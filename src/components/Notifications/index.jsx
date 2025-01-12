import './style.css'
import { useEmptyNotifications, useSubscribeNotifications } from '../../hooks/notificationsHooks'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { getNotifications } from '../../reduxStore/selectors'
import Notification from './components/Notification'
import { AnimatePresence } from 'framer-motion'

const AnimatedNotification = motion.create(Notification)

const Notifications = () => {
	useSubscribeNotifications()
	const { emptyNotifications } = useEmptyNotifications()
	const notifications = useSelector(getNotifications)

	return (
		<motion.div
			className='notifications-wrapper'
			variants={wrapperVariants}
			initial='hidden'
			animate='visible'
		>
			<AnimatePresence>
				{Array.isArray(notifications) &&
					notifications.map(notification => (
						<AnimatedNotification
							notification={notification}
							key={notification.id}
							variants={notificationVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							layout
						/>
					))}
			</AnimatePresence>

			{notifications?.length > 5 && (
				<button
					className='shadowed notifications-delete-everything cartoon2-txt bg-green'
					onClick={() => emptyNotifications()}
				>
					Delete all notifications
				</button>
			)}
		</motion.div>
	)
}

const wrapperVariants = {
	visible: {
		transition: {
			delay: 1,
			staggerChildren: 0.2, // Échelonne l'animation des enfants
			delayChildren: 0.1 // Ajoute un délai avant le début du stagger
		},
		opacity: 1
	},
	hidden: {
		opacity: 1
	}
}

const notificationVariants = {
	visible: {
		x: 0,
		opacity: 1
	},
	hidden: {
		x: '110%',
		opacity: 0
	}
}

export default Notifications
