import './style.css'
import Back from '@components/Back'
import Background from '@components/Background'
import { OverviewBank } from '@features/bank'

const BankOverview = () => {
	return (
		<main className='bg-bank-red bg center-children'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<Background theme='red' img='dollarSign' />
			<OverviewBank />
		</main>
	)
}

export default BankOverview
