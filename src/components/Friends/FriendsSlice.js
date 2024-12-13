import { createSlice } from '@reduxjs/toolkit'
import { saveStateFriends } from '../../app/store'

const friendsSlice = createSlice({
	name: 'user',
	initialState: {},
	reducers: {
		reduxAddFriend: (currentState, action) => {
			const friends = [...currentState, action.payload]
			saveStateFriends(friends)
			return friends
		},

		reduxLogFriends: (_, action) => {
			const friends = action.payload.friends
			return friends
		},

		reduxRemoveFriend: (currentState, action) => {
			const friends = currentState.filter(friend => friend.id !== action.payload.id)
			saveStateFriends(friends)
			return friends
		},

		logFriendsOut: () => {
			const friends = []
			saveStateFriends(friends)
			return friends
		}
	}
})

export const { reduxAddFriend, reduxLogFriends, reduxRemoveFriend, logFriendsOut } =
	friendsSlice.actions
export default friendsSlice.reducer
