import '../style.css'
import { useEffect, useState } from 'react'
import { useLogin } from '../../../hooks'
import Loader from '../../../components/Loader'
import { useNavigate } from 'react-router-dom'

const LogIn = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { login, isPending, isError, error, isSuccess, data } = useLogin()
	const navigate = useNavigate()

	useEffect(() => {
		if (data?.token) {
			navigate('/')
		}
	}, [isSuccess])

	const handleSubmit = async (event) => {
		event.preventDefault()
		login(username, password)
	}

	return (
		<form className='auth-wrapper cartoon-txt' onSubmit={handleSubmit}>

			<div className='field-wrapper'>
				<label className='field-label' htmlFor='username'>
					username
				</label>
				<input
					className='field shadowed'
					label='username'
					type='text'
					id='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>

			<div className='field-wrapper'>
				<label className='field-label' htmlFor='password'>
					password
				</label>
				<input
					className='field shadowed'
					label='password'
					type='text'
					id='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>

			{isPending && <div className='auth-loader'><Loader /></div>}
			{isError && <p className='auth-error'>{error.message}</p>}

			<button className='auth-submit-btn int-btn skewed'>
				<span>Envoyer</span>
			</button>

		</form>
	)
}

export default LogIn
