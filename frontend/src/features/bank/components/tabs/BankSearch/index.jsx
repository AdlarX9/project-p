import './style.css'
import Search from '@assets/loupe.png'
import Bank from '@assets/bank.png'
import { useSearchForBanks } from '@features/bank'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MotionLink = motion.create(Link)

const BankSearch = () => {
	const { searchForBanks, banks } = useSearchForBanks()

	const handleSearch = event => {
		event.preventDefault()
		const searchValue = event.target[0].value
		if (searchValue) {
			searchForBanks(searchValue)
		}
	}

	return (
		<section className='bank-search-wrapper'>
			<motion.form className='bank-search-bar' onSubmit={handleSearch}>
				<input
					type='text'
					className='shadowed bg-blue p-20 br-20 cartoon2-txt'
					placeholder='Search...'
				/>
				<button className='no-btn c-pointer' type='submit'>
					<img src={Search} alt='loupe' draggable={false} />
				</button>
			</motion.form>
			{banks?.length > 0 ? (
				<motion.div
					className='bank-search-results scrollable'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.2 }}
				>
					{banks.map(bank => (
						<MotionLink
							key={bank.id}
							className='no-link bank-search-result m-20 p-20 shadowed cartoon-short-txt br-20 bg-green'
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							to={`/focus-bank/${bank.id}/overview`}
						>
							<img src={Bank} alt='bank' draggable={false} />
							{bank.name}
						</MotionLink>
					))}
				</motion.div>
			) : (
				<p className='m-20 cartoon2-txt white'>
					{banks === null ? '' : 'No matches found...'}
				</p>
			)}
		</section>
	)
}

export default BankSearch
