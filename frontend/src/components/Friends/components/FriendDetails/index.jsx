import { useEffect, useState } from 'react'
import PopUp from '../../../PopUp'
import './style.css'
import { useAddFriend } from '../../../../hooks/friendsHooks'
import { useSelector } from 'react-redux'
import { getFriends } from '../../../../reduxStore/selectors'
import { useRemoveFriend } from '../../../../hooks/friendsHooks'
import { confirm } from '../../../Confirmation'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

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
				<motion.button
					onClick={() => handleAddFriend(friend.id)}
					className={`link ${!isFriend ? 'c-pointer' : 'c-auto'}`}
					disabled={isFriend}
					style={!isFriend && { color: 'var(--blue)' }}
				>
					{isFriend ? 'Is a friend' : 'Add as a friend'}
				</motion.button>
				{isFriend ? (
					<>
						<Link
							to={'/chat/' + friend.username}
							className='no-btn link'
							style={{ color: 'var(--yellow)' }}
						>
							Discuss
						</Link>
						<button
							onClick={() => handleRemoveFriend()}
							className={'link red c-pointer'}
						>
							Remove this friend
						</button>
					</>
				) : (
					<></>
				)}
			</div>
		</PopUp>
	)
}

export default FriendDetails
