import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { Text } from '@react-three/drei';

interface MangaSpineProps {
  title: string;
  author: string;
  volume: number;
  color: string;
  position: [number, number, number];
  onSelect: () => void;
  isOwned: boolean;
}

export function MangaSpine({ title, author, volume, color, position, onSelect, isOwned }: MangaSpineProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const spineColor = isOwned ? getBookColor(color) : '#2a2a2a';
  const opacity = isOwned ? 1 : 0.3;
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[0.3, 2, 0.05]} />
        <meshStandardMaterial 
          color={spineColor} 
          transparent 
          opacity={opacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {isOwned && (
        <>
          <Text
            position={[0, 0.5, 0.026]}
            rotation={[0, 0, Math.PI / 2]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.8}
            font="/fonts/inter-medium.woff"
          >
            {title}
          </Text>
          
          <Text
            position={[0, -0.3, 0.026]}
            rotation={[0, 0, Math.PI / 2]}
            fontSize={0.06}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
          >
            {author}
          </Text>
          
          <Text
            position={[0, -0.8, 0.026]}
            rotation={[0, 0, Math.PI / 2]}
            fontSize={0.05}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Vol. {volume}
          </Text>
        </>
      )}
    </group>
  );
}

function getBookColor(color: string): string {
  const colors = {
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    orange: '#ea580c',
    purple: '#9333ea',
    brown: '#a16207'
  };
  return colors[color as keyof typeof colors] || colors.blue;
}