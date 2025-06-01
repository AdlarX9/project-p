import { createSlice } from '@reduxjs/toolkit'
import { saveStateBank } from '@redux/store'

const bankSlice = createSlice({
	name: 'bank',
	initialState: {},
	reducers: {
		reduxAddBank: (currentState, action) => {
			const banks = [...currentState.banks, action.payload]
			const newState = { ...currentState, banks }
			saveStateBank(newState)
			return newState
		},

		reduxLogBank: (_, action) => {
			saveStateBank(action.payload)
			return action.payload
		},

		reduxRemoveBank: (currentState, action) => {
			const banks = currentState.banks.filter(bank => bank.id !== action.payload.id)
			saveStateBank({ ...currentState, banks })
			return { ...currentState, banks }
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
		},

		addLoan: (state, action) => {
			const bank = state.banks.find(bank => bank.id === action.payload.bankId)
			if (bank) {
				if (!bank.loan_requests) {
					bank.loan_requests = []
				}
				bank.loan_requests = bank.loan_requests.filter(
					loanRequest => loanRequest.id !== action.payload.loanRequestId
				)
				if (!bank.loans) bank.loans = []
				bank.loans.push(JSON.parse(action.payload.loan))
			}
			saveStateBank(state)
			return state
		}
	}
})

export const { reduxAddBank, reduxLogBank, reduxRemoveBank, logBankOut, modifyBank, addLoan } =
	bankSlice.actions
export default bankSlice.reducer
