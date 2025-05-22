import { useSelector } from 'react-redux'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getBank } from '@redux/selectors'
import { useEffect, useRef, useState } from 'react'
import { useChangeBankDescription, useChangeBankName, useLoadBankData } from '../../hooks'
import Loader from '@components/Loader'
import PopUp from '@components/PopUp'
import { confirm } from '@components/Confirmation'
import { motion, AnimatePresence } from 'framer-motion'

const ManagePanel = () => {
	useLoadBankData()
	const { id } = useParams()
	const bankState = useSelector(getBank)
	const navigate = useNavigate()

	const [currentBank, setCurrentBank] = useState()
	useEffect(() => {
		if (bankState?.banks) {
			const bankFound = bankState.banks.find(bank => bank.id == id)
			console.log(bankFound)
			if (bankFound) {
				setCurrentBank(bankFound)
			} else {
				navigate('/bank/banks')
			}
		}
	}, [bankState])

	const [openMoney, setOpenMoney] = useState(false)
	const moneyRef = useRef()

	const [openDescription, setOpenDescription] = useState(false)
	const descriptionRef = useRef()
	const { changeBankDescription } = useChangeBankDescription()

	const handleSubmitDescription = e => {
		e.preventDefault()
		const newDescription = descriptionRef.current.value
		changeBankDescription(currentBank.id, newDescription).then(res => {
			if (res?.status === 'success') {
				descriptionRef.current.value = ''
				setOpenDescription(false)
			} else {
				alert('Error: ' + res?.message)
			}
		})
	}

	const [openName, setOpenName] = useState(false)
	const nameRef = useRef()
	const { changeBankName } = useChangeBankName()

	const handleSubmitName = e => {
		e.preventDefault()
		const newName = nameRef.current.value
		if (newName) {
			confirm({ message: 'Are you sure you want to change your bank name?' }).then(res => {
				if (res) {
					changeBankName(currentBank.id, newName).then(res => {
						if (res?.status === 'success') {
							nameRef.current.value = ''
							setOpenName(false)
						} else {
							alert('Error: ' + res?.message)
						}
					})
				}
			})
		}
	}

	return (
		<>
			<main className='bank-panel'>
				<AnimatePresence>
					<motion.h1
						className='title-txt m-20'
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
						layout
						key='1'
					>
						Management Panel
					</motion.h1>
					{currentBank ? (
						<>
							<motion.section
								variants={sectionVariants}
								initial='hidden'
								animate='visible'
								exit='hidden'
								layout
								key='2'
								className='see-your-bank-panel p-20 br-20 shadowed cartoon2-txt bg-blue'
							>
								<ul>
									<li>Id: {currentBank.id}</li>
									<li className='bank-panel-li c-pointer'>
										<button
											className='no-btn cartoon2-txt panel-li-btn c-pointer'
											onClick={() => setOpenMoney(true)}
										>
											Money: {currentBank.money}
										</button>
									</li>
									<li className='bank-panel-li c-pointer'>
										<button
											className='no-btn cartoon2-txt panel-li-btn c-pointer'
											onClick={() => setOpenName(true)}
										>
											Name: {currentBank.name}
										</button>
									</li>
									<li className='bank-panel-li'>
										<button
											className='no-btn cartoon2-txt panel-li-btn c-pointer'
											onClick={() => setOpenDescription(true)}
										>
											Description: {currentBank.description}
										</button>
									</li>
								</ul>
							</motion.section>
							<motion.section
								variants={sectionVariants}
								initial='hidden'
								animate='visible'
								exit='hidden'
								layout
								key='3'
								className='bank-panel-loans p-20 br-20 shadowed cartoon2-txt bg-green'
							>
								Loans
							</motion.section>
							<motion.section
								variants={sectionVariants}
								initial='hidden'
								animate='visible'
								exit='hidden'
								layout
								key='4'
								className='bank-panel-loan-requests p-20 br-20 shadowed cartoon2-txt bg-yellow'
							>
								Loan Requests
							</motion.section>
						</>
					) : (
						<Loader />
					)}
				</AnimatePresence>
			</main>
			<PopUp className='bg-gray max-80' open={openMoney} setOpen={setOpenMoney}>
				<center>
					<h1 className='title-txt m-20'>Transfer Money</h1>
				</center>
				<form>
					<label htmlFor='amount' className='white'>
						Amount
					</label>
					<input type='number' className='field shadowed-simple' defaultValue={0} />
					<center>
						<button className='flat-btn bg-blue cartoon2-txt'>Submit</button>
					</center>
					<p className='ui-txt normal-case tac white'>
						A negative amount will transfer money from your bank to your personal
						account.
					</p>
				</form>
			</PopUp>
			<PopUp className='bg-blue' open={openName} setOpen={setOpenName}>
				<center>
					<h1 className='title-txt m-20'>Change Name</h1>
				</center>
				<form onSubmit={handleSubmitName}>
					<label htmlFor='name'>New Name</label>
					<input
						type='text'
						className='field shadowed-simple'
						placeholder='SweetBank...'
						ref={nameRef}
					/>
					<center>
						<button type='submit' className='flat-btn cartoon2-txt'>
							Submit
						</button>
					</center>
				</form>
			</PopUp>
			<PopUp className='bg-red' open={openDescription} setOpen={setOpenDescription}>
				<h1 className='title-txt m-20'>Change Description</h1>
				<form onSubmit={handleSubmitDescription}>
					<label htmlFor='name'>New Description</label>
					<input
						type='text'
						className='field shadowed-simple'
						placeholder='This bank...'
						ref={descriptionRef}
					/>
					<center>
						<button type='submit' className='flat-btn cartoon2-txt bg-blue'>
							Submit
						</button>
					</center>
				</form>
			</PopUp>
		</>
	)
}

const sectionVariants = {
	hidden: {
		opacity: 0,
		y: -20
	},
	visible: {
		opacity: 1,
		y: 0
	}
}

export default ManagePanel
