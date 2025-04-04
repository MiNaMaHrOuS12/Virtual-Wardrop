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
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.5} 
      />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Mannequin */}
      <MannequinModel />
      
      {/* Orbit controls for user interaction */}
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={6}
      />
      
      {/* Environment lighting */}
      <Environment preset="city" />
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
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: "#f0f0f0" }}
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
