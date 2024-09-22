const SignUp = () => {
	return (
		<form className='auth-wrapper cartoon-txt'>
			<div className='field-wrapper'>
				<label className='label' htmlFor='username'>
					username
				</label>
				<input className='field shadowed' label='username' type='text' id='username' />
			</div>
			<div className='field-wrapper'>
				<label className='label' htmlFor='password'>
					password
				</label>
				<input className='field shadowed' label='password' type='text' id='password' />
			</div>
			<button className='auth-submit-btn int-btn skewed'>
				<span>Envoyer</span>
			</button>
		</form>
	)
}

export default SignUp
