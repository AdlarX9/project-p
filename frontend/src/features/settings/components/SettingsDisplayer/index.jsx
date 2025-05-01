import './style.css'
import SettingElement from '../SettingElement'
import { useGetSettings, logSettings } from '@features/settings'
import { useDispatch } from 'react-redux'
import Loader from '@components/Loader'
import { useEffect } from 'react'

const SettingsDisplayer = () => {
	const { isLoading, isError, error } = useGetSettings()

	return (
		<div className='setting-element-wrapper'>
			{isLoading ? (
				<div className='settings-loader-wrapper'>
					<Loader />
				</div>
			) : isError ? (
				error
			) : (
				settings.map(element => {
					return <SettingElement key={element.title} {...element} />
				})
			)}
		</div>
	)
}

const settings = [
	{
		action: (changeSetting, settingsState) => {
			changeSetting({
				param: 'communicationPreference',
				value: settingsState.communicationPreference === 'call' ? 'text' : 'call'
			})
		},
		title: 'Communication preference',
		type: 'toggle',
		value: settingsState => {
			return settingsState.communicationPreference || 'text'
		}
	}
]

export default SettingsDisplayer
