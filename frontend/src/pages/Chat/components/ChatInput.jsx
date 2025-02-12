import { motion } from 'framer-motion'

const ChatInput = ({ friendUsername }) => {
	const handleSubmit = e => {
		e.preventDefault()
		// Send the message
	}

	return (
		<form className='chat-input-wrapper' onSubmit={handleSubmit}>
			<motion.input
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='chat-input shadowed cartoon2-txt bg-blue p-20 br-20'
				placeholder='Write...'
			></motion.input>
		</form>
	)
}

export default ChatInput
