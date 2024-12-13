import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { logPersoInf, logUserOut } from './userSlice'
import { useLogged, useRenewToken } from '../hooks'
import { reduxLogFriends } from '../components/Friends/friendsSlice'

const Check = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { isLogged, isLoading, data, refetch } = useLogged()
	const { renewToken } = useRenewToken()

	// Vérifie si l'utilisateur est connecté et tente de renouveler le token
	useEffect(() => {
		if (!isLogged && pathname !== '/signup' && pathname !== '/login') {
			console.log('Tentative de renouvellement du token...')
			renewToken().then(success => {
				if (!success) {
					navigate('/login')
					dispatch(logUserOut())
				}
			})
		}
	}, [isLogged, pathname, navigate])

	useEffect(() => {
		if (!isLoading && data?.data?.id >= 0) {
			dispatch(logPersoInf(data.data))
			dispatch(reduxLogFriends(data.data))
		}
	}, [data, dispatch, navigate])

	return null
}

export default Check
