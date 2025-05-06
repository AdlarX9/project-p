import './style.css'
import pattern from '@assets/background-pattern.png'
import { motion } from 'framer-motion'

const Background = () => {
	return (
		<div className='background-supervisor'>
			<motion.div
				className='background-wrapper'
				variants={backgroundVariants}
				initial='hidden'
				animate='visible'
			>
				<div
					className='background-stars'
					style={{ backgroundImage: `url(${pattern})` }}
				></div>
				<div className='background-gradient'></div>
			</motion.div>
		</div>
	)
}

const backgroundVariants = {
	hidden: {
		opacity: 0
	},
	visible: {
		opacity: 1
	}
}

export default Background
