'use client'

import {DeleteButton, Edit, ListButton, RefreshButton, SaveButton, useForm} from '@refinedev/antd'
import {useGetIdentity, useOne} from '@refinedev/core'
import {Form, Input, Skeleton} from 'antd'
import {IPostName} from '../../page'
import {UserIdentity} from '@/components/header'

export default function CategoryEdit({params: {id: postId}}: {params: {id: string}}) {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps} = useForm({meta: {headers: {Authorization: userInfo?.auth}}})
	const {data, isLoading} = useOne<IPostName>({
		resource: 'posts',
		id: postId,
		meta: {headers: {Authorization: userInfo?.auth}},
	})

	return (
		<Edit
			title={`Редактировать пост №${postId}`}
			saveButtonProps={saveButtonProps}
			headerButtons={({refreshButtonProps, listButtonProps}) => {
				return (
					<>
						<ListButton {...listButtonProps} />
						{refreshButtonProps && <RefreshButton {...refreshButtonProps}>Обновить</RefreshButton>}
					</>
				)
			}}
			footerButtons={({saveButtonProps, deleteButtonProps}) => {
				return (
					<>
						{saveButtonProps && <SaveButton {...saveButtonProps}>Сохранить изменения</SaveButton>}
						{deleteButtonProps && <DeleteButton {...deleteButtonProps}>Удалить</DeleteButton>}
					</>
				)
			}}>
			<Skeleton loading={isLoading}>
				<Form
					{...formProps}
					layout="vertical"
					initialValues={{title: data?.data.name, text: data?.data.text}}>
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
