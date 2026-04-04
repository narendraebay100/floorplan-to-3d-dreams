export interface FurnitureItem {
  id: string;
  name: string;
  category: 'seating' | 'tables' | 'storage' | 'beds' | 'kitchen' | 'bathroom' | 'decor' | 'lighting';
  emoji: string;
  dimensions: { width: number; height: number; depth: number }; // in meters
  color: string;
  metalness?: number;
  roughness?: number;
}

export interface PlacedFurniture {
  instanceId: string;
  itemId: string;
  position: [number, number, number];
  rotation: number; // Y-axis rotation in radians
}

export const FURNITURE_CATALOG: FurnitureItem[] = [
  // Seating
  { id: 'sofa', name: 'Sofa', category: 'seating', emoji: '🛋️', dimensions: { width: 2.0, height: 0.8, depth: 0.9 }, color: '#4a5568', roughness: 0.8 },
  { id: 'armchair', name: 'Armchair', category: 'seating', emoji: '💺', dimensions: { width: 0.8, height: 0.8, depth: 0.8 }, color: '#5a6478', roughness: 0.8 },
  { id: 'dining-chair', name: 'Dining Chair', category: 'seating', emoji: '🪑', dimensions: { width: 0.45, height: 0.9, depth: 0.45 }, color: '#8B4513', roughness: 0.5 },
  { id: 'office-chair', name: 'Office Chair', category: 'seating', emoji: '🪑', dimensions: { width: 0.6, height: 1.1, depth: 0.6 }, color: '#2d3748', roughness: 0.6 },

  // Tables
  { id: 'coffee-table', name: 'Coffee Table', category: 'tables', emoji: '☕', dimensions: { width: 1.0, height: 0.4, depth: 0.6 }, color: '#8B4513', roughness: 0.3 },
  { id: 'dining-table', name: 'Dining Table', category: 'tables', emoji: '🍽️', dimensions: { width: 1.6, height: 0.75, depth: 0.9 }, color: '#654321', roughness: 0.4 },
  { id: 'desk', name: 'Desk', category: 'tables', emoji: '🖥️', dimensions: { width: 1.4, height: 0.75, depth: 0.7 }, color: '#5C4033', roughness: 0.3 },
  { id: 'side-table', name: 'Side Table', category: 'tables', emoji: '🔲', dimensions: { width: 0.4, height: 0.5, depth: 0.4 }, color: '#8B4513', roughness: 0.4 },

  // Storage
  { id: 'bookshelf', name: 'Bookshelf', category: 'storage', emoji: '📚', dimensions: { width: 0.8, height: 1.8, depth: 0.3 }, color: '#654321', roughness: 0.5 },
  { id: 'wardrobe', name: 'Wardrobe', category: 'storage', emoji: '🚪', dimensions: { width: 1.2, height: 2.0, depth: 0.6 }, color: '#4a5568', roughness: 0.6 },
  { id: 'dresser', name: 'Dresser', category: 'storage', emoji: '🗄️', dimensions: { width: 1.0, height: 0.8, depth: 0.5 }, color: '#654321', roughness: 0.5 },
  { id: 'tv-stand', name: 'TV Stand', category: 'storage', emoji: '📺', dimensions: { width: 1.4, height: 0.5, depth: 0.4 }, color: '#2d3748', roughness: 0.4 },

  // Beds
  { id: 'single-bed', name: 'Single Bed', category: 'beds', emoji: '🛏️', dimensions: { width: 1.0, height: 0.5, depth: 2.0 }, color: '#e2e8f0', roughness: 0.9 },
  { id: 'double-bed', name: 'Double Bed', category: 'beds', emoji: '🛏️', dimensions: { width: 1.6, height: 0.5, depth: 2.0 }, color: '#e2e8f0', roughness: 0.9 },
  { id: 'nightstand', name: 'Nightstand', category: 'beds', emoji: '🔲', dimensions: { width: 0.45, height: 0.5, depth: 0.4 }, color: '#8B4513', roughness: 0.5 },

  // Kitchen
  { id: 'fridge', name: 'Refrigerator', category: 'kitchen', emoji: '🧊', dimensions: { width: 0.7, height: 1.8, depth: 0.7 }, color: '#f0f0f0', roughness: 0.1, metalness: 0.3 },
  { id: 'oven', name: 'Oven', category: 'kitchen', emoji: '♨️', dimensions: { width: 0.6, height: 0.85, depth: 0.6 }, color: '#333333', roughness: 0.2, metalness: 0.6 },
  { id: 'kitchen-island', name: 'Kitchen Island', category: 'kitchen', emoji: '🏝️', dimensions: { width: 1.4, height: 0.9, depth: 0.7 }, color: '#e2e8f0', roughness: 0.2 },

  // Bathroom
  { id: 'bathtub', name: 'Bathtub', category: 'bathroom', emoji: '🛁', dimensions: { width: 0.8, height: 0.5, depth: 1.7 }, color: '#ffffff', roughness: 0.1 },
  { id: 'toilet', name: 'Toilet', category: 'bathroom', emoji: '🚽', dimensions: { width: 0.4, height: 0.4, depth: 0.65 }, color: '#f8f9fa', roughness: 0.2 },
  { id: 'vanity', name: 'Vanity', category: 'bathroom', emoji: '🪞', dimensions: { width: 1.0, height: 0.85, depth: 0.5 }, color: '#8B4513', roughness: 0.5 },

  // Decor
  { id: 'rug', name: 'Area Rug', category: 'decor', emoji: '🟫', dimensions: { width: 2.0, height: 0.02, depth: 1.5 }, color: '#8B6F4E', roughness: 0.95 },
  { id: 'plant', name: 'Plant Pot', category: 'decor', emoji: '🪴', dimensions: { width: 0.3, height: 0.8, depth: 0.3 }, color: '#2d6a4f', roughness: 0.7 },
  { id: 'tv', name: 'TV', category: 'decor', emoji: '📺', dimensions: { width: 1.2, height: 0.7, depth: 0.05 }, color: '#1a1a1a', roughness: 0.1, metalness: 0.8 },

  // Lighting
  { id: 'floor-lamp', name: 'Floor Lamp', category: 'lighting', emoji: '🪔', dimensions: { width: 0.3, height: 1.6, depth: 0.3 }, color: '#d4a574', roughness: 0.4 },
  { id: 'table-lamp', name: 'Table Lamp', category: 'lighting', emoji: '💡', dimensions: { width: 0.25, height: 0.5, depth: 0.25 }, color: '#f5f0e1', roughness: 0.5 },
];

export const FURNITURE_CATEGORIES = [
  { id: 'seating', label: 'Seating', emoji: '🛋️' },
  { id: 'tables', label: 'Tables', emoji: '🍽️' },
  { id: 'storage', label: 'Storage', emoji: '🗄️' },
  { id: 'beds', label: 'Beds', emoji: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'bathroom', label: 'Bathroom', emoji: '🚿' },
  { id: 'decor', label: 'Decor', emoji: '🪴' },
  { id: 'lighting', label: 'Lighting', emoji: '💡' },
] as const;
