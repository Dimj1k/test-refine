import {Header} from '@components/header'
import {authProviderServer} from '@providers/auth-provider'
import {ThemedLayoutV2} from '@refinedev/antd'
import {Metadata} from 'next'
import React from 'react'

export const metadata: Metadata = {
	title: 'Посты',
}

export default async function Layout({
	authentificated,
	guest,
}: {
	guest: React.ReactNode
	authentificated: React.ReactNode
}) {
	const isAuthentificated = await getData()
	return (
		<ThemedLayoutV2 Header={Header}>{isAuthentificated ? authentificated : guest}</ThemedLayoutV2>
	)
}

async function getData() {
	const {authenticated, redirectTo} = await authProviderServer.check()

	return {
		authenticated,
		redirectTo,
	}
}
