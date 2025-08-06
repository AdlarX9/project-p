import './style.css'
import { useSelector } from 'react-redux'
import { getUser } from '@redux/selectors'
import { useMemo } from 'react'
import Profile from '@assets/profile.png'

const FriendButton = ({ onClick, friend, ref, showLastMessage = true }) => {
	const user = useSelector(getUser)

	const memoizedTimeAgo = useMemo(() => {
		return timeAgo(friend?.last_message?.created_at)
	}, [friend?.last_message?.created_at])

	function timeAgo(dateString) {
		if (!dateString) return ''

		let givenDate

		// Meilleure gestion du parsing de date pour Safari
		try {
			// Si c'est déjà au format ISO (YYYY-MM-DDTHH:mm:ssZ)
			if (dateString.includes('T') || dateString.includes('Z')) {
				givenDate = new Date(dateString)
			}
			// Si c'est au format "YYYY-MM-DD HH:MM:SS"
			else if (dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
				// Convertir en format ISO pour Safari
				const isoString = dateString.replace(' ', 'T') + 'Z'
				givenDate = new Date(isoString)
			}
			// Autres formats
			else {
				givenDate = new Date(dateString)
			}

			// Vérifier si la date est valide
			if (isNaN(givenDate.getTime())) {
				console.warn('Date invalide:', dateString)
				return 'Date invalide'
			}
		} catch (error) {
			console.error('Erreur de parsing de date:', error, dateString)
			return 'Erreur date'
		}

		const currentDate = new Date()
		const diffMs = currentDate - givenDate

		if (diffMs < 0) return '0 s'

		const diffSeconds = Math.floor(diffMs / 1000)
		const units = [
			[604800, 'w'], // semaine
			[86400, 'day'], // jour
			[3600, 'h'], // heure
			[60, 'min'], // minute
			[1, 's'] // seconde (changé de 'sec' à 's' pour cohérence)
		]

		for (const [seconds, unit] of units) {
			if (diffSeconds >= seconds) {
				const number = Math.floor(diffSeconds / seconds)
				return number + ' ' + (unit === 'day' && number > 1 ? 'days' : unit)
			}
		}
		return '0 s'
	}

	return (
		<div
			className='friend-fetched shadowed-simple'
			ref={ref}
			style={{ backgroundColor: 'var(--blue)' }}
		>
			<img
				src={Profile}
				alt='profile_picture'
				className='friend-fetched-profile-picture c-pointer'
			/>
			<button
				className='friend-fetched-writings c-pointer no-btn'
				onClick={() => onClick(friend)}
			>
				<p className='friend-fetched-info m-0'>
					<span className='cartoon-short-txt friend-fetched-username dotted-txt'>
						{friend.username}
					</span>
					<span className='cartoon2-txt friend-fetched-money'>{friend.money}</span>
				</p>
				{showLastMessage && friend?.last_message?.content && (
					<div className='last-message-wrapper'>
						<p className='cartoon2-txt dotted-txt m-0 last-message-preview dark-gray'>
							<strong>
								{friend.last_message.sender === user.username
									? 'You'
									: friend.last_message.sender}
								:
							</strong>{' '}
							{friend.last_message.content}
						</p>
						<p className='cartoon2-txt m-0 last-message-date'>{memoizedTimeAgo}</p>
					</div>
				)}
			</button>
		</div>
	)
}

export default FriendButton
