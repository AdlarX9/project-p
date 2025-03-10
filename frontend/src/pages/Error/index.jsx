import './style.css'
import Back from '@components/Back'
import { motion } from 'framer-motion'

const Error = () => {
	return (
		<section className='error-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<motion.p
				initial={{ scale: 2, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className='error-image cartoon-txt'
			>
				Error 404
			</motion.p>
		</section>
	)
}

export default Error
