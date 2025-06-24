import './style.css'
import { useSelector } from 'react-redux'
import { getMatchmaking, getSettings } from '@redux/selectors'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextualChat from '../TextualChat'
import CallComponent from '../CallComponent'

const GameBoard = () => {
	const matchmaking = useSelector(getMatchmaking)
	const settings = useSelector(getSettings)
	const navigate = useNavigate()

	useEffect(() => {
		if (matchmaking.state === 'nothing') {
			navigate('/')
		}
	}, [matchmaking])

	return (
		<>
			{matchmaking?.messages &&
				(settings?.communicationPreference === 'call' ? (
					<CallComponent />
				) : (
					<TextualChat />
				))}
		</>
	)
}

export default GameBoard
