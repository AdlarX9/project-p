import { useGetPercentage } from '@features/bank'
import { TransfersMenu } from '@features/bank'
import Back from '../../components/Back'
import Loader from '../../components/Loader'
import './style.css'

const TransfersPage = () => {
	const { percentage } = useGetPercentage()

	return (
		<section className='transfers-main-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<div className='transfers-menu-wrapper'>
				<TransfersMenu />
			</div>
			<div className='percentage cartoon2-txt white'>
				{percentage?.percentage ? (
					`you have more money than ${percentage?.percentage}% of the players!`
				) : (
					<Loader />
				)}
			</div>
		</section>
	)
}

export default TransfersPage
