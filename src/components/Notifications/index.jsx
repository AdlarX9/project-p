import { useEffect } from 'react'
import { useSubscribeNotifications } from './hooks'
import './style.css'
import { useSelector } from 'react-redux'
import { getNotifications, getUser } from '../../app/selectors'
import Notification from './components/Notification'

const Notifications = () => {
	useSubscribeNotifications()
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
