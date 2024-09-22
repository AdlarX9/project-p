import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { FriendsSlice } from '../components/Friends/FriendsSlice'

export const saveState = (reduxState) => {
	try {
		const serializedState = JSON.stringify(reduxState);
		localStorage.removeItem('reduxState')
		localStorage.setItem('reduxState', serializedState);
	} catch (e) {
		console.error('Could not save state', e);
	}
}

const loadState = () => {
	const defaultState = {
		user: {},
		friends : []
	}
	try {
		const serializedState = localStorage.getItem('reduxState');
		if (serializedState === null) {
			return defaultState
		}		
		return JSON.parse(serializedState);
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
