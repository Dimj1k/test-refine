'use client'
import {Link, useRegister} from '@refinedev/core'
import {Card, Col, Layout, Row, Typography} from 'antd'
import {HeaderAntd} from './header-element'
import {RegisterForm} from './form-element'

export const titleStyle = {
	color: '#4096ff',
	textAlign: 'center',
	marginBottom: '0',
	fontSize: '24px',
	lineHeight: '32px',
	fontWeight: 700,
	overflowWrap: 'break-word',
	hyphens: 'manual',
	textOverflow: 'unset',
	whiteSpace: 'pre-wrap',
} as const

const {Title, Text} = Typography

export const RegisterPage: React.FC = () => {
	const {mutate: registeration, isLoading} = useRegister()
	return (
		<Layout>
			<Row justify="center" align="middle" style={{minHeight: '100vh', padding: '16px 0'}}>
				<Col xs={22}>
					<HeaderAntd />
					<Card
						styles={{header: {borderBottom: 0, padding: 0}, body: {padding: 0, marginTop: '32px'}}}
						title={
							<Title level={3} style={titleStyle}>
								Зарегистрировать новый аккаунт
							</Title>
						}
						style={{
							maxWidth: '400px',
							margin: 'auto',
							padding: '32px',
							boxShadow:
								'rgba(0, 0, 0, 0.02) 0 2px 4px 0px 1px 6px -1px, rgba(0, 0, 0, 0.03) 0px 1px 2px',
						}}>
						<RegisterForm onFinish={registeration} disabled={isLoading} />
						<Text style={{fontSize: '12px'}}>
							Есть аккаунт?{' '}
							<Link to="/login" style={{fontWeight: 'bold', color: '#4096ff'}}>
								Войти
							</Link>
						</Text>
					</Card>
				</Col>
			</Row>
		</Layout>
	)
}
