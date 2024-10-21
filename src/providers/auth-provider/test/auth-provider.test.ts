'use client'

import type {AuthProvider} from '@refinedev/core'
import axios, {isAxiosError} from 'axios'
import {getApi} from '../data-provider'
import {IAuthSuccessResponce, IRegister, UserIdentity} from './interfaces'
import {Mutex} from 'async-mutex'
import {setAuthCookie, getAuthCookie, deleteAuthCookie} from './http-only-cookie.test'
import Cookies from 'js-cookie'

export const axiosJson = axios.create({
	headers: {Accept: 'application/json'},
	baseURL: getApi(),
	responseType: 'json',
	timeout: 5000,
})
const mutex = new Mutex()
const globData: {
	dataIndentity: UserIdentity | null
	auth?: string
	clear: () => void
} = {
	dataIndentity: null,
	auth: undefined,
	clear: function () {
		this.dataIndentity = null
	},
}
export const authProvider: AuthProvider = {
	login: async function ({email, password, remember}) {
		const token = globData.auth
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
				setAuthCookie(token)
			} else {
				Cookies.set('auth', token, {sameSite: 'lax'})
			}
			globData.auth = token
			globData.dataIndentity = {...user, auth: token}
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
			const token = (await deleteAuthCookie())?.value
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
			return {success: true, redirectTo: '/login'}
		} finally {
			globData.clear()
			globData.auth = undefined
		}
	},
	check: async () => {
		const token = globData.auth || (globData.auth = (await getAuthCookie())?.value)
		if (!token) {
			return {
				authenticated: false,
				redirectTo: '/login',
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
		const {id} = ((await authProvider.getIdentity!()) ?? {}) as UserIdentity
		return id ? id : null
	},
	getIdentity: async () => {
		if (globData.dataIndentity) {
			return globData.dataIndentity
		}
		const auth = await mutex.runExclusive(async () => {
			if (!globData.auth) {
				const cookie = (await getAuthCookie())?.value
				globData.auth = cookie
				setAuthCookie(cookie)
				return cookie
			}
			return globData.auth
		})
		if (auth) {
			const token =
				auth !== 'guest' ? auth : 'Bearer 163|I6etNbJQAJF7cnJmHrHMH0tOZGlySs73Gfp3w1E68ee70ce6'
			try {
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
		try {
			const {
				data: {
					message,
					result: {access_token, token_type, user},
				},
			} = await axiosJson.post<IAuthSuccessResponce>('register', values)
			const token = concatToken(token_type, access_token)
			await setAuthCookie(token)
			globData.auth = token
			globData.dataIndentity = {...user, auth: token}
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
