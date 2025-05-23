import { useSelector } from 'react-redux'
import './style.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '@components/Loader'
import { motion, AnimatePresence } from 'framer-motion'
import { useFindBank, useLoadBankData } from '../../hooks'
import YourBankInfo from '../YourBankInfo'

const ManagePanel = () => {
	const currentBank = useFindBank()

	return (
		<main className='bank-panel'>
			<AnimatePresence>
				<motion.h1
					className='title-txt m-20'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					exit={{ scale: 0 }}
					layout
					key='1'
				>
					Management Panel
				</motion.h1>
				{currentBank ? (
					<>
						<motion.section
							variants={sectionVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
							key='2'
							className='p-20 br-20 shadowed cartoon2-txt bg-blue'
						>
							<h2 className='m-0 cartoon-txt'>Bank Info</h2>
							<YourBankInfo currentBank={currentBank} />
						</motion.section>
						<motion.section
							style={{ zIndex: 0 }}
							variants={sectionVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
							key='3'
							className='p-20 br-20 shadowed cartoon2-txt bg-green'
						>
							<h2 className='m-0 cartoon-txt'>Loans</h2>
							{currentBank.loans?.length > 0 ? (
								<>
									<p className='m-0'>
										you have {currentBank.loans.length} current loans in charge
									</p>
									<Link
										to={`/focus-bank/${currentBank.id}/loans`}
										className='link blue cartoon-short-txt'
									>
										View Loans
									</Link>
								</>
							) : (
								'No loans...'
							)}
						</motion.section>
						<motion.section
							style={{ zIndex: 0 }}
							variants={sectionVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
							key='4'
							className='bank-panel-loan-requests p-20 br-20 shadowed cartoon2-txt bg-yellow'
						>
							<h2 className='m-0 cartoon-txt'>Loan Requests</h2>
							{currentBank.loan_requests?.length > 0 ? (
								<>
									<p className='dark-red m-0'>
										{currentBank.loan_requests.length} loan requests are waiting
										for you!
									</p>
									<Link
										to={`/focus-bank/${currentBank.id}/loan-requests`}
										className='link blue cartoon-short-txt'
									>
										View Loan Requests
									</Link>
									<div className='bank-panel-count white shadowed-simple'>
										{currentBank.loan_requests.length}
									</div>
								</>
							) : (
								'No loan requests...'
							)}
						</motion.section>
					</>
				) : (
					<Loader />
				)}
			</AnimatePresence>
		</main>
	)
}

const sectionVariants = {
	hidden: {
		opacity: 0,
		y: -20
	},
	visible: {
		opacity: 1,
		y: 0
	}
}

export default ManagePanel
