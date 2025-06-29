import './style.css'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { getLocker } from '@redux/selectors'
import * as THREE from 'three'
import { switchColorContent } from '../..'
/* eslint-disable react/no-unknown-property */

const getThreeColor = color => {
	if (color?.length === 3) {
		return new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255)
	} else {
		return color
	}
}

const Mesh = ({ scaleRef, customColor, setOnScreen }) => {
	const meshRef = useRef()
	const locker = useSelector(getLocker)

	useFrame(() => {
		if (meshRef.current && scaleRef?.current) {
			meshRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current)
		}
	})

	return (
		<mesh onAfterRender={() => setOnScreen(true)} position={[0, 0, 0]} ref={meshRef}>
			<boxGeometry />
			<meshStandardMaterial
				metalness={0.2}
				roughness={1}
				color={
					customColor
						? getThreeColor(customColor)
						: locker?.color
							? getThreeColor(switchColorContent(locker.color))
							: 'hotpink'
				}
			/>
		</mesh>
	)
}

const Avatar = ({ customColor = null, reverse = false, scaleRef = null }) => {
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
			className='avatar-bg-wrapper'
			custom={reverse}
		>
			<Canvas className='avatar-bg-wrapper' fog={{ color: 'blue', near: 1, far: 50 }}>
				<ambientLight intensity={1} />
				<spotLight position={[3, 15, 7]} angle={0.6} penumbra={1} intensity={200} />
				<spotLight position={[-3, 15, -7]} angle={0.6} penumbra={1} intensity={100} />
				<Mesh scaleRef={scaleRef} customColor={customColor} setOnScreen={setOnScreen} />
				<PerspectiveCamera
					makeDefault
					position={[reverse ? -0.7 : 0.7, 1, 3]}
					fov={40}
					ref={camera}
				/>
			</Canvas>
		</motion.section>
	)
}

const canvasVariants = {
	visible: () => {
		return { opacity: 1, x: 0 }
	},
	hidden: reverse => {
		return { opacity: 0, x: reverse ? 100 : -100 }
	}
}

export default Avatar
