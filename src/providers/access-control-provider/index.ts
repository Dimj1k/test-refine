import {AccessControlProvider} from '@refinedev/core'
import {authProvider} from '../auth-provider'

export const accessControlProvider: AccessControlProvider = {
	can: async ({resource, params, action}) => {
		const id = (await authProvider.getPermissions?.()) as number
		switch (action) {
			case 'author':
				return {can: id === params?.authorId}
			case 'comment':
				return {can: !!id}
			case 'create':
				return {can: !!id, reason: 'Войдите, чтобы создавать посты'}
			default:
				return {can: true}
		}
	},
}
