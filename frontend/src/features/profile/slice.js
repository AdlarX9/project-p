import { createSlice } from '@reduxjs/toolkit'
import { saveStateProfile } from '@redux/store'

const profileSlice = createSlice({
	name: 'profile',
	initialState: {},
	reducers: {
		logProfile: (currentState, action) => {
			const profile = action.payload
			saveStateProfile(profile)
			return profile
		},

		addColor: (currentState, action) => {
			const color = action.payload
			let newState = {}
			if (currentState?.locker?.colors) {
				const colors = [...currentState.locker.colors, color]
				newState = {
					...currentState,
					locker: {
						...currentState.locker,
						colors
					}
				}
			}

			saveStateProfile(newState)
			return newState
		},

		setMainColor: (currentState, action) => {
			const color = action.payload
			let newState = {}
			if (currentState?.locker?.color) {
				newState = {
					...currentState,
					locker: {
						...currentState.locker,
						color
					}
				}
			}

			saveStateProfile(newState)
			return newState
		},

		logProfileOut: () => ({})
	}
})

export const { logProfile, logProfileOut, addColor, setMainColor } = profileSlice.actions
export default profileSlice.reducer
