'use client'

import type {AuthProvider} from '@refinedev/core'
import axios from 'axios'
import Cookies from 'js-cookie'
import {getApi} from '../data-provider'
import {IAuthSuccessResponce, IRegister, UserIdentity} from './interfaces'
import {rtkStore, userInfoSlice} from '../rtk'
import {Mutex} from 'async-mutex'

export const axiosJson = axios.create({
	headers: {Accept: 'application/json'},
	baseURL: getApi(),
	responseType: 'json',
	timeout: 5000,
})
const mutex = new Mutex()
export const authProvider: AuthProvider = {
	login: async function ({email, password, remember}) {
		const token = Cookies.get('auth')
		if (token) {
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message: 'Вы уже вошли'},
			}
		}
		try {
			const {
				data: {
					result: {access_token, token_type},
				},
			} = await axiosJson.post<IAuthSuccessResponce>('login', {
				email,
				password,
				remember,
			})
			if (remember) {
				Cookies.set('auth', concatToken(token_type, access_token), {
					expires: 30, // 30 days
					path: '/',
				})
			} else {
				Cookies.set('auth', concatToken(token_type, access_token), {
					path: '/',
				})
			}
			return {
				success: true,
				redirectTo: '/',
			}
		} catch (e) {
			return {
				success: false,
				error: e as Error,
			}
		}
	},
	logout: async () => {
		try {
			await axiosJson.post<IAuthSuccessResponce>(
				'logout',
				{},
				{headers: {Authorization: Cookies.get('auth')}},
			)
			Cookies.remove('auth', {path: '/'})
		} finally {
			return {
				success: true,
				redirectTo: '/login',
			}
		}
	},
	check: async () => {
		const token = Cookies.get('auth')
		if (!token) {
			return {
				authenticated: false,
				logout: true,
				redirectTo: '/login',
				error: new Error('Доступ только для зарегистрированных пользователей'),
			}
		}
		try {
			await authProvider.getIdentity!()
			return {
				authenticated: true,
			}
		} catch (e) {
			return {
				authenticated: false,
				logout: true,
				redirectTo: '/login',
				error: e as Error,
			}
		}
	},
	getPermissions: async () => {
		const auth = Cookies.get('auth')
		if (auth) {
			const {id} = ((await authProvider.getIdentity!()) ?? {}) as UserIdentity
			return id ? id : null
		}
		return null
	},
	getIdentity: async () => {
		const auth = Cookies.get('auth')
		if (auth) {
			try {
				return await mutex.runExclusive(async () => {
					const {
						userInfo: {userInfo},
					} = rtkStore.getState()
					if (!userInfo) {
						const {data} = await axiosJson.get<{result: {id: number; name: string}}>('me', {
							headers: {Authorization: auth},
						})
						rtkStore.dispatch(userInfoSlice.actions.setCacheUserInfo(data.result))
						return {...data.result, auth}
					}
					return {...userInfo, auth}
				})
			} catch {
				return null
			}
		}
		return null
	},
	onError: async error => {
		if (error.response?.status === 401) {
			return {
				logout: true,
			}
		}

		return {error}
	},
	register: async (values: IRegister) => {
		try {
			const {
				data: {
					result: {access_token, token_type},
				},
			} = await axiosJson.post<IAuthSuccessResponce>('register', values)
			Cookies.set('auth', concatToken(token_type, access_token), {
				expires: 30, // 30 days
				path: '/',
			})
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message: 'Вы успешно зарегистрировались'},
			}
		} catch (e) {
			return {error: e as Error, success: false}
		}
	},
}

const concatToken = (tokenType: string, accessToken: string) => tokenType + ' ' + accessToken
