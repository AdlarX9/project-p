import { createSlice } from '@reduxjs/toolkit'
import { saveStateNotifications } from '../../app/store'

const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: [],
	reducers: {
		logNotifications: (state, action) => {
			const notifications = action.payload
			saveStateNotifications(notifications)
			return notifications
		},

		receiveNotification: (state, action) => {
			const notifications = [
				...state.filter(notif => notif.id !== action.payload.id),
				action.payload
			]

			if (notifications.length === state.length) {
				return state
			} else {
				saveStateNotifications(notifications)
				return notifications
			}
		},

		deleteNotification: (state, action) => {
			const updatedState = state.filter(
				notification => notification.id !== action.payload.id
			)
			saveStateNotifications(updatedState)
			return updatedState
		}
	}
})

export const { logNotifications, receiveNotification, deleteNotification } =
	notificationsSlice.actions
export default notificationsSlice.reducer
