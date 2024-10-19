'use client'

import i18next from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {initReactI18next} from 'react-i18next'

i18next
	.use(initReactI18next)
	.use(
		resourcesToBackend(async () => {
			return await import(`./ru-common.json`)
		}),
	)
	.init({lng: 'ru'})
