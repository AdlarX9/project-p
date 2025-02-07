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

const friendVariants = {
	hidden: {
		scaleX: 0,
		scaleY: 0.5
	},
	visible: {
		scaleX: 1,
		scaleY: 1
	},
	exit: {
		x: '100%',
		scale: 0,
		opacity: 0
	}
}

export default See
