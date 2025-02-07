import './style.css'
import { motion } from 'framer-motion'

const Loader = ({ exit }) => {
	return (
		<motion.div
			initial={{ scale: 0, rotate: 60 }}
			animate={{ scale: 1, rotate: 0 }}
			exit={exit}
		>
			<div className='loader'></div>
		</motion.div>
	)
}

export default Loader
