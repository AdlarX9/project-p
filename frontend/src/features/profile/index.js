import Avatar from './components/Avatar'
import ProfilePopup from './components/ProfilePopup'
import ProfileButton from './components/ProfileButton'
import LockerPreview from './components/LockerPreview'

export { ProfilePopup, ProfileButton, Avatar, LockerPreview }
export * from './hooks'
export * from './slice'
export { default as profileReducer } from './slice'

export const switchColorContent = s => {
	const color = [
		parseInt(s.slice(0, 2), 16),
		parseInt(s.slice(2, 4), 16),
		parseInt(s.slice(4, 6), 16)
	]
	return color
}
