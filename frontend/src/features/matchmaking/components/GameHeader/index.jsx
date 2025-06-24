import { useEffect } from 'react'
import './style.css'
import { motion } from 'framer-motion'
import { useGetTime, useGameExpired, useLoseGame } from '../../hooks'
import Loader from '@components/Loader'
import { confirm } from '@components/Confirmation'

const GameHeader = () => {
	const { time, setTime, isLoading } = useGetTime()
	const { gameExpired } = useGameExpired()
	const { loseGame } = useLoseGame()

	useEffect(() => {
		const interval = setInterval(() => {
			if (time > 0) {
				setTime(time => time - 1)
			} else if (time <= 0) {
				gameExpired()
				clearInterval(interval)
			}
		}, 1000)
		return () => clearInterval(interval)
	}, [time])

	const formatTime = chrono => {
		const minutes = Math.floor(chrono / 60)
		const seconds = chrono % 60
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const handleLoseGame = () => {
		confirm({ message: 'Do you really want to lose this game?' }).then(confirmed => {
			if (confirmed) {
				loseGame()
			}
		})
	}

	return (
		<motion.header
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='game-header m-20 p-20'
		>
			<h1 className='title-txt m-0'>Game</h1>
			<div className='game-header-chrono-ff'>
				<div className='cartoon-txt'>{isLoading ? <Loader /> : formatTime(time)}</div>
				<motion.button
					className='int-btn p-20 bg-red cartoon-short-txt'
					animate={{ scale: 1 }}
					whileHover={{ scale: 1.05 }}
					onClick={handleLoseGame}
				>
					Lose
				</motion.button>
			</div>
		</motion.header>
	)
}

export default GameHeader
