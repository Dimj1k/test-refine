'use client'

import {Suspense} from 'react'

import {Authenticated} from '@refinedev/core'
import {NavigateToResource} from '@refinedev/nextjs-router'

export default function IndexPage() {
	return (
		<Suspense>
			<Authenticated redirectOnFail={'/login'} key="home-page">
				<NavigateToResource />
			</Authenticated>
		</Suspense>
	)
}
