'use client'

import {Checkbox, Form, Typography} from 'antd'

export const RememberMe: React.FC = () => {
	return (
		<Form.Item name="remember" valuePropName="checked">
			<Checkbox defaultChecked>
				<Typography.Text style={{fontSize: '12px'}}>Запомнить меня</Typography.Text>
			</Checkbox>
		</Form.Item>
	)
}
