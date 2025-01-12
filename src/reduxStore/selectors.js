export const getUser = state => state.user || {}

export const getToken = state => getUser(state)?.token || ''

export const getFriends = state => state.friends || []

export const getNotifications = state => state.notifications || []

export const getMatchmaking = state => state.matchmaking || { state: 'nothing', id: null }

export const getMatchmakingState = state => getMatchmaking(state).state || 'nothing'

export const getMatchmakingId = state => getMatchmaking(state).id || null
