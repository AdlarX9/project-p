import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userReducer } from '@features/authentication'
import { friendsReducer } from '@features/friends'
import { notificationsReducer } from '@features/notifications'
import { matchmakingReducer } from '@features/matchmaking'
import { settingsReducer } from '@features/settings'
import { profileReducer } from '@features/profile'

const defaultState = {
	user: {},
	friends: [],
	notifications: [],
	matchmaking: { state: 'nothing', id: null },
	settings: {
		communicationPrefer: 'call' // call | text
	},
	messages: [],
	profile: {}
}

export const saveStateUser = reduxState => {
	try {
		const serializedState = JSON.stringify(reduxState)
		localStorage.removeItem('reduxStateUser')
		localStorage.setItem('reduxStateUser', serializedState)
	} catch (e) {
		console.error('Could not save state', e)
	}
}

export const saveStateFriends = reduxState => {
	try {
		const serializedState = JSON.stringify(reduxState)
		localStorage.removeItem('reduxStateFriends')
		localStorage.setItem('reduxStateFriends', serializedState)
	} catch (e) {
		console.error('Could not save state', e)
	}
}

export const saveStateNotifications = reduxState => {
	try {
		const serializedState = JSON.stringify(reduxState)
		localStorage.removeItem('reduxStateNotifications')
		localStorage.setItem('reduxStateNotifications', serializedState)
	} catch (e) {
		console.error('Could not save state', e)
	}
}

export const saveStateSettings = reduxState => {
	try {
		const serializedState = JSON.stringify(reduxState)
		localStorage.removeItem('reduxStateSettings')
		localStorage.setItem('reduxStateSettings', serializedState)
	} catch (e) {
		console.error('Could not save state', e)
	}
}

export const saveStateProfile = reduxState => {
	try {
		const serializedState = JSON.stringify(reduxState)
		localStorage.removeItem('reduxStateProfile')
		localStorage.setItem('reduxStateProfile', serializedState)
	} catch (e) {
		console.error('Could not save state', e)
	}
}

const loadState = () => {
	try {
		const user = localStorage.getItem('reduxStateUser')
		const friends = localStorage.getItem('reduxStateFriends')
		const notifications = localStorage.getItem('reduxStateNotifications')
		const settings = localStorage.getItem('reduxStateSettings')
		const profile = localStorage.getItem('reduxStateProfile')
		const serializedState = {
			user: JSON.parse(user),
			friends: JSON.parse(friends),
			notifications: JSON.parse(notifications),
			matchmaking: { state: 'nothing', id: null },
			settings: JSON.parse(settings),
			profile: JSON.parse(profile)
		}
		if (serializedState?.friends === null || serializedState?.user === null) {
			return defaultState
		}
		return serializedState
	} catch (e) {
		return defaultState
	}
}

let state = loadState()

export const store = configureStore({
	preloadedState: state,
	reducer: combineReducers({
		user: userReducer,
		friends: friendsReducer,
		notifications: notificationsReducer,
		matchmaking: matchmakingReducer,
		settings: settingsReducer,
		profile: profileReducer
	}),
	devTools: true
})
