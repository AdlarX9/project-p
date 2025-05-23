import './style.css'
import { LoansComponent } from '@features/bank'
import Back from '@components/Back'
import Background from '@components/Background'

const Loans = () => {
	return (
		<main className='bg-bank-red bg center-children'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<Background theme='red' img='dollarSign' />
			<LoansComponent />
		</main>
	)
}

export default Loans
