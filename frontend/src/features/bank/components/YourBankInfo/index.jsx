import './style.css'
import { useEffect, useRef, useState } from 'react'
import PopUp from '@components/PopUp'
import { confirm } from '@components/Confirmation'
import { useBankMoneyIn, useChangeBankDescription, useChangeBankName } from '../../hooks'

const YourBankInfo = ({ currentBank }) => {
	const [createdAt, setCreatedAt] = useState('')
	useEffect(() => {
		const date = new Date(currentBank.created_at)
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
		setCreatedAt(date.toLocaleString('en-US', options))
	}, [currentBank])

	const [openId, setOpenId] = useState(false)

	const [openMoney, setOpenMoney] = useState(false)
	const moneyRef = useRef()
	const { bankMoneyIn } = useBankMoneyIn()

	const handleSubmitMoney = e => {
		e.preventDefault()
		const amount = moneyRef.current.value
		if (amount) {
			bankMoneyIn(currentBank.id, amount).then(res => {
				if (res?.status === 'success') {
					moneyRef.current.value = ''
					setOpenMoney(false)
				}
			})
		}
	}

	const [openDescription, setOpenDescription] = useState(false)
	const descriptionRef = useRef()
	const { changeBankDescription } = useChangeBankDescription()

	const handleSubmitDescription = e => {
		e.preventDefault()
		const newDescription = descriptionRef.current.value
		changeBankDescription(currentBank.id, newDescription).then(res => {
			if (res?.status === 'success') {
				descriptionRef.current.value = newDescription
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
			<ul>
				<li className='bank-panel-li c-pointer'>
					<button
						className='no-btn cartoon2-txt panel-li-btn c-pointer'
						onClick={() => setOpenId(true)}
					>
						Id: {currentBank.id}
					</button>
				</li>
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
			<PopUp className='bg-gray' open={openId} setOpen={setOpenId}>
				<p className='white cartoon2-txt'>Created At: {createdAt}</p>
			</PopUp>
			<PopUp className='bg-gray max-80' open={openMoney} setOpen={setOpenMoney}>
				<center>
					<h1 className='title-txt m-20'>Transfer Money</h1>
				</center>
				<form onSubmit={handleSubmitMoney}>
					<label htmlFor='amount' className='white'>
						Amount
					</label>
					<input
						type='number'
						className='field shadowed-simple'
						defaultValue={0}
						ref={moneyRef}
					/>
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
			<PopUp className='bg-red max-80' open={openDescription} setOpen={setOpenDescription}>
				<h1 className='title-txt m-20'>Edit Description</h1>
				<form onSubmit={handleSubmitDescription}>
					<label htmlFor='name'>New Description</label>
					<textarea
						className='field shadowed-simple'
						placeholder='This bank...'
						rows={5}
						defaultValue={currentBank?.description}
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

export default YourBankInfo
