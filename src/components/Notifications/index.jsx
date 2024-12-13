import { useEffect } from 'react'
import { useSubscribeNotifications } from './hooks'
import './style.css'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications, getUser } from '../../app/selectors'
import Notification from './components/Notification'
import { logNotifications } from './notificationsSlice'

const Notifications = () => {
	useSubscribeNotifications()
	const dispatch = useDispatch()
	const notifications = useSelector(getNotifications)

	return (
		<div className='notifications-wrapper'>
			{notifications.map(notification => (
				<Notification notification={notification} key={notification.id} />
			))}
		</div>
	)
}

export default Notifications
