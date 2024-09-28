import '../style.css'
import hide from '../../../assets/hide.png'
import unhide from '../../../assets/unhide.png'
import { useEffect, useState } from 'react'
import { useLogged, useSignup } from '../../../hooks'
import Loader from '../../../components/Loader'
import { Link, useNavigate } from 'react-router-dom'

const LogIn = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [hidden, setHidden] = useState(true)

	const { signup, isPending, isError, error, data } = useSignup()
	const navigate = useNavigate()
	const { isLogged } = useLogged()

	useEffect(() => {
		if (data?.token) {
			navigate('/')
		}
	}, [isLogged])

	const handleSubmit = async (event) => {
		event.preventDefault()
		signup(username, password)
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
				<div className='password-wrapper'>
					<input
						className='field shadowed'
						label='password'
						id='password'
						type={ hidden ? 'password' : 'text' }
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<img
						src={hidden ? hide : unhide}
						alt={hidden ? 'hide' : 'show'}
						onClick={() => setHidden(!hidden)}
					/>
				</div>
			</div>

			{isError && <p className='auth-error'>{error.message}</p>}

			<button className='auth-submit-btn int-btn skewed'>
				<span>Envoyer</span>
			</button>
			<p className='cartoon2-txt auth-link'>
				Vous avez déjà un compte ? 
				<br />
				<Link to='/login'>Connectez-vous !</Link>
			</p>

			{isPending && <div className='auth-loader'><Loader /></div>}

		</form>
	)
}

export default LogIn
