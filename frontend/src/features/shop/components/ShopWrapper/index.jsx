import './style.css'
import { useGetShop } from '../../hooks'
import Loader from '@components/Loader'
import ItemButton from '../ItemButton'

const ShopWrapper = () => {
	const { data, isPending } = useGetShop()

	return (
		<>
			{isPending ? (
				<Loader />
			) : (
				<main className='shop-wrapper'>
					{data?.length && data.map((item, idx) => <ItemButton key={idx} item={item} />)}
				</main>
			)}
		</>
	)
}

export default ShopWrapper
