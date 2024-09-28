import { useSelector } from "react-redux"
import { getFriends } from "../../../../app/selectors"
import { useEffect, useState } from "react"
import FriendDetails from "../FriendDetails"

const See = () => {
	const friends = useSelector(getFriends)
	const [friend, setFriend] = useState({})
	const [openFriends, setOpenFriends] = useState(false)

	const handleOpenDetails = (friend) => {
		setFriend(friend)
		setOpenFriends(true)
	}

	return (
		<>
			<div className='friends-result-wrapper'>
				{
					friends.map(friend => (
						<button
							key={friend.id}
							className='friend-fetched shadowed c-pointer no-btn'
							onClick={() => handleOpenDetails(friend)}
						>
							<span className='cartoon-short-txt'>{friend.username}</span>
							<span className='cartoon2-txt'>{friend.money}</span>
						</button>
					))
				}
			</div>
			<FriendDetails friend={friend} open={openFriends} setOpen={setOpenFriends} />
		</>
	)
}

export default See
