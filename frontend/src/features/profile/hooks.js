import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'
import { useEffect, useState } from 'react'
import { logProfile, setMainColor } from './slice'

const axiosGetProfile = async token => {
	return axios
		.get(process.env.MAIN_URL + '/api/profile/get', {
			headers: { Authorization: token }
		})
		.then(data => {
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

const axiosSetColor = async (token, color) => {
	return axios
		.put(
			process.env.MAIN_URL + '/api/profile/set_color',
			{ color },
			{ headers: { Authorization: token } }
		)
		.then(data => data.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useSetColor = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationKey: 'setColor',
		mutationFn: color => axiosSetColor(token, color)
	})

	const setColor = color => {
		mutation
			.mutateAsync(color)
			.then(() => {
				dispatch(setMainColor(color))
			})
			.catch(err => err)
	}

	return { setColor, ...mutation }
}

const axiosGetPublicProfile = async username => {
	if (!username) {
		return null
	}

	return axios
		.get(process.env.MAIN_URL + '/api/public/get_public_profile/' + username)
		.then(data => data.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useGetPublicProfile = username => {
	const [profile, setProfile] = useState(null)

	const { data, ...query } = useQuery({
		queryKey: ['getPublicProfile', username],
		queryFn: () => axiosGetPublicProfile(username),
		enabled: !!username
	})

	useEffect(() => {
		if (data?.id) {
			setProfile(data)
		}
	}, [data])

	return { profile, data, ...query }
}
