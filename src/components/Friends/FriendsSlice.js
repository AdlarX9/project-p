import { createSlice } from '@reduxjs/toolkit'
import { saveStateFriends } from '../../app/store'

export const FriendsSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {
		add: (currentState, action) => {
			const friends = [
				...currentState,
				action.payload
			]
			saveStateFriends(friends)
			return friends
		},

		logFriends: (currentState, action) => {
			const friends = action.payload.friends
			return friends
		},

		remove: (currentState, action) => {
			const friends = currentState.filter(friend => friend.id !== action.payload.id)
			saveStateFriends(friends)
			return friends
		}
	}
})
