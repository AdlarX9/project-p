import './style.css'
import ItemPanel from '../ItemPanel'
import { Avatar, switchColorContent } from '@features/profile'

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
