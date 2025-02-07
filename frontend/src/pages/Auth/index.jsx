import Back from '../../components/Back'
import { useLogged } from '../../hooks/userHooks'
import './style.css'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'

const Auth = ({ type }) => {
	const { isLogged } = useLogged()

	return (
		<>
			{isLogged ? <Back /> : <></>}
			{type === 'login' ? <LogIn /> : <SignUp />}
		</>
	)
}

export default Auth
