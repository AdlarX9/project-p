import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { getSettings } from '@redux/selectors'
import { changeSetting } from '@features/settings'

const SettingElement = ({ action, title, type, value }) => {
	const dispatch = useDispatch()
	const settingsState = useSelector(getSettings)

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			className='shadowed bg-green p-20 br-20 setting-element'
		>
			<div className='cartoon2-txt'>{title}</div>
			<button
				className='no-btn cartoon-short-txt c-pointer'
				onClick={() => action(dispatch, changeSetting, settingsState)}
			>
				{value(settingsState)}
			</button>
		</motion.div>
	)
}

export default SettingElement
