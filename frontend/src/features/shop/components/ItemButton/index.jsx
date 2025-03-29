import './style.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { rarityData } from '@features/shop'
import { useSelector } from 'react-redux'
import { getLocker } from '@redux/selectors'

const MotionLink = motion.create(Link)

const buttonWrapper = ({ children, item, to }) => {
	return (
		<MotionLink
			variants={variants}
			initial='hidden'
			animate='visible'
			whileHover={{ scale: 1.03 }}
			style={{
				backgroundColor: '#' + item.content
			}}
			className='shop-item-button int-btn no-link'
			to={
				to
					? to
					: `/shop/item?type=${item.type}&rarity=${item.rarity}&content=${item.content}`
			}
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
			className='int-btn shop-item-button c-auto'
		>
			{children}
		</motion.div>
	)
}

const ItemButton = ({ item, nonInteractive, to }) => {
	const locker = useSelector(getLocker)

	let Wrapper
	if (nonInteractive) {
		Wrapper = classicWrapper
	} else {
		Wrapper = buttonWrapper
	}
	return (
		<Wrapper item={item} to={to}>
			<span
				className='cartoon2-txt'
				style={{
					backgroundColor:
						!locker?.colors?.some(color => color.content === item.content) &&
						'transparent'
				}}
			>
				{locker?.colors?.some(color => color.content === item.content) ? 'bought' : ''}
			</span>
			<p
				className='cartoon2-txt'
				style={{
					backgroundColor: !nonInteractive && rarityData[item.rarity].color,
					color: item.rarity == 4 && !nonInteractive && 'black'
				}}
			>
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
