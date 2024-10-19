'use client'

import {ListButton, RefreshButton, Show, TextField} from '@refinedev/antd'
import {Link, useShow} from '@refinedev/core'
import {Breadcrumb, Divider, Typography} from 'antd'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {IPostName} from '../../../@authentificated/page'

const {Title, Text} = Typography

export default function PostShow({params: {id: postId}}: {params: {id: string}}) {
	const {query} = useShow<IPostName>({
		id: postId,
	})
	const {data, isLoading, isError} = query
	const router = useRouter()
	useEffect(() => {
		if (isError) {
			router.replace('/posts')
		}
	}, [isError])

	const record = data?.data
	if (!record)
		return (
			<Show
				isLoading={isLoading}
				title={`Пост №${postId}`}
				canDelete={false}
				canEdit={false}
				headerButtons={({refreshButtonProps, listButtonProps}) => {
					return (
						<>
							<ListButton {...listButtonProps} />
							{refreshButtonProps && (
								<RefreshButton {...refreshButtonProps}>Обновить</RefreshButton>
							)}
						</>
					)
				}}>
				<Title level={3}>{'Описание'}</Title>
				<Title level={4}>{'Комментарии'}</Title>
			</Show>
		)

	const {name: title} = record

	return (
		<Show
			breadcrumb={
				<Breadcrumb items={[{title: <Link to="/posts">Посты</Link>}, {title: 'Просмотр поста'}]} />
			}
			isLoading={isLoading}
			title={<span style={{textWrap: 'wrap'}}>{title ?? `Пост №${postId}`}</span>}
			canDelete={false}
			canEdit={false}
			headerButtons={({refreshButtonProps, listButtonProps}) => {
				return (
					<>
						<ListButton {...listButtonProps} />
						{refreshButtonProps && <RefreshButton {...refreshButtonProps}>Обновить</RefreshButton>}
					</>
				)
			}}>
			<Title level={3}>Описание</Title>
			<TextField value={record.text} />
			<Title level={4}>Комментарии</Title>
			{record.comments.map((comment, idx) => {
				const {
					text,
					author: {name: userName},
					id,
				} = comment
				return (
					<div style={{marginBottom: '5px'}} key={id ?? idx}>
						<Divider
							style={{borderColor: '#4096ff', margin: 0}}
							orientation="left"
							orientationMargin={5}>
							<Text style={{fontSize: '16px'}}>{userName}</Text>
						</Divider>
						<Text>{text}</Text>
					</div>
				)
			})}
			<Typography.Text>Войдите, чтобы оставлять комментарии</Typography.Text>
		</Show>
	)
}
