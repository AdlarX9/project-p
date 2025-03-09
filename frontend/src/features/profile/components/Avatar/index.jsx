import './style.css'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
/* eslint-disable react/no-unknown-property */

const Avatar = () => {
	const [onScreen, setOnScreen] = useState(false)
	const camera = useRef()

	useEffect(() => {
		if (camera.current) {
			camera.current.lookAt(0, 0, 0)
		}
	})

	return (
		<motion.section
			variants={canvasVariants}
			initial='hidden'
			animate={onScreen ? 'visible' : 'hidden'}
			className='bg-wrapper'
		>
			<Canvas className='bg-wrapper' fog={{ color: 'blue', near: 1, far: 50 }}>
				<ambientLight intensity={4.5} />
				<spotLight position={[-5, 15, 5]} angle={0.6} penumbra={1} intensity={600} />
				<pointLight position={[5, 5, 5]} intensity={20} />
				<mesh
					onAfterRender={() => setOnScreen(true)}
					position={[0, 0, 0]}
					scale={[1, 1, 1]}
				>
					<boxGeometry />
					<meshLambertMaterial color='hotpink' />
				</mesh>
				<PerspectiveCamera makeDefault position={[0.7, 1, 3]} fov={60} ref={camera} />
			</Canvas>
		</motion.section>
	)
}

const canvasVariants = {
	visible: { opacity: 1, x: 0 },
	hidden: { opacity: 0, x: -100 }
}

export default Avatar
