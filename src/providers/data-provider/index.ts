'use client'

import {DataProvider} from '@refinedev/core'
import {authProvider, axiosJson} from '../auth-provider'
import {AxiosError} from 'axios'
import {UserIdentity} from '../auth-provider/interfaces'

type MethodTypes = 'get' | 'delete' | 'head' | 'options'
type MethodTypesWithBody = 'post' | 'put' | 'patch'
const arrayMethodTypesWithBody: MethodTypesWithBody[] = ['patch', 'post', 'put']
export function getApi(resource?: string): string {
	const API_URL = process.env.API!
	if (!API_URL) throw new Error('API_URL не найден')
	if (!resource) {
		return API_URL
	}
	if (resource.startsWith('/')) {
		return API_URL + resource
	}
	return API_URL + `/${resource}`
}

export const dataProvider: DataProvider = {
	getList: async ({resource, pagination, meta}) => {
		const {headers, method = 'get'} = meta || {}
		const Authorization = ((await authProvider.getIdentity?.()) as UserIdentity)?.auth
		const reqMethod = method as MethodTypes
		const {
			data: {result: data},
		} = await axiosJson[reqMethod](resource, {headers: {Authorization, ...headers}})
		let [start, end]: (number | undefined)[] = [0, undefined]
		if (pagination && pagination.current && pagination.pageSize) {
			start = (pagination.current - 1) * pagination.pageSize
			end = start + pagination.pageSize
		}
		const paginatedData = data.slice(start, end)
		return {data: paginatedData, total: data.length}
	},
	getOne: async ({resource, id, meta}) => {
		const {headers, method = 'get'} = meta ?? {}
		const Authorization = ((await authProvider.getIdentity?.()) as UserIdentity)?.auth
		const reqMethod = method as MethodTypes
		const {
			data: {result: data},
		} = await axiosJson[reqMethod](resource + '/' + id, {headers: {Authorization, ...headers}})
		return {data}
	},
	create: async ({resource, variables, meta}) => {
		const {headers, method = 'post'} = meta ?? {}
		const Authorization = ((await authProvider.getIdentity?.()) as UserIdentity)?.auth
		const reqMethod = method as MethodTypesWithBody
		try {
			const {data} = await axiosJson[reqMethod](resource, variables, {
				headers: {Authorization, ...headers},
			})
			return {data}
		} catch (e) {
			return {data: e as AxiosError}
		}
	},
	update: async ({id, meta, resource, variables}) => {
		const Authorization = ((await authProvider.getIdentity?.()) as UserIdentity)?.auth
		const {headers, method = 'put'} = meta ?? {}
		const reqMethod = method as MethodTypesWithBody
		try {
			const {data} = await axiosJson[reqMethod](resource + '/' + id, variables, {
				headers: {Authorization, ...headers},
			})
			return {data}
		} catch (e) {
			return {data: e as AxiosError}
		}
	},
	deleteOne: async ({id, meta, resource}) => {
		const Authorization = ((await authProvider.getIdentity?.()) as UserIdentity)?.auth
		const {headers, method = 'delete'} = meta ?? {}
		const reqMethod = method as MethodTypes
		try {
			const {data} = await axiosJson[reqMethod](resource + '/' + id, {
				headers: {Authorization, ...headers},
			})
			return {data}
		} catch (e) {
			return {data: e as AxiosError}
		}
	},
	getApiUrl: () => {
		return getApi()
	},
	custom: async ({url: resource, method = 'post', payload, headers}) => {
		try {
			if (arrayMethodTypesWithBody.some(v => v === method)) {
				const {data} = await axiosJson[method](resource, payload ?? {}, {headers})
				return {data}
			}
			const {data} = await axiosJson[method](resource, {headers})
			return {data}
		} catch (e) {
			return {data: e as AxiosError}
		}
	},
}
