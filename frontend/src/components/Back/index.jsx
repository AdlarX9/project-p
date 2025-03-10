import './style.css'
import back from '../../assets/back.png'

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Back = ({ className }) => {
	const navigate = useNavigate()

	return (
		<motion.button
			variants={linkVariants}
			initial='hidden'
			animate='visible'
			whileHover='hover'
			className={'back-btn int-btn ' + className}
			onClick={() => navigate(-1)}
		>
			<img src={back} alt='back' draggable='false' />
		</motion.button>
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
