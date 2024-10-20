import {Link} from '@refinedev/core'
import {Result} from 'antd'

export default function Page() {
	return (
		<Result
			status="403"
			title="403"
			subTitle="Войдите, чтобы создавать посты"
			extra={<Link to="/posts">Вернуться назад</Link>}
		/>
	)
}
