import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  mouseX?: number
  mouseY?: number
}

export function ParticleField({ count = 180, mouseX = 0, mouseY = 0 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()

  // Pre-compute random positions, speeds, phases for each particle
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * viewport.width * 1.5,
      y: (Math.random() - 0.5) * viewport.height * 1.5,
      z: (Math.random() - 0.5) * 4,
      speedX: (Math.random() - 0.5) * 0.003,
      speedY: (Math.random() - 0.5) * 0.002,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      amplitude: 0.15 + Math.random() * 0.25,
      scale: 0.03 + Math.random() * 0.04,
    }))
  }, [count, viewport.width, viewport.height])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    // Smooth camera parallax based on mouse
    state.camera.position.x += (mouseX * 0.8 - state.camera.position.x) * 0.05
    state.camera.position.y += (-mouseY * 0.5 - state.camera.position.y) * 0.05
    state.camera.lookAt(0, 0, 0)

    particles.forEach((p, i) => {
      const x = p.x + Math.sin(t * p.speedX * 200 + p.phaseX) * p.amplitude
      const y = p.y + Math.cos(t * p.speedY * 200 + p.phaseY) * p.amplitude

      dummy.position.set(x, y, p.z)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#D97911"
        emissive="#D97911"
        emissiveIntensity={0.6}
        roughness={0.4}
        metalness={0.2}
      />
    </instancedMesh>
  )
}
