import { useEffect } from 'react'
import './style.css'
import { useGetABank } from '@features/bank'
import { useParams } from 'react-router-dom'

const OverviewBank = () => {
	const { getABank, bank } = useGetABank()
	const { id } = useParams()

	useEffect(() => {
		console.log(bank)
	}, [bank])

	return (
		<main className='overview-bank-wrapper'>
			<h1 className='title-txt'>Overview Bank</h1>
		</main>
	)
}

export default OverviewBank
