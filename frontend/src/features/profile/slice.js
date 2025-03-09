import { createSlice } from '@reduxjs/toolkit'

const profileSlice = createSlice({
	name: 'profile',
	initialState: {},
	reducers: {
		logProfile: (currentState, action) => {
			const profile = action.payload
			return profile
		},

		logProfileOut: () => ({})
	}
})

export const { logProfile, logProfileOut } = profileSlice.actions
export default profileSlice.reducer
