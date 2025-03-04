import './style.css'
import back from '../../assets/back.png'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionLink = motion.create(Link)

const Back = ({ className }) => {
	return (
		<MotionLink
			variants={linkVariants}
			initial='hidden'
			animate='visible'
			whileHover='hover'
			className={'back-btn int-btn ' + className}
			to='/'
		>
			<img src={back} alt='back' draggable='false' />
		</MotionLink>
	)
}

const linkVariants = {
	hidden: {
		x: '100%',
		opacity: 0,
		scaleY: 0
	},
	visible: {
		x: 0,
		opacity: 1,
		scaleY: 1
	},
	hover: {
		scale: 1.05
	}
}

export default Back
