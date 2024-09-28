import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { userSlice } from "./userSlice";
import { useLogged } from "../hooks";
import { FriendsSlice } from "../components/Friends/FriendsSlice";

const Check = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const { isLogged, isLoading, data } = useLogged()

	useEffect(() => {
		if (!isLogged && pathname !== '/signup' && pathname !== '/login') {
			navigate('/login')
		}
	}, [isLogged, navigate])

	useEffect(() => {
		if (!isLoading && data?.data?.id >= 0) {
			dispatch(userSlice.actions.logPersoInf(data.data))
			dispatch(FriendsSlice.actions.logFriends(data.data))
		}
	}, [isLoading, data, dispatch])

	return null
}

export default Check