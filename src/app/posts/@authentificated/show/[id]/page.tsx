'use client'

import {DeleteButton, EditButton, ListButton, RefreshButton, Show, TextField} from '@refinedev/antd'
import {Link, useGetIdentity, usePermissions, useShow} from '@refinedev/core'
import {Breadcrumb, Divider, Typography} from 'antd'
import {IPostName} from '../../page'
import {CreateComment} from './create-comment'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {UserIdentity} from '@/providers/auth-provider/interfaces'

const {Title, Text} = Typography

export default function PostShow({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {data: id} = usePermissions<number>()
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

	const {
		author: {id: authorId},
		name: title,
	} = record

	return (
		<Show
			breadcrumb={
				<Breadcrumb items={[{title: <Link to="/posts">Посты</Link>}, {title: 'Просмотр поста'}]} />
			}
			isLoading={isLoading}
			title={<span style={{textWrap: 'wrap'}}>{title ?? `Пост №${postId}`}</span>}
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
						{deleteButtonProps && (
							<DeleteButton
								{...deleteButtonProps}
								confirmOkText="Да"
								confirmCancelText="Нет"
								confirmTitle="Вы уверены?">
								Удалить
							</DeleteButton>
						)}
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
			{id ? (
				<CreateComment postId={postId} token={userInfo?.auth} />
			) : (
				<Typography.Text>Войдите, чтобы оставлять комментарии</Typography.Text>
			)}
		</Show>
	)
}
