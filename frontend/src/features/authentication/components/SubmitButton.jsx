import { motion } from 'framer-motion'

const SubmitButton = () => {
	return (
		<motion.button
			className='auth-submit-btn int-btn skewed'
			initial={{ x: '-200%', opacity: 0, scale: 0.5 }}
			animate={{ x: 0, opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.05 }}
			style={{ skewX: '-10deg' }}
			type='submit'
		>
			<span>Submit</span>
		</motion.button>
	)
}

export default SubmitButton
