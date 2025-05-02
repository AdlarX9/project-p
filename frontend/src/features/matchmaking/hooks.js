import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMatchmakingId, getToken, getUser } from '@redux/selectors'
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
			console.log(error.response.data)
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

	const handleConnected = async (receiverAudioStream = null) => {
		dispatch(matchmakingConnected())
		navigate('/game')

		if (!receiverAudioStream) {
			return
		}

		// const audioContext = new AudioContext()
		// const audioDestination = audioContext.createMediaStreamDestination()
		// const audioSource = audioContext.createMediaStreamSource(receiverAudioStream)
		// audioSource.connect(audioDestination)
		// const audioStream = audioDestination.stream
		// const audioTracks = audioStream.getAudioTracks()
		// if (audioTracks.length === 0) {
		// 	console.error('No audio tracks available')
		// 	return
		// }
		// const audioTrack = audioTracks[0]
		// const audioConstraints = {
		// 	audio: {
		// 		deviceId: audioTrack.getSettings().deviceId,
		// 		echoCancellation: true,
		// 		noiseSuppression: true,
		// 		autoGainControl: true
		// 	}
		// }
		// const stream = await navigator.mediaDevices.getUserMedia(audioConstraints)

		const outputId = await navigator.mediaDevices
			.enumerateDevices()
			.then(devices => {
				devices.filter(devices => devices.kind === 'audiooutput')
				if (devices.some(device => device.deviceId === 'default')) {
					return 'default'
				} else {
					return devices[0].deviceId
				}
			})
			.catch(error => {
				console.error(error)
				return null
			})

		const audioElement = new Audio()
		audioElement.srcObject = receiverAudioStream
		audioElement.setSinkId(outputId)
		audioElement.play()
	}

	return handleConnected
}

export const useHandleDisconnected = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleDisconnected = () => {
		navigate('/')
		dispatch(matchmakingNothing())
	}

	return handleDisconnected
}
