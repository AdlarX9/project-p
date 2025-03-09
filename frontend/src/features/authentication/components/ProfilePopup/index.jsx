import './style.css'
import { useDelete, useLogout } from '../../hooks'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUser } from '@redux/selectors'

const ProfilePopup = () => {
	const navigate = useNavigate()
	const user = useSelector(getUser)
	const { logout } = useLogout()
	const { deleteAccount } = useDelete()

	const handleDelete = () => {
		confirm({
			message: 'Do you really want to delete your account?'
		}).then(result => {
			if (result) {
				deleteAccount()
			}
		})
	}

	return (
		<div className='profile-popup-wrapper'>
			<div className='profile-personal-info'>
				<p>{user.username}</p>
				<p className='cartoon-short-txt'>{user.money}</p>
			</div>

			<button
				className='logout-btn link'
				onClick={logout}
				style={{ color: 'rgb(255, 0, 0)' }}
			>
				Logout
			</button>

			<div className='profile-popup-secondary'>
				<button className='link' onClick={() => navigate('/login')}>
					Log in again
				</button>
				<button className='link' onClick={() => navigate('/signup')}>
					Sign up again
				</button>
				<button className='delet-account-btn link red' onClick={handleDelete}>
					Delete account
				</button>
			</div>
		</div>
	)
}

export default ProfilePopup
