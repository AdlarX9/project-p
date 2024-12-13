export const getState = state => state

export const getUser = state => getState(state).user || {}

export const getToken = state => getUser(state)?.token || ''

export const getFriends = state => state.friends || []

export const getNotifications = state => state.notifications || []
