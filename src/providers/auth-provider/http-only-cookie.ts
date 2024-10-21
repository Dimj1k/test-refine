'use server'

import {cookies} from 'next/headers'

export async function setAuthCookie(token: string, remember?: boolean) {
	console.log('Добавление')
	if (remember) {
		cookies().set('auth', token, {
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
		})
	} else {
		cookies().set('auth', token, {
			expires: Date.now() + 60e3 * 60 * 30 * 24,
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
