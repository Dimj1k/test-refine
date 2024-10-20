import type {AuthProvider, CheckResponse} from '@refinedev/core'

export const authProviderServer: Pick<AuthProvider, 'check'> = {
	check: async (): Promise<CheckResponse & {isGuest?: boolean}> => {
		const cookieStore = (await import('next/headers')).cookies()
		const fullToken = cookieStore.get('auth')?.value
		if (fullToken) {
			if (fullToken === 'guest') {
				return {
					authenticated: true,
					isGuest: true,
				}
			}
			const [tokenType] = fullToken.split(' ')
			if (tokenType.toLowerCase() == 'bearer') {
				return {
					authenticated: true,
					isGuest: false,
				}
			}
		}

		return {
			authenticated: false,
		}
	},
}
