import './style.css'
import { motion } from 'framer-motion'
import ItemPanel from '../ItemPanel'
import { Avatar } from '@features/profile'

const switchColorContent = s => {
	const color = [
		parseInt(s.slice(0, 2), 16),
		parseInt(s.slice(2, 4), 16),
		parseInt(s.slice(4, 6), 16)
	]
	return color
}

const ItemDescription = ({ type, rarity, content }) => {
	return (
		<main className='item-description-wrapper'>
			<ItemPanel type={type} rarity={rarity} content={content} />
			<div className='item-avatar-wrapper'>
				<Avatar customColor={type === 'color' && switchColorContent(content)} />
			</div>
		</main>
	)
}

export default ItemDescription
