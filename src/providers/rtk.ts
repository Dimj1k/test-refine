import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UserIdentity} from './auth-provider/interfaces'

interface UserInfo {
	userInfo: null | Omit<UserIdentity, 'auth'>
}

export const userInfoSlice = createSlice({
	initialState: {userInfo: null} as UserInfo,
	name: 'userInfo',
	reducerPath: 'userInfo',
	reducers: builder => ({
		setCacheUserInfo: builder.reducer(
			(state, {payload: {id, name}}: PayloadAction<Omit<UserIdentity, 'auth'>>) => {
				state.userInfo = {id, name}
			},
		),
		clearCacheUserInfo: builder.reducer(state => {
			state.userInfo = null
		}),
	}),
})

export const rtkStore = configureStore({
	devTools: true,
	reducer: {
		[userInfoSlice.reducerPath]: userInfoSlice.reducer,
	},
})
