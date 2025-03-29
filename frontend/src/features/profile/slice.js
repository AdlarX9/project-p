import { createSlice } from '@reduxjs/toolkit'

const profileSlice = createSlice({
	name: 'profile',
	initialState: {},
	reducers: {
		logProfile: (currentState, action) => {
			const profile = action.payload
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

			return newState
		},

		logProfileOut: () => ({})
	}
})

export const { logProfile, logProfileOut, addColor } = profileSlice.actions
export default profileSlice.reducer
