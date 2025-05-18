import './style.css'
import Bank from '@assets/bank.png'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getBank } from '@redux/selectors'
import Loader from '@components/Loader'

const MotionLink = motion.create(Link)

const BanksManagement = () => {
	const bankState = useSelector(getBank)

	return (
		<>
			<main className='banks-management-wrapper scrollable'>
				<h1 className='banks-management-header m-0 p-20'>
					<div className='title-txt'>Your Banks</div>
					<MotionLink
						className='no-link cartoon-txt p-20 int-btn br-20 m-0 bg-green btn-create-bank'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.05 }}
						to='/create-bank'
					>
						+
					</MotionLink>
				</h1>
				{!bankState?.banks && (
					<div className='banks-management-loader'>
						<Loader />
					</div>
				)}
				{bankState?.banks &&
					bankState.banks.map((bank, index) => {
						return (
							<MotionLink
								initial={{ scale: 0.8 }}
								animate={{ scale: 1, filter: 'brightness(1)' }}
								whileHover={{ filter: 'brightness(0.9)' }}
								key={index}
								className='no-link cartoon-txt p-20 shadowed br-20 m-0 bg-blue btn-your-bank c-pointer'
								to={`/focus-bank/${bank.id}/manage`}
							>
								<img src={Bank} alt='bank' draggable={false} />
								<span>
									<p className='m-0'>{bank.name}</p>
									<p className='cartoon2-txt m-0'>money: {bank.money}</p>
								</span>
							</MotionLink>
						)
					})}
				{bankState?.banks?.length === 0 && (
					<p className='cartoon2-txt'>Sorry, you have no banks yet...</p>
				)}
			</main>
		</>
	)
}

export default BanksManagement
