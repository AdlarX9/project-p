import './style.css'
import profile from '../../../../assets/profile.png'
import logoutImage from '../../../../assets/logout.png'
import PopUp from '../../../../components/PopUp'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../../../app/selectors'
import { useNavigate } from 'react-router-dom'
import { useDelete, useLogout } from '../../../../hooks'
import { confirm } from '../../../../components/Confirmation'

const Profile = () => {
	const [open, setOpen] = useState(false)
	const user = useSelector(getUser)
	const { deleteAccount } = useDelete()
	const { logout } = useLogout()
	const navigate = useNavigate()

	const handleDelete = () => {
		confirm({
			message: 'Do you really want to delte your account?'
		}).then(result => {
			if (result) {
				deleteAccount()
			}
		})
	}

	return (
		<>
			<button className='int-btn profile' onClick={() => setOpen(true)}>
				<img src={profile} alt='profile' draggable='false' />
				<span>{user.username}</span>
			</button>

			<PopUp open={open} setOpen={setOpen} className='popup-profile'>
				<div className='profile-popup-wrapper'>
					<div className='profile-personal-info'>
						<p>{user.username}</p>
						<p className='cartoon-short-txt'>{user.money}</p>
					</div>

					<button className='logout-btn link' onClick={logout}>
						<img src={logoutImage} alt='disconnect' />
						Logout
					</button>

					<div className='profile-popup-secondary'>
						<button className='link' onClick={() => navigate('/login')}>
							Log in again
						</button>
						<button className='link' onClick={() => navigate('/signup')}>
							Sign up again
						</button>
						<button
							className='delet-account-btn link red'
							onClick={handleDelete}
						>
							Delete account
						</button>
					</div>
				</div>
			</PopUp>
		</>
	)
}

export default Profile
