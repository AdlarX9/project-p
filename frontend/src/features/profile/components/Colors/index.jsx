import './style.css'
import { useSelector } from 'react-redux'
import { getProfile } from '@redux/selectors'

const Colors = () => {
	const profile = useSelector(getProfile)
	console.log(profile)

	return (
		<section className='locker-colors-wrapper'>
			<h2 className='m-0'>Colors</h2>
			<div className='colors-displayer'></div>
		</section>
	)
}

export default Colors
