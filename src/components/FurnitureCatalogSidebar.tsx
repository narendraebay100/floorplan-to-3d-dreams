import { useState, useRef } from 'react';
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES, type PlacedFurniture } from '@/lib/furnitureCatalog';
import { getSavedLayouts, saveLayout, deleteLayout, exportLayoutAsJSON, importLayoutFromJSON, type SavedLayout } from '@/lib/furnitureLayouts';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, RotateCw, ChevronLeft, ChevronRight, Plus, Save, FolderOpen, Download, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface FurnitureCatalogSidebarProps {
  placedFurniture: PlacedFurniture[];
  onAddFurniture: (itemId: string) => void;
  onRemoveFurniture: (instanceId: string) => void;
  onRotateFurniture: (instanceId: string) => void;
  onClearAll: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const FurnitureCatalogSidebar = ({
  placedFurniture,
  onAddFurniture,
  onRemoveFurniture,
  onRotateFurniture,
  onClearAll,
  collapsed,
  onToggleCollapse,
}: FurnitureCatalogSidebarProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('seating');

  const filteredItems = FURNITURE_CATALOG.filter(i => i.category === activeCategory);

  if (collapsed) {
    return (
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-start pt-2">
        <button
          onClick={onToggleCollapse}
          className="bg-background border border-l-0 rounded-r-md p-1.5 shadow-sm hover:bg-muted transition-colors"
          title="Open furniture catalog"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-0 bottom-0 z-20 w-64 bg-background/95 backdrop-blur border-r shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">🪑 Furniture</h3>
        <button onClick={onToggleCollapse} className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 p-2 border-b">
        {FURNITURE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-[11px] px-2 py-1 rounded transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground font-medium'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => onAddFurniture(item.id)}
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left group"
            >
              <span className="text-lg">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.dimensions.width}×{item.dimensions.depth}m
                </p>
              </div>
              <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Placed items */}
      {placedFurniture.length > 0 && (
        <div className="border-t">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-[11px] font-medium text-muted-foreground">
              Placed ({placedFurniture.length})
            </p>
            <Button variant="ghost" size="sm" onClick={onClearAll} className="h-6 text-[10px] text-destructive hover:text-destructive">
              Clear All
            </Button>
          </div>
          <ScrollArea className="max-h-40">
            <div className="px-2 pb-2 space-y-1">
              {placedFurniture.map(placed => {
                const item = FURNITURE_CATALOG.find(i => i.id === placed.itemId);
                if (!item) return null;
                return (
                  <div key={placed.instanceId} className="flex items-center gap-1.5 p-1.5 rounded bg-muted/50 text-xs">
                    <span>{item.emoji}</span>
                    <span className="flex-1 truncate text-foreground">{item.name}</span>
                    <button
                      onClick={() => onRotateFurniture(placed.instanceId)}
                      className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
                      title="Rotate 45°"
                    >
                      <RotateCw className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onRemoveFurniture(placed.instanceId)}
                      className="p-1 hover:bg-background rounded text-destructive/70 hover:text-destructive"
                      title="Remove"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
