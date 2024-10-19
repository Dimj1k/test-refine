import type {AuthProvider, CheckResponse} from '@refinedev/core'

export const authProviderServer: Pick<AuthProvider, 'check'> = {
	check: async (): Promise<CheckResponse & {isGuest?: boolean}> => {
		const cookieStore = (await import('next/headers')).cookies()
		const token = cookieStore.get('auth')
		if (token) {
			return {
				authenticated: true,
				isGuest: token.value === 'guest',
			}
		}

		return {
			authenticated: false,
		}
	},
}
