import { usePeerContext } from '@contexts/PeerContext'
import { useEffect, useRef } from 'react'

const CallComponent = () => {
	const { peerAudio } = usePeerContext()
	const audioElement = useRef(null)

	useEffect(() => {
		const audioEl = audioElement.current
		if (audioEl && peerAudio instanceof MediaStream) {
			// On arrête la lecture actuelle si nécessaire
			audioEl.pause()
			audioEl.srcObject = peerAudio
			// Petite attente pour éviter l'AbortError
			const playPromise = audioEl.play()
			if (playPromise !== undefined) {
				playPromise.catch(err => {
					console.warn('Playback failed:', err)
				})
			}
		}
	}, [peerAudio])

	return (
		// eslint-disable-next-line
		<audio ref={audioElement} autoPlay playsInline />
	)
}

export default CallComponent
