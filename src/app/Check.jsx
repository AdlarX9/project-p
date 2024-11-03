import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { userSlice } from './userSlice'
import { useLogged } from '../hooks'
import { friendsSlice } from '../components/Friends/friendsSlice'

const Check = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { isLogged, isLoading, data } = useLogged()

	// Redirection si non connecté
	useEffect(() => {
		if (!isLogged && pathname !== '/signup' && pathname !== '/login') {
			navigate('/login')
		}
	}, [isLogged, pathname, navigate])

	// Mise à jour des informations utilisateur et amis
	useEffect(() => {
		if (!isLoading && data?.data?.id >= 0) {
			dispatch(userSlice.actions.logPersoInf(data.data))
			dispatch(friendsSlice.actions.logFriends(data.data))
		}
	}, [isLoading, data, dispatch])

	return null
}

export default Check
