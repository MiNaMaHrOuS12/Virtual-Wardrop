import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useMannequin } from "@/lib/stores/useMannequin";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { ScaleFactors } from "@/types";

interface MannequinProps {
  scaleFactors: ScaleFactors;
}

// Male and female mannequin components using 3D models
const MaleMannequin: React.FC<MannequinProps> = ({ scaleFactors }) => {
  // Load the 3D model
  const { scene } = useGLTF("/models/male_mannequin.glb");
  
  // Create a clone of the scene to avoid modifying the cached original
  const model = useMannequin3DModel(scene, scaleFactors);
  
  return (
    <group position={[0, -0.6, 0]}>
      <primitive object={model} scale={1.5} />
    </group>
  );
};

const FemaleMannequin: React.FC<MannequinProps> = ({ scaleFactors }) => {
  // Load the 3D model
  const { scene } = useGLTF("/models/female_mannequin.glb");
  
  // Create a clone of the scene to avoid modifying the cached original
  const model = useMannequin3DModel(scene, scaleFactors);
  
  return (
    <group position={[0, -0.6, 0]}>
      <primitive object={model} scale={1.5} />
    </group>
  );
};

// Custom hook to apply scale factors to the mannequin model
function useMannequin3DModel(originalScene: THREE.Object3D, scaleFactors: ScaleFactors): THREE.Object3D {
  const modelRef = useRef<THREE.Object3D | null>(null);
  
  useEffect(() => {
    if (!originalScene) return;
    
    // Clone the original scene to avoid modifying the cached version
    const clonedScene = originalScene.clone(true);
    
    // Apply scale factors to the model
    const { height, chest, waist, hips, shoulders } = scaleFactors;
    
    // Set the model to the ref
    modelRef.current = clonedScene;
    
    // Apply scaling to specific parts of the model
    clonedScene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        // Apply material settings for all meshes
        if (meshNode.material) {
          const material = meshNode.material as THREE.MeshStandardMaterial;
          meshNode.material = material.clone();
          material.color = new THREE.Color("#f0f0f0");
          material.roughness = 0.4;
          material.metalness = 0.1;
        }
        
        // Apply scale to specific body parts based on node name
        // Note: These are example node names - actual names depend on the model structure
        const name = node.name.toLowerCase();
        
        if (name.includes('torso') || name.includes('chest')) {
          node.scale.x *= chest;
          node.scale.z *= chest;
        } else if (name.includes('waist')) {
          node.scale.x *= waist;
          node.scale.z *= waist;
        } else if (name.includes('hip')) {
          node.scale.x *= hips;
          node.scale.z *= hips;
        } else if (name.includes('shoulder')) {
          node.scale.x *= shoulders;
        }
      }
    });
    
    // Apply overall height scaling
    clonedScene.scale.y *= height;
    
    return () => {
      // Clean up
      if (modelRef.current) {
        modelRef.current.traverse((node: THREE.Object3D) => {
          if ((node as THREE.Mesh).isMesh) {
            const meshNode = node as THREE.Mesh;
            if (meshNode.material) {
              (meshNode.material as THREE.Material).dispose();
            }
            if (meshNode.geometry) {
              meshNode.geometry.dispose();
            }
          }
        });
      }
    };
  }, [originalScene, scaleFactors]);
  
  return modelRef.current || originalScene.clone();
};

export default function MannequinModel() {
  const { gender, scaleFactors } = useMannequin();
  const mannequinRef = useRef<THREE.Group>(null);
  
  // Create a more efficient rotation with useFrame
  // This avoids constant re-renders on measurement changes
  useFrame(({ clock }) => {
    if (mannequinRef.current) {
      // Very slow rotation for display purposes
      mannequinRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.3;
    }
  });
  
  // Only log significant scale factor changes to reduce noise
  useEffect(() => {
    // Skip logging for minor changes to reduce console spam
    console.log("Mannequin updated with scale factors:", scaleFactors);
  }, [
    Math.round(scaleFactors.chest * 10),
    Math.round(scaleFactors.waist * 10),
    Math.round(scaleFactors.hips * 10),
    Math.round(scaleFactors.height * 10),
    Math.round(scaleFactors.shoulders * 10),
  ]);
  
  return (
    <group ref={mannequinRef}>
      {gender === "male" ? (
        <MaleMannequin scaleFactors={scaleFactors} />
      ) : (
        <FemaleMannequin scaleFactors={scaleFactors} />
      )}
      
      {/* No additional platform needed since we have one in the scene */}
    </group>
  );
}
