import React, { createContext, useContext, useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../reduxStore/selectors'

const MercureContext = createContext(null)

export const useMercureContext = () => useContext(MercureContext)

export const MercureContextProvider = ({ children }) => {
	const eventSourceRef = useRef(null)
	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const [topics, setTopics] = useState([])

	useEffect(() => {
		const url = new URL('http://localhost:2019/.well-known/mercure')

		topics.forEach(topic => {
			url.searchParams.append('topic', topic.topic)
		})

		if (eventSourceRef.current) {
			eventSourceRef.current.close()
		}

		eventSourceRef.current = new EventSource(url)

		topics.forEach(topic => {
			eventSourceRef.current.addEventListener('message', message => {
				const parsedData = JSON.parse(message.data)
				topic.handler({ parsedData, type: parsedData.type, dispatch, user })
			})
		})

		eventSourceRef.current.onerror = () => {
			console.error('EventSource error, reconnecting...')
			eventSourceRef.current.close()
			setTimeout(() => {
				eventSourceRef.current = new EventSource(url)
			}, 3000)
		}

		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close()
			}
		}
	}, [topics])

	const addTopic = (topic, handler) => {
		if (!topics.some(el => el.topic === topic)) {
			setTopics(prev => [...prev, { topic: topic, handler: handler }])
		}
	}

	const removeTopic = topic => {
		setTopics(prev => {
			const newTopics = prev.filter(el => el.topic !== topic)
			if (newTopics.length === 0 && eventSourceRef.current) {
				eventSourceRef.current.close()
			}
			return newTopics
		})
	}

	const cleanupTopics = () => {
		setTopics(() => [])
	}

	return (
		<MercureContext.Provider value={{ addTopic, removeTopic, cleanupTopics }}>
			{children}
		</MercureContext.Provider>
	)
}
