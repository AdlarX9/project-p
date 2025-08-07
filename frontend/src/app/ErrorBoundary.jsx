import React from 'react'
import { motion } from 'framer-motion'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error) {
		// Afficher le fallback
		return { hasError: true, error }
	}

	componentDidCatch(error, errorInfo) {
		// Log de l'erreur
		console.error(error, errorInfo)
	}

	render() {
		const reloadWindow = () => {
			window.location.reload()
		}

		if (this.state.error) {
			return (
				<div
					className='bg df jcc aic scrollable'
					style={{ boxSizing: 'border-box', padding: '5rem' }}
				>
					<main className='bg-red max-80 shadowed p-20 tac br-40'>
						<h2 className='m-20 title-txt'>Error</h2>
						<p className='m-0 cartoon-txt'>An error occurred. Please try again.</p>
						<center>
							<motion.button
								onClick={reloadWindow}
								className='m-20 int-btn skewed bg-green p-20'
								animate={{ scale: 1, skewX: '-10deg' }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<span>Retry</span>
							</motion.button>
						</center>
						<p className='m-20 cartoon2-txt'>Error: {this.state.error?.message}</p>
					</main>
				</div>
			)
		}

		return this.props.children
	}
}

export default ErrorBoundary
