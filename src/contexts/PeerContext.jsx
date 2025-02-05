import jsSHA from 'jssha'
import Peer from 'peerjs'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { matchmakingConnected, matchmakingNothing } from '../reduxStore/matchmakingSlice'
import { useSelector } from 'react-redux'
import { getMatchmaking, getMatchmakingState, getToken, getUser } from '../reduxStore/selectors'
import axios from 'axios'
import { useMercureContext } from './MercureContext'

const PeerContext = createContext(null)

export const usePeerContext = () => useContext(PeerContext)

export const PeerContextProvider = ({ children }) => {
	// --- Setting up some variables and util functions ---

	const dispatch = useDispatch()
	const user = useSelector(getUser)
	const token = useSelector(getToken)
	const matchmakingState = useSelector(getMatchmakingState)
	const matchmaking = useSelector(getMatchmaking)
	const peerRef = useRef(null)
	const { waitSomeSSE, addTopic } = useMercureContext()

	const generateTurnUsername = () => {
		return Math.floor(Date.now() / 1000).toString()
	}

	const generateTurnPassword = username => {
		const shaObj = new jsSHA('SHA-1', 'TEXT')
		shaObj.setHMACKey(process.env.REACT_APP_TURN_SECRET, 'TEXT')
		shaObj.update(username)
		return shaObj.getHMAC('B64')
	}

	// --- API for exchange peer identifiers ---

	const axiosId = async (type, peerUsername, token, id = '') => {
		return axios
			.post(
				process.env.REACT_APP_API_URL + `/api/user/peer/${type}_id`,
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

		console.log('just received id : ', parsedData.id)
	}

	const idBoxTopic = process.env.REACT_APP_CLIENT_URL + '/' + user.username + '/' + 'send_id'
	const getSomeId = async username => {
		console.log('Sent request for peer id of ', username)
		axiosId('ask', username, token)
		return waitSomeSSE(idBoxTopic, handleReceiveId).then(({ id }) => id)
	}

	const deliverIdTopic = process.env.REACT_APP_CLIENT_URL + `/${user.username}/ask_id`

	const deliverIdCommunication = ({ type }) => {
		if (type === 'askId') {
			axiosId('send', matchmaking.matchedUsername, token, peerRef.current.id)
			console.log('Just sent  id', peerRef.current.id, 'to', matchmaking.matchedUsername)
		}
		return deliverIdTopic
	}

	const getAudio = async () => {
		return navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(userMedia => {
				console.log('input audio found :', userMedia)
				return userMedia
			})
			.catch(error => {
				console.error(error.message)
				return null
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
						urls: process.env.REACT_APP_STUN_URL
					},
					{
						urls: process.env.REACT_APP_TURN_URL,
						username: turnUsername,
						credential: turnPassword
					}
				],
				host: process.env.REACT_APP_PEER_SERVER_HOST,
				port: process.env.REACT_APP_PEER_SERVER_PORT,
				path: process.env.REACT_APP_PEER_SERVER_PATH,
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

	const peerCall = receiverUsername => {
		setTimeout(() => {
			getSomeId(receiverUsername).then(receiverId => {
				console.log('received matched user id :', receiverId)

				getAudio()
					.then(audioStream => {
						console.log(audioStream)

						if (!audioStream) {
							matchmakingNothing()
							return
						}

						const audioConnection = peerRef.current.call(receiverId, audioStream, {
							metadata: {
								id: peerRef.current.id,
								username: user.username
							}
						})

						audioConnection.on('stream', receiverAudioStream => {
							dispatch(matchmakingConnected())
						})
					})
					.catch(error => {
						console.error(error)
						matchmakingNothing()
					})
			})
		}, 500)
	}

	const peerConnect = receiverUsername => {
		const receiverId = getSomeId(receiverUsername)
		const dataConnection = peerRef.current.connect(receiverId)
		dataConnection.on('open', () => {
			console.log('data connection established with : ', receiverUsername)
			dataConnection.an('data', data => {
				console.log('received data from peer connect', data)
			})
		})
	}

	const waitForPeerCall = () => {
		peerRef.current.on('call', call => {
			console.log(
				'incoming call from : ',
				call.metadata.username,
				' of id ',
				call.metadata.id
			)

			call.answer(getAudio())

			call.on('stream', senderAudioStream => {
				console.log('received audio stream from : ', call.metadata.username)
				// Handle the received audio stream, play it, etc..
				dispatch(matchmakingConnected(senderAudioStream))
			})

			call.on('close', () => {
				console.log('call ended')
				call.off('stream')
			})
		})
	}

	const waitForPeerConnect = () => {
		peerRef.current.on('connection', receivedDdataConnection => {
			console.log(
				'incoming data connection from : ',
				receivedDdataConnection.metadata.username
			)
			receivedDdataConnection.on('open', () => {
				receivedDdataConnection.on('data', data => {
					console.log('received data from wait for peer connect', data)
				})
			})
		})
	}

	// --- Truely initialize game ---

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
			.then(id => {
				console.log('your id :', id)
				if (matchmaking.role === 'caller') {
					console.log('you are a caller Sir, calling...')
					peerCall(matchmaking.matchedUsername)
				} else if (matchmaking.role === 'receiver') {
					console.log('you are a receiver Sir, waiting for id and call if success.')
					addTopic(deliverIdTopic, deliverIdCommunication)
					waitForPeerCall()
				}
			})
			.catch(error => {
				console.error('Failed to initialize peer:', error)
			})
			.finally(() => {
				setIsPeerInitializing(false)
			})

		return () => {
			if (peerRef.current) {
				peerRef.current.destroy()
				peerRef.current = null
			}
		}
	}, [matchmakingState])

	return <PeerContext.Provider value={{ peer: peerRef.current }}>{children}</PeerContext.Provider>
}
