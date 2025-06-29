import { useEffect, useRef } from 'react'
import './style.css'
import { usePeerContext } from '@contexts/PeerContext'
import { useSelector } from 'react-redux'
import { getMatchmaking, getUser } from '@redux/selectors'
import { motion, AnimatePresence } from 'framer-motion'

const TextualChat = () => {
	const matchmaking = useSelector(getMatchmaking)
	const user = useSelector(getUser)
	const { sendMessage } = usePeerContext()
	const inputRef = useRef(null)
	const scrollableRef = useRef(null)

	useEffect(() => {
		if (!scrollableRef.current) {
			return
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
			<section className='textual-chat-wrapper scrollable p-20' ref={scrollableRef}>
				<p className='cartoon2-txt m-0 p-20' style={{ alignSelf: 'center' }}>
					Textual chat initiated
				</p>
				<AnimatePresence>
					{matchmaking?.messages?.length &&
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

export default TextualChat
