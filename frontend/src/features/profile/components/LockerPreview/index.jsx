import { useSelector } from 'react-redux'
import './style.css'
import { ItemButton } from '@features/shop'
import { getLocker } from '@redux/selectors'
import PopUp from '@components/PopUp'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Colors from '../Colors/'

const LockerPreview = () => {
	const locker = useSelector(getLocker)
	const [open, setOpen] = useState(false)

	const color = {
		content: locker?.color ?? 'cd2fac',
		rarity: locker?.colors?.find(c => c.color === locker?.color)?.rarity ?? 1,
		type: 'color'
	}

	return (
		<div className='shadowed bg-red br-20 p-20 cartoon-txt locker-preview-wrapper'>
			<p className='title-txt m-0 p-20'>Locker</p>
			<motion.button
				className='c-pointer no-btn'
				onClick={() => setOpen(true)}
				animate={{ scale: 1 }}
				whileHover={{ scale: 1.05 }}
			>
				<ItemButton item={color} nonInteractive />
			</motion.button>
			<PopUp className='popup-profile' open={open} setOpen={setOpen}>
				<Colors />
			</PopUp>
		</div>
	)
}

export default LockerPreview
