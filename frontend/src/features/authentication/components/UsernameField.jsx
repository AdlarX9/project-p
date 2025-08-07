import Field from './Field'

const UsernameField = ({ username, setUsername }) => {
	return (
		<Field
			value={username}
			setValue={setUsername}
			label='username'
			autoComplete='username'
			type='text'
		/>
	)
}

export default UsernameField
