import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getToken, getUser } from '../../../app/selectors'
import { deleteNotification, logNotifications, receiveNotification } from '../notificationsSlice'

const axiosNotificationsGet = async token => {
	try {
		const response = await axios.get(process.env.REACT_APP_URL + '/api/user/getNotifications', {
			headers: {
				Authorization: token
			}
		})
		return { data: response.data, status: response.status }
	} catch (error) {
		return error
	}
}

export const useSubscribeNotifications = () => {
	const { username, token } = useSelector(getUser)
	const dispatch = useDispatch()

	const { data } = useQuery({
		queryKey: ['notificationSubscribe'],
		queryFn: () => axiosNotificationsGet(token),
		enabled: !!token,
		retry: 0
	})
	useEffect(() => {
		if (data?.status == 200) {
			dispatch(logNotifications(data.data))
		}
	}, [data])

	const url = new URL('http://localhost:2019/.well-known/mercure')
	url.searchParams.append('topic', 'http://localhost:3000/' + username)
	const eventSource = new EventSource(url)
	eventSource.onmessage = notification => {
		const parsedData = JSON.parse(notification.data)
		dispatch(receiveNotification(parsedData))
	}

	return data
}

const axiosNotificationsDelete = async (token, notification) => {
	try {
		const response = await axios.delete(
			`${process.env.REACT_APP_URL}/api/user/deleteNotification/${notification.id}`,
			{
				headers: {
					Authorization: token // Ajoutez 'Bearer' pour l'authentification
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
		mutationKey: 'deleteNotif', // `mutationKey` est une chaîne simple ici
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
