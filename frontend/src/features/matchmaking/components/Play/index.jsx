import { useSelector } from 'react-redux'
import { getMatchmakingState } from '@redux/selectors'
import { UsePlay, useCancelPlay } from '@features/matchmaking'
import './style.css'
import { motion } from 'framer-motion'

const Play = () => {
	const { play } = UsePlay()
	const cancelPlay = useCancelPlay()
	const matchmakingState = useSelector(getMatchmakingState)

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{
				opacity:
					matchmakingState === 'connecting' || matchmakingState === 'pending' ? 0.5 : 1
			}}
			whileHover={{
				scale: 1.05
			}}
		>
			<motion.button
				className={'no-link int-btn skewed play-btn'}
				style={{
					cursor:
						matchmakingState === 'connecting' || matchmakingState === 'pending'
							? 'auto'
							: 'pointer',
					backgroundColor: matchmakingState !== 'nothing' ? 'var(--red)' : 'var(--yellow)'
				}}
				onClick={matchmakingState === 'nothing' ? play : cancelPlay}
				disabled={matchmakingState === 'connecting' || matchmakingState === 'pending'}
			>
				<span>{matchmakingState === 'nothing' ? 'play' : 'cancel'}</span>
			</motion.button>
		</motion.div>
	)
}

export default Play
