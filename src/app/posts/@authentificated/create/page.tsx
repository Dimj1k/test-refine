'use client'

import {Create, SaveButton, useForm} from '@refinedev/antd'
import {Link} from '@refinedev/core'
import {Breadcrumb, Form, Input} from 'antd'

export default function PostCreate() {
	const {formProps, saveButtonProps} = useForm()

	return (
		<Create
			breadcrumb={
				<Breadcrumb items={[{title: <Link to="/posts">Посты</Link>}, {title: 'Создание поста'}]} />
			}
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
			</Form>
		</Create>
	)
}