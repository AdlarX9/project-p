import './style.css'
import friends from '../../assets/friends.png'
import seeking from '../../assets/seeing.png'
import seeing from '../../assets/loupe.png'
import PopUp from '../PopUp/'
import { useState } from 'react'
import Search from './components/Search'
import See from './components/See'

const Friends = () => {
	const [open, setOpen] = useState(false)
	const [isSeeking, setIsSeeking] = useState(false)
	const openPopUp = () => {
		setOpen(true)
		setIsSeeking(false)
	}
	const [friend, setFriend] = useState({})

	return (
		<>
			<button
				className='int-btn friends-btn'
				onClick={openPopUp}
			>
				<img
					src={friends}
					alt='add-friends'
					draggable='false'
				/>
			</button>
			<PopUp
				open={open}
				setOpen={setOpen}
				className='popup-friends'
			>
				<div className='friends-popup-wrapper'>
					<header className='friends-popup-header'>
						<h2>Amis</h2>
						<button
							className='no-btn'
							onClick={() => setIsSeeking(!isSeeking)}
						>
							<img
								src={isSeeking ? seeking : seeing}
								alt={isSeeking ? 'btn-to-look' : 'btn-to-search'}
							/>
						</button>
					</header>

					{isSeeking ? (
						<Search />
					) : (
						<See
							friend={friend}
							setFriend={setFriend}
						/>
					)}
				</div>
			</PopUp>
		</>
	)
}

export default Friends
