import './style.css'
import { useSelector } from 'react-redux'
import { getLocker } from '@redux/selectors'
import { ItemButton } from '@features/shop'
import { useSetColor } from '@features/profile'

const Colors = () => {
	const locker = useSelector(getLocker)
	const { setColor } = useSetColor()

	const handleClick = color => {
		setColor(color.content)
	}

	return (
		<section className='locker-colors-wrapper'>
			<h2 className='m-0'>Colors</h2>
			<div className='colors-displayer'>
				{locker?.colors?.map((color, idx) => (
					<button
						key={idx}
						className='no-btn c-pointer'
						onClick={() => handleClick(color)}
					>
						<ItemButton item={color} nonInteractive bordered />
					</button>
				))}
				{locker?.colors?.length === 0 && 'Locker empty'}
			</div>
		</section>
	)
}

export default Colors
