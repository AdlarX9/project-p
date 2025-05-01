import { createSlice } from '@reduxjs/toolkit'
import { saveStateSettings } from '@redux/store'

const settingsSlice = createSlice({
	name: 'settings',
	initialState: {},
	reducers: {
		logSettings: (_, action) => {
			const settings = action.payload
			saveStateSettings(settings)
			return settings
		},

		reduxChangeSetting: (prevState, action) => {
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

export const { logSettings, reduxChangeSetting, logSettingsOut } = settingsSlice.actions
export default settingsSlice.reducer
