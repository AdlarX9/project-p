import Back from '../../components/Back'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import './style.css'
import { useEffect } from 'react'

const Auth = ({ type }) => {

	return (
		<>
			<Back />
			{type === 'login' ? (
				<LogIn />
			) : type === 'signup' ? (
				<SignUp />
			) : null}
		</>
	)
}

export default Auth
