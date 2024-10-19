'use client'
import {LogoutOutlined} from '@ant-design/icons'
import {RefineThemedLayoutV2Props, ThemedLayoutV2, ThemedSiderV2} from '@refinedev/antd'
import {useLogout} from '@refinedev/core'
import {Menu, Typography} from 'antd'
import {PropsWithChildren} from 'react'

export const ThemedLayout = ({
	children,
	...props
}: PropsWithChildren<RefineThemedLayoutV2Props>) => {
	const {mutateAsync: logout} = useLogout()
	return (
		<ThemedLayoutV2
			{...props}
			Sider={({Title}) => (
				<ThemedSiderV2
					Title={Title}
					render={({items}) => {
						return (
							<>
								{items}
								<Menu.Item key={'logout'}>
									<LogoutOutlined />
									<Typography.Text onClick={() => logout()}>Выйти</Typography.Text>
								</Menu.Item>
							</>
						)
					}}
				/>
			)}>
			{children}
		</ThemedLayoutV2>
	)
}
