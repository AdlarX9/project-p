import './style.css'
import { useEffect, useRef, useState } from 'react'
import { useLogged, useSignup } from '@features/authentication'
import Loader from '@components/Loader'
import { useNavigate } from 'react-router-dom'
import UsernameField from './UsernameField'
import PasswordField from './PasswordField'
import SubmitButton from './SubmitButton'
import AuthMessage from './AuthMessage'

const LogIn = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const genderRef = useRef(null)

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
		signup(username, password, genderRef.current.value)
	}

	return (
		<form className='auth-wrapper cartoon-txt' onSubmit={handleSubmit}>
			<UsernameField username={username} setUsername={setUsername} />
			<PasswordField isNewPassword={true} password={password} setPassword={setPassword} />

			<label htmlFor='gender' className='cartoon-short-txt auth-gender-label'>
				Gender
			</label>
			<select id='gender' className='cartoon2-txt' name='gender' ref={genderRef}>
				<option value='Man'>Man</option>
				<option value='Woman'>Woman</option>
				<option value='Croissant'>Croissant</option>
			</select>

			{isError && <p className='auth-error'>{error.message}</p>}

			<SubmitButton />

			<AuthMessage
				text='You already have an account?'
				endpoint='/login'
				linkMessage='Log In!'
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
