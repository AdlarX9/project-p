import Field from './Field'
import hide from '@assets/hide.png'
import unhide from '@assets/unhide.png'
import { useState } from 'react'

const PasswordField = ({ password, setPassword, isNewPassword }) => {
	const [hidden, setHidden] = useState(true)

	const toggleShowPassword = e => {
		e.preventDefault()
		setHidden(!hidden)
	}

	return (
		<Field
			value={password}
			setValue={setPassword}
			label='password'
			autoComplete={isNewPassword ? 'new-password' : 'current-password'}
			extraClassName='password-field'
			type={hidden ? 'password' : 'text'}
			button={
				<button onClick={e => toggleShowPassword(e)} className='no-btn toggle-hide'>
					<img src={hidden ? hide : unhide} alt={hidden ? 'hide' : 'show'} />
				</button>
			}
		/>
	)
}

export default PasswordField
