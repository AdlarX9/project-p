import { createSlice } from '@reduxjs/toolkit'
import { saveStateSettings } from './store'

const settingsSlice = createSlice({
	name: 'settings',
	initialState: {},
	reducers: {
		changeSetting: (prevState, action) => {
			const settings = { ...prevState, [action.payload.key]: action.payload.value }
			saveStateSettings(settings)
			return settings
		},

		logSettingsOut: () => {
			const settings = {}
			saveStateSettings(settings)
			return settings
		}
	}
})

export const { logNotifications, receiveNotification, deleteNotification, logNotificationsOut } =
	settingsSlice.actions
export default settingsSlice.reducer
