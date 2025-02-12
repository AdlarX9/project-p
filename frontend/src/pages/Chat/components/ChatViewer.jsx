import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useGetConversation } from '../../../hooks/messageHooks'
import Loader from '../../../components/Loader'
import { useSelector } from 'react-redux'
import { getUser } from '../../../reduxStore/selectors'

const ChatViewer = ({ friendUsername }) => {
	const user = useSelector(getUser)
	const [messages, setMessages] = useState([])
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
						<motion.p
							className='cartoon-short-txt chatter-label'
							style={
								message.sender.username !== user.username && {
									justifySelf: 'end'
								}
							}
						>
							{message.sender.username === user.username ? 'you' : friendUsername}
						</motion.p>
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
