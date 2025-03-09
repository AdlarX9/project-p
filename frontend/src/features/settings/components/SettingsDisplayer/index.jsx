import './style.css'
import SettingElement from '../SettingElement'

const SettingsDisplayer = () => {
	return (
		<div className='setting-element-wrapper'>
			{settings.map(element => {
				return <SettingElement key={element.title} {...element} />
			})}
		</div>
	)
}

const settings = [
	{
		action: (dispatch, changeSetting, settingsState) => {
			dispatch(
				changeSetting({
					key: 'communicationPreference',
					value: settingsState.communicationPreference === 'text' ? 'call' : 'text'
				})
			)
		},
		title: 'Communication preference',
		type: 'toggle',
		value: settingsState => {
			return settingsState.communicationPrefer
		}
	}
]

export default SettingsDisplayer
