'use client'
import {Link} from '@refinedev/core'
import {Typography} from 'antd'
import {RegisterForm} from './form-element'

const {Text} = Typography

export const RegisterFormLayout: React.FC = () => {
	return (
		<>
			<RegisterForm />
			<Text style={{fontSize: '12px'}}>
				Есть аккаунт?{' '}
				<Link to="/login" style={{fontWeight: 'bold', color: '#4096ff'}}>
					Войти
				</Link>
			</Text>
		</>
	)
}
