'use client'

import type {AuthProvider} from '@refinedev/core'
import axios from 'axios'
import Cookies from 'js-cookie'
import {getApi} from '../data-provider'
import {IAuthSuccessResponce} from './interfaces'
import {IRegister} from '@app/(sign)/register/components/form-element'

export const axiosJson = axios.create({
	headers: {Accept: 'application/json'},
	baseURL: getApi(),
	responseType: 'json',
	timeout: 5000,
})

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
			})
			if (remember) {
				Cookies.set('auth', token_type + ' ' + access_token, {
					expires: 30, // 30 days
					path: '/',
				})
			} else {
				Cookies.set('auth', token_type + ' ' + access_token, {
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
			await axiosJson.get('me', {headers: {Authorization: token}})
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
			const {data} = await axiosJson.get<{result: {id: number; name: string}}>('me', {
				headers: {Authorization: auth},
			})
			return data.result.id
		}
		return null
	},
	getIdentity: async () => {
		const auth = Cookies.get('auth')
		if (auth) {
			const {data} = await axiosJson.get<{result: {id: number; name: string}}>('me', {
				headers: {Authorization: auth},
			})
			return {...data.result, auth}
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
			Cookies.set('auth', token_type + ' ' + access_token, {
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
