import './style.css'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const FriendButton = forwardRef(({ onClick, friend }, ref) => {
	return (
		<motion.button
			variants={friendVariants}
			initial='hidden'
			whileInView='visible'
			exit='exit'
			className='friend-fetched shadowed c-pointer no-btn'
			onClick={() => onClick(friend)}
			layout
			ref={ref}
			style={{ backgroundColor: 'var(--blue)' }}
		>
			<span className='cartoon-short-txt'>{friend.username}</span>
			<span className='cartoon2-txt'>{friend.money}</span>
		</motion.button>
	)
})

const friendVariants = {
	hidden: {
		scaleX: 0,
		scaleY: 0.5
	},
	visible: {
		scaleX: 1,
		scaleY: 1
	},
	exit: {
		x: '100%',
		scale: 0,
		opacity: 0
	}
}

FriendButton.displayName = 'FriendButton'

export default FriendButton
