import './style.css'
import stars from '@assets/background-pattern.png'
import grayStars from '@assets/background-gray-pattern.png'
import dollarSign from '@assets/background-bank-pattern.png'
import items from '@assets/background-shop-pattern.png'
import { useHomeContext } from '@contexts/HomeContext'

const Background = ({ theme = 'blue', img = 'stars' }) => {
	const { bgInitialOffset } = useHomeContext()

	return (
		<div className='background-supervisor'>
			<div className={`background-wrapper theme-${theme}`}>
				<div
					className='background-stars'
					style={{
						backgroundImage: `url(${imgs[img]})`,
						'--initial-offset': `${bgInitialOffset.current}rem`
					}}
				></div>
				<div className='background-gradient'></div>
			</div>
		</div>
	)
}

const imgs = {
	stars: stars,
	dollarSign: dollarSign,
	grayStars: grayStars,
	items: items
}

export default Background
