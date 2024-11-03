import { useSelector } from 'react-redux'
import { getFriends } from '../../../../app/selectors'
import { useState } from 'react'
import FriendDetails from '../FriendDetails'

const See = ({ enableDetails = true, friend, setFriend }) => {
	const friends = useSelector(getFriends)
	const [openFriends, setOpenFriends] = useState(false)

	const handleOpenDetails = friendSelected => {
		if (friendSelected.id === friend?.id) {
			setFriend({})
		} else {
			setFriend(friendSelected)
		}
		setOpenFriends(true)
	}

	return (
		<>
			<div className='friends-result-wrapper'>
				{friends.map(friend => (
					<button
						key={friend.id}
						className='friend-fetched shadowed c-pointer no-btn'
						onClick={() => handleOpenDetails(friend)}
					>
						<span className='cartoon-short-txt'>{friend.username}</span>
						<span className='cartoon2-txt'>{friend.money}</span>
					</button>
				))}
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
