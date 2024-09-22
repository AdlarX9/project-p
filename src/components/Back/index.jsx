import './style.css'

import back from '../../assets/back.png'
import { Link } from 'react-router-dom'

const Back = () => {

	return (
		<Link className='back-btn int-btn' to='/'>
            <img src={back} alt='back' draggable='false' />
        </Link>
	)
}

export default Back
