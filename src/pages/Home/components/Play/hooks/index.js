import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getToken } from '../../../../../app/selectors'

const axiosPlay = async () => {
	return axios
		.post(process.env.REACT_APP_URL + '/api/queue.add', {}, {})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.message)
		})
}

export const UsePlay = () => {
	const token = useSelector(getToken)
	const mutation = useMutation({
		mutationKey: 'play',
		mutationFn: axiosPlay
	})

	const play = () => {
		mutation.mutate()
	}

	return { play, ...mutation }
}
