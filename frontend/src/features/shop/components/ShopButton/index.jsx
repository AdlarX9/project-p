import './style.css'
import { motion } from 'framer-motion'
import Caddie from '@assets/caddie.png'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const ShopButton = () => {
	return (
		<MotionLink
			variants={variants}
			initial='hidden'
			animate='visible'
			whileHover={{ scale: 1.05 }}
			className='int-btn bg-active-green shop-button'
			to='/shop'
		>
			<img src={Caddie} alt='caddie' draggable='false' />
		</MotionLink>
	)
}

const variants = {
	hidden: {
		opacity: 0
	},
	visible: {
		opacity: 1
	}
}

export default ShopButton
