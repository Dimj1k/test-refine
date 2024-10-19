import {AuthPage} from '@components/auth-page'
import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import {Link} from '@refinedev/core'
import {Suspense} from 'react'
import {RememberMe} from './remember-me'
import {Metadata} from 'next'
import {titleStyle} from '../inline-style'
import {Guest} from './guest'

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
				formProps={{
					initialValues: {
						remember: true,
					},
				}}
				registerLink={
					<Text style={{fontSize: '12px'}}>
						Не имеете аккаунта?{' '}
						<Link to="/register" style={{fontWeight: 'bold'}}>
							Зарегистрироваться
						</Link>
					</Text>
				}
				forgotPasswordLink={<Guest />}
			/>
		</Suspense>
	)
}
