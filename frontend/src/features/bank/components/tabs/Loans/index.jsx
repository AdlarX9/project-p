import { useSelector } from 'react-redux'
import './style.css'
import { getBank } from '@redux/selectors'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Loans = () => {
	const bankState = useSelector(getBank)

	return (
		<section className='loans-wrapper'>
			<AnimatePresence>
				<motion.h1 className='loans-content title-txt m-0' layout>
					Your Loans
				</motion.h1>
				{bankState.loans.map((loan, idx) => (
					<motion.div
						key={loan.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						layoutId={loan.id}
						className='p-20 br-20 cartoon2-txt shadowed m-20 bg-green'
					>
						<p className='m-0'>
							<strong className='cartoon-short-txt'>Owned to:</strong>{' '}
							{loan.bank.name}
						</p>
						<p className='m-0'>
							<strong className='cartoon-short-txt'>Amount:</strong> ${loan.amount}
						</p>
						<p className='m-0'>
							<strong className='cartoon-short-txt'>Interest Rate:</strong>{' '}
							{loan.interest_rate}%
						</p>
						<p className='m-0'>
							<strong className='cartoon-short-txt'>Repaid:</strong> ${loan.repaid}
						</p>
					</motion.div>
				))}
			</AnimatePresence>
		</section>
	)
}

export default Loans
