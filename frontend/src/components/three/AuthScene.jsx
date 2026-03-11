import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function WaveSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#6c5ce7"
                    roughness={0.15}
                    metalness={0.9}
                    distort={0.25}
                    speed={1.5}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </Float>
    );
}

function FloatingRings({ count = 3 }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {Array.from({ length: count }).map((_, i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / count]}>
                    <torusGeometry args={[2 + i * 0.5, 0.02, 8, 64]} />
                    <meshStandardMaterial
                        color="#a29bfe"
                        transparent
                        opacity={0.2 - i * 0.04}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function AuthScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 50 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
            dpr={[1, 1.5]}
        >
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />
            <pointLight position={[-3, -3, -3]} intensity={0.4} color="#818cf8" />

            <WaveSphere />
            <FloatingRings />
        </Canvas>
    );
}
