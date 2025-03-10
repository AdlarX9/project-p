import './style.css'
import { motion } from 'framer-motion'

const ItemPanel = ({ type, rarity, content }) => {
	return (
		<motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='item-panel'>
			<p>{content}</p>
		</motion.section>
	)
}

export default ItemPanel
