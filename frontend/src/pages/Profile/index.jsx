import './style.css'
import Back from '@components/Back'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getUser } from '@redux/selectors'
import PopUp from '@components/PopUp'
import { useState } from 'react'
import { ProfilePopup } from '@features/user'

const Profile = () => {
	const [open, setOpen] = useState(false)
	const user = useSelector(getUser)

	return (
		<section className='profile-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>

			<motion.button
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				className='int-btn profile-popup-button bg-blue'
				onClick={() => setOpen(true)}
			>
				<span>{user.username}</span>
			</motion.button>

			<PopUp open={open} setOpen={setOpen} className='popup-profile'>
				<ProfilePopup />
			</PopUp>
		</section>
	)
}

export default Profile
