import '../style.css'
import { useSelector } from 'react-redux'
import { getFriends } from '../../../reduxStore/selectors'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FriendDetails from './FriendDetails'
import FriendButton from './FriendButton'

const See = ({ enableDetails = true, friend, setFriend }) => {
	const friends = useSelector(getFriends)
	const [openFriends, setOpenFriends] = useState(false)

	const handleOpenDetails = friendSelected => {
		setFriend(friendSelected)
		setOpenFriends(true)
	}

	return (
		<>
			<div className='friends-result-wrapper'>
				<AnimatePresence>
					{friends.map(friend => (
						<FriendButton friend={friend} key={friend.id} onClick={handleOpenDetails} />
					))}
				</AnimatePresence>
			</div>
			<FriendDetails
				friend={friend}
				open={enableDetails ? openFriends : false}
				setOpen={setOpenFriends}
			/>
		</>
	)
}

export default See
