import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useMannequin } from "@/lib/stores/useMannequin";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { ScaleFactors } from "@/types";

// Helper function to get node hierarchy for debugging
function getNodeNameHierarchy(node: THREE.Object3D, depth = 0, maxDepth = 3): string {
  if (depth > maxDepth) return '';
  
  let result = ' '.repeat(depth * 2) + node.name;
  if ((node as THREE.Mesh).isMesh) {
    result += ' [MESH]';
  }
  result += '\n';
  
  for (const child of node.children) {
    result += getNodeNameHierarchy(child, depth + 1, maxDepth);
  }
  
  return result;
}

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
    <group position={[0, 0, 0]}>
      <primitive object={model} scale={1.6} castShadow receiveShadow />
    </group>
  );
};

const FemaleMannequin: React.FC<MannequinProps> = ({ scaleFactors }) => {
  // Load the 3D model
  const { scene } = useGLTF("/models/female_mannequin.glb");
  
  // Create a clone of the scene to avoid modifying the cached original
  const model = useMannequin3DModel(scene, scaleFactors);
  
  return (
    <group position={[0, 0, 0]}>
      <primitive object={model} scale={1.6} castShadow receiveShadow />
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
    // Debug: Log all node names to identify body parts
    console.log("Model hierarchy:", getNodeNameHierarchy(clonedScene));
    
    // Apply material and scaling to the entire model
    clonedScene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        // Apply material settings for all meshes
        if (meshNode.material) {
          const material = meshNode.material as THREE.MeshStandardMaterial;
          const newMaterial = material.clone();
          meshNode.material = newMaterial;
          newMaterial.color = new THREE.Color("#ffffff");
          newMaterial.roughness = 0.2;
          newMaterial.metalness = 0.1;
          newMaterial.envMapIntensity = 1.2;
          
          // Enable shadows for all meshes
          meshNode.castShadow = true;
          meshNode.receiveShadow = true;
        }
        
        // Apply scale based on node name and position
        const name = node.name.toLowerCase();
        
        // Safer approach with more specific matching and position-based scaling
        // Chest/Torso area
        if (name.includes('chest') || name.includes('torso') || name.includes('upper') || 
            (node.position.y > 0.5 && node.position.y < 1.2)) {
          node.scale.x *= chest;
          node.scale.z *= chest;
        } 
        // Waist area
        else if (name.includes('waist') || name.includes('abdomen') || name.includes('stomach') || 
                (node.position.y > 0 && node.position.y < 0.5)) {
          node.scale.x *= waist;
          node.scale.z *= waist;
        } 
        // Hip area
        else if (name.includes('hip') || name.includes('pelvis') || name.includes('thigh') || 
                (node.position.y > -0.3 && node.position.y < 0)) {
          node.scale.x *= hips;
          node.scale.z *= hips;
        }
        // Shoulders
        else if (name.includes('shoulder') || name.includes('clavicle') || 
                (Math.abs(node.position.x) > 0.2 && node.position.y > 0.8)) {
          node.scale.x *= shoulders;
          node.scale.z *= shoulders * 0.5;
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
      // Continuous slow rotation for better visibility
      mannequinRef.current.rotation.y = clock.getElapsedTime() * 0.15;
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
