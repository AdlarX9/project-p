import { useGetPercentage } from '@features/bank'
import { NavBar } from '@features/bank'
import Back from '../../components/Back'
import './style.css'
import Background from '../../components/Background'
import { useLocation } from 'react-router-dom'
import { BankGeneral, Loans, BanksManagement, BankSearch } from '@features/bank'
import { motion, AnimatePresence } from 'framer-motion'

const Wrapper = ({ children, layoutId }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			layoutId={layoutId}
		>
			{children}
		</motion.div>
	)
}

const Bank = () => {
	const location = useLocation()
	const pathname = location.pathname
	const currentTab = pathname.split('/')[2]

	return (
		<section className='bank-wrapper'>
			<Background theme='red' img='dollarSign' />
			<div className='back-wrapper'>
				<Back to='/' />
			</div>
			<NavBar />
			<AnimatePresence>
				{currentTab === 'general' && (
					<Wrapper layoutId='1'>
						<BankGeneral />
					</Wrapper>
				)}
				{currentTab === 'loans' && (
					<Wrapper layoutId='2'>
						<Loans />
					</Wrapper>
				)}
				{currentTab === 'banks' && (
					<Wrapper layoutId='3'>
						<BanksManagement />
					</Wrapper>
				)}
				{currentTab === 'search' && (
					<Wrapper layoutId='4'>
						<BankSearch />
					</Wrapper>
				)}
			</AnimatePresence>
		</section>
	)
}

export default Bank
