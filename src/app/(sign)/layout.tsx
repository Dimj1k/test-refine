import {redirect} from 'next/navigation'
import React from 'react'
import {authProviderServer} from '@/providers/auth-provider'

export default async function LogLayout({children}: {children: React.ReactNode}) {
	const data = await getData()
	if (data.authenticated) {
		redirect(data?.redirectTo || '/')
	}
	return <>{children}</>
}

async function getData() {
	const {authenticated, redirectTo, error} = await authProviderServer.check()

	return {
		authenticated,
		redirectTo,
		error,
	}
}
