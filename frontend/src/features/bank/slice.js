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
		},

		reduxChangeBankName: (currentState, action) => {
			const banks = currentState.map(bank => {
				if (bank.id === action.payload.id) {
					return { ...bank, name: action.payload.name }
				}
				return bank
			})
			saveStateBank(banks)
			return banks
		}
	}
})

export const { reduxAddBank, reduxLogBank, reduxRemoveBank, logBankOut, reduxChangeBankName } =
	bankSlice.actions
export default bankSlice.reducer
