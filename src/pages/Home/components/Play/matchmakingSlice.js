import { createSlice } from '@reduxjs/toolkit'

const matchmakingSlice = createSlice({
	name: 'matchmaking',
	initialState: 'nothing',
	reducers: {
		matchmakingNothing: () => {
			return 'nothing'
		},
		matchmakingPending: () => {
			return 'pending'
		},
		matchmakingInQueue: () => {
			return 'inQueue'
		},
		matchmakingConnecting: () => {
			return 'connecting'
		},
		matchmakingConnected: () => {
			return 'connected'
		}
	}
})

export const {
	matchmakingNothing,
	matchmakingPending,
	matchmakingInQueue,
	matchmakingConnecting,
	matchmakingConnected
} = matchmakingSlice.actions
export default matchmakingSlice.reducer
