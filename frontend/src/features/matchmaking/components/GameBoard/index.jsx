import './style.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getMatchmaking } from '@redux/selectors'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '@redux/selectors'
import { usePeerContext } from '@contexts/PeerContext'

const GameBoard = () => {
	const matchmaking = useSelector(getMatchmaking)
	const user = useSelector(getUser)
	const navigate = useNavigate()
	const { sendMessage } = usePeerContext()
	const inputRef = useRef(null)
	const scrollableRef = useRef(null)

	useEffect(() => {
		if (matchmaking.state === 'nothing') {
			navigate('/')
		}

		scrollableRef.current.scrollTo({
			top: scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight,
			behavior: 'smooth'
		})
	}, [matchmaking])

	const handleSubmit = e => {
		e.preventDefault()
		sendMessage(inputRef.current.value)
		inputRef.current.value = ''
	}

	return (
		<>
			<section className='game-board-wrapper scrollable p-20' ref={scrollableRef}>
				<p className='cartoon2-txt m-0 p-20' style={{ alignSelf: 'center' }}>
					Textual chat initiated
				</p>
				<AnimatePresence>
					{matchmaking?.messages &&
						matchmaking.messages.map((message, index) => (
							<motion.div
								key={index}
								variants={messageVariants}
								initial='hidden'
								animate='visible'
								exit='exit'
								className='game-message'
								style={{ alignSelf: message.author === user.username && 'start' }}
								layout
							>
								<div
									className='cartoon-short-txt'
									style={{
										alignSelf: message.author === user.username && 'start'
									}}
								>
									{message.author}
								</div>
								<div
									className='cartoon2-txt p-20 br-20 shadowed'
									style={{
										backgroundColor:
											message.author === user.username
												? 'var(--yellow)'
												: 'var(--red)'
									}}
								>
									{message.content}
								</div>
							</motion.div>
						))}
					{matchmaking?.messages?.length === 0 && (
						<p className='cartoon2-txt gray' style={{ alignSelf: 'center' }}>
							No messages yet
						</p>
					)}
				</AnimatePresence>
			</section>
			<form className='game-form' onSubmit={e => handleSubmit(e)}>
				<div className='cartoon-short-txt'>Type your message</div>
				<input
					type='text'
					className='game-input bg-blue shadowed br-20 p-20 cartoon2-txt'
					ref={inputRef}
				/>
				<button
					type='submit'
					className='no-btn cartoon-short-txt bg-yellow shadowed-simple'
				>
					{'>'}
				</button>
			</form>
		</>
	)
}

const messageVariants = {
	hidden: {
		opacity: 0,
		y: -20
	},
	visible: {
		opacity: 1,
		y: 0
	},
	exit: {
		opacity: 0,
		y: -20
	}
}

export default GameBoard
