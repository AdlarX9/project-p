import './style.css'
import profile from '../../../../assets/profile.png'
import logout from '../../../../assets/logout.png'
import PopUp from '../../../../components/PopUp'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../../../app/selectors'
import { userSlice } from '../../../../app/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDelete } from '../../../../hooks'

const Profile = () => {
	const [open, setOpen] = useState(false)
	const user = useSelector(getUser)

	const { deleteAccount } = useDelete()

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleDelete = () => {
		const confirmation = window.confirm('Êtes-vous sur de vouloir supprimer votre compte ?')
		if (confirmation) {
			deleteAccount()
		} else return
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
						<p>{user.money}</p>
					</div>

					<button
						className='logout-btn link'
						onClick={() => dispatch(userSlice.actions.logout())}
					>
						<img src={logout} alt='disconnect'/>
						Logout
					</button>

					<div className='profile-popup-secondary'>
						<button className='link' onClick={() => navigate('/login')}>Log in again</button>
						<button className='link' onClick={() => navigate('/signup')}>Sign up again</button>
						<button
							className='delet-account-btn link'
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
