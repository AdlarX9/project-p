import './style.css'
import back from '../../assets/back.png'

import { useNavigate } from 'react-router-dom'
import { motion, scale } from 'framer-motion'

const Back = ({ className, to = null }) => {
	const navigate = useNavigate()
	const destination = to === null ? -1 : to

	return (
		<motion.button
			variants={linkVariants}
			initial='hidden'
			animate='visible'
			whileHover='hover'
			className={'back-btn int-btn ' + className}
			onClick={() => navigate(destination)}
		>
			<img src={back} alt='back' draggable='false' />
		</motion.button>
	)
}

const linkVariants = {
	hidden: {
		x: '100%',
		opacity: 0,
		scaleY: 0,
		scaleX: 1.5
	},
	visible: {
		x: 0,
		opacity: 1,
		scaleY: 1,
		scaleX: 1
	},
	hover: {
		scaleY: 1.05,
		scaleX: 1.05
	}
}

export default Back
