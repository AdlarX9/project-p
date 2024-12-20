import { UsePlay } from './hooks'
import './style.css'
import { motion } from 'framer-motion'

const Play = () => {
	const { play } = UsePlay()
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			whileHover={{ scale: 1.05 }}
		>
			<button className='int-btn skewed play-btn' onClick={() => play()}>
				<span>play</span>
			</button>
		</motion.div>
	)
}

export default Play
