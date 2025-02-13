import { motion } from 'framer-motion'
import { useState } from 'react'
import { useSendMessage } from '../../../hooks/messageHooks'

const ChatInput = ({ friendUsername, setMessages }) => {
	const { sendMessage } = useSendMessage()
	const [message, setMessage] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		sendMessage(friendUsername, message).then(message => {
			setMessages(messages => [...messages, message])
		})
		setMessage('')
	}

	return (
		<form className='chat-input-wrapper' onSubmit={handleSubmit}>
			<motion.input
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='chat-input shadowed cartoon2-txt bg-blue p-20 br-20'
				placeholder='Write...'
				value={message}
				onChange={e => setMessage(e.target.value)}
			/>
		</form>
	)
}

export default ChatInput
