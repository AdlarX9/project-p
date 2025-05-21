import { useSelector } from 'react-redux'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getBank } from '@redux/selectors'
import { useEffect, useState } from 'react'
import { useLoadBankData } from '../../hooks'
import Loader from '@components/Loader'
import { motion, AnimatePresence } from 'framer-motion'

const ManagePanel = () => {
	useLoadBankData()
	const { id } = useParams()
	const bankState = useSelector(getBank)
	const [currentBank, setCurrentBank] = useState()
	const navigate = useNavigate()

	useEffect(() => {
		if (bankState?.banks) {
			const currentBank = bankState.banks.find(bank => bank.id == id)
			console.log(currentBank)

			if (currentBank) {
				setCurrentBank(currentBank)
			} else {
				navigate('/bank/banks')
			}
		}
	}, [bankState])

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
							className='see-your-bank-panel p-20 br-20 shadowed cartoon2-txt bg-blue'
						>
							<ul>
								<li>Id: {currentBank.id}</li>
								<li>Name: {currentBank.name}</li>
								<li>Money: {currentBank.money}</li>
								<li>Description: {currentBank.description}</li>
							</ul>
						</motion.section>
						<motion.section
							variants={sectionVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
							key='3'
							className='bank-panel-loans p-20 br-20 shadowed cartoon2-txt bg-green'
						>
							Loans
						</motion.section>
						<motion.section
							variants={sectionVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
							key='4'
							className='bank-panel-loan-requests p-20 br-20 shadowed cartoon2-txt bg-yellow'
						>
							Loan Requests
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
		opacity: 0
	},
	visible: {
		opacity: 1
	}
}

export default ManagePanel
