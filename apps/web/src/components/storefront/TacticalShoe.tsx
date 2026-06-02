'use client'

import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

// Tipamos los nodos y materiales específicos de tu modelo
type GLTFResult = GLTF & {
    nodes: {
        ShoeMesh: THREE.Mesh
    }
    materials: {
        ShoeMaterial: THREE.Material
    }
}

export default function TacticalShoe() {
    // Asignamos el tipo THREE.Group al ref y lo inicializamos en null
    const group = useRef<THREE.Group>(null)

    // Hacemos un cast del resultado de useGLTF hacia nuestro tipo personalizado
    const { nodes, materials } = useGLTF(''/*'/tactical-shoe.glb'*/) as GLTFResult
    const scroll = useScroll()

    useFrame((state, delta) => {
        // TypeScript requiere que nos aseguremos de que .current existe antes de mutarlo
        if (!group.current) return

        const offset = scroll.offset

        // 1. Rotación
        group.current.rotation.y += delta * 0.5
        group.current.rotation.y += offset * 2

        // 2. Efecto Zoom Out (Escala)
        const scale = 2 - (offset * 1.5)
        group.current.scale.set(scale, scale, scale)

        // 3. Desplazamiento hacia arriba
        group.current.position.y = offset * 3
    })

    return (
        <group ref={group}>
            <mesh
                geometry={nodes.ShoeMesh.geometry}
                material={materials.ShoeMaterial}
            />
        </group>
    )
}

// Precarga del modelo para mejor rendimiento
useGLTF.preload(''/* '/tactical-shoe.glb' */)