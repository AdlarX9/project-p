import { useEffect, useState } from 'react'
import PopUp from '../../../PopUp'
import './style.css'
import { useAddFriend } from '../../hooks'
import { useSelector } from 'react-redux'
import { getFriends } from '../../../../app/selectors'
import { useRemoveFriend } from '../../hooks/'
import Confirmation from '../../../Confirmation'

const FriendDetails = ({ friend, open, setOpen }) => {
	const [isFriend, setIsFriend] = useState(false)
	const [openConfirmation, setOpenConfirmation] = useState(false)
	const [confirmed, setConfirmed] = useState(false)
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

	const handleAddFriend = id => {
		addFriend(id)
		setIsFriend(true)
	}

	useEffect(() => {
		if (confirmed) {
			removeFriend(friend)
			setConfirmed(false)
		}
	}, [confirmed])

	return (
		<PopUp
			className='friend-detail popup-profile'
			open={open}
			setOpen={setOpen}
		>
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
						onClick={() => setOpenConfirmation(true)}
						className={'link red c-pointer'}
					>
						Remove this friend
					</button>
				) : (
					<></>
				)}
			</div>
			<Confirmation
				message='Do you really want to delete this friend ?'
				confirmed={confirmed}
				setConfirmed={setConfirmed}
				open={openConfirmation}
				setOpen={setOpenConfirmation}
			/>
		</PopUp>
	)
}

export default FriendDetails
