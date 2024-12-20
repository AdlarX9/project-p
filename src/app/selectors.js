export const getUser = state => state.user || {}

export const getToken = state => getUser(state)?.token || ''

export const getFriends = state => state.friends || []

export const getNotifications = state => state.notifications || []

export const getMatchmaking = state => state.matchmaking || 'nothing'
