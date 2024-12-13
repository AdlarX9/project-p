import { createSlice } from '@reduxjs/toolkit'
import { saveStateFriends, saveStateNotifications, saveStateUser } from './store'

const userSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {
		logUser: (currentState, action) => {
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

		logUserOut: () => {
			const state = {
				friends: [],
				user: {},
				notifications: []
			}
			saveStateUser(state.user)
			return state.user
		}
	}
})

export const { logUser, logPersoInf, logUserOut } = userSlice.actions
export default userSlice.reducer
