'use client'

import {DeleteButton, EditButton, List, ShowButton, useTable} from '@refinedev/antd'
import {useGetIdentity, usePermissions} from '@refinedev/core'
import {Space, Table} from 'antd'
import {UserIdentity} from '@/components/header'

export default function CategoryList() {
	const {data: userInfo} = useGetIdentity<UserIdentity>()
	const {data: id} = usePermissions<number>()
	const {tableProps} = useTable<IPostTitle>({
		meta: {headers: {Authorization: userInfo?.auth}},
	})
	return (
		<List>
			<Table<IPostTitle> {...tableProps} rowKey="id">
				<Table.Column dataIndex="id" title={'Идентификатор'} width={'12%'} />
				<Table.Column dataIndex="name" title={'Название'} />
				<Table.Column<IPostTitle>
					dataIndex="text"
					title="Описание"
					render={(_, record) =>
						record.text.length > 100 ? record.text.slice(0, 97) + '...' : record.text
					}
				/>
				<Table.ColumnGroup title="Автор">
					<Table.Column<IPostTitle>
						title="ИД"
						align="center"
						render={(_, record) => record.author.id}
					/>
					<Table.Column<IPostTitle>
						title="Имя"
						align="center"
						render={(_, record) => record.author.name}
					/>
				</Table.ColumnGroup>
				<Table.Column
					title={'Действия'}
					render={(_, record: IPostTitle) => {
						const {
							id: recordId,
							author: {id: authorId},
						} = record
						if (authorId === id) {
							return (
								<Space>
									<EditButton hideText size="small" recordItemId={recordId} />
									<ShowButton hideText size="small" recordItemId={recordId} />
									<DeleteButton
										hideText
										size="small"
										recordItemId={recordId}
										meta={{headers: {Authorization: userInfo?.auth}}}
										invalidates={['list']}
										confirmTitle="Вы уверены?"
										confirmOkText="Да"
										confirmCancelText="Нет"
									/>
								</Space>
							)
						}
						return (
							<ShowButton size="middle" recordItemId={recordId}>
								Показать
							</ShowButton>
						)
					}}
					width={'10%'}
				/>
			</Table>
		</List>
	)
}

export interface IPostTitle {
	id: number
	title: string
	text: string
	author: User
	comments: Comment[]
}

export type IPostName = Omit<IPostTitle, 'title'> & {
	name: string
}

export interface User {
	id: number
	name: string
}

export interface Comment {
	id: number
	text: string
	author: User
}