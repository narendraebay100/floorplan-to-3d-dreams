import { Suspense, useRef, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut, Maximize, Download, Camera, Ruler, Palette, Footprints } from "lucide-react";
import { Generated3DModel } from "@/components/Generated3DModel";
import { useFloorPlan } from "@/contexts/FloorPlanContext";
import { exportSceneAsGLB, exportSceneAsGLTF, exportSceneAsOBJ } from "@/lib/exportScene";
import { toast } from "sonner";
import * as THREE from "three";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { FirstPersonControls } from "@/components/FirstPersonControls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Store refs globally so buttons outside Canvas can access them
let sceneRef: THREE.Scene | null = null;
let glRef: THREE.WebGLRenderer | null = null;

const SceneCapture = () => {
  const { scene, gl } = useThree();
  sceneRef = scene;
  glRef = gl;
  return null;
};

const Scene = ({ showMeasurements, walkthroughMode }: { showMeasurements: boolean; walkthroughMode: boolean }) => {
  return (
    <>
      <SceneCapture />
      {!walkthroughMode && (
        <>
          <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={75} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={30}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1, 0]}
          />
        </>
      )}
      {walkthroughMode && (
        <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={75} />
      )}
      <FirstPersonControls enabled={walkthroughMode} />
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" distance={30} decay={1} />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#ffffff" distance={25} decay={1} />
      
      <color attach="background" args={['#f1f5f9']} />
      
      <Grid 
        args={[20, 20]}
        position={[0, -0.2, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#cbd5e1"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#94a3b8"
        fadeDistance={30}
        fadeStrength={1}
      />
      
      <Generated3DModel showMeasurements={showMeasurements} />
    </>
  );
};

const defaultRoomColors: Record<string, { floor: string; wall: string }> = {
  living: { floor: '#8B4513', wall: '#F5F5DC' },
  bedroom: { floor: '#D2691E', wall: '#E6E6FA' },
  kitchen: { floor: '#696969', wall: '#FFFFFF' },
  bathroom: { floor: '#708090', wall: '#F0F8FF' },
  hallway: { floor: '#BC8F8F', wall: '#F8F8FF' },
  other: { floor: '#D3D3D3', wall: '#DCDCDC' },
};

const getDefaultColor = (type: string, part: 'floor' | 'wall') =>
  (defaultRoomColors[type] || defaultRoomColors.other)[part];

interface ColorTheme {
  name: string;
  description: string;
  colors: Record<string, { floor: string; wall: string }>;
}

const presetThemes: ColorTheme[] = [
  {
    name: 'Modern',
    description: 'Clean whites & cool grays',
    colors: {
      living: { floor: '#3C3C3C', wall: '#FAFAFA' },
      bedroom: { floor: '#4A4A4A', wall: '#F0F0F0' },
      kitchen: { floor: '#2C2C2C', wall: '#FFFFFF' },
      bathroom: { floor: '#505050', wall: '#E8E8E8' },
      hallway: { floor: '#383838', wall: '#F5F5F5' },
      other: { floor: '#444444', wall: '#EEEEEE' },
    },
  },
  {
    name: 'Rustic',
    description: 'Warm wood & earthy tones',
    colors: {
      living: { floor: '#6B3A2A', wall: '#E8D5B7' },
      bedroom: { floor: '#7A4B3A', wall: '#F2E0C8' },
      kitchen: { floor: '#5C2E1E', wall: '#D4B896' },
      bathroom: { floor: '#8B6F4E', wall: '#EDE0D0' },
      hallway: { floor: '#6E4530', wall: '#E6D2B5' },
      other: { floor: '#7B5B3A', wall: '#DFC8A8' },
    },
  },
  {
    name: 'Scandinavian',
    description: 'Light birch & soft pastels',
    colors: {
      living: { floor: '#C8AD7F', wall: '#FEFEFE' },
      bedroom: { floor: '#D4BA8A', wall: '#F8F6F0' },
      kitchen: { floor: '#BFA878', wall: '#FFFFFF' },
      bathroom: { floor: '#B0C4B1', wall: '#F5F9F6' },
      hallway: { floor: '#CAAF82', wall: '#FAFAF7' },
      other: { floor: '#C2A87C', wall: '#F7F5EF' },
    },
  },
  {
    name: 'Industrial',
    description: 'Raw concrete & steel accents',
    colors: {
      living: { floor: '#5A5A5A', wall: '#9E9E9E' },
      bedroom: { floor: '#636363', wall: '#A8A8A8' },
      kitchen: { floor: '#4E4E4E', wall: '#8F8F8F' },
      bathroom: { floor: '#6B6B6B', wall: '#B0B0B0' },
      hallway: { floor: '#555555', wall: '#999999' },
      other: { floor: '#606060', wall: '#A0A0A0' },
    },
  },
  {
    name: 'Tropical',
    description: 'Lush greens & sandy neutrals',
    colors: {
      living: { floor: '#8B7355', wall: '#F5F0E1' },
      bedroom: { floor: '#9C8465', wall: '#EDE8D5' },
      kitchen: { floor: '#7A6348', wall: '#F0EBD8' },
      bathroom: { floor: '#5F8A6E', wall: '#E8F0EA' },
      hallway: { floor: '#887050', wall: '#F2ECDD' },
      other: { floor: '#7E6A4F', wall: '#EEE9D9' },
    },
  },
];

