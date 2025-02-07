import { createSlice } from '@reduxjs/toolkit'

const matchmakingSlice = createSlice({
	name: 'matchmaking',
	initialState: {
		state: 'nothing',
		id: null
	},
	reducers: {
		matchmakingNothing: prevState => {
			return {
				...prevState,
				state: 'nothing'
			}
		},
		matchmakingPending: prevState => {
			return {
				...prevState,
				state: 'pending'
			}
		},
		matchmakingInQueue: (_, action) => {
			return {
				id: action.payload,
				state: 'inQueue'
			}
		},
		matchmakingConnecting: (prevState, action) => {
			return {
				...prevState,
				state: 'connecting',
				role: action.payload.role,
				matchedUsername: action.payload.matchedUsername
			}
		},
		matchmakingConnected: prevState => {
			return {
				...prevState,
				state: 'connected'
			}
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
