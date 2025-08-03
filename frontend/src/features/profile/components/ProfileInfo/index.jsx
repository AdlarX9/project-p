import { useSelector } from 'react-redux'
import './style.css'
import { getProfile } from '@redux/selectors'
import { useEffect } from 'react'

const ProfileInfo = () => {
	const profile = useSelector(getProfile)

	useEffect(() => {
		console.log(profile)
	}, [profile])

	return (
		<>
			<section>email: {profile?.email}</section>
			<section>gender: {profile.gender}</section>
		</>
	)
}

export default ProfileInfo
