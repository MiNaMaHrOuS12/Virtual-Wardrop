import { useEffect } from "react";
import Header from "@/components/Header";
import ThreeDScene from "@/components/ThreeDScene";
import MeasurementInputs from "@/components/MeasurementInputs";
import ProductCatalog from "@/components/ProductCatalog";
import { useBrandSettings } from "@/lib/stores/useBrandSettings";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAudio } from "@/lib/stores/useAudio";
import { VolumeX, Volume2 } from "lucide-react";

export default function Home() {
  const { loadSettings } = useBrandSettings();
  const { toggleMute, isMuted } = useAudio();
  
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="flex-grow pt-20 px-4 pb-8 lg:pb-12">
        <div className="container mx-auto">
          <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Measurement inputs */}
              <div className="order-2 lg:order-1">
                <MeasurementInputs />
              </div>
              
              {/* Middle column - 3D Scene */}
              <div className="order-1 lg:order-2 h-[500px] lg:h-[700px]">
                <ThreeDScene />
                
                {/* Audio controls */}
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right column - Product catalog */}
              <div className="order-3 lg:order-3">
                <ProductCatalog />
              </div>
            </div>
          </DndProvider>
          
          {/* Instructions */}
          <div className="mt-8 max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">How to Use the Virtual Try-On</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Adjust the measurements using the sliders to match your body dimensions</li>
              <li>Toggle between male and female mannequin options</li>
              <li>Browse the product catalog and drag items onto the mannequin</li>
              <li>Rotate the 3D view by clicking and dragging in the scene</li>
              <li>Zoom in and out using the mouse wheel</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 shadow-md py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; 2023 Virtual Try-On SaaS Platform | All rights reserved
        </div>
      </footer>
    </div>
  );
}
