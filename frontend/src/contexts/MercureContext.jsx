import React, { createContext, useContext, useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@redux/selectors'
import { useRemoveNotification } from '@features/notifications'

const MercureContext = createContext(null)

export const useMercureContext = () => useContext(MercureContext)

export const MercureContextProvider = ({ children }) => {
	const eventSourceRef = useRef(null)
	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const removeNotification = useRemoveNotification()
	const [topics, setTopics] = useState({})

	const initializeUrl = () => {
		const url = new URL(process.env.REACT_APP_MERCURE_URL + '/.well-known/mercure')
		Object.keys(topics).forEach(topic => {
			url.searchParams.append('topic', topic)
		})
		return url
	}

	const setupEventHandlers = () => {
		Object.keys(topics).forEach(topic => {
			const handler = topics[topic]
			eventSourceRef.current.addEventListener('message', message => {
				const parsedData = JSON.parse(message.data)
				console.log(parsedData)
				handler({ parsedData, type: parsedData.type, dispatch, user, removeNotification })
			})
		})
	}

	useEffect(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
		}

		const url = initializeUrl()
		if (Object.keys(topics)?.length > 0) {
			eventSourceRef.current = new EventSource(url)
			setupEventHandlers()

			// Redémarrage ne cas d'erreur
			eventSourceRef.current.onerror = err => {
				console.log(err)
				eventSourceRef.current.close()
				setTimeout(() => {
					eventSourceRef.current = new EventSource(url)
				}, 3000)
			}
		}

		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close()
			}
		}
	}, [topics])

	const addTopic = (topic, handler) => {
		setTopics(prev => ({ ...prev, [topic]: handler }))
	}

	const addSingleUseTopic = (topic, handler) => {
		const derivedHandler = data => {
			handler(data)
			removeTopic(topic)
		}

		addTopic(topic, derivedHandler)
	}

	const waitingActions = {}

	const waitSomeSSE = (topic, handler) => {
		const derivedHandler = data => {
			handler(data)
			waitingActions[topic].current(data.parsedData)
		}

		addSingleUseTopic(topic, derivedHandler)

		waitingActions[topic] = () => null
		return new Promise(resolve => {
			waitingActions[topic].current = resolve
		})
	}

	const removeTopic = topic => {
		setTopics(prev => {
			const { [topic]: removed, ...rest } = prev // Enlever le topic de l'objet
			if (Object.keys(rest).length === 0 && eventSourceRef.current) {
				eventSourceRef.current.close()
			}
			return rest
		})
	}

	const cleanupTopics = () => {
		setTopics(() => [])
	}

	return (
		<MercureContext.Provider value={{ waitSomeSSE, addTopic, removeTopic, cleanupTopics }}>
			{children}
		</MercureContext.Provider>
	)
}
