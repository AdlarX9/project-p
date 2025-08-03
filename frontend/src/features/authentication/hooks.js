import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import { getToken } from '@redux/selectors'
import { useMercureContext } from '@contexts/MercureContext'
import { logUser, logUserOut, logPersoInf } from './slice'
import { logFriendsOut, reduxLogFriends } from '@features/friends'
import { logNotificationsOut } from '@features/notifications'
import { matchmakingNothing } from '@features/matchmaking'
import { logProfileOut } from '@features/profile'

const axiosLogin = async data => {
	return axios
		.post(process.env.MAIN_URL + '/api/login', data)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message || 'Error while trying to log in')
		})
}

export const useLogin = () => {
	const dispatch = useDispatch()
	const { cleanupTopics } = useMercureContext()
	const [_, setCookie, __] = useCookies(['refresh_token'])

	const mutation = useMutation({
		mutationFn: axiosLogin,
		onSuccess: data => {
			setCookie('refresh_token', data.refresh_token, {
				path: '/',
				maxAge: 315_360_000, // 10 ans
				secure: true
			})
			dispatch(logUser(data.token))
		}
	})

	const login = (username, password) => {
		cleanupTopics()
		mutation.mutate({ username, password })
	}

	return {
		login,
		...mutation
	}
}

const axiosLogout = async ({ refresh_token, token }) => {
	return axios
		.delete(process.env.MAIN_URL + '/api/user/logout', {
			headers: {
				Authorization: token
			},
			data: { refresh_token }
		})
		.then(data => data.data)
		.catch(error => {
			console.log(error)
			throw new Error(error.response.data.message)
		})
}

export const useLogout = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)
	const { cleanupTopics } = useMercureContext()
	const [cookies, _, removeCookie] = useCookies(['refresh_token'])

	const mutation = useMutation({
		mutationKey: ['logout'],
		mutationFn: ({ token, refresh_token }) => axiosLogout({ refresh_token, token })
	})

	const logout = () => {
		cleanupTopics()
		mutation.mutate({ token, refresh_token: cookies?.refresh_token })
		removeCookie('refresh_token', {
			path: '/'
		})
		dispatch(logUserOut())
		dispatch(logFriendsOut())
		dispatch(logNotificationsOut())
		dispatch(matchmakingNothing())
		dispatch(logProfileOut())
	}

	return { logout }
}

const axiosRenewAccessToken = async ({ refresh_token }) => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/token/refresh',
			{
				refresh_token
			},
			{}
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useRenewToken = () => {
	const dispatch = useDispatch()
	const [cookies, setCookie, _] = useCookies(['refresh_token'])
	const { logout } = useLogout()
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const mutation = useMutation({
		mutationFn: axiosRenewAccessToken,
		onSuccess: data => {
			dispatch(logUser(data.token))
		},
		onError: () => {
			if (pathname !== '/signup' && pathname !== '/login') {
				navigate('/login')
				logout()
			}
		}
	})

	return {
		renewToken: async () => {
			mutation.mutate({ refresh_token: cookies.refresh_token })
		}
	}
}

const axiosMe = async token => {
	if (!token) {
		return { data: null, code: 401 }
	}

	return axios
		.get(`${process.env.MAIN_URL}/api/user/me`, {
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
	const dispatch = useDispatch()
	const { pathname } = useLocation()
	const queryClient = useQueryClient()
	const [isLogged, setIsLogged] = useState(!!token)

	const { data, isPending, isFetching, refetch } = useQuery({
		queryKey: ['user'],
		queryFn: () => axiosMe(token),
		retry: 3,
		refetchOnWindowFocus: true
	})

	useEffect(() => {
		refetch()
	}, [token])

	useEffect(() => {
		if (data?.code === 200) {
			dispatch(logPersoInf(data.data))
			dispatch(reduxLogFriends(data.data))
			setIsLogged(true)
		} else if (!isPending) {
			setIsLogged(false)
		}
	}, [data, isPending])

	useEffect(() => {
		queryClient.invalidateQueries(['user']) // Force la mise à jour au lieu de refetch
	}, [pathname, queryClient])

	return { isLogged, isFetching, refetch, data }
}

const axiosSignup = async data => {
	return axios
		.post(process.env.MAIN_URL + '/api/public/signup', data)
		.then(response => response.data)
		.catch(error => error)
}

export const useSignup = () => {
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationFn: data => axiosSignup(data),
		onSuccess: data => {
			dispatch(logUser(data.token))
		}
	})

	const signup = (username, password, gender) => {
		mutation.mutate({
			username: username,
			password: password,
			gender: gender
		})
	}

	return {
		signup,
		...mutation
	}
}

const axiosDelete = async token => {
	return axios
		.delete(process.env.MAIN_URL + '/api/user/me', {
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
