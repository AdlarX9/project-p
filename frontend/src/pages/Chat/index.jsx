import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Back from '../../components/Back'
import { useSelector } from 'react-redux'
import { getFriends } from '../../reduxStore/selectors'
import ChatViewer from './components/ChatViewer'
import ChatInput from './components/ChatInput'

const Chat = () => {
	const friends = useSelector(getFriends)
	const navigate = useNavigate()
	const { username } = useParams()

	useEffect(() => {
		if (!friends.find(friend => friend.username === username)) {
			navigate('/')
		}
	})

	return (
		<section className='chat-wrapper'>
			<div className='chat-back-wrapper'>
				<Back />
			</div>
			<motion.h1
				initial={{ opacity: 0, x: '-100%' }}
				animate={{ opacity: 1, x: 0 }}
				className='cartoon-txt p-20 chat-title'
			>
				Chat with {username}
			</motion.h1>
			<ChatViewer friendUsername={username} />
			<ChatInput friendUsername={username} />
		</section>
	)
}

export default Chat
