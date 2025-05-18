import './style.css'
import Back from '@components/Back'
import Background from '@components/Background'
import { CreateBank } from '@features/bank'

const BankCreate = () => {
	return (
		<main className='bg-bank-red bg center-children'>
			<div className='back-wrapper'>
				<Back />
			</div>
			<Background theme='red' img='dollarSign' />
			<CreateBank />
		</main>
	)
}

export default BankCreate
