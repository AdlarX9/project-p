import './style.css'
import { motion } from 'framer-motion'

const LoadingPage = () => {
	return (
		<section className='loading-page-wrapper cartoon-txt'>
			<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				Setting up...
			</motion.p>
		</section>
	)
}

export default LoadingPage
