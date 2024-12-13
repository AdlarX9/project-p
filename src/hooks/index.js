import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { logUser, logPersoInf, logUserOut } from '../app/userSlice'
import { logFriendsOut, reduxLogFriends } from '../components/Friends/friendsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getToken, getUser } from '../app/selectors'
import { useLocation } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { logNotificationsOut } from '../components/Notifications/notificationsSlice'

const axiosLoginFromIdentifiers = async data => {
	return axios
		.post(process.env.REACT_APP_URL + '/api/login', data)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message || 'Error while trying to log in')
		})
}

export const useLogin = () => {
	const dispatch = useDispatch()
	const [cookies, setCookie, _] = useCookies(['refresh_token'])

	const mutation = useMutation({
		mutationFn: axiosLoginFromIdentifiers,
		onSuccess: data => {
			setCookie('refresh_token', data.refresh_token, {
				path: '/',
				maxAge: 31_536_000
			})
			dispatch(logUser(data.token))
		}
	})

	const login = (username, password) => {
		mutation.mutate({ username, password })
	}

	return {
		login,
		...mutation
	}
}

export const useLogout = () => {
	const dispatch = useDispatch()
	const [, _, removeCookie] = useCookies(['refresh_token'])

	return {
		logout: () => {
			removeCookie('refresh_token', {
				path: '/'
			})
			dispatch(logUserOut())
			dispatch(logFriendsOut())
			dispatch(logNotificationsOut())
		}
	}
}

const axiosRenewAccessToken = async ({ refresh_token }) => {
	return axios
		.post(
			process.env.REACT_APP_URL + '/api/token/refresh',
			{},
			{
				headers: {
					Authorization: `Bearer ${refresh_token}`
				}
			}
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useRenewToken = () => {
	const dispatch = useDispatch()
	const [cookies, setCookie, _] = useCookies(['refresh_token'])

	const mutation = useMutation({
		mutationFn: axiosRenewAccessToken,
		onSuccess: data => {
			setCookie('refresh_token', data.refresh_token, {
				path: '/',
				maxAge: 31_536_000
			})
			dispatch(logUser(data.token))
		}
	})

	return {
		renewToken: async () => {
			mutation.mutate(cookies.refresh_token)
		}
	}
}

const axiosMe = async token => {
	return axios
		.get(`${process.env.REACT_APP_URL}/api/user/me`, {
			headers: {
				Authorization: token
			}
		})
		.then(response => ({ data: response.data, code: response.status }))
		.catch(error => ({
			data: error.response?.data || null,
			code: error.response?.status || 500
		}))
}

export const useLogged = () => {
	const token = useSelector(getToken)
	const [isLogged, setIsLogged] = useState(true)
	const user = useSelector(getUser)
	const dispatch = useDispatch()
	const { pathname } = useLocation()

	const query = useQuery({
		queryKey: ['user'],
		queryFn: () => axiosMe(token),
		enabled: !!token,
		retry: 3
	})

	useEffect(() => {
		if (query.data?.code === 401 || !user?.token) {
			setIsLogged(false)
		} else {
			setIsLogged(true)
		}
	}, [query.data, user])

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
			dispatch(login(data.token))
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
			dispatch(logUserOut())
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
