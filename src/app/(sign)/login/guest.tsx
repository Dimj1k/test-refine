'use client'
import {Link} from '@refinedev/core'
import Cookies from 'js-cookie'

export const Guest = () => {
	return (
		<Link to="/" style={{fontSize: '12px'}} onClick={() => Cookies.set('auth', 'guest')}>
			Продолжить как гость
		</Link>
	)
}
