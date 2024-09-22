import './style.css'
import cancel from '../../assets/cancel.png'

const PopUp = ({ children, open, setOpen, className }) => {
	const closePopUp = () => setOpen(false)

	if (!open) return null

	return (
		<section className='popup-background'>
			<div className={['cartoon-txt shadowed popup', className].join(' ')}>
				{children}
				<button className='shadowed-simple popup-cancel' onClick={closePopUp}>
					<img src={cancel} alt='close' draggable='false' />
				</button>
			</div>
		</section>
	)
}

export default PopUp
