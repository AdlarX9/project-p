import { useSearchParams } from 'react-router-dom'
import './style.css'
import Back from '@components/Back'
import { ItemDescription } from '@features/shop'

const ShopItem = () => {
	const [searchParams] = useSearchParams()
	const type = searchParams.get('type')
	const rarity = searchParams.get('rarity')
	const content = searchParams.get('content')

	return (
		<section className='page-shop-item-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<ItemDescription type={type} rarity={rarity} content={content} />
		</section>
	)
}

export default ShopItem
