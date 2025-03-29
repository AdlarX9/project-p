import { useSelector } from 'react-redux'
import './style.css'
import { ItemButton } from '@features/shop'
import { getLocker } from '@redux/selectors'

const LockerPreview = () => {
	const locker = useSelector(getLocker)

	const color = {
		content: locker?.color ?? 'cd2fac',
		rarity: locker?.colors?.find(c => c.color === locker?.color)?.rarity ?? 1,
		type: 'color'
	}

	return (
		<div className='shadowed bg-red br-20 p-20 cartoon-txt locker-preview-wrapper'>
			<p className='title-txt m-0 p-20'>Locker</p>
			<ItemButton item={color} to='/pute' />
		</div>
	)
}

export default LockerPreview
