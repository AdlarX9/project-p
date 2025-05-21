import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getToken, getUser } from '@redux/selectors'
import { useMutation, useQuery } from '@tanstack/react-query'
import { logPersoInf } from '@features/authentication'
import { reduxLogFriends } from '@features/messages'
import { useEffect, useState } from 'react'
import { reduxChangeBankName, reduxLogBank } from './slice'

const axiosTransfer = async ({ body, headers }) => {
	return axios
		.patch(process.env.MAIN_URL + '/api/bank/transfer', body, { headers })
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response?.data?.message || error.message)
		})
}

export const useTransfer = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationFn: axiosTransfer,
		onSuccess: data => {
			dispatch(logPersoInf(data))
			dispatch(reduxLogFriends(data))
		},
		onError: error => {
			console.error('Erreur lors du transfert :', error.message)
		}
	})

	const transfer = (friend, amount) => {
		mutation.mutate({
			body: { idFriend: friend.id, amount },
			headers: { Authorization: token }
		})
	}

	return {
		transfer,
		...mutation
	}
}

const axiosGetPercentage = async token => {
	return axios
		.get(process.env.MAIN_URL + '/api/bank/percentage', {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => error.message)
}

export const useGetPercentage = () => {
	const user = useSelector(getUser)

	const { refetch, data, ...query } = useQuery({
		queryKey: ['getThePercentage'],
		queryFn: () => axiosGetPercentage(user.token),
		retry: 0,
		enabled: !!user
	})

	useEffect(() => {
		refetch()
	}, [user.money])

	return { ...query, percentage: data }
}

const axiosGetBankData = async token => {
	return axios
		.get(process.env.MAIN_URL + '/api/bank/get', {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response?.data?.message || error.message)
		})
}

export const useLoadBankData = () => {
	const user = useSelector(getUser)
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const { refetch, data, ...query } = useQuery({
		queryKey: ['bankData'],
		queryFn: () => axiosGetBankData(token),
		retry: 0,
		enabled: !!user
	})

	useEffect(() => {
		refetch()
	}, [user.money])

	useEffect(() => {
		if (data?.banks) {
			dispatch(reduxLogBank(data))
		}
	}, [data])

	return { ...query, data }
}

const axiosSearchForBanks = async (searchValue, token) => {
	return axios
		.get(process.env.MAIN_URL + '/api/bank/search', {
			headers: {
				Authorization: token
			},
			params: {
				name: searchValue
			}
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response?.data?.message || error.message)
		})
}

export const useSearchForBanks = () => {
	const token = useSelector(getToken)
	const [banks, setBanks] = useState(null)

	const mutation = useMutation({
		mutationFn: searchValue => axiosSearchForBanks(searchValue, token),
		onSuccess: data => {
			setBanks(data)
		}
	})

	const searchForBanks = searchValue => {
		mutation.mutate(searchValue)
	}

	return { ...mutation, searchForBanks, banks }
}

const axiosGetABank = async (bankId, token) => {
	return axios
		.get(process.env.MAIN_URL + '/api/bank/' + bankId, {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response?.data?.message || error.message)
		})
}

export const useGetABank = bankId => {
	const token = useSelector(getToken)
	const [bank, setBank] = useState(null)

	const { data, ...query } = useQuery({
		queryKey: ['bank', bankId],
		queryFn: () => axiosGetABank(bankId, token)
	})

	useEffect(() => {
		if (data?.id) {
			setBank(data)
		}
	}, [data])

	return { data, ...query, bank }
}

const axiosRequestLoan = async (body, token) => {
	return axios
		.post(process.env.MAIN_URL + '/api/bank/request_loan', body, {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => {
			return error.response?.data?.message || error.message
		})
}

export const useRequestLoan = () => {
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationKey: ['requestLoan'],
		mutationFn: body => axiosRequestLoan(body, token)
	})

	const requestLoan = async (bankId, amount, duration, interestRate, request) => {
		return mutation.mutateAsync({ bankId, amount, duration, interestRate, request })
	}

	return { requestLoan, ...mutation }
}

const axiosChangeBankName = async (bankId, name, token) => {
	return axios
		.patch(
			process.env.MAIN_URL + `/api/bank/${bankId}/change_name`,
			{ name },
			{ headers: { Authorization: token } }
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response?.data?.message || error.message)
		})
}

export const useChangeBankName = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationKey: ['changeBankName'],
		mutationFn: ({ bankId, name }) => axiosChangeBankName(bankId, name, token),
		onSuccess: data => {
			dispatch(reduxChangeBankName({ id: data.bankId, name: data.name }))
		}
	})

	const changeBankName = async (bankId, name) => {
		return mutation.mutateAsync({ bankId, name })
	}

	return { changeBankName, ...mutation }
}
