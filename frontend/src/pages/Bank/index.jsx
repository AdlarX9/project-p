import { useGetPercentage } from '@features/bank'
import { NavBar } from '@features/bank'
import Back from '../../components/Back'
import './style.css'
import Background from '../../components/Background'
import { useLocation } from 'react-router-dom'
import { BankGeneral, Loans, BanksManagement, BankSearch } from '@features/bank'

const Bank = () => {
	const location = useLocation()
	const pathname = location.pathname
	const currentTab = pathname.split('/')[2]

	return (
		<section className='bank-wrapper'>
			<Background bank />
			<div className='back-wrapper'>
				<Back to='/' />
			</div>
			<NavBar />
			{currentTab === 'general' && <BankGeneral />}
			{currentTab === 'loans' && <Loans />}
			{currentTab === 'banks' && <BanksManagement />}
			{currentTab === 'search' && <BankSearch />}
		</section>
	)
}

export default Bank
