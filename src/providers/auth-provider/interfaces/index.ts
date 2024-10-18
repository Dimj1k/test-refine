export interface IMessage {
	message: string
}

export interface IAuthSuccessResponce extends IMessage {
	result: {
		user: {
			id: number
			name: string
		}
		access_token: string
		token_type: string
	}
}

export interface IErrorResponce extends IMessage {
	errors: {property_name: string}[]
}

export type UserIdentity = {
	name: string
	id: number
	auth: string
}

export interface IRegister {
	name: string
	email: string
	password: string
	password_confirmation: this['password']
}
