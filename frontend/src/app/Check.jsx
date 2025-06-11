import { useEffect } from 'react'
import { useLogged, useRenewToken } from '@features/authentication'
import { useGetProfile } from '@features/profile'

const Check = () => {
	useGetProfile()
	const { isLogged } = useLogged()
	const { renewToken } = useRenewToken()

	useEffect(() => {
		if (!isLogged) {
			renewToken()
		}
	}, [isLogged])

	return <p className='check-paragraph'>Project P — Beta version — Copyright (c) 2025 AdlarX9</p>
}

export default Check
