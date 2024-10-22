'use client'

import type {AuthProvider} from '@refinedev/core'
import axios, {isAxiosError} from 'axios'
import Cookies from 'js-cookie'
import {getApi} from '../data-provider'
import {IAuthSuccessResponce, IMessage, IRegister, UserIdentity} from './interfaces'
import {Mutex} from 'async-mutex'

export const axiosJson = axios.create({
	headers: {Accept: 'application/json'},
	baseURL: getApi(),
	responseType: 'json',
	timeout: 5000,
})
const mutex = new Mutex()
const globData: {
	dataIndentity: UserIdentity | null
} = {
	dataIndentity: null,
}
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
					message,
					result: {access_token, token_type, user},
				},
			} = await axiosJson.post<IAuthSuccessResponce>('login', {
				email,
				password,
				remember,
			})
			const token = concatToken(token_type, access_token)
			if (remember) {
				Cookies.set('auth', token, {
					expires: 30, // 30 days
					path: '/',
					sameSite: 'Lax',
				})
			} else {
				Cookies.set('nr', '1', {path: '/'})
				Cookies.set('auth', token, {
					path: '/',
					sameSite: 'Lax',
				})
			}
			globData.dataIndentity = {...user, auth: token}
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message},
			}
		} catch (e) {
			if (isAxiosError<IMessage>(e)) {
				return {
					success: false,
					error: {...e, message: e.response?.data.message!, statusCode: e.status, name: ''},
				}
			}
			return {
				success: false,
				error: e as Error,
			}
		}
	},
	logout: async () => {
		try {
			const token = Cookies.get('auth')
			const {data} =
				token && token !== 'guest'
					? await axiosJson.post<IAuthSuccessResponce>(
							'logout',
							{},
							{headers: {Authorization: token}},
					  )
					: {data: {message: 'Successfully logged out'}}
			return {
				success: true,
				redirectTo: '/login',
				successNotification: {message: data.message},
			}
		} catch (e) {
			return {success: true, redirectTo: '/login', error: e as Error}
		} finally {
			Cookies.remove('auth', {path: '/'})
			Cookies.remove('nr', {path: '/'})
			globData.dataIndentity = null
		}
	},
	check: async () => {
		const token = Cookies.get('auth')
		if (!token) {
			return {
				authenticated: false,
				redirectTo: '/login',
			}
		}
		if (token === 'guest') {
			return {
				authenticated: true,
			}
		}
		try {
			await authProvider.getIdentity!()
			return {
				authenticated: true,
			}
		} catch (e) {
			if (isAxiosError(e)) {
				return {
					error: {...e, message: e.response?.data.message, name: ''},
					logout: true,
					authenticated: false,
					redirectTo: '/login',
				}
			}
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
			const token =
				auth !== 'guest' ? auth : 'Bearer 163|I6etNbJQAJF7cnJmHrHMH0tOZGlySs73Gfp3w1E68ee70ce6'
			try {
				if (globData.dataIndentity) {
					return globData.dataIndentity
				}
				if (!Cookies.get('nr')) {
					Cookies.set('auth', token, {
						expires: 30, // 30 days
						path: '/',
						sameSite: 'Lax',
					})
				}
				const res = await mutex.runExclusive(async () => {
					const {data} = await axiosJson.get<{result: {id: number; name: string}}>('me', {
						headers: {
							Authorization: token,
						},
					})
					if (auth === 'guest') {
						globData.dataIndentity = {name: 'Гость', id: 0, auth: token}
					} else {
						globData.dataIndentity = {...data.result, auth: token}
					}
					mutex.cancel()
					return globData.dataIndentity
				})
				return res
			} catch {
				return globData.dataIndentity
			}
		}
		return null
	},
	onError: async error => {
		if (error.response?.status === 401) {
			return {
				logout: true,
				error,
			}
		}

		return {error}
	},
	register: async (values: IRegister) => {
		if (Cookies.get('auth')) {
			return {
				success: true,
				redirectTo: '/',
				successNotification: {
					message: 'Выйдите из текущего аккаунта, чтобы зарегистрировать нового пользователя',
				},
			}
		}
		try {
			const {
				data: {
					message,
					result: {access_token, token_type, user},
				},
			} = await axiosJson.post<IAuthSuccessResponce>('register', values)
			const token = concatToken(token_type, access_token)
			Cookies.set('auth', token, {
				expires: 30, // 30 days
				path: '/',
				sameSite: 'Lax',
			})
			globData.dataIndentity = {...user, auth: token}
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message},
			}
		} catch (e) {
			if (isAxiosError(e)) {
				return {
					error: {...e, message: e.response?.data.message, statusCode: e.status, name: ''},
					success: false,
				}
			}
			return {error: e as Error, success: false}
		}
	},
}

const concatToken = (tokenType: string, accessToken: string) => tokenType + ' ' + accessToken
