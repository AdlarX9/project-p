import React, { createContext, useContext, useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../reduxStore/selectors'

const MercureContext = createContext(null)

export const useMercureContext = () => useContext(MercureContext)

export const MercureContextProvider = ({ children }) => {
	const eventSourceRef = useRef(null)
	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const [topics, setTopics] = useState({})

	const initializeUrl = () => {
		const url = new URL('http://localhost:2019/.well-known/mercure')
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
				handler({ parsedData, type: parsedData.type, dispatch, user })
			})
		})
	}

	useEffect(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
		}

		const url = initializeUrl()
		eventSourceRef.current = new EventSource(url)
		setupEventHandlers()

		// Redémarrage ne cas d'erreur
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
		setTopics(prev => ({ ...prev, [topic]: handler }))
	}

	const waitIdAction = {
		current: () => null
	}

	const addWaitingTopic = (topic, handler) => {
		const derivedHandler = data => {
			handler(data)
			removeTopic(topic)
		}
		addTopic(topic, derivedHandler)
	}

	const handleReceiveId = ({ parsedData, type }) => {
		if (type !== 'send_id') {
			return
		}

		waitIdAction.current(parsedData.id)
	}

	const waitForId = () => {
		addWaitingTopic(
			process.env.REACT_APP_CLIENT_URL + '/' + user.username + '/' + 'send_id',
			handleReceiveId
		)

		return new Promise(resolve => {
			waitIdAction.current = resolve
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
		<MercureContext.Provider value={{ waitForId, addTopic, removeTopic, cleanupTopics }}>
			{children}
		</MercureContext.Provider>
	)
}
