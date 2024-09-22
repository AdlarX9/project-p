import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'

import Error from '../pages/Error/'
import Home from '../pages/Home/'
import Settings from '../pages/Settings/'
import Locker from '../pages/Locker/'
import Shop from '../pages/Shop/'
import Auth from '../pages/Auth/'
import { ReactQueryDevtools, ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import React from 'react'

const queryClient = new QueryClient()

function App() {
	const [isOpen, setIsOpen] = React.useState(false)
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<Router>
					<Routes>
						<Route path='*' element={<Error />} />
						<Route path='/' element={<Home />} />
						<Route path='/settings' element={<Settings />} />
						<Route path='/locker' element={<Locker />} />
						<Route path='/shop' element={<Shop />} />
						<Route path='/login' element={<Auth type='login' />} />
						<Route path='/signup' element={<Auth type='signup' />} />
					</Routes>
				</Router>
				<button onClick={() => setIsOpen(!isOpen)}>
					{`${isOpen ? 'Close' : 'Open'} the devtools panel`}
				</button>
				{isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</Provider>
	)
}

export default App
