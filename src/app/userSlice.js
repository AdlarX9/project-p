import { createSlice } from '@reduxjs/toolkit'
import { saveState } from './store'

export const userSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {
		login: (currentState, action) => {
			const state = {
				friends: currentState.friends,
				user: {
					...currentState.user,
					token: 'bearer ' + action.payload
				}
			}
			saveState(state)
			return state
		}
	}
})
