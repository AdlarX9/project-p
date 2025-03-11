import './style.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const buttonWrapper = ({ children, item }) => {
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
			{children}
		</MotionLink>
	)
}

const classicWrapper = ({ children, item }) => {
	return (
		<motion.div
			variants={variants}
			initial='hidden'
			animate='visible'
			style={{ backgroundColor: '#' + item.content }}
			className='shop-item-button int-btn c-auto'
		>
			{children}
		</motion.div>
	)
}

const ItemButton = ({ item, nonInteractive }) => {
	let Wrapper
	if (nonInteractive) {
		Wrapper = classicWrapper
	} else {
		Wrapper = buttonWrapper
	}

	return (
		<Wrapper item={item}>
			<p className='cartoon2-txt'>
				{item.type === 'color' && '#'}
				{item.content}
			</p>
		</Wrapper>
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
