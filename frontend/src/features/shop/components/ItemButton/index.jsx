import './style.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { rarityData } from '@features/shop'
import { useSelector } from 'react-redux'
import { getLocker } from '@redux/selectors'

const MotionLink = motion.create(Link)

const buttonWrapper = ({ children, item, to, bordered }) => {
	return (
		<MotionLink
			variants={variants}
			initial='hidden'
			animate='visible'
			whileHover={{ scale: 1.03 }}
			style={{
				backgroundColor: '#' + item.content,
				borderColor: bordered && rarityData[item.rarity].color
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

const classicWrapper = ({ children, item, bordered }) => {
	return (
		<motion.div
			variants={variants}
			initial='hidden'
			animate='visible'
			style={{
				backgroundColor: '#' + item.content,
				borderColor: bordered && rarityData[item.rarity].color
			}}
			className='int-btn shop-item-button c-inherit'
		>
			{children}
		</motion.div>
	)
}

const ItemButton = ({ item, nonInteractive, to, bordered }) => {
	const locker = useSelector(getLocker)

	let Wrapper
	if (nonInteractive) {
		Wrapper = classicWrapper
	} else {
		Wrapper = buttonWrapper
	}
	return (
		<Wrapper item={item} to={to} bordered={bordered}>
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
				className='cartoon-short-txt'
				style={{ display: locker.color !== item.content && 'none' }}
			>
				Equipped
			</p>
			<p
				className='cartoon2-txt'
				style={{
					backgroundColor: !nonInteractive && rarityData[item.rarity].color,
					direction: 'ltr',
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
