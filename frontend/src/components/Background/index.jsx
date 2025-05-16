import './style.css'
import stars from '@assets/background-pattern.png'
import dollarSign from '@assets/background-bank-pattern.png'
import { motion } from 'framer-motion'

const Background = ({ bank = false }) => {
	return (
		<div className='background-supervisor'>
			<motion.div
				className={`background-wrapper theme-${bank ? 'bank' : 'blue'}`}
				variants={backgroundVariants}
				initial='hidden'
				animate='visible'
			>
				<div
					className='background-stars'
					style={{ backgroundImage: `url(${bank ? dollarSign : stars})` }}
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
