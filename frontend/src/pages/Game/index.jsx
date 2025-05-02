import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getMatchmaking } from '@redux/selectors'
import { useEffect } from 'react'
import Back from '@components/Back'

const Game = () => {
	const matchmaking = useSelector(getMatchmaking)

	useEffect(() => {
		console.log(matchmaking)
	}, [matchmaking])

	return (
		<main>
			<div className='back-wrapper'>
				<Back />
			</div>
			<h1 className='title-txt'>Game</h1>
		</main>
	)
}

export default Game
