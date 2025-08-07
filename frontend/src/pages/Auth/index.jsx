import './style.css'
import Back from '@components/Back'
import { useLogged } from '@features/authentication'
import { LogIn, SignUp } from '@features/authentication'
import { motion } from 'framer-motion'

const Auth = ({ type }) => {
	const { isLogged } = useLogged()

	return (
		<>
			{isLogged ? (
				<div className='back-wrapper'>
					<Back to='/' />
				</div>
			) : (
				<></>
			)}
			<motion.h1
				className='title-txt auth-title'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				{type === 'login' ? 'Log In' : 'Sign Up'}
			</motion.h1>
			{type === 'login' ? <LogIn /> : <SignUp />}
		</>
	)
}

export default Auth
