import './style.css'
import PopUp from '../PopUp/'

const Confirmation = ({ message, confirmed, setConfirmed, open, setOpen }) => {

	const handleCancel = () => {
        setConfirmed(false)
        setOpen(false)
    }

	const handleConfirm = () => {
        setConfirmed(true)
        setOpen(false)
    }

	return (
		<PopUp open={open} setOpen={setOpen} className='popup-confirmation cartoon-short-txt popup-profile'>
			{message}
			<div className='confirmation-buttons'>
				<button onClick={handleCancel} className='int-btn p-20 bg-blue'>Cancel</button>
				<button onClick={handleConfirm} className='int-btn skewed p-20 bg-red'>
					<span>Confirm</span>
				</button>
			</div>
		</PopUp>
	)
}

export default Confirmation