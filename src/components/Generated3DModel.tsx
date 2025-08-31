import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFloorPlan } from '@/contexts/FloorPlanContext';

export const Generated3DModel = () => {
  const { currentFloorPlan } = useFloorPlan();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  if (!currentFloorPlan) {
    return <DefaultHouse />;
  }

  return (
    <group ref={groupRef}>
      {/* Generate walls from floor plan data */}
      {currentFloorPlan.walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} scale={currentFloorPlan.scale} />
      ))}
      
      {/* Generate floors for each room */}
      {currentFloorPlan.rooms.map((room) => (
        <Room3D key={room.id} room={room} scale={currentFloorPlan.scale} />
      ))}
      
      {/* Floor plan title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.5}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        {currentFloorPlan.name}
      </Text>
    </group>
  );
};

const Wall3D = ({ wall, scale }: { wall: any; scale: number }) => {
  // Convert 2D coordinates to 3D world coordinates
  const startX = (wall.start.x - 400) / scale; // Center around origin
  const startZ = (wall.start.y - 300) / scale;
  const endX = (wall.end.x - 400) / scale;
  const endZ = (wall.end.y - 300) / scale;
  
  // Calculate wall dimensions
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const angle = Math.atan2(endZ - startZ, endX - startX);
  
  // Position at center of wall
  const centerX = (startX + endX) / 2;
  const centerZ = (startZ + endZ) / 2;
  
  return (
    <mesh 
      position={[centerX, wall.height / 2, centerZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, wall.height, wall.thickness]} />
      <meshStandardMaterial 
        color="#f8fafc" 
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  );
};

const Room3D = ({ room, scale }: { room: any; scale: number }) => {
  // Convert room bounds to 3D coordinates
  const x = (room.bounds.x + room.bounds.width / 2 - 400) / scale;
  const z = (room.bounds.y + room.bounds.height / 2 - 300) / scale;
  const width = room.bounds.width / scale;
  const depth = room.bounds.height / scale;
  
  // Enhanced room materials
  const roomMaterials = {
    living: { 
      floor: '#8B4513', // Wood floor
      wall: '#F5F5DC'   // Beige walls
    },
    bedroom: { 
      floor: '#D2691E', // Carpet
      wall: '#E6E6FA'   // Lavender walls
    },
    kitchen: { 
      floor: '#696969', // Tile floor
      wall: '#FFFFFF'   // White walls
    },
    bathroom: { 
      floor: '#708090', // Slate tile
      wall: '#F0F8FF'   // Alice blue walls
    },
    hallway: { 
      floor: '#BC8F8F', // Rosy brown
      wall: '#F8F8FF'   // Ghost white
    },
    other: { 
      floor: '#D3D3D3', 
      wall: '#DCDCDC' 
    }
  };
  
  const materials = roomMaterials[room.type] || roomMaterials.other;
  
  return (
    <>
      {/* Enhanced Floor with realistic texture */}
      <mesh position={[x, -0.01, z]} receiveShadow>
        <boxGeometry args={[width, 0.02, depth]} />
        <meshStandardMaterial 
          color={materials.floor} 
          roughness={room.type === 'kitchen' || room.type === 'bathroom' ? 0.1 : 0.8}
          metalness={room.type === 'kitchen' || room.type === 'bathroom' ? 0.2 : 0.0}
        />
      </mesh>
      
      {/* Room-specific furniture and details */}
      {room.type === 'living' && <LivingRoomFurniture position={[x, 0, z]} roomSize={[width, depth]} />}
      {room.type === 'bedroom' && <BedroomFurniture position={[x, 0, z]} roomSize={[width, depth]} />}
      {room.type === 'kitchen' && <KitchenFurniture position={[x, 0, z]} roomSize={[width, depth]} />}
      {room.type === 'bathroom' && <BathroomFurniture position={[x, 0, z]} roomSize={[width, depth]} />}
      
      {/* Room label */}
      <Text
        position={[x, 0.1, z]}
        fontSize={Math.min(width, depth) * 0.15}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        font="/fonts/Inter-Bold.woff"
      >
        {room.name}
      </Text>
    </>
  );
};

