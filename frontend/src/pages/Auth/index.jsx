import Back from '../../components/Back'
import { useLogged } from '@features/authentication'
import './style.css'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'

const Auth = ({ type }) => {
	const { isLogged } = useLogged()

	return (
		<>
			{isLogged ? (
				<div className='back-wrapper'>
					<Back />
				</div>
			) : (
				<></>
			)}
			{type === 'login' ? <LogIn /> : <SignUp />}
		</>
	)
}

export default Auth
