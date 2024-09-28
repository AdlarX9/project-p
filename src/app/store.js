import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { FriendsSlice } from '../components/Friends/FriendsSlice'

const defaultState = {
	user: {},
	friends : []
}

export const saveStateUser = (reduxState) => {
	try {
		const serializedState = JSON.stringify(reduxState);
		localStorage.removeItem('reduxStateUser')
		localStorage.setItem('reduxStateUser', serializedState);
	} catch (e) {
		console.error('Could not save state', e);
	}
}

export const saveStateFriends = (reduxState) => {
	try {
		const serializedState = JSON.stringify(reduxState);
		localStorage.removeItem('reduxStateFriends')
		localStorage.setItem('reduxStateFriends', serializedState);
	} catch (e) {
		console.error('Could not save state', e);
	}
}

const loadState = () => {
	try {
		const user = localStorage.getItem('reduxStateUser')
		const friends = localStorage.getItem('reduxStateFriends')
		const serializedState = {
			user: JSON.parse(user),
			friends: JSON.parse(friends)
		}
		if (serializedState?.friends === null || serializedState?.user === null) {
			return defaultState
		}
		return serializedState;
	} catch (e) {
		return defaultState
	}
}

let state = loadState()

export const store = configureStore({
	preloadedState: state,
	reducer: combineReducers({
		user: userSlice.reducer,
		friends: FriendsSlice.reducer
	})
})
