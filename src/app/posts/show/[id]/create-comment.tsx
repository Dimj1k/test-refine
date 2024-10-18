import {useCustomMutation, useInvalidate, useNotification} from '@refinedev/core'
import {Button, Form, Input} from 'antd'
import {memo} from 'react'

export const CreateComment: React.FC<{token?: string; postId: number | string}> = memo(
	({token, postId}) => {
		const {isLoading, mutate: sendComment} = useCustomMutation<ICommentSuccess>()
		const [form] = Form.useForm<{text: string}>()
		const notification = useNotification()
		const invalidate = useInvalidate()
		return (
			<Form
				style={{marginTop: '15px'}}
				form={form}
				onFinish={values =>
					sendComment(
						{
							url: `posts/${postId}/comments`,
							method: 'post',
							config: {headers: {Authorization: token}},
							values,
						},
						{
							onSuccess: () => {
								invalidate({invalidates: ['detail'], id: postId, resource: 'posts'})
								form.resetFields()
								notification.open?.({
									message: 'Ваш комментарий успешно опубликован',
									type: 'success',
									undoableTimeout: 2000,
								})
							},
							onError: () => {
								invalidate({invalidates: ['detail'], id: postId, resource: 'posts'})
								notification.open?.({
									message: 'Произошла ошибка при опубликованнии комменатария',
									type: 'error',
								})
							},
						},
					)
				}
				disabled={isLoading}>
				<Form.Item name="text" required rules={[{required: true, message: 'Введите комментарий'}]}>
					<Input.TextArea placeholder="Ваш комментарий" />
				</Form.Item>
				<Button type="primary" size="large" htmlType="submit">
					Опубликовать комментарий
				</Button>
			</Form>
		)
	},
)

export interface ICommentSuccess {
	result: {text: string; author: {id: number; name: string}}
	message: string
}
