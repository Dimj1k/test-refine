'use client'

import {DeleteButton, Edit, ListButton, RefreshButton, SaveButton, useForm} from '@refinedev/antd'
import {useGetIdentity, useOne} from '@refinedev/core'
import {Form, Input, Skeleton} from 'antd'
import {IPostName} from '../../page'
import {UserIdentity} from '@/components/header'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {IErrorResponce} from '@/providers/auth-provider/interfaces'
import {AxiosError} from 'axios'

export default function PostEdit({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps} = useForm()
	const {data, isLoading, error} = useOne<
		IPostName,
		AxiosError<IErrorResponce> & {statusCode: number}
	>({
		resource: 'posts',
		id: postId,
	})
	const router = useRouter()
	const record = data?.data
	useEffect(() => {
		if (record && record.author.id !== userInfo?.id) {
			router.back()
		}
		if (error?.status === 404) {
			router.replace('/posts')
		}
	}, [record, error])

	return (
		<Edit
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
						{deleteButtonProps && <DeleteButton {...deleteButtonProps}>Удалить</DeleteButton>}
						{saveButtonProps && <SaveButton {...saveButtonProps}>Сохранить изменения</SaveButton>}
					</>
				)
			}}>
			<Skeleton loading={isLoading}>
				<Form
					{...formProps}
					layout="vertical"
					initialValues={{title: record?.name, text: record?.text}}>
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
