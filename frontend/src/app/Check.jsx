import { useEffect } from 'react'
import { useLogged, useRenewToken } from '@features/user'

const Check = () => {
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
