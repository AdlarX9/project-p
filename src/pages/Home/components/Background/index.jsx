import './style.css'
import React, { useEffect, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useFBX, useProgress } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
/* eslint-disable react/no-unknown-property */

const Background = () => {
	const fbx = useFBX('/island/source/Stronghold.fbx')

	return (
		<Canvas className='bg-wrapper' fog={{ color: 'blue', near: 1, far: 50 }}>
			<ambientLight intensity={6} />
			<spotLight position={[-5, 15, 5]} angle={0.6} penumbra={1} intensity={600} />
			<pointLight position={[10, 10, -10]} intensity={2000} />
			<primitive object={fbx} scale={0.01} />
			<PerspectiveCamera makeDefault position={[6, 4, -6]} fov={50} />
			<OrbitControls target={[0, 2, 0]} />

			<EffectComposer
				resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
			>
				<Vignette eskil={false} offset={0} darkness={0.6} />
			</EffectComposer>
		</Canvas>
	)
}

export default Background
