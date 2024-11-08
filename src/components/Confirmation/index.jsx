import './style.css'
import PopUp from '../PopUp/'
import { useRef, useState } from 'react'

const confirmAction = {
	current: () => Promise.resolve(true)
}

export function confirm(props) {
	return confirmAction.current(props)
}

const Confirmation = () => {
	const [open, setOpen] = useState(false)
	const [props, setProps] = useState({})
	const resolveRef = useRef(null)

	confirmAction.current = props =>
		new Promise(resolve => {
			setProps(props)
			setOpen(true)
			resolveRef.current = resolve
		})

	const handleCancel = () => {
		if (resolveRef.current) {
			resolveRef.current(false)
		}
		setOpen(false)
	}

	const handleConfirm = () => {
		if (resolveRef.current) {
			resolveRef.current(true)
		}
		setOpen(false)
	}

	return (
		<PopUp
			open={open}
			setOpen={setOpen}
			className='popup-confirmation cartoon-short-txt popup-profile'
		>
			<div>{props.message}</div>{' '}
			<div className='confirmation-buttons'>
				<button onClick={handleCancel} className='int-btn p-20 bg-blue'>
					Cancel
				</button>
				<button onClick={handleConfirm} className='int-btn skewed p-20 bg-red'>
					<span>Confirm</span>
				</button>
			</div>
		</PopUp>
	)
}

export default Confirmation
