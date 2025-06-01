import './style.css'
import BankImage from '@assets/bank.png'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)

const BankButton = () => {
	return (
		<MotionLink
			className='bank-button int-btn p-20 bg-red'
			to='/bank/banks'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			whileHover={{ scale: 1.05 }}
		>
			<img src={BankImage} alt='bank_building' draggable={false} />
		</MotionLink>
	)
}

export default BankButton
