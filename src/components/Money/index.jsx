import { useSelector } from 'react-redux'
import './style.css'
import { getUser } from '../../app/selectors'
import money from '../../assets/money.png'

const Money = () => {
	const user = useSelector(getUser)
	return (
		<button className='money'>
			<img src={money} alt='money'  draggable='false' />
			<span className='cartoon-txt'>{user.money}</span>
		</button>
	)
}

export default Money
