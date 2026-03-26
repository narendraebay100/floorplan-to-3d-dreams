import { Suspense, useRef, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut, Maximize, Download, Camera, Ruler, Palette, ChevronDown, ChevronUp } from "lucide-react";
import { Generated3DModel } from "@/components/Generated3DModel";
import { useFloorPlan } from "@/contexts/FloorPlanContext";
import { exportSceneAsGLB, exportSceneAsGLTF, exportSceneAsOBJ } from "@/lib/exportScene";
import { toast } from "sonner";
import * as THREE from "three";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
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

const Scene = ({ showMeasurements }: { showMeasurements: boolean }) => {
  return (
    <>
      <SceneCapture />
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

export const Viewer3D = () => {
  const { currentFloorPlan, isGenerating, roomColors, setRoomColors } = useFloorPlan();
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
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
                <Scene showMeasurements={showMeasurements} />
              </Suspense>
            </Canvas>
          </div>

          {/* Room Color Customization Panel */}
          {showColorPanel && currentFloorPlan && (
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Room Colors
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRoomColors({})}
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
                          onChange={(e) => setRoomColors(prev => ({
                            ...prev,
                            [room.id]: { ...prev[room.id], floor: e.target.value }
                          }))}
                          className="block w-8 h-8 rounded cursor-pointer border border-input"
                        />
                      </div>
                      <div className="text-center">
                        <Label className="text-[10px] text-muted-foreground">Wall</Label>
                        <input
                          type="color"
                          value={roomColors[room.id]?.wall || getDefaultColor(room.type, 'wall')}
                          onChange={(e) => setRoomColors(prev => ({
                            ...prev,
                            [room.id]: { ...prev[room.id], wall: e.target.value }
                          }))}
                          className="block w-8 h-8 rounded cursor-pointer border border-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
