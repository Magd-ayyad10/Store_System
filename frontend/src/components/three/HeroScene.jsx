import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingBlob({ position, color, speed = 0.4, distort = 0.4, size = 1.5 }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.3;
            meshRef.current.rotation.y += 0.003;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
            <mesh ref={meshRef} position={position}>
                <icosahedronGeometry args={[size, 20]} />
                <MeshDistortMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.8}
                    distort={distort}
                    speed={speed * 3}
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </Float>
    );
}

function Particles({ count = 200 }) {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.02;
            points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#818cf8"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

function AnimatedTorus() {
    const torusRef = useRef();

    useFrame((state) => {
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.elapsedTime * 0.15;
            torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <mesh ref={torusRef} position={[4, -1, -3]}>
            <torusGeometry args={[1.2, 0.4, 16, 60]} />
            <meshStandardMaterial
                color="#a29bfe"
                wireframe
                transparent
                opacity={0.3}
            />
        </mesh>
    );
}

export default function HeroScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 55 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
            dpr={[1, 1.5]}
        >
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6c5ce7" />
            <pointLight position={[5, 3, 2]} intensity={0.3} color="#fd79a8" />

            <FloatingBlob position={[-3, 1, -2]} color="#6c5ce7" speed={0.3} distort={0.5} size={1.8} />
            <FloatingBlob position={[3, -1, -1]} color="#fd79a8" speed={0.5} distort={0.35} size={1.2} />
            <FloatingBlob position={[0, 2, -4]} color="#a29bfe" speed={0.2} distort={0.3} size={1} />

            <AnimatedTorus />
            <Particles count={300} />
        </Canvas>
    );
}
