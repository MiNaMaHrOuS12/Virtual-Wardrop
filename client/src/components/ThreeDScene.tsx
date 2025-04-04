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
  // Enhanced lighting setup
  return (
    <>
      {/* Enhanced environment and lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={1.8} 
        castShadow 
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0005}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={1} 
        color="#f0f9ff"
      />
      <spotLight
        position={[0, 15, 0]}
        intensity={1.2}
        angle={0.5}
        penumbra={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Rim light for better definition */}
      <pointLight 
        position={[0, 1, -4]} 
        intensity={0.5} 
        color="#e0f7fa"
      />
      
      {/* Larger floor with more premium look */}
      <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 128]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.15}
          metalness={0.3}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Subtle shadow catcher */}
      <mesh position={[0, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.8, 64]} />
        <shadowMaterial opacity={0.3} transparent />
      </mesh>
      
      {/* Mannequin */}
      <MannequinModel />
      
      {/* Enhanced orbit controls for better user experience */}
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 7}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={1.2}
        maxDistance={5}
        target={[0, 0.4, 0]}
        makeDefault
        enableDamping={true}
        dampingFactor={0.05}
      />
      
      {/* Premium environment lighting */}
      <Environment preset="studio" />
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
        camera={{ position: [0, 0.75, 2.8], fov: 40 }}
        style={{ 
          background: "linear-gradient(to bottom, #e0f2fe, #ffffff)",
          height: "80vh",  // Make the canvas taller
          minHeight: "500px" // Set minimum height
        }}
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
