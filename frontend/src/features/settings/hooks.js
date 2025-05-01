import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'
import { reduxChangeSetting, logSettings } from './slice'
import { useEffect } from 'react'

const axiosGetSettings = async token => {
	return axios
		.get(`${process.env.MAIN_URL}/api/settings/get`, {
			headers: {
				Authorization: token
			}
		})
		.then(response => response.data)
		.catch(error => {
			throw new Error(error.response.data.message)
		})
}

export const useGetSettings = () => {
	const token = useSelector(getToken)
	const dispatch = useDispatch()

	const query = useQuery({
		queryKey: ['getSettings'],
		queryFn: () => axiosGetSettings(token),
		enabled: !!token
	})

	useEffect(() => {
		if (query.data) {
			dispatch(logSettings(query.data))
		}
	}, [query.data])

	return { ...query }
}

const axiosChangeSetting = async (token, setting) => {
	return axios
		.put(
			`${process.env.MAIN_URL}/api/settings/edit/${setting.param}`,
			{
				value: setting.value
			},
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

export const useChangeSetting = () => {
	const dispatch = useDispatch()
	const token = useSelector(getToken)

	const mutation = useMutation({
		mutationKey: ['changeSetting'],
		mutationFn: setting => axiosChangeSetting(token, setting),
		onSuccess: data => {
			dispatch(reduxChangeSetting({ key: data.key, value: data.value }))
		}
	})

	const changeSetting = setting => {
		mutation.mutate(setting)
	}

	return { changeSetting, ...mutation }
}
