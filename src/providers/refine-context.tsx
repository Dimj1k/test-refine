'use client'
import routerProvider from '@refinedev/nextjs-router'
import {I18nProvider, Refine} from '@refinedev/core'
import {RefineKbar, RefineKbarProvider} from '@refinedev/kbar'
import {PropsWithChildren} from 'react'
import {AppIcon} from '../components/app-icon'
import RefIcon from '@ant-design/icons/lib/icons/TruckFilled'
import {dataProvider} from './data-provider'
import {useNotificationProvider} from '@refinedev/antd'
import {authProvider} from './auth-provider'
import {DevtoolsProvider} from '@refinedev/devtools'
import {useTranslation} from 'next-i18next'
import './i18n-provider'
import {accessControlProvider} from './access-control-provider'

export const RefineContext: React.FC<PropsWithChildren> = ({children}) => {
	const {t, i18n} = useTranslation()
	const i18nProvider: I18nProvider = {
		translate: (key, options: string) => {
			return t(key, options)
		},
		changeLocale: lang => i18n.changeLanguage(lang),
		getLocale: () => i18n.language,
	}
	return (
		<RefineKbarProvider>
			<DevtoolsProvider>
				<Refine
					accessControlProvider={accessControlProvider}
					i18nProvider={i18nProvider}
					routerProvider={routerProvider}
					dataProvider={dataProvider}
					notificationProvider={useNotificationProvider}
					authProvider={authProvider}
					resources={[
						{
							name: 'posts',
							list: '/posts',
							create: '/posts/create',
							edit: '/posts/edit/:id',
							show: '/posts/show/:id',
							meta: {
								canDelete: true,
								label: 'Посты',
								icon: <RefIcon />,
							},
						},
					]}
					options={{
						warnWhenUnsavedChanges: true,
						projectId: 'fGVDEF-tC5vtr-68GdlO',
						title: {text: 'Refine Project', icon: <AppIcon />},
					}}>
					{children}
					<RefineKbar />
				</Refine>
			</DevtoolsProvider>
		</RefineKbarProvider>
	)
}
