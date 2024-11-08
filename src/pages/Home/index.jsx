import './style.css'
import settings from '../../assets/settings.png'

import Friends from '../../components/Friends/'
import Profile from './components/Profile'
import Background from './components/Background'
import Play from './components/Play'
import { Link } from 'react-router-dom'
import Money from '../../components/Money'

const Home = () => {
	return (
		<section className='home-wrapper'>
			<header className='home-header'>
				<Profile />
				<div className='money-friends'>
					<Money />
					<Friends />
				</div>
			</header>
			<Background />
			<footer className='home-footer'>
				<button className='int-btn home-settings'>
					<Link to='/settings'>
						<img src={settings} alt='settings' draggable='false' />
					</Link>
				</button>
				<Play />
			</footer>
		</section>
	)
}

export default Home
