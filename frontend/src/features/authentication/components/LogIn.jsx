import './style.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@features/authentication'
import Loader from '@components/Loader'

import PasswordField from './PasswordField'
import UsernameField from './UsernameField'
import SubmitButton from './SubmitButton'
import AuthMessage from './AuthMessage'

const LogIn = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { login, isPending, isError, error, data } = useLogin()
	const navigate = useNavigate()

	useEffect(() => {
		if (data?.token) {
			navigate('/')
		}
	}, [data])

	const handleSubmit = async event => {
		event.preventDefault()
		login(username, password)
	}

	return (
		<form className='auth-wrapper cartoon-txt' onSubmit={handleSubmit}>
			<UsernameField username={username} setUsername={setUsername} />
			<PasswordField isNewPassword={false} password={password} setPassword={setPassword} />

			{isError && <p className='auth-error'>{error.message}</p>}

			<SubmitButton />

			<AuthMessage
				text="You don't have an account?"
				endpoint='/signup'
				linkMessage='Create one!'
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
