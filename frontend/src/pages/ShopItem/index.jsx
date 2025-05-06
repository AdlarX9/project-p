import { useSearchParams } from 'react-router-dom'
import './style.css'
import Back from '@components/Back'
import Background from '@components/Background'
import { ItemDescription } from '@features/shop'
import { Money } from '@features/bank'

const ShopItem = () => {
	const [searchParams] = useSearchParams()
	const type = searchParams.get('type')
	const rarity = searchParams.get('rarity')
	const content = searchParams.get('content')

	return (
		<section className='page-shop-item-wrapper'>
			<Background />
			<div className='back-wrapper'>
				<Back />
			</div>
			<div className='shop-money-wrapper'>
				<Money interactive={false} />
			</div>
			<ItemDescription type={type} rarity={rarity} content={content} />
		</section>
	)
}

export default ShopItem
