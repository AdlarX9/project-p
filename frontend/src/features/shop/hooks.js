import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { getToken } from '@redux/selectors'

const axiosGetShop = async token => {
	return axios
		.get(process.env.REACT_APP_API_URL + '/api/shop/get_shop', {
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