// Living Room Furniture Component
const LivingRoomFurniture = ({ position, roomSize }: { position: [number, number, number]; roomSize: [number, number] }) => {
  const [x, y, z] = position;
  const [width, depth] = roomSize;
  
  return (
    <group>
      {/* Sofa */}
      <mesh position={[x - width/4, y + 0.2, z]} castShadow>
        <boxGeometry args={[width/3, 0.4, 0.8]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      
      {/* Coffee Table */}
      <mesh position={[x, y + 0.15, z]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.3} />
      </mesh>
      
      {/* TV Stand */}
      <mesh position={[x + width/3, y + 0.2, z - depth/3]} castShadow>
        <boxGeometry args={[1.2, 0.4, 0.3]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>
      
      {/* TV */}
      <mesh position={[x + width/3, y + 0.6, z - depth/3]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Side Table */}
      <mesh position={[x - width/2.5, y + 0.25, z + depth/4]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.4} />
      </mesh>
    </group>
  );
};

// Bedroom Furniture Component
const BedroomFurniture = ({ position, roomSize }: { position: [number, number, number]; roomSize: [number, number] }) => {
  const [x, y, z] = position;
  const [width, depth] = roomSize;
  
  return (
    <group>
      {/* Bed */}
      <mesh position={[x, y + 0.15, z - depth/4]} castShadow>
        <boxGeometry args={[1.4, 0.3, 2.0]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>
      
      {/* Bed Frame */}
      <mesh position={[x, y + 0.05, z - depth/4]} castShadow>
        <boxGeometry args={[1.5, 0.1, 2.1]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Nightstands */}
      <mesh position={[x - 0.8, y + 0.2, z - depth/4]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </mesh>
      
      <mesh position={[x + 0.8, y + 0.2, z - depth/4]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </mesh>
      
      {/* Dresser */}
      <mesh position={[x + width/3, y + 0.3, z + depth/3]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.4]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Wardrobe */}
      <mesh position={[x - width/3, y + 0.8, z + depth/4]} castShadow>
        <boxGeometry args={[0.6, 1.6, 0.5]} />
        <meshStandardMaterial color="#4a5568" roughness={0.7} />
      </mesh>
    </group>
  );
};

// Kitchen Furniture Component
const KitchenFurniture = ({ position, roomSize }: { position: [number, number, number]; roomSize: [number, number] }) => {
  const [x, y, z] = position;
  const [width, depth] = roomSize;
  
  return (
    <group>
      {/* Kitchen Counters */}
      <mesh position={[x - width/3, y + 0.4, z - depth/3]} castShadow>
        <boxGeometry args={[width/2, 0.8, 0.6]} />
        <meshStandardMaterial color="#f7fafc" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Island */}
      <mesh position={[x, y + 0.4, z]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} />
      </mesh>
      
      {/* Refrigerator */}
      <mesh position={[x + width/3, y + 0.8, z - depth/3]} castShadow>
        <boxGeometry args={[0.6, 1.6, 0.6]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.1} metalness={0.3} />
      </mesh>
      
      {/* Stove */}
      <mesh position={[x - width/4, y + 0.45, z - depth/3]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Upper Cabinets */}
      <mesh position={[x - width/3, y + 1.2, z - depth/3]} castShadow>
        <boxGeometry args={[width/2, 0.6, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.4} />
      </mesh>
      
      {/* Sink */}
      <mesh position={[x - width/5, y + 0.42, z - depth/3]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.3]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
};

// Bathroom Furniture Component
const BathroomFurniture = ({ position, roomSize }: { position: [number, number, number]; roomSize: [number, number] }) => {
  const [x, y, z] = position;
  const [width, depth] = roomSize;
  
  return (
    <group>
      {/* Bathtub/Shower */}
      <mesh position={[x - width/3, y + 0.15, z]} castShadow>
        <boxGeometry args={[1.5, 0.3, 0.7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      
      {/* Toilet */}
      <mesh position={[x + width/4, y + 0.2, z + depth/4]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.2} />
      </mesh>
      
      {/* Vanity */}
      <mesh position={[x, y + 0.3, z - depth/3]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.5]} />
        <meshStandardMaterial color="#8B4513" roughness={0.5} />
      </mesh>
      
      {/* Mirror */}
      <mesh position={[x, y + 0.8, z - depth/2.8]} castShadow>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#e6f3ff" roughness={0.0} metalness={1.0} />
      </mesh>
      
      {/* Sink */}
      <mesh position={[x, y + 0.32, z - depth/3]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.04]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
    </group>
  );
};

// Fallback default house when no floor plan is generated
const DefaultHouse = () => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Floor */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 1.5, -3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[0, 1.5, 3]} castShadow>
        <boxGeometry args={[8, 3, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[-4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      
      <mesh position={[4, 1.5, 0]} castShadow>
        <boxGeometry args={[0.2, 3, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[5, 1.5, 4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Demo label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.4}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        Upload floor plan to generate 3D model
      </Text>
    </group>
  );
};