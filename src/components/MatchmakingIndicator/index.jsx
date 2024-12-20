import './style.css'
import { useSelector } from 'react-redux'
import { getMatchmaking } from '../../app/selectors'

const MatchmakingIndicator = () => {
	const matchmakingState = useSelector(getMatchmaking)
	return (
		<section className='matchmaking-wrapper'>
			{matchmakingState === 'pending' && (
				<div className='matchmaking-pending matchmaking-styled-bg'>
					<span className='cartoon2-txt'>Matching...</span>
				</div>
			)}
		</section>
	)
}

export default MatchmakingIndicator
