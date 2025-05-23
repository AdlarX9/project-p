import './style.css'
import { LoanRequestsComponent } from '@features/bank'
import Back from '@components/Back'
import Background from '@components/Background'

const LoanRequests = () => {
	return (
		<main className='bg-bank-red bg center-children'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<Background theme='red' img='dollarSign' />
			<LoanRequestsComponent />
		</main>
	)
}

export default LoanRequests
