import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { userSlice } from '../app/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getToken, getUser } from '../app/selectors'
import { useLocation } from 'react-router-dom'
import { friendsSlice } from '../components/Friends/friendsSlice'

const axiosLogin = async data => {
	return axios
		.post(process.env.REACT_APP_URL + '/api/login', data)
		.then(response => response.data)
		.catch(error => {
			throw new Error('Mot de passe ou identifiant invalide !')
		})
}

export const useLogin = () => {
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationFn: axiosLogin,
		onSuccess: (data, variables, context) => {
			dispatch(userSlice.actions.login(data.token))
		}
	})

	const login = (username, password) => {
		mutation.mutate({
			username: username,
			password: password
		})
	}

	return {
		login,
		...mutation
	}
}

const axiosMe = async token => {
	return axios
		.get(process.env.REACT_APP_URL + '/api/user/me', {
			headers: {
				Authorization: token
			}
		})
		.then(response => ({ data: response.data, code: response.statusCode }))
		.catch(error => error)
}

export const useLogged = () => {
	const token = useSelector(getToken)
	const [isLogged, setIsLogged] = useState(true)
	const user = useSelector(getUser)
	const { pathname } = useLocation()

	const query = useQuery({
		queryKey: ['user'],
		queryFn: () => axiosMe(token),
		enabled: !!token,
		retry: 0
	})

	useEffect(() => {
		if (query.data?.status === 401 || !user?.token) {
			setIsLogged(false)
			query.refetch()
		} else if (!isLogged) {
			setIsLogged(true)
			query.refetch()
		}
	}, [query.isPending, user])

	useEffect(() => {
		if (pathname === '/') {
			query.refetch()
		}
	}, [pathname])

	return { isLogged, ...query }
}

const axiosSignup = async (data, login) => {
	return axios
		.post(process.env.REACT_APP_URL + '/api/public/signup', data)
		.then(response => response.data)
		.catch(error => error)
}

export const useSignup = () => {
	const dispatch = useDispatch()
	const { login } = useLogin()

	const mutation = useMutation({
		mutationFn: axiosSignup,
		onSuccess: data => {
			dispatch(userSlice.actions.login(data.token))
		}
	})

	const signup = (username, password) => {
		mutation.mutate(
			{
				username: username,
				password: password
			},
			login
		)
	}

	return {
		signup,
		...mutation
	}
}

const axiosDelete = async token => {
	return axios
		.delete(process.env.REACT_APP_URL + '/api/user/me', {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => error)
}

export const useDelete = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationFn: axiosDelete,
		onSuccess: () => {
			dispatch(userSlice.actions.logout())
		}
	})

	const deleteAccount = () => {
		mutation.mutate(token)
	}

	return {
		deleteAccount,
		...mutation
	}
}

const axiosTransfer = async ({ body, headers }) => {
	return axios
		.patch(process.env.REACT_APP_URL + '/api/user/transfer', body, { headers })
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
			dispatch(userSlice.actions.logPersoInf(data))
			dispatch(friendsSlice.actions.logFriends(data))
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
