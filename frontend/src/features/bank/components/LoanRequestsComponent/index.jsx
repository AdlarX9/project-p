import './style.css'
import PopUp from '@components/PopUp'
import Loader from '@components/Loader'
import { confirm } from '@components/Confirmation'
import { useApproveLoanRequest, useFindBank } from '../../hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'

const LoanRequestsComponent = () => {
	const currentBank = useFindBank()
	const { approveLoanRequest } = useApproveLoanRequest()
	const [open, setOpen] = useState(false)
	const [currentRequest, setCurrentRequest] = useState(null)
	const errorRef = useRef(null)
	const interestRef = useRef(null)

	const handleClick = request => {
		setCurrentRequest(request)
		setOpen(true)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		if (!currentRequest) return
		const interestRate = interestRef.current.value
		confirm({ message: 'Do you really want to approve this loan request?' }).then(confirmed => {
			if (confirmed) {
				approveLoanRequest(currentRequest.id, interestRate)
					.then(res => {
						if (res?.status === 'success') {
							setOpen(false)
							setCurrentRequest(null)
						} else {
							errorRef.current.textContent =
								res.message || 'An error occurred while approving the loan request.'
						}
					})
					.catch(err => {
						throw new Error(
							err.message || 'An error occurred while approving the loan request.'
						)
					})
			}
		})
	}

	return (
		<>
			<main className='loan-requests-component max-80'>
				<center>
					<motion.h1
						className='title-txt m-20'
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
					>
						Loan Requests
					</motion.h1>
				</center>
				{currentBank?.loan_requests?.length > 0 ? (
					<ul className='loan-requests-list scrollable max-100'>
						<AnimatePresence>
							{currentBank.loan_requests.map((request, index) => (
								<motion.li
									key={index}
									className='loan-request-item cartoon2-txt p-20 br-20 shadowed bg-blue m-20 c-pointer max-100'
									initial={{ opacity: 0, y: -20, scale: 1 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: -20, scale: 1 }}
									whileHover={{ scale: 1.02 }}
									onClick={() => handleClick(request)}
									layout
								>
									<p className='m-0'>
										<span className='cartoon-short-txt'>Applicant:</span>{' '}
										{request.applicant.name}
									</p>
									<p className='m-0'>
										<span className='cartoon-short-txt'>Amount:</span> $
										{request.amount}
									</p>
									<div className='m-0 max-100'>
										<span className='cartoon-short-txt'>Message:</span>{' '}
										<p className='loan-request-core m-0 max-100'>
											{request.request}
										</p>
									</div>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>
				) : currentBank?.loan_requests?.length === 0 ? (
					<p className='no-loan-requests cartoon-txt'>No loan requests available...</p>
				) : (
					<Loader />
				)}
			</main>
			<PopUp open={open} setOpen={setOpen} className='bg-yellow max-80 cartoon2-txt'>
				{currentRequest && (
					<>
						<h2 className='m-20 title-txt'>Request Details</h2>
						<section className='popup-loan-request scrollable p-20 bg-red br-20 shadowed'>
							<p className='m-0'>
								<span className='cartoon-short-txt'>Applicant:</span>{' '}
								{currentRequest.applicant.name}
							</p>
							<p className='m-0'>
								<span className='cartoon-short-txt'>Amount:</span> $
								{currentRequest.amount}
							</p>
							<p className='m-0'>
								<span className='cartoon-short-txt'>Duration:</span>{' '}
								{currentRequest.duration}{' '}
								{currentRequest.duration > 1 ? 'weeks' : 'week'}
							</p>
							<p className='m-0'>
								<span className='cartoon-short-txt'>Interest Rate:</span>{' '}
								{currentRequest.interest_rate}%
							</p>
							<div className='m-0 max-100'>
								<span className='cartoon-short-txt m-0'>Request:</span>
								<p className='m-0 loan-request-details-core'>
									{currentRequest.request}
								</p>
							</div>
						</section>
						<form onSubmit={handleSubmit}>
							<center>
								<h2 className='cartoon-txt m-20'>Approve Loan Request</h2>
							</center>
							<center>
								<input
									type='number'
									className='field shadowed m-20 max-80'
									defaultValue={currentRequest.interest_rate}
									max={currentRequest.interest_rate}
									ref={interestRef}
								/>
							</center>
							<center>
								<button className='flat-btn bg-blue shadowed-simple cartoon2-txt p-20'>
									Submit
								</button>
							</center>
							<center>
								<p className='ui-txt red' ref={errorRef} />
							</center>
						</form>
					</>
				)}
			</PopUp>
		</>
	)
}

export default LoanRequestsComponent
