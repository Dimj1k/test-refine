import {Card, Col, Layout, Row} from 'antd'
import {HeaderAntd, RegisterFormLayout} from './components'
import {Metadata} from 'next'
import Title from 'antd/lib/typography/Title'
import {titleStyle} from '../inline-style'

export const metadata: Metadata = {
	title: 'Регистрация',
}

export default async function Register() {
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
						<RegisterFormLayout />
					</Card>
				</Col>
			</Row>
		</Layout>
	)
}
