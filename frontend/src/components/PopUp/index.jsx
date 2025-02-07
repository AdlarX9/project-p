import './style.css'
import cancel from '../../assets/cancel.png'
import { motion } from 'framer-motion'

const PopUp = ({ children, open, setOpen, className }) => {
	return (
		<motion.section
			variants={backgroundVariants}
			initial='initial'
			animate={!open ? 'initial' : 'displayed'}
			className='popup-background'
		>
			<motion.div
				initial='initial'
				animate={!open ? 'initial' : 'displayed'}
				className={['cartoon-txt shadowed popup', className].join(' ')}
				variants={className === 'popup-friends' ? positionVariants : scaleVariants}
			>
				{children}
				<button className='shadowed-simple popup-cancel' onClick={() => setOpen(false)}>
					<img src={cancel} alt='close' draggable='false' />
				</button>
			</motion.div>
		</motion.section>
	)
}

const backgroundVariants = {
	initial: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		pointerEvents: 'none'
	},
	displayed: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		pointerEvents: 'auto'
	}
}

const scaleVariants = {
	initial: {
		scale: 0
	},
	displayed: {
		scale: 1
	}
}

const positionVariants = {
	initial: {
		x: '110%'
	},
	displayed: {
		x: 0
	}
}

export default PopUp
