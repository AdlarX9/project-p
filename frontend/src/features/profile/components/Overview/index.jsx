import { useGetPublicProfile } from '../../hooks'
import './style.css'
import { useParams } from 'react-router-dom'
import Loader from '@components/Loader'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getFriends } from '@redux/selectors'
import { useAddFriend, useRemoveFriend } from '@features/friends'
import { confirm } from '@components/Confirmation'

const Overview = () => {
	const { username } = useParams()
	const { profile, isPending } = useGetPublicProfile(username)
	const friends = useSelector(getFriends)
	const { addFriend } = useAddFriend()
	const { removeFriend } = useRemoveFriend()

	const handleRemoveFriend = () => {
		confirm({
			message: `Do you really want to remove this friend?`
		}).then(result => {
			if (result) {
				removeFriend(profile)
			}
		})
	}

	const handleAddFriend = () => {
		addFriend(profile.id)
	}

	return (
		<main className='overview-wrapper cartoon-txt'>
			<div className='overview-header'>
				<motion.h1
					className='title-txt m-0 dotted-txt'
					initial={{ x: '50%', opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
				>
					{username}
				</motion.h1>
				{friends.map(friend => friend.username).includes(username) ? (
					<motion.button
						className='int-btn overview-friend-btn p-20 bg-red cartoon-short-txt'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.05 }}
						onClick={handleRemoveFriend}
					>
						Remove friend
					</motion.button>
				) : (
					<motion.button
						className='int-btn overview-friend-btn p-20 bg-green cartoon-short-txt skewed'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, scale: 1, skewX: '-10deg' }}
						whileHover={{ scale: 1.05 }}
						onClick={handleAddFriend}
					>
						<span>Add Friend</span>
					</motion.button>
				)}
			</div>
			<motion.div
				className='profile-overview-separator'
				initial={{ scaleX: 0, x: '-50%' }}
				animate={{ scaleX: 1, x: 0 }}
			/>
			{isPending && (
				<center>
					<Loader />
				</center>
			)}
			{profile && (
				<motion.div
					className='profile-overview-info scrollable'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
				>
					<p>
						ID: <span>{profile.id}</span>
					</p>
					<p>
						Money: <span>{profile.money}</span>
					</p>
					<p>
						Gender: <span>{profile.gender}</span>
					</p>
					{profile.email && (
						<p>
							Email: <span>{profile.email}</span>
						</p>
					)}
					{profile.banks?.length > 0 && (
						<p>
							Banks: <span>{profile.banks.map(bank => bank.name).join(', ')}</span>
						</p>
					)}
					{profile.links?.length > 0 && (
						<>
							Links:{' '}
							<ul className='m-0'>
								{profile.links.map((link, idx) => (
									<li key={idx}>
										<span>
											<a href={link}>{link}</a>
										</span>
									</li>
								))}
							</ul>
						</>
					)}
				</motion.div>
			)}
		</main>
	)
}

export default Overview
