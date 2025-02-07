import React, { createContext, useContext, useState } from 'react'

const HomeContext = createContext(null)

export const useHomeContext = () => useContext(HomeContext)

export const HomeContextProvider = ({ children }) => {
	const [backgroundLoaded, setBackgroundLoaded] = useState(false)

	return (
		<HomeContext.Provider value={{ backgroundLoaded, setBackgroundLoaded }}>
			{children}
		</HomeContext.Provider>
	)
}
