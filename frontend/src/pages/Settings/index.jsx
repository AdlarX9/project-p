import './style.css'
import { motion } from 'framer-motion'
import Back from '@components/Back'
import { SettingsDisplayer } from '@features/settings'

const Settings = () => {
	return (
		<section className='settings-wrapper'>
			<div className='settings-back'>
				<Back />
			</div>
			<motion.h1
				initial={{ opacity: 0, x: '-100%' }}
				animate={{ opacity: 1, x: '0%' }}
				className='title-txt m-20 p-20'
			>
				Settings
			</motion.h1>
			<SettingsDisplayer />
		</section>
	)
}

const settings = [
	{
		action: (dispatch, changeSetting, settingsState) => {
			dispatch(
				changeSetting({
					key: 'communicationPrefer',
					value: settingsState.communicationPrefer === 'text' ? 'call' : 'text'
				})
			)
		},
		title: 'Communication preference',
		type: 'click',
		value: settingsState => {
			return settingsState.communicationPrefer
		}
	}
]

export default Settings
