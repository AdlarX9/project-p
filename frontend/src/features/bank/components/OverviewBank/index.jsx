import './style.css'
import { useGetABank } from '@features/bank'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loader from '@components/Loader'
import PopUp from '@components/PopUp'
import { useState } from 'react'
import LoanForm from '../LoanForm'

const OverviewBank = () => {
	const { id } = useParams()
	const { bank } = useGetABank(id)
	const [open, setOpen] = useState(false)

	return (
		<>
			<main className='overview-bank-wrapper'>
				<motion.h1
					className='title-txt overview-bank-title'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
				>
					Overview Bank
				</motion.h1>
				{bank?.id ? (
					<>
						<motion.section
							className='overview-bank-card p-20 cartoon2-txt shadowed br-20 bg-blue'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className='overview-bank-card-txt'>
								<h2 className='cartoon-txt m-0'>Bank ID</h2>
								<p className='m-0'>{bank.id}</p>
							</div>
							<div className='overview-bank-card-txt'>
								<h2 className='cartoon-txt m-0'>Bank Name</h2>
								<p className='m-0'>{bank.name}</p>
							</div>
							<div className='overview-bank-card-txt'>
								<h2 className='cartoon-txt m-0'>Bank Description</h2>
								<p className='m-0'>{bank.description}</p>
							</div>
							<div className='overview-bank-card-txt'>
								<h2 className='cartoon-txt m-0'>Capital</h2>
								<p className='m-0'>{bank.money}</p>
							</div>
							<div className='overview-bank-card-txt'>
								<h2 className='cartoon-txt m-0 bo-owner-title'>Owner</h2>
								<Link
									className='m-20 no-link ui-txt bank-overview-owner flat-btn bg-green'
									to={`/profile/${bank.owner.id}`}
								>
									{bank.owner.username}
								</Link>
							</div>
						</motion.section>
						<motion.button
							className='p-20 bg-yellow int-btn br-20 ask-loan-btn'
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							whileHover={{ scale: 1.05 }}
							onClick={() => setOpen(true)}
						>
							Ask loan
						</motion.button>
					</>
				) : (
					<Loader />
				)}
			</main>
			<PopUp open={open} setOpen={setOpen} className='bg-bank-red'>
				<LoanForm />
			</PopUp>
		</>
	)
}

export default OverviewBank
