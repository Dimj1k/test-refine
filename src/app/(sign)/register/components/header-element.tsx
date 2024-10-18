import {Flex, Space} from 'antd'
import Link from 'next/link'
import {AppIcon} from '@/components/app-icon'
import Title from 'antd/es/typography/Title'

export const HeaderAntd = () => {
	return (
		<Flex justify="center" style={{marginBottom: '32px', fontSize: '20px'}}>
			<Link href="/">
				<Space>
					<div style={{height: '24px', width: '24px', color: 'rgb(22, 119, 255)'}}>
						<AppIcon />
					</div>
					<Title style={{fontSize: 'inherit', marginBottom: '0', fontWeight: 700}}>
						Refine Project
					</Title>
				</Space>
			</Link>
		</Flex>
	)
}
