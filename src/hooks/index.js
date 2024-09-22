import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { userSlice } from '../app/userSlice'
import { useDispatch } from 'react-redux'

const axiosLogin = async (data) => {
	return axios.post(process.env.REACT_APP_URL + '/api/login', data)
	.then(response => response.data)
	.catch(error => {
		throw new Error('Password ou Username invalide !')
	})
}

export const useLogin = () => {
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationFn: axiosLogin,
		onSuccess: (data, variables, context) => {
			dispatch(userSlice.actions.login(data.token))
		}
	})

	const login = (username, password) => {
		mutation.mutate({
			username: username,
			password: password
		})
	}

	return {
		login,
		...mutation
	}

}
