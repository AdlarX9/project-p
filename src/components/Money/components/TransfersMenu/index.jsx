import { useEffect, useState } from 'react'
import './style.css'
import { useTransfer } from '../../../../hooks/'
import See from '../../../Friends/components/See'
import { confirm } from '../../../Confirmation'

const TransfersMenu = () => {
	const [amount, setAmount] = useState(0)
	const [friend, setFriend] = useState({})
	const { transfer } = useTransfer()

	const handleSubmit = e => {
		e.preventDefault()
		if (amount > 0 && friend?.id) {
			confirm({
				message: `Do you really want to transfer ${amount} to ${friend.username}?`
			}).then(result => {
				if (result) {
					transfer(friend, amount)
				}
				setAmount(0)
				setFriend({})
			})
		}
	}

	return (
		<div className='transfers-wrapper'>
			<span>transfers</span>
			<form onSubmit={e => handleSubmit(e)} className='transfers-form'>
				<input
					type='number'
					className='field shadowed'
					value={amount}
					onChange={e => setAmount(e.target.value)}
					min='0'
				/>
				<button type='submit' className='no-btn blue cartoon-short-txt c-pointer'>
					Transfer
				</button>
			</form>
			<span className='link c-auto'>
				Friend to send the money : {friend.username ? friend.username : 'none'}
			</span>
			<See enableDetails={false} friend={friend} setFriend={setFriend} />
		</div>
	)
}

export default TransfersMenu
