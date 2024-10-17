import {Flex, Space, Typography} from 'antd'
import Link from 'next/link'
import {AppIcon} from '@/components/app-icon'
import {memo} from 'react'

export const HeaderAntd = memo(() => {
	return (
		<Flex justify="center" style={{marginBottom: '32px', fontSize: '20px'}}>
			<Link href="/">
				<Space>
					<div style={{height: '24px', width: '24px', color: 'rgb(22, 119, 255)'}}>
						<AppIcon />
					</div>
					<Typography.Title style={{fontSize: 'inherit', marginBottom: '0', fontWeight: 700}}>
						Refine Project
					</Typography.Title>
				</Space>
			</Link>
		</Flex>
	)
})
