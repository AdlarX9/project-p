import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useDeleteMessage, useGetConversation } from '@features/messages'
import Loader from '../../../components/Loader'
import { useSelector } from 'react-redux'
import { getUser } from '@redux/selectors'
import { confirm } from '../../../components/Confirmation'

const ChatViewer = ({ friendUsername, messages, setMessages }) => {
	const user = useSelector(getUser)
	const { deleteMessage } = useDeleteMessage()
	const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetConversation(friendUsername)

	useEffect(() => {
		if (data?.pages[0]) {
			setMessages(messages => [
				...messages,
				...data.pages[0].filter(
					newMessage => !messages.some(msg => msg.id === newMessage.id)
				)
			])
		}
	}, [data])

	const handleDelete = async message => {
		confirm({ message: 'Are you sure you want to delete this message?' })
			.then(() => {
				deleteMessage(message.id)
				setMessages(messages =>
					messages.filter(randomMessage => randomMessage.id !== message.id)
				)
			})
			.catch(err => {
				throw new Error(err.message)
			})
	}

	return (
		<motion.section
			className='chat-wiewer'
			variants={wrapperVariants}
			initial='hidden'
			animate='visible'
		>
			{isLoading && <Loader />}
			<AnimatePresence>
				{messages.map((message, index) => (
					<motion.div
						key={index}
						className='chat-message'
						variants={messageVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
						layout
					>
						<motion.div
							className='chat-label-wrapper'
							style={
								message.sender.username !== user.username && {
									flexDirection: 'row-reverse'
								}
							}
						>
							<p className='cartoon-short-txt chatter-label'>
								{message.sender.username === user.username ? 'you' : friendUsername}
							</p>
							{message.sender.id === user.id && (
								<motion.button
									className='link'
									style={{ color: 'red' }}
									onClick={() => handleDelete(message)}
								>
									delete
								</motion.button>
							)}
						</motion.div>
						<motion.p
							className='shadowed-simple p-20 br-20 bg-green cartoon2-txt chat-message-content'
							style={
								message.sender.username === user.username && {
									backgroundColor: 'var(--red)'
								}
							}
						>
							{message.content}
						</motion.p>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.section>
	)
}

const wrapperVariants = {
	visible: {
		transition: {
			delay: 1,
			staggerChildren: 0.2, // Échelonne l'animation des enfants
			delayChildren: 0.1 // Ajoute un délai avant le début du stagger
		}
	}
}

const messageVariants = {
	visible: {
		x: 0,
		opacity: 1
	},
	hidden: {
		x: 100,
		opacity: 0
	}
}

export default ChatViewer
