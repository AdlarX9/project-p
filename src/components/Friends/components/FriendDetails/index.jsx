import { useEffect, useState } from 'react'
import PopUp from '../../../PopUp'
import './style.css'
import { useAddFriend } from '../../hooks'
import { useSelector } from 'react-redux'
import { getFriends } from '../../../../app/selectors'
import { useRemoveFriend } from '../../hooks/'

const FriendDetails = ({ friend, open, setOpen }) => {
	const [isFriend, setIsFriend] = useState(false)
	const friends = useSelector(getFriends)
	const { addFriend } = useAddFriend()
	const { removeFriend } = useRemoveFriend()

	useEffect(() => {
		if (friends.map(user => user.id).includes(friend.id)) {
			setIsFriend(true)
		} else {
			setIsFriend(false)
		}
	})

	const handleAddFriend = (id) => {
		addFriend(id)
		setIsFriend(true)
	}

	const handleRemoveFriend = (friend) => {
		const confirmation = window.confirm('You are going to remove a friend of yours')
		if (confirmation) {
			removeFriend(friend)
		}
	}

	return (
		<PopUp className='friend-detail popup-profile' open={open} setOpen={setOpen}>
			<div className='friend-detail-pres'>
				<span className='cartoon-short-txt'>{friend.username}</span>
				<span className='cartoon2-txt'>{friend.money}</span>
			</div>
			<div className='friend-details-actions'>
				<button
					onClick={() => handleAddFriend(friend.id)}
					className={`link ${!isFriend ? 'c-pointer' : ''}`}
					disabled={ isFriend }
				>
					{ isFriend ? 'Is a friend' : 'Add as a friend' }
				</button>
				{ isFriend ? (
					<button
						onClick={() => handleRemoveFriend(friend)}
						className={'link red c-pointer'}
					>
						Remove this friend
					</button>
				) : (<></>)}
			</div>
		</PopUp>
	)
}

export default FriendDetails
