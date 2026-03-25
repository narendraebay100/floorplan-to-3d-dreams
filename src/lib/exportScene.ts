import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';

export const exportSceneAsGLB = (scene: THREE.Scene, filename = 'floor-plan-3d.glb') => {
  const exporter = new GLTFExporter();

  exporter.parse(
    scene,
    (result) => {
      const blob = new Blob([result as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('GLB export failed:', error);
    },
    { binary: true }
  );
};

export const exportSceneAsGLTF = (scene: THREE.Scene, filename = 'floor-plan-3d.gltf') => {
  const exporter = new GLTFExporter();

  exporter.parse(
    scene,
    (result) => {
      const json = JSON.stringify(result, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    (error) => {
      console.error('GLTF export failed:', error);
    },
    { binary: false }
  );
};
