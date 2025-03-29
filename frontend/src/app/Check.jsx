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

	return null
}

export default Check
