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
	const peerIdRef = useRef(null) // the peer id of the peer
	const peerRef = useRef(null) // the user's Peer instance
	const peerAudioRef = useRef(null) // the audio stream received from the peer
	const userAudioRef = useRef(null) // the audio stream received from the user
	const connectionRef = useRef(null) // the connection coming from the connect methods
	const callRef = useRef(null) // the connection coming from the call methods

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
		peerIdRef.current = parsedData.id
	}

	const idBoxTopic = process.env.MAIN_URL + '/' + user.username + '/' + 'send_id'
	const getSomeId = async username => {
		return new Promise((resolve, reject) => {
			waitSomeSSE(idBoxTopic, handleReceiveId)
				.then(({ id }) => {
					clearInterval(interval)
					clearTimeout(timeout)
					peerIdRef.current = id
					resolve(peerIdRef.current)
				})
				.catch(err => {
					clearInterval(interval)
					clearTimeout(timeout)
					reject(err)
				})

			const interval = setInterval(() => {
				if (peerIdRef.current) {
					resolve(peerIdRef.current)
					clearInterval(interval)
				}
				console.log('Sent request for peer id of', username)
				axiosId('ask', username, token)
			}, 500)

			const timeout = setTimeout(() => {
				clearInterval(interval)
				reject(new Error('Timeout while waiting for peer id'))
			}, 20000) // Timeout après 20 secondes (par exemple)
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
					resolve(userMedia)
				})
				.catch(() => {
					resolve(getSilentAudioStream())
				})
		})
	}

	const changeAudioStream = async () => {
		try {
			const newStream = await getAudio()
			const senders = callRef.current.getSenders()
			newStream.getAudioTracks().forEach(newTrack => {
				const sender = senders.find(s => s.track.kind === 'audio')
				if (sender) {
					sender.replaceTrack(newTrack)
				}
			})
		} catch (error) {
			console.error('Error changing audio stream:', error)
		}
	}

	// --- Functions dealing with the peerjs library ---

	const initializePeer = async () => {
		peerIdRef.current = null
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

		return new Promise(resolve => {
			peerRef.current.on('open', id => {
				peerRef.current.off('open')
				resolve(id)
			})
		})
	}

	// Peer call

	const peerCall = receiverUsername => {
		getAudio().then(stream => {
			userAudioRef.current = stream
			getSomeId(receiverUsername).then(receiverId => {
				console.log('receiverId:', receiverId)
				callRef.current = peerRef.current.call(receiverId, userAudioRef.current, {
					metadata: {
						id: peerRef.current.id,
						username: user.username
					}
				})

				handleCall()
			})
		})
	}

	const waitForPeerCall = () => {
		peerRef.current.on('call', call => {
			getAudio().then(stream => {
				userAudioRef.current = stream
				callRef.current = call
				callRef.current.answer(userAudioRef.current)
				handleCall()
			})
		})
	}

	const handleCall = () => {
		console.log('handleCall called')
		navigator.mediaDevices.addEventListener('devicechange', changeAudioStream)

		callRef.current.on('stream', audioStream => {
			peerAudioRef.current = audioStream
			handleConnected()
			playAudioStream()
		})

		callRef.current.on('close', () => {
			navigator.mediaDevices.removeEventListener('devicechange', changeAudioStream)
			closeConnection()
		})
	}

	// Peer connection

	const peerConnect = receiverUsername => {
		getSomeId(receiverUsername).then(receiverId => {
			console.log('receiverId:', receiverId)

			connectionRef.current = peerRef.current.connect(receiverId, {
				metadata: {
					id: peerRef.current.id,
					username: user.username,
					userId: user.id
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
		console.log('handleConnect called')

		connectionRef.current.on('open', () => {
			handleConnected()
			connectionRef.current.on('data', message => {
				dispatch(
					matchmakingReceiveMessage({ ...message, author: matchmaking.matchedUsername })
				)
			})
		})

		connectionRef.current.on('close', () => {
			closeConnection()
		})

		connectionRef.current.on('error', err => {
			throw new Error(err)
		})
	}

	const sendMessage = content => {
		if (connectionRef.current && connectionRef.current.open) {
			const message = { content }
			connectionRef.current.send(message)
			dispatch(matchmakingReceiveMessage({ ...message, author: user.username }))
		}
	}

	// Close connection
	const closeConnection = () => {
		if (connectionRef.current) {
			connectionRef.current.off('open')
			connectionRef.current.off('data')
			connectionRef.current.off('close')
			connectionRef.current.off('error')
			connectionRef.current.close()
			connectionRef.current = null
		}
		if (callRef.current) {
			callRef.current.off('stream')
			callRef.current.off('close')
			callRef.current.close()
			callRef.current = null
		}
		if (peerRef.current) {
			peerRef.current.destroy()
			peerRef.current = null
		}
		handleDisconnected()
	}

	// --- Handle window refreshing and closing events ---

	const handleWindowUnload = () => {
		if (matchmakingState === 'connected') {
			navigator.sendBeacon(
				process.env.MAIN_URL + '/api/public/lose_game_refresh',
				JSON.stringify({
					token: token,
					gameId: matchmaking.gameId
				})
			)
		}
	}

	useEffect(() => {
		window.onpagehide = handleWindowUnload
		window.onbeforeunload = handleWindowUnload

		return () => {
			window.onpagehide = null
			window.onbeforeunload = null
		}
	})

	// Safety

	useEffect(() => {
		if (matchmakingState === 'nothing') {
			closeConnection()
		}
	}, [matchmakingState])

	// --- Truly initialize game ---

	// Script de l'initialisation de la partie
	useEffect(() => {
		if (matchmakingState !== 'connecting') {
			return
		}

		if (peerRef.current && !peerRef.current.destroyed && !peerRef.current.disconnected) {
			return
		}

		initializePeer()
			.then(() => {
				if (matchmaking.role === 'caller') {
					peerConnect(matchmaking.matchedUsername)
					if (settings?.communicationPreference === 'call') {
						peerCall(matchmaking.matchedUsername)
					}
				} else if (matchmaking.role === 'receiver') {
					waitForPeerConnect(matchmaking.matchedUsername)
					if (settings?.communicationPreference === 'call') {
						waitForPeerCall(matchmaking.matchedUsername)
					}
					addTopic(deliverIdTopic, deliverIdCommunication)
					console.log('listening to events as a receiver')
				}
			})
			.catch(() => {
				closeConnection()
			})
	}, [matchmakingState])

	// --- Play received audio stream ---

	const playAudioStream = () => {
		if (peerAudioRef.current instanceof MediaStream) {
			const audioEl = document.createElement('audio')
			audioEl.setAttribute('autoplay', 'autoplay')
			audioEl.setAttribute('playsinline', 'playsinline')
			audioEl.srcObject = peerAudioRef.current

			const playPromise = audioEl.play()
			if (playPromise !== undefined) {
				playPromise.catch(err => {
					console.warn('Playback failed: ' + err.message)
				})
			}
		}
	}

	return (
		<PeerContext.Provider
			value={{
				peer: peerRef.current,
				sendMessage,
				peerAudioRef: peerAudioRef,
				userAudioRef: userAudioRef
			}}
		>
			{children}
		</PeerContext.Provider>
	)
}
