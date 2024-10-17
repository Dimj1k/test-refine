export interface IMessage {
	message: string
}

export interface IAuthSuccessResponce extends IMessage {
	result: Result
}

export interface IErrorResponce extends IMessage {
	errors: {property_name: string}[]
}

interface Result {
	user: User
	access_token: string
	token_type: string
}

interface User {
	id: number
	name: string
}
