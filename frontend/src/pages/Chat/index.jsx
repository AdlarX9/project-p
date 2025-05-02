import { useNavigate, useParams } from 'react-router-dom'
import './style.css'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Back from '../../components/Back'
import { useSelector } from 'react-redux'
import { getFriends, getUser } from '@redux/selectors'
import { ChatViewer, ChatInput } from '@features/messages'
import { useMercureContext } from '../../contexts/MercureContext'

const Chat = () => {
	const user = useSelector(getUser)
	const friends = useSelector(getFriends)
	const navigate = useNavigate()
	const [messages, setMessages] = useState([])
	const { username } = useParams()
	const { addTopic, removeTopic } = useMercureContext()

	const receiveMessage = ({ type, parsedData }) => {
		if (type !== 'messageUpdate') {
			return
		}

		if (parsedData.action === 'receive') {
			setMessages(prevMessages => [...prevMessages, parsedData.message])
		} else if (parsedData.action === 'delete') {
			setMessages(prevMessages =>
				prevMessages.filter(message => message.id !== parsedData.message.id)
			)
		}
	}

	useEffect(() => {
		if (!friends.find(friend => friend.username === username)) {
			navigate('/')
		}

		addTopic(process.env.MAIN_URL + '/' + user.username + '/chat/' + username, receiveMessage)

		return () => {
			removeTopic(process.env.MAIN_URL + '/' + user.username + '/chat/' + username)
		}
	}, [username])

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
			<ChatViewer friendUsername={username} messages={messages} setMessages={setMessages} />
			<ChatInput friendUsername={username} messages={messages} setMessages={setMessages} />
		</section>
	)
}

export default Chat
