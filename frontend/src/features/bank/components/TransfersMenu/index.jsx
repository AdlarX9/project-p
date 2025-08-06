import './style.css'
import { useState } from 'react'
import { useTransfer } from '@features/bank'
import { SeeFriends } from '@features/friends'
import { confirm } from '@components/Confirmation'
import { motion } from 'framer-motion'

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
			<motion.span
				variants={basicVariants}
				initial='hidden'
				animate='visible'
				className='title-txt transfers-title'
			>
				transfers
			</motion.span>
			<motion.form
				variants={basicVariants}
				initial='hidden'
				animate='visible'
				onSubmit={e => handleSubmit(e)}
				className='transfers-form'
			>
				<motion.input
					type='number'
					className='field shadowed transfers-field'
					value={amount}
					onChange={e => setAmount(e.target.value)}
					min='0'
					style={{ fontSize: '3rem' }}
				/>
				<button type='submit' className='no-btn blue cartoon-short-txt c-pointer'>
					Transfer
				</button>
			</motion.form>
			<span className='link cartoon2-txt c-auto'>
				Friend to send the money : {friend.username ? friend.username : 'none'}
			</span>
			<div className='transfers-friends-wrapper'>
				<SeeFriends
					enableDetails={false}
					friend={friend}
					showLastMessage={false}
					setFriend={newFriend =>
						setFriend(friend => (friend?.id == newFriend.id ? {} : newFriend))
					}
				/>
			</div>
		</div>
	)
}

const basicVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 }
}

export default TransfersMenu
