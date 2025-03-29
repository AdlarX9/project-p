import './style.css'
import { motion } from 'framer-motion'
import ItemButton from '../ItemButton'
import { rarityData } from '@features/shop'
import { useBuyItem } from '../../hooks'
import { useSelector } from 'react-redux'
import { getLocker } from '@redux/selectors'

const ItemPanel = ({ type, rarity, content }) => {
	const { buyItem } = useBuyItem()
	const locker = useSelector(getLocker)

	return (
		<motion.section
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='item-panel-wrapper shadowed br-20'
			style={{ backgroundColor: rarityData[rarity].color }}
		>
			<h2 style={{ color: rarity == 4 && 'black' }} className='cartoon-txt white'>
				#{content}
			</h2>
			<ItemButton nonInteractive item={{ type, rarity, content }} />
			<p className='cartoon2-txt white' style={{ color: rarity == 4 && 'black' }}>
				Price :{' '}
				<span
					className='cartoon-short-txt'
					style={{ color: rarity != 4 && 'var(--yellow)' }}
				>
					{rarityData[rarity].price}
				</span>
			</p>
			<motion.div whileHover={{ scale: 1.05 }}>
				{!locker?.colors?.some(color => color.content === content) && (
					<button
						className='no-link int-btn bg-blue skewed p-20'
						style={{ width: '100%' }}
						onClick={() => buyItem({ rarity, type, content })}
					>
						<span>Buy</span>
					</button>
				)}
			</motion.div>
		</motion.section>
	)
}

export default ItemPanel
