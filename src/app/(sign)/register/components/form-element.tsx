'use client'
import {useRegister} from '@refinedev/core'
import {Button, Flex, Form, FormProps, Input, InputProps} from 'antd'
import {createContext, FormEvent, useContext, useMemo} from 'react'

const MobileContext = createContext(true)
const {Item} = Form
type NormalizeInputProps = Omit<
	InputProps & {
		normalizeBy: RegExp | string
		typeInput?: 'Password' | 'Search'
	},
	'onInput'
>

const NormalizeInput: React.FC<NormalizeInputProps> = ({normalizeBy, typeInput, ...props}) => {
	const isMobile = useContext(MobileContext)
	const inputProps = {
		onInput: (event: FormEvent<HTMLInputElement>) => {
			const target = event.target as EventTarget & HTMLInputElement
			const {value} = target
			const invalidMatched = value.match(normalizeBy)
			if (invalidMatched) {
				const prevSelectionRange = (invalidMatched.index || -1) + invalidMatched[0].length - 1
				if (!isMobile) {
					target.blur()
					setTimeout(() => {
						target.focus({preventScroll: true})
						target.setSelectionRange(prevSelectionRange, prevSelectionRange, 'none')
					}, 4)
				} else {
					setTimeout(() => {
						target.setSelectionRange(prevSelectionRange, prevSelectionRange, 'none')
					}, 4)
				}
			}
		},
		...props,
	}
	switch (typeInput) {
		case 'Password':
			return <Input.Password {...inputProps} />
		case 'Search':
			return <Input.Search {...inputProps} />
		default:
			return <Input {...inputProps} />
	}
}

export const RegisterForm: React.FC<FormProps> = props => {
	const isMobile = useMemo(() => {
		if (typeof window != 'undefined') {
			const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
			return regex.test(navigator.userAgent)
		}
		return false
	}, [])
	const {mutate: onFinish, isLoading} = useRegister()
	return (
		<MobileContext.Provider value={isMobile}>
			<Form
				layout="vertical"
				onFinish={onFinish}
				requiredMark={false}
				disabled={isLoading}
				{...props}>
				<Item
					name="name"
					label="Ваше имя"
					rules={[
						{required: true, message: 'Введите своё имя'},
						{
							min: 3,
							warningOnly: true,
							message: 'Имя должно содержать не менее 3 букв',
						},
					]}
					validateDebounce={500}
					normalize={(value: string) => {
						if (value[0] == ' ') {
							return value.trimStart()
						}
						return value.replace(/\s{2,}/, ' ')
					}}>
					<NormalizeInput size="large" normalizeBy={/\s{2,}/} placeholder="Имя" />
				</Item>
				<Item
					name="email"
					label="Ваша электронная почта"
					rules={[{required: true, message: 'Введите свою электронную почту', type: 'email'}]}
					validateDebounce={500}
					normalize={(value: string) => value.replace(' ', '')}>
					<NormalizeInput size="large" placeholder="example@example.ex" normalizeBy={' '} />
				</Item>
				<Item
					name="password"
					label="Ваш пароль"
					rules={[
						{required: true, message: 'Введите пароль'},
						{min: 8, message: 'Пароль должен быть не короче 8 символов'},
					]}
					normalize={(value: string) => value.replace(' ', '')}
					// hasFeedback
				>
					<NormalizeInput
						size="large"
						typeInput="Password"
						placeholder="●●●●●●●●"
						normalizeBy={' '}
					/>
				</Item>
				<Item
					name="password_confirmation"
					label="Подтверждение пароля"
					dependencies={['password']}
					// hasFeedback
					normalize={(value: string) => value.replace(' ', '')}
					rules={[
						{required: true, message: 'Введите подтверждение пароля'},
						({getFieldValue}) => ({
							validator(_, value) {
								if (!value || getFieldValue('password') == value) {
									return Promise.resolve()
								}
								return Promise.reject(new Error('Пароли не совпадают!'))
							},
						}),
					]}>
					<NormalizeInput
						size="large"
						typeInput="Password"
						placeholder="●●●●●●●●"
						normalizeBy={' '}
					/>
				</Item>
				<Item>
					<Flex justify="center" style={{width: '100%'}} gap={8} vertical>
						<Button block type="primary" size="large" htmlType="submit">
							Зарегистрироваться
						</Button>
					</Flex>
				</Item>
			</Form>
		</MobileContext.Provider>
	)
}
