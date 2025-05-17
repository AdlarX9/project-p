import { ShopWrapper } from '@features/shop'
import './style.css'
import Back from '@components/Back'
import Background from '@components/Background'
import { motion } from 'framer-motion'
import { Money } from '@features/bank'

const Shop = () => {
	return (
		<section className='shop-page-wrapper'>
			<Background theme='purple' img='items' />
			<div className='back-wrapper'>
				<Back />
			</div>
			<div className='shop-money-wrapper'>
				<Money interactive={false} />
			</div>
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='title-txt shop-title'
			>
				Shop
			</motion.p>
			<ShopWrapper />
		</section>
	)
}

export default Shop
