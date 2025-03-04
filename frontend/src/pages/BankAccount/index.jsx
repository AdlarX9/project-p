import { useGetPercentage } from '../../hooks/bankHooks'
import TransfersMenu from './components/TransfersMenu'
import Back from '../../components/Back'
import './style.css'

const BankAccount = () => {
	const { percentage } = useGetPercentage()

	return (
		<section className='bank-wrapper'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<div className='transfers-menu-wrapper'>
				<TransfersMenu />
			</div>
		</section>
	)
}

export default BankAccount
