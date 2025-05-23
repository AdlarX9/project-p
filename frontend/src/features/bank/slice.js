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
			saveStateBank(action.payload)
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
		},

		modifyBank: (currentState, action) => {
			const banks = currentState.banks.map(bank => {
				if (bank.id === action.payload.id) {
					const newBank = { ...bank }
					if (action.payload?.name) {
						newBank.name = action.payload.name
					}
					if (action.payload?.description) {
						newBank.description = action.payload.description
					}
					if (action.payload?.money) {
						newBank.money = action.payload.money
					}
					return newBank
				}
				return bank
			})
			const newState = { ...currentState, banks }
			saveStateBank(newState)
			return newState
		}
	}
})

export const { reduxAddBank, reduxLogBank, reduxRemoveBank, logBankOut, modifyBank } =
	bankSlice.actions
export default bankSlice.reducer
