import {Header} from '@components/header'
import {authProviderServer} from '@providers/auth-provider'
import {CheckResponse} from '@refinedev/core'
import {Metadata} from 'next'
import {redirect} from 'next/navigation'
import React from 'react'
import {ThemedLayout} from './themed-layout'

export const metadata: Metadata = {
	title: 'Посты',
}

export default async function Layout({authentificated}: {authentificated: React.ReactNode}) {
	const data = await getData()
	if (!data.authenticated) {
		return redirect(data?.redirectTo || '/login')
	}
	return <ThemedLayout Header={Header}>{authentificated}</ThemedLayout>
}

async function getData() {
	const {
		authenticated,
		isGuest: guest,
		redirectTo,
	} = (await authProviderServer.check()) as CheckResponse & {
		isGuest?: boolean
	}

	return {
		authenticated,
		guest,
		redirectTo,
	}
}
