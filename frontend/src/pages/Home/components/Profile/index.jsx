import './style.css'
import profile from '../../../../assets/profile.png'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getUser } from '../../../../reduxStore/selectors'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const Profile = () => {
	const user = useSelector(getUser)

	return (
		<>
			<MotionLink
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				className='int-btn profile'
				to='/profile'
			>
				<img src={profile} alt='profile' draggable='false' />
				<span>{user.username}</span>
			</MotionLink>
		</>
	)
}

export default Profile
