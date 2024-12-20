import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getToken, getUser } from '../../../../../app/selectors'
import {
	matchmakingConnecting,
	matchmakingInQueue,
	matchmakingPending
} from '../matchmakingSlice'

const axiosPlay = async token => {
	return axios
		.post(
			process.env.REACT_APP_URL + '/api/queue/add',
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

export const UsePlay = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)
	const user = useSelector(getUser)
	const mutation = useMutation({
		mutationKey: 'play',
		mutationFn: () => axiosPlay(token),
		onSuccess: () => {
			dispatch(matchmakingPending())
		}
	})

	const play = () => {
		mutation.mutate()
		const url = new URL('http://localhost:2019/.well-known/mercure')
		url.searchParams.append(
			'topic',
			'http://localhost:3000/' + user.username + '/matchmaking'
		)
		const eventSource = new EventSource(url)
		eventSource.onmessage = notification => {
			const parsedData = JSON.parse(notification.data)
			switch (parsedData.message) {
				case 'queued':
					dispatch(matchmakingInQueue())
					break
				case 'matched':
					dispatch(matchmakingConnecting())
					break
				default:
					break
			}
		}
	}

	return { play, ...mutation }
}
