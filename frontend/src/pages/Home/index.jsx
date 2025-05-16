import './style.css'
import settings from '../../assets/settings.png'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import Background from '@components/Background'
import { Friends } from '@features/friends'
import { Money, BankButton } from '@features/bank'
import { Play } from '@features/matchmaking'
import { Avatar, ProfileButton } from '@features/profile'
import { ShopButton } from '@features/shop'

const Home = () => {
	return (
		<section className='home-wrapper'>
			<Background />
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
				<div className='bank-settings-wrapper'>
					<BankButton />
					<motion.button
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						whileHover={{ scale: 1.05 }}
						className='int-btn home-settings'
					>
						<Link to='/settings' className='no-link'>
							<img src={settings} alt='settings' draggable='false' />
						</Link>
					</motion.button>
				</div>
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
