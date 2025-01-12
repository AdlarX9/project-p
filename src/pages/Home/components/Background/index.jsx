import './style.css'
import React, { useMemo, useState } from 'react'
import { Canvas, invalidate, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useFBX } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
/* eslint-disable react/no-unknown-property */

const Background = () => {
	const fbx = useFBX('/island/source/Stronghold.fbx')
	const [onScreen, setOnScreen] = useState(false)

	return (
		<motion.section
			variants={canvasVariants}
			initial='hidden'
			animate={onScreen ? 'visible' : 'hidden'}
			className='bg-wrapper'
		>
			<Canvas className='bg-wrapper' fog={{ color: 'blue', near: 1, far: 50 }}>
				<ambientLight intensity={6} />
				<spotLight position={[-5, 15, 5]} angle={0.6} penumbra={1} intensity={600} />
				<pointLight position={[10, 10, -10]} intensity={2000} />
				<mesh onAfterRender={() => setOnScreen(true)}>
					<primitive object={fbx} scale={0.01} />
				</mesh>
				<PerspectiveCamera makeDefault position={[6, 4, -6]} fov={50} />
				<OrbitControls
					enableDamping={true}
					enablePan={false}
					enableZoom={false}
					minAzimuthAngle={Math.PI / 2}
					maxAzimuthAngle={Math.PI}
					minPolarAngle={Math.PI / 2.6}
					maxPolarAngle={Math.PI / 2.6}
					target={[0, 1, 0]}
				/>

				<EffectComposer resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}>
					<Vignette eskil={false} offset={0} darkness={0.6} />
				</EffectComposer>
			</Canvas>
		</motion.section>
	)
}

const canvasVariants = {
	visible: { opacity: 1 },
	hidden: { opacity: 0 }
}

export default Background
