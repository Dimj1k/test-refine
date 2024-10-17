'use client'

import {DeleteButton, EditButton, ListButton, RefreshButton, Show, TextField} from '@refinedev/antd'
import {useGetIdentity, usePermissions, useShow} from '@refinedev/core'
import {Divider, Typography} from 'antd'
import {IPostName} from '../../page'
import {CreateComment} from './create-comment'
import {UserIdentity} from '@/components/header'

const {Title, Text} = Typography

export default function PostShow({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {data: id} = usePermissions<number>()
	const {query} = useShow<IPostName>({
		id: postId,
		meta: {headers: {Authorization: userInfo?.auth}},
	})
	const {data, isLoading} = query

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

	const {
		author: {id: authorId},
		name: title,
	} = record

	return (
		<Show
			isLoading={isLoading}
			title={title ?? `Пост №${postId}`}
			canDelete={id === authorId}
			canEdit={id === authorId}
			headerButtons={({
				editButtonProps,
				deleteButtonProps,
				refreshButtonProps,
				listButtonProps,
			}) => {
				return (
					<>
						<ListButton {...listButtonProps} />
						{editButtonProps && <EditButton {...editButtonProps}>Изменить</EditButton>}
						{deleteButtonProps && <DeleteButton {...deleteButtonProps}>Удалить</DeleteButton>}
						{refreshButtonProps && <RefreshButton {...refreshButtonProps}>Обновить</RefreshButton>}
					</>
				)
			}}>
			<Title level={3}>Описание</Title>
			<TextField value={record.text} />
			<Title level={4}>Комментарии</Title>
			{record.comments.map(comment => {
				const {
					text,
					author: {name: userName},
					id,
				} = comment
				return (
					<div style={{marginBottom: '5px'}} key={id}>
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
			<CreateComment postId={postId} token={userInfo?.auth} />
		</Show>
	)
}
