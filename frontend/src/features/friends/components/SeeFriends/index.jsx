import './style.css'
import { useSelector } from 'react-redux'
import { getFriends } from '@redux/selectors'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import FriendDetails from '../FriendDetails'
import FriendButton from '../FriendButton'
import { motion } from 'framer-motion'

const MotionFriendButton = motion.create(FriendButton)

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
						<MotionFriendButton
							friend={friend}
							onClick={handleOpenDetails}
							key={friend.id}
							variants={friendVariants}
							initial='hidden'
							whileInView='visible'
							exit='exit'
							layout
						/>
					))}
				</AnimatePresence>
				{friends?.length === 0 && (
					<p className='cartoon2-txt tac'>You don&apos;t have any friends yet!</p>
				)}
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
