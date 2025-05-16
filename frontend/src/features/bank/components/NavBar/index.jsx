import './style.css'
import { Link, useLocation } from 'react-router-dom'
import { useLoadBankData } from '@features/bank'

const NavBar = () => {
	const location = useLocation()
	const pathname = location.pathname
	const currentTab = pathname.split('/')[2]
	useLoadBankData()

	return (
		<div className='bank-navbar'>
			{tabs.map((tab, index) => {
				return (
					<Link
						className={`tab cartoon2-txt c-pointer no-link white skewed ${tab.to === `/${currentTab}` && 'selected-tab'}`}
						key={index}
						to={`/bank${tab.to}`}
					>
						<span>{tab.name}</span>
					</Link>
				)
			})}
		</div>
	)
}

const tabs = [
	{
		name: 'General',
		to: '/general'
	},
	{
		name: 'Loans',
		to: '/loans'
	},
	{
		name: 'Banks',
		to: '/banks'
	},
	{
		name: 'Search',
		to: '/search'
	}
]

export default NavBar
