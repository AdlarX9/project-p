import { createSlice } from '@reduxjs/toolkit'
import { saveStateBank } from '@redux/store'

const bankSlice = createSlice({
	name: 'bank',
	initialState: {},
	reducers: {
		reduxAddBank: (currentState, action) => {
			const bank = [...currentState, action.payload]
			saveStateBank(bank)
			return bank
		},

		reduxLogBank: (_, action) => {
			return action.payload
		},

		reduxRemoveBank: (currentState, action) => {
			const bank = currentState.filter(friend => friend.id !== action.payload.id)
			saveStateBank(bank)
			return bank
		},

		logBankOut: () => {
			const bank = {}
			saveStateBank(bank)
			return bank
		}
	}
})

export const { reduxAddBank, reduxLogBank, reduxRemoveBank, logBankOut } = bankSlice.actions
export default bankSlice.reducer
