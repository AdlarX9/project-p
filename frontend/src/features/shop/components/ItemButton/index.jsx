import './style.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const ItemButton = ({ item }) => {
	return (
		<MotionLink
			variants={variants}
			initial='hidden'
			animate='visible'
			whileHover={{ scale: 1.03 }}
			style={{ backgroundColor: '#' + item.content }}
			className='shop-item-button int-btn'
			to={`/shop/item?type=${item.type}&rarity=${item.rarity}&content=${item.content}`}
		>
			<p className='cartoon2-txt'>
				{item.type === 'color' && '#'}
				{item.content}
			</p>
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

export default ItemButton
