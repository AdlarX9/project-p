import Peer from 'peerjs'
import axios from 'axios'
import jsSHA from 'jssha'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useMercureContext } from '@contexts/MercureContext'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
	useHandleConnected,
	useHandleDisconnected,
	matchmakingReceiveMessage
} from '@features/matchmaking'
import {
	getUser,
	getToken,
	getSettings,
	getMatchmaking,
	getMatchmakingState
} from '@redux/selectors'

const PeerContext = createContext(null)

export const usePeerContext = () => useContext(PeerContext)

export const PeerContextProvider = ({ children }) => {
	// --- Setting up some variables and util functions ---

	const handleConnected = useHandleConnected()
	const handleDisconnected = useHandleDisconnected()
	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const token = useSelector(getToken)
	const settings = useSelector(getSettings)
	const matchmakingState = useSelector(getMatchmakingState)
	const matchmaking = useSelector(getMatchmaking)
	const { waitSomeSSE, addTopic } = useMercureContext()
	const peerRef = useRef(null)
	const audioRef = useRef(null)
	const connectionRef = useRef(null)

	const generateTurnUsername = () => {
		return Math.floor(Date.now() / 1000).toString()
	}

	const generateTurnPassword = username => {
		const shaObj = new jsSHA('SHA-1', 'TEXT')
		shaObj.setHMACKey(process.env.TURN_SECRET, 'TEXT')
		shaObj.update(username)
		return shaObj.getHMAC('B64')
	}

	// --- API to exchange peer identifiers ---

	const axiosId = async (type, peerUsername, token, id = '') => {
		return axios
			.post(
				process.env.MAIN_URL + `/api/matchmaking/peer/${type}_id`,
				{ peerUsername, id },
				{
					headers: {
						Authorization: token
					}
				}
			)
			.then(response => response)
			.catch(error => {
				throw new Error(error.message)
			})
	}

	const handleReceiveId = ({ parsedData, type }) => {
		if (type !== 'sendId') {
			return
		}

		console.log('just received id: ', parsedData.id)
	}

	const idBoxTopic = process.env.MAIN_URL + '/' + user.username + '/' + 'send_id'
	const getSomeId = async username => {
		return new Promise((resolve, reject) => {
			const intervalId = setInterval(() => {
				console.log('Sent request for peer id of', username)
				axiosId('ask', username, token)
			}, 500)

			const timeoutId = setTimeout(() => {
				clearInterval(intervalId)
				reject(new Error('Timeout while waiting for peer id'))
			}, 10000) // Timeout après 10 secondes (par exemple)

			waitSomeSSE(idBoxTopic, handleReceiveId)
				.then(({ id }) => {
					clearInterval(intervalId)
					clearTimeout(timeoutId)
					resolve(id)
				})
				.catch(err => {
					clearInterval(intervalId)
					clearTimeout(timeoutId)
					reject(err)
				})
		})
	}

	const deliverIdTopic = process.env.MAIN_URL + `/${user.username}/ask_id`

	const deliverIdCommunication = ({ type }) => {
		if (type === 'askId') {
			axiosId('send', matchmaking.matchedUsername, token, peerRef.current.id)
			console.log('Just sent  id', peerRef.current.id, 'to', matchmaking.matchedUsername)
		}
		return deliverIdTopic
	}

	const getSilentAudioStream = () => {
		const audioContext = new AudioContext()
		const oscillator = audioContext.createOscillator() // source sonore
		const dst = audioContext.createMediaStreamDestination() // MediaStream

		// Oscillateur : silence (gain à 0)
		const gainNode = audioContext.createGain()
		gainNode.gain.value = 0

		oscillator.connect(gainNode)
		gainNode.connect(dst)
		oscillator.start()

		return dst.stream // Ceci est un MediaStream audio
	}

	const getAudio = async () => {
		return new Promise(resolve => {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then(userMedia => {
					console.log('input audio found:', userMedia)
					resolve(userMedia)
				})
				.catch(() => {
					resolve(getSilentAudioStream())
				})
		})
	}

	// --- Functions dealing with the peerjs library ---

	const initializePeer = async () => {
		const turnUsername = generateTurnUsername()
		const turnPassword = generateTurnPassword(turnUsername)
		peerRef.current = new Peer({
			config: {
				iceServers: [
					{
						urls: process.env.STUN_URL
					},
					{
						urls: process.env.TURN_URL,
						username: turnUsername,
						credential: turnPassword
					}
				],
				host: process.env.DOMAIN_NAME,
				port: process.env.PEER_SERVER_PORT,
				path: process.env.PEER_SERVER_PATH,
				secure: true
			}
		})

		if (settings?.communicationPreference === 'call') {
			audioRef.current = await getAudio()
		}

		return new Promise(resolve => {
			peerRef.current.on('open', id => {
				peerRef.current.off('open')
				resolve(id)
			})
		})
	}

	// Peer call

	const peerCall = receiverUsername => {
		getSomeId(receiverUsername).then(receiverId => {
			console.log('received matched user id:', receiverId)

			connectionRef.current = peerRef.current.call(receiverId, audioRef.current, {
				metadata: {
					id: peerRef.current.id,
					username: user.username
				}
			})

			handleCall()
		})
	}

	const waitForPeerCall = () => {
		peerRef.current.on('call', call => {
			connectionRef.current = call
			connectionRef.current.answer(audioRef.current)
			handleCall()
		})
	}

	const handleCall = () => {
		connectionRef.current.on('stream', audioStream => {
			console.log('audio stream: ', audioStream)
			handleConnected(audioStream)
		})

		connectionRef.current.on('close', () => {
			closeConnection()
		})
	}

	// Peer connection

	const peerConnect = receiverUsername => {
		getSomeId(receiverUsername).then(receiverId => {
			connectionRef.current = peerRef.current.connect(receiverId, {
				metadata: {
					id: peerRef.current.id,
					username: user.username
				}
			})
			handleConnect()
		})
	}

	const waitForPeerConnect = () => {
		peerRef.current.on('connection', dataConnection => {
			connectionRef.current = dataConnection
			handleConnect()
		})
	}

	const handleConnect = () => {
		connectionRef.current.on('open', () => {
			handleConnected()
			connectionRef.current.send('salut')
			connectionRef.current.on('data', data => {
				dispatch(matchmakingReceiveMessage(data))
			})
		})

		connectionRef.current.on('close', () => {
			closeConnection()
		})

		connectionRef.current.on('error', err => {
			throw new Error(err)
		})
	}

	// Close connection
	const closeConnection = () => {
		if (connectionRef.current) {
			connectionRef.current.off('open')
			connectionRef.current.off('data')
			connectionRef.current.off('close')
			connectionRef.current.off('error')
			connectionRef.current.off('stream')
			connectionRef.current.close()
			connectionRef.current = null
		}
		if (peerRef.current) {
			peerRef.current.destroy()
			peerRef.current = null
		}
		handleDisconnected()
	}

	// --- Truly initialize game ---

	// Script de l'initialisation de la partie
	const [isPeerInitializing, setIsPeerInitializing] = useState(false)
	useEffect(() => {
		if (matchmakingState !== 'connecting') {
			return
		}

		if (peerRef.current && !peerRef.current.destroyed && !peerRef.current.disconnected) {
			return
		}

		setIsPeerInitializing(true)
		initializePeer()
			.then(() => {
				if (matchmaking.role === 'caller') {
					if (settings?.communicationPreference === 'call') {
						peerCall(matchmaking.matchedUsername)
					} else {
						peerConnect(matchmaking.matchedUsername)
					}
				} else if (matchmaking.role === 'receiver') {
					addTopic(deliverIdTopic, deliverIdCommunication)
					if (settings?.communicationPreference === 'call') {
						waitForPeerCall(matchmaking.matchedUsername)
					} else {
						waitForPeerConnect(matchmaking.matchedUsername)
					}
				}
			})
			.catch(error => {
				closeConnection()
				console.error('Failed to initialize peer:', error)
			})
			.finally(() => {
				setIsPeerInitializing(false)
			})
	}, [matchmakingState])

	return <PeerContext.Provider value={{ peer: peerRef.current }}>{children}</PeerContext.Provider>
}
