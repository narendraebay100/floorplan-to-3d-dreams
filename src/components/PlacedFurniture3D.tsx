import { useRef, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FURNITURE_CATALOG, type PlacedFurniture } from '@/lib/furnitureCatalog';

interface PlacedFurniture3DProps {
  items: PlacedFurniture[];
  onUpdatePosition: (instanceId: string, position: [number, number, number]) => void;
  selectedId: string | null;
  onSelect: (instanceId: string | null) => void;
}

export const PlacedFurniture3D = ({ items, onUpdatePosition, selectedId, onSelect }: PlacedFurniture3DProps) => {
  return (
    <group>
      {items.map(placed => (
        <DraggableFurnitureItem
          key={placed.instanceId}
          placed={placed}
          isSelected={selectedId === placed.instanceId}
          onSelect={onSelect}
          onUpdatePosition={onUpdatePosition}
        />
      ))}
    </group>
  );
};

const DraggableFurnitureItem = ({
  placed,
  isSelected,
  onSelect,
  onUpdatePosition,
}: {
  placed: PlacedFurniture;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
}) => {
  const item = FURNITURE_CATALOG.find(i => i.id === placed.itemId);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, gl } = useThree();
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersection = useRef(new THREE.Vector3());

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    onSelect(placed.instanceId);
    setIsDragging(true);
    (gl.domElement as HTMLElement).style.cursor = 'grabbing';
    // @ts-ignore
    e.target?.setPointerCapture?.(e.pointerId);
  }, [placed.instanceId, onSelect, gl]);

  const handlePointerMove = useCallback((e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(plane.current, intersection.current)) {
      const y = item ? item.dimensions.height / 2 : 0.25;
      onUpdatePosition(placed.instanceId, [intersection.current.x, y, intersection.current.z]);
    }
  }, [isDragging, camera, raycaster, gl, placed.instanceId, onUpdatePosition, item]);

  const handlePointerUp = useCallback((e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    (gl.domElement as HTMLElement).style.cursor = 'auto';
  }, [isDragging, gl]);

  if (!item) return null;

  const { width, height, depth } = item.dimensions;

  return (
    <mesh
      ref={meshRef}
      position={placed.position}
      rotation={[0, placed.rotation, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={isSelected ? '#3b82f6' : item.color}
        roughness={item.roughness ?? 0.5}
        metalness={item.metalness ?? 0}
        emissive={isSelected ? '#3b82f6' : '#000000'}
        emissiveIntensity={isSelected ? 0.15 : 0}
      />
      {/* Selection outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(width + 0.02, height + 0.02, depth + 0.02)]} />
          <lineBasicMaterial color="#3b82f6" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};
