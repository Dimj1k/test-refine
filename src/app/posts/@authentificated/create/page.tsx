'use client'

import {Create, SaveButton, useForm} from '@refinedev/antd'
import {Link, useGetIdentity} from '@refinedev/core'
import {Breadcrumb, Form, Input, Result} from 'antd'
import {IErrorResponce, IMessage, UserIdentity} from '@/providers/auth-provider/interfaces'
import {isAxiosError} from 'axios'

export default function PostCreate() {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {formProps, saveButtonProps} = useForm<IMessage>({
		successNotification: data => {
			if (isAxiosError<IErrorResponce>(data?.data)) {
				return {message: data?.data.response?.data.message!, type: 'error'}
			}
			return {message: data?.data.message!, type: 'success'}
		},
		errorNotification: error => ({message: error?.message!, type: 'error'}),
	})

	if (userInfo?.id === 0) {
		return (
			<Result
				title="403"
				status={403}
				subTitle="Войдите, чтобы создавать посты"
				extra={<Link to="/">Вернуться на главную страницу</Link>}
			/>
		)
	}

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
