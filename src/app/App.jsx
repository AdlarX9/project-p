import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	ReactQueryDevtools,
	ReactQueryDevtoolsPanel
} from '@tanstack/react-query-devtools'

import { store } from './store'

import Check from './Check'
import Notifications from '../components/Notifications/'
import Confirmation from '../components/Confirmation'

import Error from '../pages/Error/'
import Settings from '../pages/Settings/'
import Locker from '../pages/Locker/'
import Shop from '../pages/Shop/'
import MatchmakingIndicator from '../components/MatchmakingIndicator'

const Home = lazy(() => import('../pages/Home/'))
const Auth = lazy(() => import('../pages/Auth/'))

const queryClient = new QueryClient()

function App() {
	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<CookiesProvider defaultSetOptions>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<Router>
						<Check />
						<Notifications />
						<Suspense>
							<Routes>
								<Route path='*' element={<Error />} />
								<Route path='/' element={<Home />} />
								<Route path='/settings' element={<Settings />} />
								<Route path='/locker' element={<Locker />} />
								<Route path='/shop' element={<Shop />} />
								<Route path='/login' element={<Auth type='login' />} />
								<Route path='/signup' element={<Auth type='signup' />} />
							</Routes>
						</Suspense>
						<Confirmation />
						<MatchmakingIndicator />
					</Router>
					{isOpen && (
						<ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />
					)}
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</Provider>
		</CookiesProvider>
	)
}

export default App
