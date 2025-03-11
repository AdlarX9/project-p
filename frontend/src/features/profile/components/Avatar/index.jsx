import './style.css'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getProfile } from '@redux/selectors'
import * as THREE from 'three'
/* eslint-disable react/no-unknown-property */

const getThreeColor = color => {
	return new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255)
}

const Avatar = ({ customColor = null }) => {
	const [onScreen, setOnScreen] = useState(false)
	const camera = useRef()
	const profile = useSelector(getProfile)

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
			className='avatar-bg-wrapper'
		>
			<Canvas className='avatar-bg-wrapper' fog={{ color: 'blue', near: 1, far: 50 }}>
				<ambientLight intensity={1} />
				<spotLight position={[3, 15, 7]} angle={0.6} penumbra={1} intensity={200} />
				<spotLight position={[-3, 15, -7]} angle={0.6} penumbra={1} intensity={100} />
				<mesh
					onAfterRender={() => setOnScreen(true)}
					position={[0, 0, 0]}
					scale={[1, 1, 1]}
				>
					<boxGeometry />
					<meshStandardMaterial
						metalness={0.2}
						roughness={1}
						color={
							customColor
								? getThreeColor(customColor)
								: profile.color
									? getThreeColor(profile.color)
									: 'hotpink'
						}
					/>
				</mesh>
				<PerspectiveCamera makeDefault position={[0.7, 1, 3]} fov={40} ref={camera} />
			</Canvas>
		</motion.section>
	)
}

const canvasVariants = {
	visible: { opacity: 1, x: 0 },
	hidden: { opacity: 0, x: -100 }
}

export default Avatar
