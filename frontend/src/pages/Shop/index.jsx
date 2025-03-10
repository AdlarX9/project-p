import { ShopWrapper } from '@features/shop'
import './style.css'
import Back from '@components/Back'
import { motion } from 'framer-motion'

const Shop = () => {
	return (
		<section className='shop-page-wrapper'>
			<div className='back-wrapper'>
				<Back />
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
