import './style.css'
import { useEmptyNotifications, useSubscribeNotifications } from './hooks'
import { useSelector } from 'react-redux'
import { getNotifications } from '../../app/selectors'
import Notification from './components/Notification'
import { useEffect } from 'react'

const Notifications = () => {
	useSubscribeNotifications()
	const { emptyNotifications } = useEmptyNotifications()
	const notifications = useSelector(getNotifications)

	return (
		<div className='notifications-wrapper'>
			{Array.isArray(notifications) &&
				notifications.map(notification => (
					<Notification notification={notification} key={notification.id} />
				))}

			{notifications?.length > 5 && (
				<button
					className='shadowed notifications-delete-everything cartoon2-txt bg-green'
					onClick={() => emptyNotifications()}
				>
					Delete all notifications
				</button>
			)}
		</div>
	)
}

export default Notifications
