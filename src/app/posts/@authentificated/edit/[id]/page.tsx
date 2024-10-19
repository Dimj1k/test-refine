'use client'

import {DeleteButton, Edit, ListButton, RefreshButton, SaveButton, useForm} from '@refinedev/antd'
import {Link, useGetIdentity} from '@refinedev/core'
import {Breadcrumb, Form, Input, Skeleton} from 'antd'
import {UserIdentity} from '@/providers/auth-provider/interfaces'
import {IPostName} from '../../page'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

export default function PostEdit({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps, query} = useForm<IPostName>()
	const initialValues = formProps.initialValues as IPostName | undefined
	const router = useRouter()
	useEffect(() => {
		if (initialValues && initialValues.author.id !== userInfo?.id) {
			router.back()
		}
		if (query?.isError) {
			router.replace('/posts')
		}
	}, [initialValues, query?.isError])

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
				return (
					<>
						{deleteButtonProps && (
							<DeleteButton
								{...deleteButtonProps}
								confirmTitle="Вы уверены?"
								confirmOkText="Да"
								confirmCancelText="Нет">
								Удалить
							</DeleteButton>
						)}
						{saveButtonProps && <SaveButton {...saveButtonProps}>Сохранить изменения</SaveButton>}
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
