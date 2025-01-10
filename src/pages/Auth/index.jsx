import hide from '../../assets/hide.png'
import unhide from '../../assets/unhide.png'
import { Link, useNavigate } from 'react-router-dom'
import Back from '../../components/Back'
import { useLogged, useLogin, useSignup } from '../../hooks'
import './style.css'
import { useEffect, useState } from 'react'
import { Loader } from '@react-three/drei'

const Auth = ({ type }) => {
	const { isLogged } = useLogged()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
	const [hidden, setHidden] = useState(true)
	const { login, ...loginData } = useLogin()
	const { signup, ...signupData } = useSignup()
	const [isPending, setIsPending] = useState(null)
	const [isError, setIsError] = useState(null)
	const [error, setError] = useState(null)
	const [data, setData] = useState(null)
	let untrackedIsPending, untrackedIsError, untrackedError, untrackedData

	useEffect(() => {
		if (type === 'login') {
			;({ untrackedIsPending, untrackedIsError, untrackedError, untrackedData } = loginData)
		} else {
			;({ untrackedIsPending, untrackedIsError, untrackedError, untrackedData } = signupData)
		}
		setIsPending(() => untrackedIsPending)
		setIsError(() => untrackedIsError)
		setError(() => untrackedError)
		setData(() => untrackedData)
	}, [type, loginData, signupData])

	useEffect(() => {
		console.log(isPending)
	}, [isPending])

	useEffect(() => {
		if (data?.token) {
			navigate('/')
		}
	}, [isLogged])

	const handleSubmit = async event => {
		event.preventDefault()
		login(username, password)
	}

	const toggleShowPassword = e => {
		e.preventDefault()
		setHidden(!hidden)
	}

	return (
		<>
			{isLogged ? <Back /> : <></>}
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
						onChange={e => setUsername(e.target.value)}
					/>
				</div>

				<div className='field-wrapper'>
					<label className='field-label' htmlFor='password'>
						password
					</label>
					<div className='password-wrapper'>
						<input
							className='field shadowed password-field'
							label='password'
							id='password'
							type={hidden ? 'password' : 'text'}
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button onClick={toggleShowPassword} className='no-btn'>
							<img src={hidden ? hide : unhide} alt={hidden ? 'hide' : 'show'} />
						</button>
					</div>
				</div>

				{isError && <p className='auth-error'>{error.message}</p>}

				<button className='auth-submit-btn int-btn skewed'>
					<span>Envoyer</span>
				</button>
				<p className='cartoon2-txt auth-link'>
					{type === 'login'
						? "Vous n'avez pas de compte ?"
						: 'Vous avez déjà un compte ?'}
					<br />
					{type === 'login' ? (
						<Link to='/signup'>Créez-en un !</Link>
					) : (
						<Link to='/login'>Connectez-vous !</Link>
					)}
				</p>

				{isPending && (
					<div className='auth-loader'>
						<Loader />
					</div>
				)}
			</form>
		</>
	)
}

export default Auth
