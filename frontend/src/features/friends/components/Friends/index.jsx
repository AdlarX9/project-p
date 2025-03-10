import './style.css'
import friends from '@assets/friends.png'
import seeking from '@assets/seeing.png'
import seeing from '@assets/loupe.png'
import PopUp from '@components/PopUp'
import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchFriends from '../SearchFriends'
import SeeFriends from '../SeeFriends'

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
			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				className='int-btn friends-btn'
				onClick={openPopUp}
			>
				<img src={friends} alt='add-friends' draggable='false' />
			</motion.button>
			<PopUp open={open} setOpen={setOpen} className='popup-friends'>
				<div className='friends-popup-wrapper'>
					<header className='friends-popup-header'>
						<h2>Amis</h2>
						<button className='no-btn' onClick={() => setIsSeeking(!isSeeking)}>
							<img
								src={isSeeking ? seeking : seeing}
								alt={isSeeking ? 'btn-to-look' : 'btn-to-search'}
								draggable='false'
							/>
						</button>
					</header>

					{isSeeking ? (
						<SearchFriends />
					) : (
						<SeeFriends friend={friend} setFriend={setFriend} />
					)}
				</div>
			</PopUp>
		</>
	)
}

export default Friends
