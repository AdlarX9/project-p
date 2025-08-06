import { createContext, useContext, useEffect, useRef, useState } from 'react'

const HomeContext = createContext(null)

export const useHomeContext = () => useContext(HomeContext)

export const HomeContextProvider = ({ children }) => {
	const bgInitialOffset = useRef(0)
	let start = Date.now()

	const bgIncrementInitialOffset = () => {
		let end = Date.now()
		const diff = end - start
		bgInitialOffset.current += (diff * 10) / 8000 // 10rem per 8s
		bgInitialOffset.current %= 10
		start = Date.now()
		requestAnimationFrame(bgIncrementInitialOffset)
	}

	useEffect(() => {
		bgIncrementInitialOffset()
	})

	return <HomeContext.Provider value={{ bgInitialOffset }}>{children}</HomeContext.Provider>
}
