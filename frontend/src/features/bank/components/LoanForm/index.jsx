import { useRef } from 'react'
import { confirm } from '@components/Confirmation'
import './style.css'
import { useRequestLoan } from '../../hooks'
import { useParams } from 'react-router-dom'

const LoanForm = () => {
	const amountRef = useRef()
	const durationRef = useRef()
	const interestRateRef = useRef()
	const messageRef = useRef()
	const errorRef = useRef()
	const { requestLoan } = useRequestLoan()
	const { id } = useParams()

	const handleSubmit = e => {
		e.preventDefault()
		confirm({
			message: 'submit the current loan request?'
		})
			.then(confirmed => {
				if (confirmed) {
					const amount = amountRef.current.value
					const duration = durationRef.current.value
					const interestRate = interestRateRef.current.value
					const message = messageRef.current.value
					requestLoan(id, amount, duration, interestRate, message).then(res => {
						if (res?.status === 'success') {
							amountRef.current.value = 0
							durationRef.current.value = 0
							interestRateRef.current.value = 0
							messageRef.current.value = ''
						} else {
							errorRef.current.innerText = res
						}
					})
				}
			})
			.catch(error => {
				throw new Error(error.message)
			})
	}

	return (
		<form className='loan-form scrollable' onSubmit={handleSubmit}>
			<center>
				<h1 className='title-txt m-20'>Loan Form</h1>
			</center>
			<>
				<div>
					<label htmlFor='number'>Amount</label>
					<input
						className='field shadowed-simple'
						type='number'
						placeholder='Loan Amount'
						min={0}
						defaultValue={0}
						ref={amountRef}
					/>
				</div>
				<div>
					<label htmlFor='text'>Duration (weeks)</label>
					<input
						className='field shadowed-simple'
						type='number'
						placeholder='Loan Duration'
						min={0}
						defaultValue={0}
						ref={durationRef}
					/>
				</div>
				<div>
					<label htmlFor='number'>Max Interest Rate (%)</label>
					<input
						className='field shadowed-simple'
						type='number'
						placeholder='Interest Rate'
						min={0}
						defaultValue={0}
						ref={interestRateRef}
					/>
				</div>
				<div>
					<label htmlFor='number'>Message</label>
					<textarea
						className='field shadowed-simple'
						placeholder='Why?'
						ref={messageRef}
					/>
				</div>
			</>
			<center>
				<button type='submit' className='p-20 bg-blue cartoon2-txt flat-btn'>
					Request Loan
				</button>
			</center>
			<center className='ui-txt dark-red' ref={errorRef}></center>
		</form>
	)
}

export default LoanForm
