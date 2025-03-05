import './style.css'
import settings from '../../assets/settings.png'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import { Friends } from '@features/friends/'
import { Money } from '@features/bank'
import { Play } from '@features/matchmaking'
import { ProfileButton } from '@features/user'
// import Background from './components/Background'

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
			{/* <Background /> */}
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
				<Play />
			</footer>
		</section>
	)
}

export default Home
