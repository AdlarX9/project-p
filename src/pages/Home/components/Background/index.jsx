import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import './style.css';

/* eslint-disable react/no-unknown-property */

function Box(props) {
	const meshRef = useRef();
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	useFrame((state, delta) => {
		if (meshRef.current) {
			meshRef.current.rotation.x += delta;
			meshRef.current.rotation.y += delta;
			meshRef.current.rotation.z += delta;
		}
	})

	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	)
}

const Background = () => {
	return (
		<Canvas className='bg-wrapper'>
			<ambientLight intensity={Math.PI / 2} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
			<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
			<Box position={[-1.2, 0, 0]} />
			<Box position={[1.2, 0, 0]} />
		</Canvas>
	);
}

export default Background;