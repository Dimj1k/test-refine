import {useCustomMutation, useInvalidate} from '@refinedev/core'
import {Button, Form, Input} from 'antd'
import {isAxiosError} from 'axios'
import {memo} from 'react'
import {IErrorResponce} from '@/providers/auth-provider/interfaces'

export const CreateComment: React.FC<{token?: string; postId: number | string}> = memo(
	({token, postId}) => {
		const {isLoading, mutateAsync: sendComment} = useCustomMutation<ICommentSuccess>()
		const [form] = Form.useForm<{text: string}>()
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
							successNotification: data => {
								if (isAxiosError<IErrorResponce>(data?.data)) {
									return {message: data?.data.response?.data.message!, type: 'error'}
								}
								return {message: data?.data.message!, type: 'success'}
							},
							values,
						},
						{
							onSuccess: () => {
								invalidate({invalidates: ['detail'], id: postId, resource: 'posts'}).then(() => {
									form.resetFields()
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
