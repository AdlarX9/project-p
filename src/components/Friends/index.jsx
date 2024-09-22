import './style.css'
import friends from '../../assets/friends.png'
import PopUp from '../PopUp/'
import { useState } from 'react'

const Friends = () => {
	const [open, setOpen] = useState(false)
	const openPopUp = () => setOpen(true)

	return (
		<>
			<button className='int-btn friends-btn' onClick={openPopUp}>
				<img src={friends} alt='add-friends' draggable='false' />
			</button>
			<PopUp open={open} setOpen={setOpen} className='popup-friends'>
				Test Amis
			</PopUp>
		</>
	)
}

export default Friends
