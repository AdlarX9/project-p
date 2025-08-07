import './style.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import Back from '@components/Back'
import PopUp from '@components/PopUp'
import Background from '@components/Background'
import { getUser } from '@redux/selectors'
import { ProfilePopup, Avatar, LockerPreview, ProfileInfo } from '@features/profile'
import ProfilePicture from '@assets/profile.png'

const Profile = () => {
	const [open, setOpen] = useState(false)
	const user = useSelector(getUser)
	const navigate = useNavigate()

	return (
		<section className='profile-wrapper oh'>
			<Background />
			<div className='back-wrapper'>
				<Back />
			</div>

			<motion.div
				className='profile-popup-button-wrapper int-btn bg-blue c-auto'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<motion.button
					className='no-btn c-pointer profile-page-picture'
					whileHover={{ scale: 1.1 }}
					onClick={() => navigate('/profile_overview/' + user.username)}
				>
					<img src={ProfilePicture} alt='profile_picture' />
				</motion.button>
				<motion.button
					whileHover={{ scale: 1.05 }}
					className='profile-popup-button no-btn cartoon-txt c-pointer'
					onClick={() => setOpen(true)}
				>
					<span>{user.username}</span>
				</motion.button>
			</motion.div>

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
