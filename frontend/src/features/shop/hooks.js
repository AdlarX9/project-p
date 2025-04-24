import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'
import { useLogged } from '@features/authentication'
import { addColor } from '@features/profile'

const axiosGetShop = async token => {
	return axios
		.get(process.env.MAIN_URL + '/api/shop/get_shop', {
			headers: { Authorization: token }
		})
		.then(response => response.data)
		.catch(err => {
			throw new Error(err.message)
		})
}

export const useGetShop = () => {
	const token = useSelector(getToken)

	const query = useQuery({
		queryKey: ['getShop'],
		queryFn: () => axiosGetShop(token),
		enabled: !!token,
		refetchInterval: 15 * 1000,
		retry: 1
	})

	return query
}

const axiosBuyItem = async (token, item) => {
	return axios
		.post(process.env.MAIN_URL + '/api/shop/buy_item', item, {
			headers: { Authorization: token }
		})
		.then(response => {
			return response.data
		})
		.catch(err => {
			console.log(err)
			throw new Error(err.message)
		})
}

export const useBuyItem = () => {
	const token = useSelector(getToken)
	const { refetch } = useLogged()
	const dispatch = useDispatch()

	const mutation = useMutation({
		mutationKey: 'buyItem',
		mutationFn: item => axiosBuyItem(token, item),
		onSuccess: item => {
			refetch()
			dispatch(addColor(item))
		}
	})

	const buyItem = item => {
		mutation.mutate(item)
	}

	return { buyItem, ...mutation }
}
