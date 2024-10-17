'use client'

import {ColorModeContext} from '@contexts/color-mode'
import type {RefineThemedLayoutV2HeaderProps} from '@refinedev/antd'
import {useGetIdentity} from '@refinedev/core'
import {Layout as AntdLayout, Space, Switch, theme, Typography} from 'antd'
import React, {useContext} from 'react'

const {Text} = Typography
const {useToken} = theme
export type UserIdentity = {
	name: string
	id: number
	auth: string
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({sticky = true}) => {
	const {token} = useToken()
	const {data: userInfo} = useGetIdentity<UserIdentity>({})
	const {mode, setMode} = useContext(ColorModeContext)

	const headerStyles: React.CSSProperties = {
		backgroundColor: token.colorBgElevated,
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: '0px 24px',
		height: '64px',
	}

	if (sticky) {
		headerStyles.position = 'sticky'
		headerStyles.top = 0
		headerStyles.zIndex = 1
	}

	return (
		<AntdLayout.Header style={headerStyles}>
			<Space>
				<Switch
					checkedChildren="🌛"
					unCheckedChildren="🔆"
					onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
					defaultChecked={mode === 'dark'}
				/>
				{userInfo?.name && (
					<Space style={{marginLeft: '8px'}} size="middle">
						{userInfo?.name && <Text strong>{userInfo.name}</Text>}
					</Space>
				)}
			</Space>
		</AntdLayout.Header>
	)
}
