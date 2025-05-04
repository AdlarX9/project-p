import './style.css'
import { motion } from 'framer-motion'
import { GameBoard, GameHeader } from '@features/matchmaking'
import Back from '@components/Back'

const Game = () => {
	return (
		<main className='game-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<GameHeader />
			<GameBoard />
		</main>
	)
}

export default Game
