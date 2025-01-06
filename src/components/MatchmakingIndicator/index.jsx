import './style.css'
import { useSelector } from 'react-redux'
import { getMatchmakingState } from '../../app/selectors'

const MatchmakingIndicator = () => {
	const matchmakingState = useSelector(getMatchmakingState)
	const messages = {
		pending: 'Pending...',
		connecting: 'Connecting...',
		inQueue: 'In Queue...',
		connected: 'Connected...'
	}
	const isValidState = Object.hasOwn(messages, matchmakingState)

	return (
		<section className='matchmaking-wrapper'>
			{isValidState && (
				<div className='matchmaking-pending matchmaking-styled-bg'>
					<span className='cartoon2-txt'>{messages[matchmakingState]}</span>
				</div>
			)}
		</section>
	)
}

export default MatchmakingIndicator
