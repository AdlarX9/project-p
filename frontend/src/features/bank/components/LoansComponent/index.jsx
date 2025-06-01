import { useEffect, useState } from 'react'
import { useFindBank } from '../../hooks'
import './style.css'
import Loader from '@components/Loader'
import PopUp from '@components/PopUp'
import { motion, AnimatePresence } from 'framer-motion'

const LoansComponent = () => {
	const currentBank = useFindBank()
	const [open, setOpen] = useState(false)
	const [currentLoan, setCurrentLoan] = useState(null)

	return (
		<>
			<main className='scrollable loans-component-wrapper'>
				<AnimatePresence>
					<motion.h1
						className='title-txt m-20'
						key='h1'
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						layout
					>
						Loans
					</motion.h1>
					{currentBank?.loans ? (
						currentBank.loans.length > 0 ? (
							currentBank.loans.map((loan, index) => (
								<motion.button
									key={index}
									className='p-20 cartoon2-txt br-20 shadowed bg-blue m-20 c-pointer no-button loan-component'
									onClick={() => {
										setCurrentLoan(loan)
										setOpen(true)
									}}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									whileHover={{ scale: 1.03 }}
									layout
								>
									<p className='m-0'>
										<strong>Borrower:</strong> {loan.poor.name}
									</p>
									<p className='m-0'>
										<strong>Amount:</strong> {loan.amount}
									</p>
									<p className='m-0'>
										<strong>Repaid:</strong> {loan.repaid}
									</p>
								</motion.button>
							))
						) : (
							<p className='m-0 cartoon-txt'>No loans found...</p>
						)
					) : (
						<Loader />
					)}
				</AnimatePresence>
			</main>
			<PopUp open={open} setOpen={setOpen} className='bg-gray max-80'>
				<div className='m-0'>
					<p className='m-0 cartoon2-txt var-blue'>
						<strong>Borrower:</strong> {currentLoan?.poor.name}
					</p>
					<p className='m-0 cartoon2-txt var-yellow'>
						<strong>Interest Rate:</strong> {currentLoan?.interest_rate}%
					</p>
					<p className='m-0 cartoon2-txt var-green'>
						<strong>Amount:</strong> {currentLoan?.amount}
					</p>
					<p className='m-0 cartoon2-txt var-red'>
						<strong>Repaid:</strong> {currentLoan?.repaid} (
						{Math.round((currentLoan?.repaid / currentLoan?.amount) * 100)}%)
					</p>
				</div>
				<center>
					<progress
						value={currentLoan?.repaid}
						max={currentLoan?.amount}
						className='progress-bar'
					/>
				</center>
			</PopUp>
		</>
	)
}

export default LoansComponent
