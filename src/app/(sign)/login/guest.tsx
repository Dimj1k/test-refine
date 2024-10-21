'use client'
import {Link} from '@refinedev/core'
import {setAuthCookie} from '@/providers/auth-provider/http-only-cookie'

export const Guest = () => {
	return (
		<Link to="/" style={{fontSize: '12px', height: '1.5em'}} onClick={() => setAuthCookie('guest')}>
			Продолжить как гость
		</Link>
	)
}
