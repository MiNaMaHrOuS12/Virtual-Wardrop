import { useRef, useEffect, useMemo } from "react";
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
  
  // Clone the scene to avoid modifying the original
  const model = useMemo(() => {
    const clonedScene = scene.clone(true);
    
    // Set enhanced material for better visibility and shadows
    clonedScene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        if (meshNode.material) {
          const material = meshNode.material as THREE.MeshStandardMaterial;
          meshNode.material = enhanceMannequinMaterial(material);
          
          // Enhance shadows for better visibility
          meshNode.castShadow = true;
          meshNode.receiveShadow = true;
          
          // Add a slight scale to avoid z-fighting
          meshNode.scale.multiplyScalar(1.001);
        }
      }
    });
    
    return clonedScene;
  }, [scene]);
  
  // Scale adjustments
  const { chest, waist, hips, height, shoulders } = scaleFactors;
  
  useEffect(() => {
    console.log("Updated male model with scales:", scaleFactors);
    
    model.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        const name = node.name.toLowerCase();
        const y = node.position.y;
        
        // Reset scales to prevent compounding
        node.scale.set(1, 1, 1);
        
        // Apply part-specific scaling
        if (name.includes('chest') || name.includes('torso') || (y > 0.5 && y < 1.2)) {
          node.scale.x = chest;
          node.scale.z = chest;
        } else if (name.includes('waist') || (y > 0 && y < 0.5)) {
          node.scale.x = waist;
          node.scale.z = waist;
        } else if (name.includes('hip') || (y > -0.3 && y < 0)) {
          node.scale.x = hips;
          node.scale.z = hips;
        } else if (name.includes('shoulder') || (Math.abs(node.position.x) > 0.2 && y > 0.8)) {
          node.scale.x = shoulders;
          node.scale.z = shoulders * 0.5;
        }
      }
    });
    
    // Apply height scaling to entire model
    model.scale.y = height;
    
  }, [model, chest, waist, hips, height, shoulders]);
  
  return (
    <group position={[0, 0, 0]}>
      <primitive object={model} scale={1.6} castShadow receiveShadow />
    </group>
  );
};

const FemaleMannequin: React.FC<MannequinProps> = ({ scaleFactors }) => {
  // Load the 3D model
  const { scene } = useGLTF("/models/female_mannequin.glb");
  
  // Clone the scene to avoid modifying the original
  const model = useMemo(() => {
    const clonedScene = scene.clone(true);
    
    // Set enhanced material for better visibility and shadows
    clonedScene.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        if (meshNode.material) {
          const material = meshNode.material as THREE.MeshStandardMaterial;
          meshNode.material = enhanceMannequinMaterial(material);
          
          // Enhance shadows for better visibility
          meshNode.castShadow = true;
          meshNode.receiveShadow = true;
          
          // Add a slight scale to avoid z-fighting
          meshNode.scale.multiplyScalar(1.001);
        }
      }
    });
    
    return clonedScene;
  }, [scene]);
  
  // Scale adjustments
  const { chest, waist, hips, height, shoulders } = scaleFactors;
  
  useEffect(() => {
    console.log("Updated female model with scales:", scaleFactors);
    
    model.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Mesh).isMesh) {
        const meshNode = node as THREE.Mesh;
        const name = node.name.toLowerCase();
        const y = node.position.y;
        
        // Reset scales to prevent compounding
        node.scale.set(1, 1, 1);
        
        // Apply part-specific scaling
        if (name.includes('chest') || name.includes('torso') || (y > 0.5 && y < 1.2)) {
          node.scale.x = chest;
          node.scale.z = chest;
        } else if (name.includes('waist') || (y > 0 && y < 0.5)) {
          node.scale.x = waist;
          node.scale.z = waist;
        } else if (name.includes('hip') || (y > -0.3 && y < 0)) {
          node.scale.x = hips;
          node.scale.z = hips;
        } else if (name.includes('shoulder') || (Math.abs(node.position.x) > 0.2 && y > 0.8)) {
          node.scale.x = shoulders;
          node.scale.z = shoulders * 0.5;
        }
      }
    });
    
    // Apply height scaling to entire model
    model.scale.y = height;
    
  }, [model, chest, waist, hips, height, shoulders]);
  
  return (
    <group position={[0, 0, 0]}>
      <primitive object={model} scale={1.6} castShadow receiveShadow />
    </group>
  );
};

// Helper function to improve material settings for better visibility
function enhanceMannequinMaterial(material: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  const newMaterial = material.clone();
  // Brighter white for better contrast
  newMaterial.color = new THREE.Color("#ffffff");
  // Lower roughness for more glossy appearance
  newMaterial.roughness = 0.15;
  // Slight metalness for better highlights
  newMaterial.metalness = 0.12;
  // Increased environment map intensity for better reflections
  newMaterial.envMapIntensity = 1.5;
  // Add slight emissive glow to make it stand out
  newMaterial.emissive = new THREE.Color("#444444");
  newMaterial.emissiveIntensity = 0.05;
  
  return newMaterial;
}

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
