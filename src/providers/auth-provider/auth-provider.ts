'use client'

import type {AuthProvider} from '@refinedev/core'
import axios, {isAxiosError} from 'axios'
import Cookies from 'js-cookie'
import {getApi} from '../data-provider'
import {IAuthSuccessResponce, IRegister, UserIdentity} from './interfaces'
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
	idTimeoutClear: ReturnType<typeof setTimeout> | null
} = {
	dataIndentity: null,
	idTimeoutClear: null,
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
				})
			} else {
				Cookies.set('auth', token, {
					path: '/',
				})
			}
			globData.dataIndentity = {...user, auth: token}
			globData.idTimeoutClear = setTimeout(() => {
				globData.dataIndentity = null
				globData.idTimeoutClear = null
			}, 15000)
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message},
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
			const token = Cookies.get('auth')
			const {data} =
				token && token !== 'guest'
					? await axiosJson.post<IAuthSuccessResponce>(
							'logout',
							{},
							{headers: {Authorization: token}},
					  )
					: {data: {message: 'Вы вышли'}}
			return {
				success: true,
				redirectTo: '/login',
				successNotification: {message: data.message},
			}
		} catch (e) {
			return {success: true, redirectTo: '/login'}
		} finally {
			Cookies.remove('auth', {path: '/'})
			globData.dataIndentity = null
			globData.idTimeoutClear = null
		}
	},
	check: async () => {
		const token = Cookies.get('auth')
		if (!token) {
			return {
				authenticated: false,
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
				const res = await mutex.runExclusive(async () => {
					const {data} = await axiosJson.get<{result: {id: number; name: string}}>('me', {
						headers: {
							Authorization: token,
						},
					})
					globData.dataIndentity = {...data.result, auth: token}
					mutex.cancel()
					globData.idTimeoutClear = setTimeout(() => {
						globData.dataIndentity = null
						globData.idTimeoutClear = null
					}, 5000)
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
			}
		}

		return {error}
	},
	register: async (values: IRegister) => {
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
			})
			globData.dataIndentity = {...user, auth: token}
			globData.idTimeoutClear = setTimeout(() => {
				globData.dataIndentity = null
				globData.idTimeoutClear = null
			}, 15000)
			return {
				success: true,
				redirectTo: '/',
				successNotification: {message},
			}
		} catch (e) {
			if (isAxiosError(e)) {
				return {error: {...e, message: e.response?.data.message}, success: false}
			}
			return {error: e as Error, success: false}
		}
	},
}

const concatToken = (tokenType: string, accessToken: string) => tokenType + ' ' + accessToken
