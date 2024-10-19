'use client'

import {List, ShowButton, useTable} from '@refinedev/antd'
import {Table} from 'antd'
import {IPostTitle} from '../@authentificated/page'

export default function PostsList() {
	const {tableProps} = useTable<IPostTitle>()
	return (
		<List canCreate={false}>
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
					render={(_, {id}: IPostTitle) => {
						return (
							<ShowButton size="middle" recordItemId={id}>
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
