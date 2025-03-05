import './style.css'
import cancel from '../../../../assets/cancel.png'
import { forwardRef } from 'react'
import { useRemoveNotification } from '@features/notifications'

const Notification = forwardRef(({ notification }, ref) => {
	const removeNotification = useRemoveNotification()

	// Fonction pour gérer la suppression avec sécurité supplémentaire
	const handleRemove = () => {
		if (notification) {
			removeNotification(notification)
		}
	}

	return (
		<div className='notification-wrapper shadowed bg-red' ref={ref}>
			<button className='shadowed-simple popup-cancel' onClick={handleRemove}>
				<img src={cancel} alt='close' draggable='false' />
			</button>
			<p className='cartoon-short-txt'>{notification?.title || 'No Title'}</p>
			<p className='cartoon2-txt'>{notification?.message || 'No Message'}</p>
		</div>
	)
})

Notification.displayName = 'Notification'
export default Notification
