import './style.css'
import { motion } from 'framer-motion'
import Back from '../../components/Back'
import SettingElement from './components/SettingElement'

const Settings = () => {
	return (
		<section className='settings-wrapper'>
			<div className='settings-back'>
				<Back />
			</div>
			<motion.h1
				initial={{ opacity: 0, x: '-100%' }}
				animate={{ opacity: 1, x: '0%' }}
				className='cartoon-txt'
			>
				Settings
			</motion.h1>
			<div className='setting-element-wrapper'>
				{settings.map(element => {
					return <SettingElement key={element.title} {...element} />
				})}
			</div>
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
