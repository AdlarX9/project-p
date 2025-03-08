import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getToken, getUser } from '@redux/selectors'
import {
	deleteNotification,
	logNotifications,
	logNotificationsOut,
	receiveNotification
} from '@features/notifications'
import { useMercureContext } from '@contexts/MercureContext'
import { reduxAddFriend, reduxRemoveFriend } from '@features/friends'

const axiosNotificationsGet = async token => {
	return axios
		.get(process.env.REACT_APP_API_URL + '/api/user/getNotifications', {
			headers: {
				Authorization: token
			}
		})
		.catch(data => ({ data: data.data, status: data.status }))
		.catch(error => error)
}

const axiosGetFriend = async (token, friendUsername) => {
	return axios
		.get(process.env.REACT_APP_API_URL + '/api/friends/get/' + friendUsername, {
			headers: { Authorization: token }
		})
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

const handleNotification = ({ type, parsedData, dispatch, user, removeNotification }) => {
	if (type !== 'notification') {
		return
	}

	switch (parsedData?.action) {
		case 'addFriend':
			axiosGetFriend(user.token, parsedData.target).then(data => {
				dispatch(reduxAddFriend(data))
			})
			break
		case 'removeFriend':
			dispatch(reduxRemoveFriend(parsedData.target))
			break
		case 'receiveMessage':
			if (window.location.pathname === '/chat/' + parsedData.target[0]) {
				removeNotification(parsedData)
				return
			}
			break
		case 'deleteMessage':
			if (window.location.pathname === '/chat/' + parsedData.target[0]) {
				removeNotification(parsedData)
				return
			}
			break
	}

	dispatch(receiveNotification(parsedData))
}

export const useSubscribeNotifications = () => {
	const { username, token } = useSelector(getUser)
	const dispatch = useDispatch()
	const { addTopic } = useMercureContext()

	const { data, refetch } = useQuery({
		queryKey: ['notificationSubscribe'],
		queryFn: () => axiosNotificationsGet(token),
		enabled: !!token,
		retry: 0
	})

	const topic = process.env.REACT_APP_CLIENT_URL + '/' + username + '/notifications'
	useEffect(() => {
		if (data?.status == 200) {
			dispatch(logNotifications(data.data))
			addTopic(topic, handleNotification)
		}
	}, [data])

	return { data, refetch }
}

const axiosNotificationsDelete = async (token, notification) => {
	try {
		const response = await axios.delete(
			`${process.env.REACT_APP_API_URL}/api/user/deleteNotification/${notification.id}`,
			{
				headers: {
					Authorization: token
				}
			}
		)
		return response.data
	} catch (error) {
		throw new Error(error.message)
	}
}

export const useRemoveNotification = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationKey: 'deleteNotif',
		mutationFn: notification => axiosNotificationsDelete(token, notification),
		onSuccess: data => {
			dispatch(deleteNotification(data))
		},
		onError: error => {
			console.error('Erreur lors de la suppression de la notification:', error)
		}
	})

	const remove = notification => {
		mutation.mutate(notification)
	}

	return remove
}

const axiosEmptyNotifications = async token => {
	try {
		const response = await axios.delete(
			process.env.REACT_APP_API_URL + '/api/user/emptyNotifications',
			{
				headers: {
					Authorization: token
				}
			}
		)
		return response.data
	} catch (error) {
		throw new Error(error.message)
	}
}

export const useEmptyNotifications = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationKey: 'emptyNotifications',
		mutationFn: () => axiosEmptyNotifications(token),
		onSuccess: () => {
			dispatch(logNotificationsOut())
		}
	})

	const emptyNotifications = () => {
		mutation.mutate()
	}

	return { emptyNotifications, ...mutation }
}
