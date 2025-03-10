import './style.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ItemPanel from '../ItemPanel'

const ItemDescription = ({ type, rarity, content }) => {
	return (
		<main className='item-description-wrapper show-box'>
			<ItemPanel type={type} rarity={rarity} content={content} />
		</main>
	)
}

export default ItemDescription
