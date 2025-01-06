import { useSelector } from 'react-redux'
import { getMatchmakingState } from '../../../../app/selectors'
import { UsePlay, useCancelPlay } from './hooks'
import './style.css'
import { motion } from 'framer-motion'

const Play = () => {
	const { play } = UsePlay()
	const cancelPlay = useCancelPlay()
	const matchmakingState = useSelector(getMatchmakingState)

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{
				opacity:
					matchmakingState === 'connecting' || matchmakingState === 'pending'
						? 0.5
						: 1
			}}
			whileHover={{
				scale:
					matchmakingState === 'connecting' || matchmakingState === 'pending'
						? 1
						: 1.05
			}}
		>
			<button
				className={
					'int-btn skewed play-btn ' +
					(matchmakingState === 'connecting' && 'c-auto ') +
					(matchmakingState !== 'nothing' ? ' bg-red' : ' bg-yellow')
				}
				onClick={matchmakingState === 'nothing' ? play : cancelPlay}
				disabled={
					matchmakingState === 'connecting' || matchmakingState === 'pending'
				}
			>
				<span>{matchmakingState === 'nothing' ? 'play' : 'cancel'}</span>
			</button>
		</motion.div>
	)
}

export default Play
