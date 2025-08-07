import { createSlice } from '@reduxjs/toolkit'
import { saveStateFriends, saveStateUser } from '@redux/store'

const userSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {
		logUser: (_, action) => {
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

		modifyUser: (currentState, action) => {
			const state = { ...currentState }
			if (action.payload.username) {
				state.username = action.payload.username
			}
			if (action.payload.money) {
				state.money = action.payload.money
			}
			saveStateUser(state)
			return state
		},

		addMoney: (currentState, action) => {
			const state = {
				...currentState,
				money: parseInt(currentState.money) + parseInt(action.payload)
			}
			saveStateUser(state)
			return state
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

export const { logUser, logPersoInf, logUserOut, modifyUser, addMoney } = userSlice.actions
export default userSlice.reducer
