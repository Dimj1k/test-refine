'use server'

import {cookies} from 'next/headers'

export async function setAuthCookie(token?: string) {
	console.log('Добавление')
	if (token) {
		cookies().set('auth', token, {
			expires: Date.now() + 60e3 * 60 * 24 * 30,
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
		})
	}
}

export async function getAuthCookie() {
	console.log(cookies().get('auth'))
	return cookies().get('auth')
}

export async function deleteAuthCookie() {
	console.log('Удаление')
	const cookieStore = cookies()
	const auth = cookieStore.get('auth')
	cookieStore.delete('auth')
	return auth
}
