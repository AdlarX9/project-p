import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools, ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import eruda from 'eruda'

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
import ProfileOverview from '@pages/ProfileOverview/'
import TransfersPage from '@pages/TransfersPage/'
import Shop from '@pages/Shop/'
import ShopItem from '@pages/ShopItem/'
import LoadingPage from '@pages/LoadingPage/'
import Game from '@pages/Game'
import Chat from '@pages/Chat'
import Bank from '@pages/Bank/'
import BankCreate from '@pages/BankCreate/'
import BankManage from '@pages/BankManage/'
import BankOverview from '@pages/BankOverview/'
import LoanRequests from '@pages/LoanRequests/'
import Loans from '@pages/Loans/'

const Home = lazy(() => import('@pages/Home/'))
const Auth = lazy(() => import('@pages/Auth/'))

const queryClient = new QueryClient()

const App = () => {
	const [isOpen, setIsOpen] = React.useState(false)

	if (process.env.APP_ENV === 'dev') {
		eruda.init()
	}

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
											<Route
												path='/profile_overview'
												element={<ProfileOverview />}
											/>
											<Route path='/transfers' element={<TransfersPage />} />
											<Route path='/shop' element={<Shop />} />
											<Route path='/shop/item' element={<ShopItem />} />
											<Route path='/chat/:username' element={<Chat />} />
											<Route path='/bank/:tab' element={<Bank />} />
											<Route path='/create-bank' element={<BankCreate />} />
											<Route
												path='/focus-bank/:id/loans'
												element={<Loans />}
											/>
											<Route
												path='/focus-bank/:id/loan-requests'
												element={<LoanRequests />}
											/>
											<Route
												path='/focus-bank/:id/manage'
												element={<BankManage />}
											/>
											<Route
												path='/focus-bank/:id/overview'
												element={<BankOverview />}
											/>
										</Routes>
									</HomeContextProvider>
								</Suspense>
								<Confirmation />
								<MatchmakingIndicator />
							</PeerContextProvider>
						</MercureContextProvider>
					</Router>
					{process.env.APP_ENV === 'dev' && (
						<>
							{isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
							<ReactQueryDevtools
								initialIsOpen={false}
								buttonPosition='bottom-left'
							/>
						</>
					)}
				</QueryClientProvider>
			</Provider>
		</CookiesProvider>
	)
}

export default App