export const Viewer3D = () => {
  const { currentFloorPlan, isGenerating, roomColors, setRoomColors } = useFloorPlan();
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const applyTheme = useCallback((theme: ColorTheme) => {
    if (!currentFloorPlan) return;
    const newColors: Record<string, { floor?: string; wall?: string }> = {};
    currentFloorPlan.rooms.forEach((room) => {
      const tc = theme.colors[room.type] || theme.colors.living;
      newColors[room.id] = { floor: tc.floor, wall: tc.wall };
    });
    setRoomColors(newColors);
    setActiveTheme(theme.name);
    toast.success(`Applied "${theme.name}" theme`);
  }, [currentFloorPlan, setRoomColors]);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = useCallback(() => {
    if (!viewerRef.current) return;
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => toast.error('Fullscreen not supported'));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleExportGLB = useCallback(() => {
    if (!sceneRef) {
      toast.error("No 3D scene available to export");
      return;
    }
    const name = currentFloorPlan?.name?.replace(/\.[^/.]+$/, '') || 'floor-plan-3d';
    toast.promise(
      new Promise<void>((resolve) => {
        exportSceneAsGLB(sceneRef!, `${name}.glb`);
        setTimeout(resolve, 500);
      }),
      { loading: 'Exporting GLB…', success: 'GLB file downloaded!', error: 'Export failed' }
    );
  }, [currentFloorPlan]);

  const handleExportGLTF = useCallback(() => {
    if (!sceneRef) {
      toast.error("No 3D scene available to export");
      return;
    }
    const name = currentFloorPlan?.name?.replace(/\.[^/.]+$/, '') || 'floor-plan-3d';
    toast.promise(
      new Promise<void>((resolve) => {
        exportSceneAsGLTF(sceneRef!, `${name}.gltf`);
        setTimeout(resolve, 500);
      }),
      { loading: 'Exporting GLTF…', success: 'GLTF file downloaded!', error: 'Export failed' }
    );
  }, [currentFloorPlan]);

  const handleExportOBJ = useCallback(() => {
    if (!sceneRef) {
      toast.error("No 3D scene available to export");
      return;
    }
    const name = currentFloorPlan?.name?.replace(/\.[^/.]+$/, '') || 'floor-plan-3d';
    exportSceneAsOBJ(sceneRef!, `${name}.obj`);
    toast.success('OBJ file downloaded!');
  }, [currentFloorPlan]);

  const handleScreenshot = useCallback(() => {
    if (!glRef || !sceneRef) {
      toast.error("No 3D scene available to capture");
      return;
    }
    try {
      const canvas = glRef.domElement;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      const name = currentFloorPlan?.name?.replace(/\.[^/.]+$/, '') || 'floor-plan-3d';
      link.download = `${name}-screenshot.png`;
      link.click();
      toast.success('Screenshot saved!');
    } catch {
      toast.error('Failed to capture screenshot');
    }
  }, [currentFloorPlan]);

  return (
    <section id="viewer-3d" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Interactive 3D Visualization
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentFloorPlan 
              ? `Exploring: ${currentFloorPlan.name}` 
              : "Upload a floor plan above to generate your 3D model"
            }
          </p>
        </div>

        <Card ref={viewerRef} className="architectural-elevation overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b bg-surface-subtle flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Toggle
                size="sm"
                pressed={showMeasurements}
                onPressedChange={setShowMeasurements}
                aria-label="Toggle measurements"
                className="border border-input"
              >
                <Ruler className="h-4 w-4 mr-2" />
                Measurements
              </Toggle>
              <Toggle
                size="sm"
                pressed={showColorPanel}
                onPressedChange={setShowColorPanel}
                aria-label="Toggle color panel"
                className="border border-input"
              >
                <Palette className="h-4 w-4 mr-2" />
                Colors
              </Toggle>
              <Button variant="outline" size="sm" onClick={handleScreenshot}>
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export 3D
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportGLB}>
                    Export as GLB (binary)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportGLTF}>
                    Export as GLTF (JSON)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportOBJ}>
                    Export as OBJ (mesh)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" onClick={handleFullscreen}>
                <Maximize className="h-4 w-4 mr-2" />
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="h-[600px] relative bg-muted/30">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                {/* Skeleton layout */}
                <div className="w-full h-full p-8 flex flex-col items-center justify-center gap-6">
                  {/* Animated 3D wireframe cube */}
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-lg animate-pulse" />
                    <div className="absolute inset-3 border-2 border-primary/50 rounded-md animate-pulse [animation-delay:150ms]" />
                    <div className="absolute inset-6 border-2 border-primary/70 rounded animate-pulse [animation-delay:300ms]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>

                  {/* Progress text */}
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-foreground animate-pulse">
                      Building your 3D model…
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing walls, detecting rooms, generating geometry
                    </p>
                  </div>

                  {/* Skeleton bars */}
                  <div className="w-full max-w-md space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-3/4 rounded-full bg-primary/60 animate-[shimmer_1.5s_ease-in-out_infinite]" />
                      </div>
                      <span className="text-xs text-muted-foreground w-24">Detecting walls</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-1/2 rounded-full bg-primary/60 animate-[shimmer_1.5s_ease-in-out_infinite_0.3s]" />
                      </div>
                      <span className="text-xs text-muted-foreground w-24">Mapping rooms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-primary/20 overflow-hidden">
                        <div className="h-full w-1/4 rounded-full bg-primary/60 animate-[shimmer_1.5s_ease-in-out_infinite_0.6s]" />
                      </div>
                      <span className="text-xs text-muted-foreground w-24">3D generation</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <Canvas
              shadows
              gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
              camera={{ position: [8, 6, 8], fov: 75 }}
              style={{ opacity: isGenerating ? 0.15 : 1, transition: 'opacity 0.5s ease' }}
            >
              <Suspense fallback={null}>
                <Scene showMeasurements={showMeasurements} walkthroughMode={walkthroughMode} />
              </Suspense>
            </Canvas>
          </div>

          {/* Room Color Customization Panel */}
          {showColorPanel && currentFloorPlan && (
            <div className="p-4 border-t bg-muted/30 space-y-4">
              {/* Theme Presets */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-primary" />
                  Color Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {presetThemes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => applyTheme(theme)}
                      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left ${
                        activeTheme === theme.name
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-input bg-background hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        {['living', 'bedroom', 'kitchen'].map((type) => (
                          <div
                            key={type}
                            className="w-4 h-4 rounded-full border border-background"
                            style={{ backgroundColor: theme.colors[type]?.floor }}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{theme.name}</p>
                        <p className="text-[10px] text-muted-foreground">{theme.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Per-Room Colors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">Custom Room Colors</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setRoomColors({}); setActiveTheme(null); }}
                    className="text-xs text-muted-foreground"
                  >
                    Reset All
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentFloorPlan.rooms.map((room) => (
                    <div key={room.id} className="flex items-center gap-3 p-2 rounded-lg bg-background border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{room.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{room.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <Label className="text-[10px] text-muted-foreground">Floor</Label>
                          <input
                            type="color"
                            value={roomColors[room.id]?.floor || getDefaultColor(room.type, 'floor')}
                            onChange={(e) => {
                              setRoomColors(prev => ({
                                ...prev,
                                [room.id]: { ...prev[room.id], floor: e.target.value }
                              }));
                              setActiveTheme(null);
                            }}
                            className="block w-8 h-8 rounded cursor-pointer border border-input"
                          />
                        </div>
                        <div className="text-center">
                          <Label className="text-[10px] text-muted-foreground">Wall</Label>
                          <input
                            type="color"
                            value={roomColors[room.id]?.wall || getDefaultColor(room.type, 'wall')}
                            onChange={(e) => {
                              setRoomColors(prev => ({
                                ...prev,
                                [room.id]: { ...prev[room.id], wall: e.target.value }
                              }));
                              setActiveTheme(null);
                            }}
                            className="block w-8 h-8 rounded cursor-pointer border border-input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info panel */}
          <div className="p-4 bg-surface-subtle border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-foreground">Controls:</span>
                <span className="text-muted-foreground ml-2">Click & drag to rotate</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Zoom:</span>
                <span className="text-muted-foreground ml-2">Scroll wheel or pinch</span>
              </div>
              <div>
                <span className="font-medium text-foreground">Pan:</span>
                <span className="text-muted-foreground ml-2">Right-click & drag</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
