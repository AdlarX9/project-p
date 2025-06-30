import './style.css'
import { useSelector } from 'react-redux'
import { getMatchmaking } from '@redux/selectors'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TextualChat from '../TextualChat'
import { Avatar, useGetPublicProfile, switchColorContent } from '@features/profile'
import Loader from '@components/Loader'
import { usePeerContext } from '@contexts/PeerContext'

const GameBoard = () => {
	const matchmaking = useSelector(getMatchmaking)
	const navigate = useNavigate()
	const { peerAudioRef, userAudioRef } = usePeerContext()
	const peersVolumeRef = useRef(1)
	const userVolumeRef = useRef(1)

	const { profile, isPending } = useGetPublicProfile(matchmaking?.matchedUsername)

	useEffect(() => {
		if (matchmaking.state === 'nothing') {
			navigate('/')
		}
	}, [matchmaking])

	const handleVolume = person => {
		const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		const analyser = audioCtx.createAnalyser()
		analyser.fftSize = 2048

		let source
		if (person === 'peer') {
			source = audioCtx.createMediaStreamSource(peerAudioRef.current)
		} else if (person === 'user') {
			source = audioCtx.createMediaStreamSource(userAudioRef.current)
		}
		source.connect(analyser)

		const dataArray = new Uint8Array(analyser.fftSize)

		const getVolume = () => {
			analyser.getByteTimeDomainData(dataArray)

			let sum = 0
			for (let i = 0; i < dataArray.length; i++) {
				const val = (dataArray[i] - 128) / 128
				sum += val * val
			}

			const rms = Math.sqrt(sum / dataArray.length)
			const normalized = Math.min(rms * 10, 1) // adapte la sensibilité ici

			const volume = 1 + normalized / 2

			if (person === 'peer') {
				peersVolumeRef.current = volume
			} else if (person === 'user') {
				userVolumeRef.current = volume
			}

			if (
				(person === 'user' && userAudioRef.current instanceof MediaStream) ||
				(person === 'peer' && peerAudioRef.current instanceof MediaStream)
			) {
				requestAnimationFrame(getVolume)
			}
		}

		getVolume()
	}

	useEffect(() => {
		if (userAudioRef.current instanceof MediaStream) {
			handleVolume('user')
		}
		if (peerAudioRef.current instanceof MediaStream) {
			handleVolume('peer')
		}
	})

	return (
		<>
			<div className='game-board-avatars'>
				<Avatar reverse scaleRef={userVolumeRef} />
				{isPending ? (
					<div className='game-board-loader-wrapper'>
						<Loader />
					</div>
				) : profile?.locker?.color ? (
					<Avatar
						customColor={switchColorContent(profile.locker.color)}
						scaleRef={peersVolumeRef}
					/>
				) : (
					<Avatar customColor='hotpink' scaleRef={peersVolumeRef} />
				)}
			</div>
			<TextualChat />
		</>
	)
}

export default GameBoard
