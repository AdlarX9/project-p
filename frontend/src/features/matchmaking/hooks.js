import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMatchmakingId, getMatchmaking, getToken, getUser } from '@redux/selectors'
import {
	matchmakingConnected,
	matchmakingConnecting,
	matchmakingInQueue,
	matchmakingNothing,
	matchmakingPending
} from '@features/matchmaking'
import { useMercureContext } from '@contexts/MercureContext'

const axiosPlay = async token => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/matchmaking/add',
			{},
			{
				headers: {
					Authorization: token
				}
			}
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.message)
		})
}

const axiosPong = async user => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/matchmaking/pong',
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
		case 'nothing':
			dispatch(matchmakingNothing())
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
		const topic = process.env.MAIN_URL + '/' + user.username + '/matchmaking_update'
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
		.delete(process.env.MAIN_URL + '/api/matchmaking/cancel_play', {
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
			const topic = process.env.MAIN_URL + '/' + username + '/matchmaking_update'
			removeTopic(topic)
			dispatch(matchmakingNothing())
		}
	})

	const cancelPlay = () => {
		mutation.mutate()
	}

	return cancelPlay
}

export const useHandleConnected = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleConnected = async () => {
		dispatch(matchmakingConnected())
		navigate('/game')
	}

	return handleConnected
}

export const useHandleDisconnected = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { removeTopic } = useMercureContext()
	const { username } = useSelector(getUser)

	const handleDisconnected = () => {
		const topic = process.env.MAIN_URL + '/' + username + '/matchmaking_update'
		removeTopic(topic)
		navigate('/')
		dispatch(matchmakingNothing())
	}

	return handleDisconnected
}

const axiosGetTime = async (token, gameId) => {
	return axios
		.get(process.env.MAIN_URL + '/api/matchmaking/get_time/' + gameId, {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useGetTime = () => {
	const token = useSelector(getToken)
	const [time, setTime] = useState(null)
	const { gameId } = useSelector(getMatchmaking)

	const { data, ...query } = useQuery({
		queryKey: ['getTime'],
		queryFn: () => axiosGetTime(token, gameId)
	})

	useEffect(() => {
		if (data?.timeLeft) {
			setTime(data.timeLeft)
		}
	}, [data])

	return { ...query, data, time, setTime }
}

const axiosGameExpired = async (token, gameId) => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/matchmaking/game_expired',
			{ gameId },
			{
				headers: {
					Authorization: token
				}
			}
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useGameExpired = () => {
	const token = useSelector(getToken)
	const { gameId } = useSelector(getMatchmaking)

	const mutation = useMutation({
		mutationKey: 'gameExpired',
		mutationFn: () => axiosGameExpired(token, gameId)
	})

	const gameExpired = () => {
		mutation.mutate()
	}

	return { gameExpired }
}

const axiosLoseGame = async (token, gameId) => {
	return axios
		.post(
			process.env.MAIN_URL + '/api/matchmaking/lose_game',
			{ gameId },
			{
				headers: {
					Authorization: token
				}
			}
		)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useLoseGame = () => {
	const token = useSelector(getToken)
	const { gameId } = useSelector(getMatchmaking)

	const mutation = useMutation({
		mutationKey: 'loseGame',
		mutationFn: () => axiosLoseGame(token, gameId)
	})

	const loseGame = () => {
		mutation.mutate()
	}

	return { loseGame, ...mutation }
}
