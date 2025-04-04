import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { OrbitControls, Environment, useProgress, Html } from "@react-three/drei";
import MannequinModel from "./MannequinModel";
import { useClothing } from "@/lib/stores/useClothing";
import { useDrop } from "react-dnd";
import { useAudio } from "@/lib/stores/useAudio";
import * as THREE from "three";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "./ui/button";

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
  // Enhanced lighting setup with photographic three-point lighting
  return (
    <>
      {/* Enhanced environment and lighting with a distinct background */}
      <color attach="background" args={["#e0e0e0"]} />
      
      {/* Ambient light - fill light - increased for better visibility */}
      <ambientLight intensity={1.5} />
      
      {/* Key light - main directional light - improved settings for sharper shadows */}
      <directionalLight 
        position={[4, 6, 4]} 
        intensity={3.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00005}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        color="#ffffff"
      />
      
      {/* Fill light - increased for more even lighting */}
      <directionalLight 
        position={[-4, 4, -2]} 
        intensity={2.0} 
        color="#ffffff"
      />
      
      {/* Front light for better visibility */}
      <directionalLight 
        position={[0, 2, 8]} 
        intensity={2.0} 
        color="#ffffff"
      />
      
      {/* Enhanced rim light for better silhouette definition */}
      <spotLight
        position={[0, 2, -5]}
        intensity={1.2}
        angle={0.5}
        penumbra={0.6}
        color="#ffffff"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Top-down light for natural feel */}
      <pointLight 
        position={[0, 8, 0]} 
        intensity={0.6} 
        color="#ffffff"
        distance={10}
        decay={2}
      />
      
      {/* Floor reference plane for better orientation when zoomed in */}
      <mesh 
        rotation-x={-Math.PI / 2} 
        position={[0, -0.02, 0]} 
        receiveShadow
      >
        <circleGeometry args={[4, 36]} />
        <meshStandardMaterial 
          color="#f5f5f5" 
          roughness={0.9} 
          metalness={0.0} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Grid helper for better navigation when zoomed in */}
      <gridHelper 
        args={[8, 20, "#aaaaaa", "#e5e5e5"]} 
        position={[0, 0, 0]} 
      />
      
      {/* Mannequin */}
      <MannequinModel />
      
      {/* Enhanced orbit controls for better user experience */}
      <OrbitControls 
        enablePan={true} // Allow panning to see all parts when zoomed in
        minPolarAngle={0} // Allow full vertical rotation
        maxPolarAngle={Math.PI} 
        minDistance={0.5} // Allow closer zooming
        maxDistance={10} // Allow zooming out further
        target={[0, 0.7, 0]} // Centered on mannequin's middle
        makeDefault
      />
      
      {/* Premium environment lighting */}
      <Environment preset="studio" />
    </>
  );
}

export default function ThreeDScene() {
  const [isReady, setIsReady] = useState(false);
  const { selectedItems } = useClothing();
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    playBackgroundMusic,
    toggleMute,
    isMuted,
    isPlaying,
    togglePlay
  } = useAudio();
  
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
    
    // Auto play background music on user interaction
    const handleInteraction = () => {
      playBackgroundMusic();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    // Prevent page scrolling when mouse is over canvas
    const handleWheel = (e: WheelEvent) => {
      // Only prevent default if pointer is over the canvas
      if (e.target instanceof HTMLElement && 
          (e.target.tagName === 'CANVAS' || e.target.closest('.canvas-container'))) {
        e.preventDefault();
      }
    };
    
    // Add event listeners
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    setIsReady(true);
    
    return () => {
      // Clean up audio and event listeners
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound, playBackgroundMusic]);
  
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
      className={`relative w-full h-full rounded-lg overflow-hidden canvas-container ${
        isOver ? "border-2 border-blue-500" : ""
      }`}
      style={{ height: "100%" }}
    >
      <Canvas
        shadows
        camera={{ 
          position: [0, 0.8, 2.5], 
          fov: 45,
          near: 0.1,
          far: 1000 
        }}
        style={{ 
          background: "transparent", 
          height: "100%", 
          width: "100%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        frameloop="demand"
        performance={{ min: 0.5 }}
        dpr={[1, 2]} // Increase DPR for better quality
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
      
      {/* Audio controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white bg-opacity-80 rounded-full h-10 w-10 shadow-md backdrop-blur-sm"
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white bg-opacity-80 rounded-full h-10 w-10 shadow-md backdrop-blur-sm"
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
      </div>
    </div>
  );
}
