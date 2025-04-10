import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools, ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

import { store } from '@redux/store'
import { MercureContextProvider } from '@contexts/MercureContext'
import { PeerContextProvider } from '@contexts/PeerContext'
import { HomeContextProvider } from '@contexts/HomeContext'

import Check from './Check'
import { Notifications } from '@features/notifications'
import Confirmation from '@components/Confirmation'
import { MatchmakingIndicator } from '@features/matchmaking'

import Error from '@pages/Error/'
import Settings from '@pages/Settings/'
import Profile from '@pages/ProfilePage/'
import BankAccount from '@pages/BankAccount/'
import Shop from '@pages/Shop/'
import ShopItem from '@pages/ShopItem/'
import LoadingPage from '@pages/LoadingPage/'
import Game from '@pages/Game'
import Chat from '@pages/Chat'

const Home = lazy(() => import('@pages/Home/'))
const Auth = lazy(() => import('@pages/Auth/'))

const queryClient = new QueryClient()

const App = () => {
	const [isOpen, setIsOpen] = React.useState(false)

	return (
		<CookiesProvider defaultSetOptions>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<Router>
						<MercureContextProvider>
							<PeerContextProvider>
								<Check />
								<Notifications />
								<Suspense fallback={<LoadingPage />}>
									<HomeContextProvider>
										<Routes>
											<Route path='*' element={<Error />} />
											<Route path='/' element={<Home />} />
											<Route path='/login' element={<Auth type='login' />} />
											<Route
												path='/signup'
												element={<Auth type='signup' />}
											/>
											<Route path='/game' element={<Game />} />
											<Route path='/settings' element={<Settings />} />
											<Route path='/profile' element={<Profile />} />
											<Route path='/bankaccount' element={<BankAccount />} />
											<Route path='/shop' element={<Shop />} />
											<Route path='/shop/item' element={<ShopItem />} />
											<Route path='/chat/:username' element={<Chat />} />
										</Routes>
									</HomeContextProvider>
								</Suspense>
								<Confirmation />
								<MatchmakingIndicator />
							</PeerContextProvider>
						</MercureContextProvider>
					</Router>
					{/* {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
					<ReactQueryDevtools initialIsOpen={false} /> */}
				</QueryClientProvider>
			</Provider>
		</CookiesProvider>
	)
}

export default App
