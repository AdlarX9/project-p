import './style.css'
import cancel from '../../assets/cancel.png'
import { useState } from 'react'

const PopUp = ({ children, open, setOpen, className }) => {
	const [closingPopup, setClosingPopup] = useState('')
	const [closingBg, setClosingBg] = useState('')

	const closePopUp = () => {
		setClosingPopup(className + '-closing')
		setClosingBg('popup-bg-closing')

		setTimeout(() => {
			setOpen(false)
			setClosingPopup('')
			setClosingBg('')
		}, 100)
	}

	if (!open) return null

	return (
		<section className={'popup-background ' + closingBg}>
			<div
				className={['cartoon-txt shadowed popup', className, closingPopup].join(
					' '
				)}
			>
				{children}
				<button className='shadowed-simple popup-cancel' onClick={closePopUp}>
					<img src={cancel} alt='close' draggable='false' />
				</button>
			</div>
		</section>
	)
}

export default PopUp
