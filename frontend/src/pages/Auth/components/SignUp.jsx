import '../style.css'
import { useEffect, useState } from 'react'
import { useLogged, useSignup } from '@features/authentication'
import Loader from '../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import UsernameField from './UsernameField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'
import AuthMessage from './AuthMessage'

const LogIn = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const { signup, isPending, isError, error, data } = useSignup()
	const navigate = useNavigate()
	const { isLogged } = useLogged()

	useEffect(() => {
		if (data?.token) {
			navigate('/')
		}
	}, [isLogged])

	const handleSubmit = async event => {
		event.preventDefault()
		signup(username, password)
	}

	return (
		<form className='auth-wrapper cartoon-txt' onSubmit={handleSubmit}>
			<UsernameField username={username} setUsername={setUsername} />
			<PasswordField isNewPassword={true} password={password} setPassword={setPassword} />

			{isError && <p className='auth-error'>{error.message}</p>}

			<SubmitButton />

			<AuthMessage
				text='Vous avez déjà un compte ?'
				endpoint='/login'
				linkMessage='Connectez-vous !'
			/>

			{isPending && (
				<div className='auth-loader'>
					<Loader />
				</div>
			)}
		</form>
	)
}

export default LogIn
