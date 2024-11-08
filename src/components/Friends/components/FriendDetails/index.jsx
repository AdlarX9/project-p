import { useEffect, useState } from 'react'
import PopUp from '../../../PopUp'
import './style.css'
import { useAddFriend } from '../../hooks'
import { useSelector } from 'react-redux'
import { getFriends } from '../../../../app/selectors'
import { useRemoveFriend } from '../../hooks/'
import { confirm } from '../../../Confirmation'

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

	const handleRemoveFriend = () => {
		confirm({
			message: `Do you really want to delete this friend?`
		}).then(result => {
			if (result) {
				removeFriend(friend)
				setIsFriend(false)
			}
		})
	}

	const handleAddFriend = id => {
		addFriend(id)
		setIsFriend(true)
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
					disabled={isFriend}
				>
					{isFriend ? 'Is a friend' : 'Add as a friend'}
				</button>
				{isFriend ? (
					<button
						onClick={() => handleRemoveFriend()}
						className={'link red c-pointer'}
					>
						Remove this friend
					</button>
				) : (
					<></>
				)}
			</div>
		</PopUp>
	)
}

export default FriendDetails
