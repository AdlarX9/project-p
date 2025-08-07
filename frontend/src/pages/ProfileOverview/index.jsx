import './style.css'
import Back from '@components/Back'
import Background from '@components/Background'
import { Overview } from '@features/profile'

const ProfileOverview = () => {
	return (
		<div className='profile-overview-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<Background />
			<Overview />
		</div>
	)
}

export default ProfileOverview
