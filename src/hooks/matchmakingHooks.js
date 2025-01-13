import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchmakingId, getToken, getUser } from '../reduxStore/selectors'
import {
	matchmakingConnecting,
	matchmakingInQueue,
	matchmakingNothing,
	matchmakingPending
} from '../reduxStore/matchmakingSlice'
import { useEffect, useRef } from 'react'
import { useMercureContext } from '../contexts/MercureContext'

const axiosPlay = async token => {
	return axios
		.post(
			process.env.REACT_APP_API_URL + '/api/queue/add',
			{},
			{
				headers: {
					Authorization: token
				}
			}
		)
		.then(response => response.data)
		.catch(error => {
			console.log(error.response.data)
			throw new Error(error.message)
		})
}

const axiosPong = async user => {
	return axios
		.post(
			process.env.REACT_APP_API_URL + '/api/queue/pong',
			{},
			{
				headers: {
					Authorization: user.token
				}
			}
		)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

const handleUpdate = ({ type, parsedData, dispatch, user }) => {
	if (type !== 'matchmakingUpdate') {
		return
	}

	switch (parsedData.message) {
		case 'in_queue':
			dispatch(matchmakingInQueue(parsedData.messageId))
			break
		case 'connecting':
			dispatch(matchmakingConnecting(parsedData))
			break
		case 'ping':
			axiosPong(user)
			break
		default:
			break
	}
}

export const UsePlay = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)
	const user = useSelector(getUser)
	const eventSourceRef = useRef(null)
	const { addTopic } = useMercureContext()

	const subscribeMathcmakingUpdate = () => {
		const topic = process.env.REACT_APP_CLIENT_URL + '/' + user.username + '/matchmaking_update'
		addTopic(topic, handleUpdate)
	}

	const mutation = useMutation({
		mutationKey: 'play',
		mutationFn: () => axiosPlay(token),
		onSuccess: () => {
			dispatch(matchmakingPending())
			subscribeMathcmakingUpdate()
		}
	})

	const play = () => {
		mutation.mutate()
	}

	// Cleanup EventSource lors du démontage du composant
	useEffect(() => {
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close()
			}
		}
	}, [])

	return { play, ...mutation }
}

const axiosCancelPlay = async (token, messageId) => {
	return axios
		.delete(process.env.REACT_APP_API_URL + '/api/queue/cancel_play', {
			headers: {
				Authorization: token
			},
			data: { messageId }
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useCancelPlay = () => {
	const dispatch = useDispatch()
	const { username, token } = useSelector(getUser)
	const { removeTopic } = useMercureContext()
	const messageId = useSelector(getMatchmakingId)

	const mutation = useMutation({
		mutationKey: 'cancelPlay',
		mutationFn: () => axiosCancelPlay(token, messageId),
		onSuccess: () => {
			const topic = process.env.REACT_APP_CLIENT_URL + '/' + username + '/matchmaking_update'
			removeTopic(topic)
			dispatch(matchmakingNothing())
		}
	})

	const cancelPlay = () => {
		mutation.mutate()
	}

	return cancelPlay
}
