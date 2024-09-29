import { useSelector } from 'react-redux'
import './style.css'
import { getUser } from '../../app/selectors'
import money from '../../assets/money.png'
import { useEffect, useState } from 'react'
import PopUp from '../PopUp/'
import Loader from '../Loader/'
import TransfersMenu from './components/TransfersMenu/'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const Money = () => {
	const user = useSelector(getUser)
	const [open, setOpen] = useState(false)

	const { isPending, data, refetch } = useQuery({
		queryKey: ['getThePercentage'],
		queryFn: async () => {
			return axios.get(process.env.REACT_APP_URL + '/api/user/percentage', {
				headers: {
					Authorization: user.token,
				}
			}).then(response => response.data)
			.catch(error => error.message)
		},
		retry: 0,
		enabled: !!user
	})

	useEffect(() => {
		refetch()
	}, [user.money])

	return (
		<>
			<button className='money c-pointer' onClick={() => setOpen(true)}>
				<img src={money} alt='money' draggable='false' />
				<span className='cartoon-txt'>{user.money}</span>
			</button>
			<PopUp className='cartoon2-txt popup-profile' open={open} setOpen={setOpen} >
				{ isPending ? <Loader /> :
					`${user.money} : C'est plus que ${Math.round(data.percentage * 100) / 100}% des gens !`
				}
				<TransfersMenu />
			</PopUp>
		</>
	)
}

export default Money
