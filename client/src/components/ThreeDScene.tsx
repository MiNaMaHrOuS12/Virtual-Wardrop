import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, Environment, useProgress, Html } from "@react-three/drei";
import MannequinModel from "./MannequinModel";
import { useClothing } from "@/lib/stores/useClothing";
import { useDrop } from "react-dnd";
import { useAudio } from "@/lib/stores/useAudio";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-white bg-opacity-80 p-4 rounded-md shadow-md">
        <div className="text-center font-medium">Loading... {progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

function Scene() {
  // Lighting setup
  return (
    <>
      {/* Environment and lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1.3} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.7} 
      />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.9}
        angle={0.4}
        penumbra={0.3}
        castShadow
      />
      
      {/* Floor - a single unified platform with a subtle gradient */}
      <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial 
          color="#f8f9fa" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Mannequin */}
      <MannequinModel />
      
      {/* Orbit controls for user interaction */}
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={1.5}
        maxDistance={4}
        target={[0, 0.5, 0]}
        makeDefault
      />
      
      {/* Environment lighting */}
      <Environment preset="sunset" />
    </>
  );
}

export default function ThreeDScene() {
  const [isReady, setIsReady] = useState(false);
  const { selectedItems } = useClothing();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  
  // Setup drop target for clothing items
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "clothing-item",
    drop: () => ({ name: "Mannequin" }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  
  // Initialize audio elements
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.5;
    
    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.7;
    
    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);
    
    setIsReady(true);
    
    return () => {
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-center">Loading resources...</div>
      </div>
    );
  }
  
  return (
    <div 
      ref={drop} 
      className={`relative w-full h-full rounded-lg overflow-hidden ${
        isOver ? "border-2 border-blue-500" : ""
      }`}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}
        style={{ background: "linear-gradient(to bottom, #e0f2fe, #ffffff)" }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        frameloop="demand"
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Indicator for selected items */}
      {selectedItems.length > 0 && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-md shadow-md">
          <div className="text-sm font-medium">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} applied
          </div>
        </div>
      )}
      
      {/* Drop zone indicator */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
            Drop to try on
          </div>
        </div>
      )}
    </div>
  );
}
