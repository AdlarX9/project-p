import './style.css'
import stars from '@assets/background-pattern.png'
import grayStars from '@assets/background-gray-pattern.png'
import dollarSign from '@assets/background-bank-pattern.png'
import items from '@assets/background-shop-pattern.png'
import { motion } from 'framer-motion'

const Background = ({ theme = 'blue', img = 'stars' }) => {
	const imgs = {
		stars: stars,
		dollarSign: dollarSign,
		grayStars: grayStars,
		items: items
	}
	return (
		<div className='background-supervisor'>
			<motion.div
				className={`background-wrapper theme-${theme}`}
				variants={backgroundVariants}
				initial='hidden'
				animate='visible'
			>
				<div
					className='background-stars'
					style={{ backgroundImage: `url(${imgs[img]})` }}
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
