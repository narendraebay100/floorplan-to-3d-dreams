import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FirstPersonControlsProps {
  enabled: boolean;
  moveSpeed?: number;
  lookSpeed?: number;
  eyeHeight?: number;
}

export const FirstPersonControls = ({
  enabled,
  moveSpeed = 4,
  lookSpeed = 0.002,
  eyeHeight = 1.6,
}: FirstPersonControlsProps) => {
  const { camera, gl } = useThree();
  const keysRef = useRef<Set<string>>(new Set());
  const isLockedRef = useRef(false);
  const eulerRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const velocityRef = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.code);
  }, []);

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.code);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isLockedRef.current || !enabled) return;
    const euler = eulerRef.current;
    euler.setFromQuaternion(camera.quaternion);
    euler.y -= e.movementX * lookSpeed;
    euler.x -= e.movementY * lookSpeed;
    euler.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.x));
    camera.quaternion.setFromEuler(euler);
  }, [camera, lookSpeed, enabled]);

  const onPointerLockChange = useCallback(() => {
    isLockedRef.current = document.pointerLockElement === gl.domElement;
  }, [gl]);

  const onClick = useCallback(() => {
    if (enabled && !isLockedRef.current) {
      gl.domElement.requestPointerLock();
    }
  }, [enabled, gl]);

  useEffect(() => {
    if (!enabled) {
      if (isLockedRef.current) {
        document.exitPointerLock();
      }
      keysRef.current.clear();
      return;
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    gl.domElement.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      gl.domElement.removeEventListener('click', onClick);
      if (isLockedRef.current) {
        document.exitPointerLock();
      }
    };
  }, [enabled, onKeyDown, onKeyUp, onMouseMove, onPointerLockChange, onClick, gl]);

  // Set initial position when entering walkthrough
  useEffect(() => {
    if (enabled) {
      camera.position.set(0, eyeHeight, 5);
      eulerRef.current.set(0, 0, 0, 'YXZ');
      camera.quaternion.setFromEuler(eulerRef.current);
    }
  }, [enabled, camera, eyeHeight]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const keys = keysRef.current;
    const vel = velocityRef.current;
    const dir = direction.current;

    // Deceleration
    vel.x -= vel.x * 8.0 * delta;
    vel.z -= vel.z * 8.0 * delta;

    // Direction from keys
    dir.z = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
    dir.x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'));
    dir.normalize();

    vel.z -= dir.z * moveSpeed * delta * 10;
    vel.x -= dir.x * moveSpeed * delta * 10;

    // Move camera
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    camera.position.addScaledVector(forward, -vel.z * delta);
    camera.position.addScaledVector(right, -vel.x * delta);

    // Lock Y position
    camera.position.y = eyeHeight;
  });

  return null;
};
