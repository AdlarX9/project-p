import './style.css'
import cancel from '../../../../assets/cancel.png'
import { useState } from 'react'
import { useRemoveNotification } from '../../hooks'

const Notification = ({ notification }) => {
	const [extraClassName, setExtraClassName] = useState('')
	const removeNotification = useRemoveNotification()

	const closeNotification = () => {
		setExtraClassName('notification-is-closing')
		setTimeout(() => {
			removeNotification(notification)
		}, 200)
	}

	return (
		<div className={'notification-wrapper shadowed bg-red ' + extraClassName}>
			<button
				className='shadowed-simple popup-cancel'
				onClick={closeNotification}
			>
				<img
					src={cancel}
					alt='close'
					draggable='false'
				/>
			</button>
			<p className='cartoon-short-txt'>{notification.title}</p>
			<p className='cartoon2-txt'>{notification.message}</p>
		</div>
	)
}

export default Notification
