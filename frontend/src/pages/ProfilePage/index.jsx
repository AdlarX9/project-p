import './style.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import Back from '@components/Back'
import PopUp from '@components/PopUp'
import Background from '@components/Background'
import { getUser } from '@redux/selectors'
import { ProfilePopup, Avatar, LockerPreview, ProfileInfo } from '@features/profile'

const Profile = () => {
	const [open, setOpen] = useState(false)
	const user = useSelector(getUser)

	return (
		<section className='profile-wrapper oh'>
			<Background />
			<div className='back-wrapper'>
				<Back />
			</div>

			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				className='profile-popup-button bg-blue int-btn'
				onClick={() => setOpen(true)}
			>
				<span>{user.username}</span>
			</motion.button>

			<main className='profile-page-main'>
				<ProfileInfo />
				<section className='profile-page-locker'>
					<div>
						<Avatar />
					</div>
					<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
						<LockerPreview />
					</motion.div>
				</section>
			</main>

			<PopUp open={open} setOpen={setOpen} className='popup-profile'>
				<ProfilePopup />
			</PopUp>
		</section>
	)
}

export default Profile
