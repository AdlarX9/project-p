import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const AuthMessage = ({ text, endpoint, linkMessage }) => {
	return (
		<motion.p
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			className='cartoon2-txt auth-link'
		>
			{text}
			<br />
			<Link to={endpoint}>{linkMessage}</Link>
		</motion.p>
	)
}

export default AuthMessage
