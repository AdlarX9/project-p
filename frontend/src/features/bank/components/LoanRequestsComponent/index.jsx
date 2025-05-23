import './style.css'
import { useEffect } from 'react'
import { useFindBank } from '../../hooks'

const LoanRequestsComponent = () => {
	const currentBank = useFindBank()

	useEffect(() => {
		console.log(currentBank?.loan_requests)
	}, [currentBank])

	return <h1 className='title-txt m-20'>Loan Requests</h1>
}

export default LoanRequestsComponent
