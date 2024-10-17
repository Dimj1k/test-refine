'use client'

import {Create, SaveButton, useForm} from '@refinedev/antd'
import {useGetIdentity} from '@refinedev/core'
import {Form, Input} from 'antd'
import {UserIdentity} from '@/components/header'

export default function CategoryCreate() {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps} = useForm({meta: {headers: {Authorization: userInfo?.auth}}})

	return (
		<Create
			title="Создать новый пост"
			saveButtonProps={saveButtonProps}
			footerButtons={({saveButtonProps}) => (
				<>{saveButtonProps && <SaveButton {...saveButtonProps}>Сохранить</SaveButton>}</>
			)}>
			<Form {...formProps} layout="vertical">
				<Form.Item
					label={'Заголовок поста'}
					name={'title'}
					rules={[
						{
							required: true,
							message: 'Введите заголовок поста',
						},
					]}>
					<Input placeholder="Заголовок" />
				</Form.Item>
				<Form.Item
					label="Текст поста"
					required
					rules={[{required: true, message: 'Введите текст поста'}]}
					name="text">
					<Input.TextArea spellCheck={true} placeholder="Текст" />
				</Form.Item>
				<Form.Item></Form.Item>
			</Form>
		</Create>
	)
}
