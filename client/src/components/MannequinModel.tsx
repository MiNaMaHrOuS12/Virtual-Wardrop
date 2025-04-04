import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useMannequin } from "@/lib/stores/useMannequin";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

// Male and female mannequin components
const MaleMannequin = ({ scaleFactors }) => {
  // Create a simple mannequin using primitive shapes
  // These would be replaced with actual 3D models in a production environment
  
  // Apply scale factors from measurements
  const {
    height,
    chest,
    waist,
    hips,
    shoulders,
    limbs,
    neck
  } = scaleFactors;
  
  // Load a texture
  const texture = useTexture("/textures/wood.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  // Scale constants for mannequin parts
  const torsoHeight = 0.4 * height;
  const headRadius = 0.08 * height;
  const armLength = 0.3 * height * limbs;
  const legLength = 0.45 * height * limbs;
  
  return (
    <group position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, height * 0.5 - headRadius * 0.5, 0]}>
        <sphereGeometry args={[headRadius * neck, 32, 32]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, height * 0.25, 0]}>
        <boxGeometry 
          args={[
            shoulders * 0.15 * shoulders, 
            torsoHeight, 
            chest * 0.1 * chest
          ]} 
        />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.6} 
          metalness={0.1} 
          map={texture}
        />
      </mesh>
      
      {/* Waist/Hip area */}
      <mesh position={[0, height * 0.1 - 0.05, 0]}>
        <boxGeometry 
          args={[
            hips * 0.14 * hips, 
            0.2 * height, 
            waist * 0.1 * waist
          ]} 
        />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.6} 
          metalness={0.1}
          map={texture}
        />
      </mesh>
      
      {/* Left Arm */}
      <mesh position={[-shoulders * 0.1 * shoulders, height * 0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
        <cylinderGeometry args={[0.03 * height, 0.02 * height, armLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[shoulders * 0.1 * shoulders, height * 0.3, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <cylinderGeometry args={[0.03 * height, 0.02 * height, armLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-hips * 0.05 * hips, -0.15 * height, 0]}>
        <cylinderGeometry args={[0.04 * height, 0.03 * height, legLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[hips * 0.05 * hips, -0.15 * height, 0]}>
        <cylinderGeometry args={[0.04 * height, 0.03 * height, legLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

const FemaleMannequin = ({ scaleFactors }) => {
  // Similar to male mannequin but with female proportions
  // Would use proper 3D models in a production environment
  
  // Apply scale factors from measurements
  const {
    height,
    chest,
    waist,
    hips,
    shoulders,
    limbs,
    neck
  } = scaleFactors;
  
  // Load a texture
  const texture = useTexture("/textures/wood.jpg");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  
  // Scale constants for mannequin parts
  const torsoHeight = 0.4 * height;
  const headRadius = 0.075 * height;
  const armLength = 0.3 * height * limbs;
  const legLength = 0.45 * height * limbs;
  
  return (
    <group position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, height * 0.5 - headRadius * 0.5, 0]}>
        <sphereGeometry args={[headRadius * neck, 32, 32]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          roughness={0.7} 
          metalness={0.1} 
        />
      </mesh>
      
      {/* Torso - more curved for female */}
      <mesh position={[0, height * 0.25, 0]}>
        <boxGeometry 
          args={[
            shoulders * 0.13 * shoulders, 
            torsoHeight, 
            chest * 0.11 * chest
          ]} 
        />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.6} 
          metalness={0.1} 
          map={texture}
        />
      </mesh>
      
      {/* Waist area - more defined for female */}
      <mesh position={[0, height * 0.15, 0]}>
        <boxGeometry 
          args={[
            waist * 0.12 * waist, 
            0.1 * height, 
            waist * 0.09 * waist
          ]} 
        />
        <meshStandardMaterial 
          color="#f5f5f5" 
          roughness={0.6} 
          metalness={0.1}
          map={texture}
        />
      </mesh>
      
      {/* Hip area - wider for female */}
      <mesh position={[0, height * 0.05, 0]}>
        <boxGeometry 
          args={[
            hips * 0.15 * hips, 
            0.15 * height, 
            hips * 0.11 * hips
          ]} 
        />
        <meshStandardMaterial 
          color="#f0f0f0" 
          roughness={0.6} 
          metalness={0.1}
          map={texture}
        />
      </mesh>
      
      {/* Left Arm */}
      <mesh position={[-shoulders * 0.09 * shoulders, height * 0.3, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
        <cylinderGeometry args={[0.025 * height, 0.02 * height, armLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[shoulders * 0.09 * shoulders, height * 0.3, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <cylinderGeometry args={[0.025 * height, 0.02 * height, armLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-hips * 0.06 * hips, -0.15 * height, 0]}>
        <cylinderGeometry args={[0.035 * height, 0.025 * height, legLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[hips * 0.06 * hips, -0.15 * height, 0]}>
        <cylinderGeometry args={[0.035 * height, 0.025 * height, legLength, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
};

export default function MannequinModel() {
  const { gender, scaleFactors } = useMannequin();
  const mannequinRef = useRef<THREE.Group>(null);
  
  // Rotate mannequin for better viewing
  useFrame(({ clock }) => {
    if (mannequinRef.current) {
      // Very slow rotation for display purposes
      mannequinRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
    }
  });
  
  // Debug logs when scale factors change significantly
  useEffect(() => {
    console.log("Mannequin updated with scale factors:", scaleFactors);
  }, [scaleFactors]);
  
  return (
    <group ref={mannequinRef}>
      {gender === "male" ? (
        <MaleMannequin scaleFactors={scaleFactors} />
      ) : (
        <FemaleMannequin scaleFactors={scaleFactors} />
      )}
      
      {/* Floor/stand for the mannequin */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          roughness={0.5} 
          metalness={0.3} 
        />
      </mesh>
    </group>
  );
}
