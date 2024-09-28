import { createSlice } from '@reduxjs/toolkit'
import { saveStateFriends, saveStateUser } from './store'

export const userSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {

		login: (currentState, action) => {
			const user = {
				token: 'bearer ' + action.payload
			}
			saveStateUser(user)
			return user
		},

		logPersoInf: (currentState, action) => {
			const state = {
				friends: action.payload.friends,
				user: {
					...currentState,
					id: action.payload.id,
					username: action.payload.username,
					money: action.payload.money
				}
			}
			saveStateUser(state.user)
			saveStateFriends(state.friends)
			return state.user
		},

		logout: () => {
			const state = {
				friends: [],
				user: {}
			}
			saveStateUser(state.user)
			saveStateFriends(state.friends)
			return state.user
		}
		
	}
})
