import './style.css'
import { useSelector } from 'react-redux'
import { getFriends } from '@redux/selectors'
import { AnimatePresence } from 'framer-motion'
import FriendButton from '../FriendButton'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MotionFriendButton = motion.create(FriendButton)

const See = ({ enableDetails = true, setFriend, showLastMessage = true }) => {
	const friends = useSelector(getFriends)
	const navigate = useNavigate()

	const handleOpenDetails = friendSelected => {
		setFriend(friendSelected)
		if (enableDetails) {
			navigate('/chat/' + friendSelected.username)
		}
	}

	return (
		<div className='friends-result-wrapper scrollable'>
			<AnimatePresence>
				{friends.map(friend => (
					<MotionFriendButton
						showLastMessage={showLastMessage}
						friend={friend}
						onClick={handleOpenDetails}
						key={friend.id}
						variants={friendVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						layout
					/>
				))}
			</AnimatePresence>
			{friends?.length === 0 && (
				<p className='cartoon2-txt tac'>You don&apos;t have any friends yet!</p>
			)}
		</div>
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
