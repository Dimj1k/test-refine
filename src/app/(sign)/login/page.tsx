import {AuthPage} from '@components/auth-page'
import {titleStyle} from '../register/components'
import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import {Link} from '@refinedev/core'
import {Suspense} from 'react'
import {RememberMe} from './remember-me'
import {Metadata} from 'next'

export const metadata: Metadata = {
	title: 'Вход',
}

export default async function Login() {
	return (
		<Suspense>
			<AuthPage
				type="login"
				rememberMe={<RememberMe />}
				contentProps={{
					title: (
						<Title level={3} style={titleStyle}>
							Войти в свой аккаунт
						</Title>
					),
				}}
				registerLink={
					<Text style={{fontSize: '12px'}}>
						Не имеете аккаунта?{' '}
						<Link to="/register" style={{fontWeight: 'bold'}}>
							Зарегистрироваться
						</Link>
					</Text>
				}
				forgotPasswordLink={false}
			/>
		</Suspense>
	)
}