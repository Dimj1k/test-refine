'use client'

import {DeleteButton, Edit, ListButton, RefreshButton, SaveButton, useForm} from '@refinedev/antd'
import {Link, useGetIdentity, useNotification} from '@refinedev/core'
import {Breadcrumb, Form, Input, Result, Skeleton} from 'antd'
import {IErrorResponce, IMessage, UserIdentity} from '@/providers/auth-provider/interfaces'
import {IPostName} from '../../page'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {isAxiosError} from 'axios'

export default function PostEdit({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps, query} = useForm<IMessage>({
		successNotification: data => {
			if (isAxiosError<IErrorResponce>(data?.data)) {
				return {message: data?.data.response?.data.message!, type: 'error'}
			}
			return {message: data?.data.message!, type: 'success'}
		},
		errorNotification: error => ({message: error?.message!, type: 'error'}),
	})
	const initialValues = formProps.initialValues as IPostName | undefined
	const router = useRouter()
	const notify = useNotification()
	useEffect(() => {
		if (userInfo?.id && initialValues && initialValues.author.id !== userInfo.id) {
			router.back()
			notify.open?.({message: 'Вы не можете редактировать не свои посты', type: 'error'})
		}
		if (query?.isError) {
			router.replace('/posts')
		}
	}, [initialValues, query?.isError])

	if (userInfo?.id === 0) {
		return (
			<Result
				title="403"
				status={403}
				subTitle="Войдите, чтобы редактировать посты"
				extra={<Link to="/">Вернуться на главную страницу</Link>}
			/>
		)
	}

	return (
		<Edit
			breadcrumb={
				<Breadcrumb
					items={[{title: <Link to="/posts">Посты</Link>}, {title: 'Редактирование поста'}]}
				/>
			}
			title={`Редактировать пост №${postId}`}
			saveButtonProps={saveButtonProps}
			headerButtons={({refreshButtonProps, listButtonProps}) => {
				return (
					<>
						{listButtonProps && <ListButton {...listButtonProps} />}
						{refreshButtonProps && <RefreshButton {...refreshButtonProps}>Обновить</RefreshButton>}
					</>
				)
			}}
			footerButtons={({saveButtonProps, deleteButtonProps}) => {
				const isAuthor = initialValues?.author.id === userInfo?.id
				return (
					<>
						{deleteButtonProps && (
							<DeleteButton
								{...deleteButtonProps}
								confirmTitle="Вы уверены?"
								confirmOkText="Да"
								confirmCancelText="Нет"
								disabled={!isAuthor}>
								Удалить
							</DeleteButton>
						)}
						{saveButtonProps && (
							<SaveButton {...saveButtonProps} disabled={!isAuthor}>
								Сохранить изменения
							</SaveButton>
						)}
					</>
				)
			}}>
			<Skeleton loading={query?.isLoading}>
				<Form
					{...formProps}
					layout="vertical"
					initialValues={{
						title: formProps.initialValues?.name,
						text: formProps.initialValues?.text,
					}}>
					<Form.Item label={'Заголовок поста'} name={'title'}>
						<Input />
					</Form.Item>
					<Form.Item label={'Текст'} name={'text'}>
						<Input.TextArea placeholder="Текст" />
					</Form.Item>
				</Form>
			</Skeleton>
		</Edit>
	)
}
