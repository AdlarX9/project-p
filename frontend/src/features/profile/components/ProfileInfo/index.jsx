import { useSelector } from 'react-redux'
import './style.css'
import { getProfile } from '@redux/selectors'
import Link from '@assets/link.png'
import Edit from '@assets/edit.png'
import Bin from '@assets/bin.png'
import { useSetGenderEmail, useSetLinks } from '../../hooks'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PopUp from '@components/PopUp'

const SocialLink = ({ index, link }) => {
	const profile = useSelector(getProfile)
	const { setLinks } = useSetLinks()
	const aRef = useRef(null)
	const formRef = useRef(null)

	const switchMode = () => {
		if (formRef.current.style.display === 'block') {
			aRef.current.style.display = 'block'
			formRef.current.style.display = 'none'
		} else {
			aRef.current.style.display = 'none'
			formRef.current.style.display = 'block'
		}
	}

	const editLink = (idx, e) => {
		e.preventDefault()
		const newLinks = [...profile.links]
		newLinks[idx] = e.target.querySelector('input').value
		setLinks(newLinks)
		switchMode()
	}

	const deleteLink = idx => {
		const newLinks = [...profile.links]
		newLinks.splice(idx, 1)
		setLinks(newLinks)
	}

	return (
		<li>
			<img src={Link} alt='link' className='profile-link-img' />
			<a className='cartoon2-txt profile-link-link dotted-txt' href={link} ref={aRef}>
				{link}
			</a>
			<form onSubmit={e => editLink(index, e)} ref={formRef} style={{ display: 'none' }}>
				<input
					className='cartoon2-txt profile-link-input p-0'
					defaultValue={link}
					style={{ width: '92%' }}
				/>
			</form>
			<button className='no-btn profile-edit-img c-pointer' onClick={switchMode}>
				<img src={Edit} alt='edit' />
			</button>
			<button
				className='no-btn profile-edit-img profile-delete-img c-pointer'
				onClick={() => deleteLink(index)}
			>
				<img src={Bin} alt='bin' />
			</button>
		</li>
	)
}

const ProfileInfo = () => {
	const profile = useSelector(getProfile)
	const { setLinks } = useSetLinks()
	const [open, setOpen] = useState(false)
	const { setGenderEmail } = useSetGenderEmail()

	const addLink = e => {
		e.preventDefault()
		const link = e.target.querySelector('input').value
		e.target.querySelector('input').value = 'https://'
		const newLinks = [...profile.links, link]
		setLinks(newLinks)
	}

	const handleSubmit = e => {
		e.preventDefault()
		const gender = e.target.querySelector('select').value
		const email = e.target.querySelector('input[type="email"]').value
		setGenderEmail(gender, email)
		setOpen(false)
	}

	return (
		<>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='shadowed p-20 br-20 bg-yellow cartoon-short-txt'
			>
				<h1 className='m-20 title-txt'>Profile Info</h1>
				<motion.button
					className='no-btn profile-gender-email cartoon-short-txt br-20 c-pointer'
					whileHover={{ border: '0.3rem solid red' }}
					animate={{ border: '0.3rem solid transparent' }}
					onClick={() => setOpen(true)}
				>
					<div>
						gender: <span className='cartoon2-txt'>{profile?.gender}</span>
					</div>
					<div>
						email:{' '}
						<span className='cartoon2-txt'>
							{profile?.email ? profile.email : 'Undefined'}
						</span>
					</div>
				</motion.button>
				<div>
					links:
					<br />
					<ul className='profile-links cartoon2-txt'>
						{profile?.links?.map((link, index) => (
							<SocialLink key={index} index={index} link={link} />
						))}
						<li>
							<img src={Link} alt='link' className='profile-link-img' />
							<form onSubmit={addLink}>
								<input
									className='cartoon2-txt profile-link-input p-0'
									defaultValue='https://'
								/>
							</form>
						</li>
					</ul>
				</div>
			</motion.section>
			<PopUp open={open} setOpen={setOpen} className='bg-red cartoon-short-txt'>
				<h1 className='title-txt p-20 m-0'>Edit Info</h1>
				<br />
				<form onSubmit={handleSubmit}>
					<div>
						gender:{' '}
						<select className='cartoon2-txt bg-green br-10'>
							<option value='Man'>Man</option>
							<option value='Woman'>Woman</option>
							<option value='Croissant'>Croissant</option>
						</select>
					</div>
					<br />
					<div>
						email:{' '}
						<input
							type='email'
							defaultValue={profile?.email ? profile?.email : ''}
							placeholder='example@example.com'
							className='cartoon2-txt profile-link-input bg-green'
						/>
					</div>
					<br />
					<br />
					<center>
						<motion.button
							type='submit'
							className='int-btn p-20 skewed bg-blue'
							animate={{ scale: 1, skewX: '-10deg' }}
							whileHover={{ scale: 1.05 }}
						>
							<span>Submit</span>
						</motion.button>
					</center>
				</form>
			</PopUp>
		</>
	)
}

export default ProfileInfo
