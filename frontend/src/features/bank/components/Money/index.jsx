import { useSelector } from 'react-redux'
import './style.css'
import { getUser } from '@redux/selectors'
import money from '@assets/money.png'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const Money = () => {
	const user = useSelector(getUser)

	return (
		<>
			<MotionLink
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				className='money c-pointer'
				to='bankaccount'
			>
				<img src={money} alt='money' draggable='false' />
				<span className='cartoon-txt'>{user.money}</span>
			</MotionLink>
		</>
	)
}

export default Money
