import './style.css'
import { motion } from 'framer-motion'

const GameHeader = () => {
	return (
		<motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='title-txt'>
			Game
		</motion.h1>
	)
}

export default GameHeader
