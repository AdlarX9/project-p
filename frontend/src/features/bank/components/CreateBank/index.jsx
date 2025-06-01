import './style.css'
import { useCreateBank } from '../../hooks'
import { confirm } from '@components/Confirmation'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateBank = () => {
	const { createBank } = useCreateBank()
	const navigate = useNavigate()
	const bankNameRef = useRef(null)
	const bankDescriptionRef = useRef(null)
	const errorRef = useRef(null)

	const handleSubmit = e => {
		e.preventDefault()
		const bankName = bankNameRef.current.value.trim()
		const bankDescription = bankDescriptionRef.current.value.trim()
		confirm({ message: 'create a new bank?' }).then(confirmed => {
			if (confirmed) {
				createBank(bankName, bankDescription).then(res => {
					if (res?.status === 'success') {
						navigate('/bank/banks')
					} else {
						errorRef.current.innerText = res || 'Failed to create bank'
					}
				})
			}
		})
	}

	return (
		<>
			<h1 className='title-txt create-bank-title'>Create bank</h1>
			<form onSubmit={handleSubmit} className='cartoon2-txt'>
				<label htmlFor='name' className='cartoon-txt'>
					Bank Name
				</label>
				<center>
					<input
						type='text'
						placeholder='Your brand new bank name'
						className='field cartoon-txt shadowed create-bank-field'
						ref={bankNameRef}
					/>
				</center>
				<label htmlFor='description' className='cartoon-txt'>
					Bank Description
				</label>
				<center>
					<input
						type='text'
						placeholder='Your bank description'
						className='field cartoon-txt shadowed create-bank-field'
						ref={bankDescriptionRef}
					/>
				</center>
				<center>
					<button
						type='submit'
						className='ui-txt flat-btn bg-blue m-20 p-20 shadowed-simple'
					>
						Create your Bank
					</button>
				</center>
				<center>
					<p ref={errorRef} className='ui-txt red m-0 dark-red bg-yellow max-80 br-20' />
				</center>
			</form>
		</>
	)
}

export default CreateBank
