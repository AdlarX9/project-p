import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'
import { useEffect } from 'react'
import { logProfile } from './slice'

const axiosGetProfile = async token => {
	return axios
		.get(process.env.REACT_APP_API_URL + '/api/profile/get', {
			headers: { Authorization: token }
		})
		.then(data => {
			console.log(data / data)
			return data.data
		})
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useGetProfile = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const { data, isPending } = useQuery({
		queryKey: ['getProfile'],
		queryFn: () => axiosGetProfile(token),
		enabled: !!token
	})

	useEffect(() => {
		if (!isPending && data?.locker) {
			dispatch(logProfile(data))
		}
	}, [data])

	return { data }
}
