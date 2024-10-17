import {RegisterPage} from './components'
import {Metadata} from 'next'

export const metadata: Metadata = {
	title: 'Регистрация',
}

export default async function Register() {
	return <RegisterPage />
}
