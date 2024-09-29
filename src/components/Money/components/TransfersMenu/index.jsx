import { useEffect, useState } from 'react'
import './style.css'
import { useTransfer } from '../../../../hooks/'
import See from '../../../Friends/components/See'
import Confirmation from '../../../Confirmation'

const TransfersMenu = () => {
	const [amount, setAmount] = useState(0)
	const [friend, setFriend] = useState({})
	const [message, setMessage] = useState('')
	const [open, setOpen] = useState(false)
	const [confirmed, setConfirmed] = useState(false)
	const { transfer } = useTransfer()

	const handleSubmit = (e) => {
		e.preventDefault()
		setMessage(`Do you really want to transfer ${amount} to ${friend.username}?`)
		if (amount > 0 && friend?.id) {
			setOpen(true)
		}
	}

	useEffect(() => {
		if (confirmed && friend?.id && amount !== 0) {
			transfer(friend.id, amount)
			setConfirmed(false)
			setAmount(0)
			setFriend({})
		}
	}, [confirmed])

	return (
		<div className='transfers-wrapper'>
			<span>transfers</span>
			<form onSubmit={(e) => handleSubmit(e)} className='transfers-form'>
				<input
					type="number"
					className='field shadowed'
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					min='0'
				/>
				<button
					type='submit'
					className='no-btn blue cartoon-short-txt c-pointer'
				>Transfer</button>
			</form>
			<span className='link'>Friend to send the money : {friend.username ? friend.username : 'none'}</span>
			<See enableDetails={false} friend={friend} setFriend={setFriend} />
			<Confirmation
				message={message}
				confirmed={confirmed}
				setConfirmed={setConfirmed}
				open={open}
				setOpen={setOpen}
			/>
		</div>
	)
}

export default TransfersMenu
