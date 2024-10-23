'use client'
import {message} from 'antd'
import {useOnline} from './use-online'
import {useEffect, useId} from 'react'

export const IsOfflineMessage: React.FC = () => {
	const isOnline = useOnline()
	const [messageApi, contextHolder] = message.useMessage()
	const key = useId()
	useEffect(() => {
		if (!isOnline) {
			messageApi.error({
				content: 'Вы отключились от сети',
				duration: -1,
				key,
				style: {fontSize: '1.1rem'},
			})
		} else {
			messageApi.destroy(key)
		}
	}, [isOnline])
	return <>{contextHolder}</>
}
