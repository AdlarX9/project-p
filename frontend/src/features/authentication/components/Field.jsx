import { motion } from 'framer-motion'

const Field = ({ label, type, autoComplete, value, setValue, extraClassName, button }) => {
	return (
		<motion.div
			className='field-wrapper'
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			whileFocus={{ scale: 1.05 }}
		>
			<label className='field-label' htmlFor={label}>
				{label}
			</label>
			<div className={extraClassName === 'password-field' ? 'password-wrapper' : ''}>
				<input
					className={'field auth-field shadowed ' + extraClassName}
					label={label}
					autoComplete={autoComplete}
					type={type}
					id={label}
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
				{button}
			</div>
		</motion.div>
	)
}

export default Field
