'use client'

import i18next from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import {initReactI18next} from 'react-i18next'

i18next
	.use(initReactI18next)
	.use(
		resourcesToBackend(async (language: string) => {
			return await import(`./${language}-common.json`)
		}),
	)
	.init({lng: 'ru', fallbackLng: 'en'})
