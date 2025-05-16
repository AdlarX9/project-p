import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getToken, getUser } from '@redux/selectors'
import { useMutation, useQuery } from '@tanstack/react-query'
import { logPersoInf } from '@features/authentication'
import { reduxLogFriends } from '@features/messages'
import { useEffect } from 'react'
import { reduxLogBank } from './slice'

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
		.catch(error => error.message)
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
