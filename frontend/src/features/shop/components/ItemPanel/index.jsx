import './style.css'
import { motion } from 'framer-motion'
import ItemButton from '../ItemButton'

const ItemPanel = ({ type, rarity, content }) => {
	const rarityData = {
		1: {
			color: 'var(--gray)',
			price: '400'
		},
		2: {
			color: 'green',
			price: '800'
		},
		3: {
			color: 'var(--purple)',
			price: '1500'
		},
		4: {
			color: 'var(--yellow)',
			price: '2000'
		}
	}

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='item-panel-wrapper shadowed br-20 p-20'
			style={{ backgroundColor: rarityData[rarity].color }}
		>
			<h2 style={{ color: rarity == 4 && 'black' }} className='cartoon-txt white'>
				#{content}
			</h2>
			<ItemButton nonInteractive item={{ type, rarity, content }} />
			<p className='cartoon2-txt'>Price : {rarityData[rarity].price}</p>
		</motion.section>
	)
}

export default ItemPanel
