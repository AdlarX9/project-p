import './style.css'
import settings from '../../assets/settings.png'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Friends } from '@features/friends/'
import { Money } from '@features/bank'
import { Play } from '@features/matchmaking'
import { ProfileButton } from '@features/authentication'
import { Avatar } from '@features/profile'
import { ShopButton } from '@features/shop'

const Home = () => {
	return (
		<section className='home-wrapper'>
			<header className='home-header'>
				<ProfileButton />
				<div className='money-friends'>
					<Money />
					<Friends />
				</div>
			</header>
			<section className='avatar-wrapper'>
				<Avatar />
			</section>
			<footer className='home-footer'>
				<motion.button
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					whileHover={{ scale: 1.05 }}
					className='int-btn home-settings'
				>
					<Link to='/settings'>
						<img src={settings} alt='settings' draggable='false' />
					</Link>
				</motion.button>
				<div className='shop-play-buttons'>
					<div className='home-shop-button-wrapper'>
						<ShopButton />
					</div>
					<Play />
				</div>
			</footer>
		</section>
	)
}

export default Home
