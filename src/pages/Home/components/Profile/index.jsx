import './style.css'
import profile from '../../../../assets/profile.png'

const Profile = () => {
	return (
		<button className='int-btn profile'>
			<img src={profile} alt='profile' draggable='false' />
			<span>Profile</span>
		</button>
	)
}

export default Profile
