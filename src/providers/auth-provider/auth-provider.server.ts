import type {AuthProvider} from '@refinedev/core'

export const authProviderServer: Pick<AuthProvider, 'check'> = {
	check: async () => {
		const cookieStore = (await import('next/headers')).cookies()
		const token = cookieStore.get('auth')
		if (token) {
			return {
				authenticated: true,
			}
		}

		return {
			authenticated: false,
		}
	},
}
