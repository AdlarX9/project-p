import { useSelector } from 'react-redux'
import './style.css'
import { getUser } from '@redux/selectors'
import money from '@assets/money.png'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const Money = ({ interactive = true }) => {
	const user = useSelector(getUser)

	let Wrapper
	if (interactive) {
		Wrapper = MotionLink
	} else {
		Wrapper = motion.div
	}

	return (
		<>
			<Wrapper
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: interactive ? 1.05 : 1 }}
				className={`no-link money ${interactive ? 'c-pointer' : 'c-auto'}`}
				to='transfers'
			>
				<img src={money} alt='money' draggable='false' />
				<span className='cartoon-txt'>{user.money}</span>
			</Wrapper>
		</>
	)
}

export default Money
