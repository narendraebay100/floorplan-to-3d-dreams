import type { PlacedFurniture } from './furnitureCatalog';

export interface SavedLayout {
  id: string;
  name: string;
  furniture: PlacedFurniture[];
  savedAt: string;
}

const STORAGE_KEY = 'floorplan-furniture-layouts';

export const getSavedLayouts = (): SavedLayout[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLayout = (name: string, furniture: PlacedFurniture[]): SavedLayout => {
  const layout: SavedLayout = {
    id: `layout-${Date.now()}`,
    name,
    furniture: [...furniture],
    savedAt: new Date().toISOString(),
  };
  const layouts = getSavedLayouts();
  layouts.push(layout);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  return layout;
};

export const deleteLayout = (id: string): void => {
  const layouts = getSavedLayouts().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
};

export const exportLayoutAsJSON = (layout: SavedLayout): void => {
  const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${layout.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importLayoutFromJSON = (file: File): Promise<SavedLayout> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const layout = JSON.parse(reader.result as string) as SavedLayout;
        if (!layout.furniture || !Array.isArray(layout.furniture)) {
          reject(new Error('Invalid layout file'));
          return;
        }
        // Give it a new ID
        layout.id = `layout-${Date.now()}`;
        layout.savedAt = new Date().toISOString();
        const layouts = getSavedLayouts();
        layouts.push(layout);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
        resolve(layout);
      } catch {
        reject(new Error('Failed to parse layout file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
