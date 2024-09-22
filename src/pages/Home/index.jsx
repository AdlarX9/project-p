import './style.css'
import '../../index.css'

import settings from '../../assets/settings.png'
import money from '../../assets/money.png'

import Friends from '../../components/Friends/'
import Profile from './components/Profile'
import Background from './components/Background'
import Play from './components/Play'
import { Link } from 'react-router-dom'

const Home = () => {
	return (
		<section className='home-wrapper'>
			<header className='home-header'>
				<Profile />
				<div className='money-friends'>
					<button className='money'>
						<img src={money} alt='money'  draggable='false' />
						<span className='cartoon-txt'>1000</span>
					</button>
					<Friends />
				</div>
			</header>
			<footer className='home-footer'>
				<button className='int-btn home-settings'>
					<Link to='/settings'>
						<img src={settings} alt='settings' draggable='false' />
					</Link>
				</button>
				<Play />
			</footer>
			<Background />
		</section>
	)
}

export default Home
