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
      
      <main className="flex-grow pt-20 px-4 pb-8 lg:pb-12 overflow-x-hidden">
        <div className="container mx-auto">
          {/* Banner/Intro section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3">Virtual Try-On Experience</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Customize your mannequin with your measurements, browse our collection, and see how different clothing items will look on your body type!
            </p>
          </div>
          
          <DndProvider backend={HTML5Backend}>
            {/* Full screen mannequin section */}
            <div className="mb-8">
              <div className="h-screen max-h-[80vh] flex items-center justify-center">
                <ThreeDScene />
              </div>
              
              {/* Audio controls */}
              <div className="mt-2 flex justify-end">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Controls and catalog section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Left column - Measurement inputs */}
              <div className="lg:max-h-[600px] lg:overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 px-2 sticky top-0 bg-slate-50 dark:bg-slate-950 py-2 z-10">Your Measurements</h2>
                <MeasurementInputs />
              </div>
              
              {/* Right column - Product catalog */}
              <div className="lg:col-span-2 lg:max-h-[600px] lg:overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 px-2 sticky top-0 bg-slate-50 dark:bg-slate-950 py-2 z-10">Clothing Collection</h2>
                <ProductCatalog />
              </div>
            </div>
          </DndProvider>
          
          {/* Instructions */}
          <div className="mt-8 max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">How to Use the Virtual Try-On</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Customize Your Mannequin</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Choose between male and female body types</li>
                  <li>Adjust body measurements with the sliders</li>
                  <li>See changes reflect immediately on your 3D mannequin</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Try On Clothing</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Browse our clothing collection by category</li>
                  <li>Click on items or drag them onto the mannequin</li>
                  <li>Rotate the 3D view to see from all angles</li>
                  <li>Zoom in/out using the mouse wheel</li>
                </ul>
              </div>
            </div>
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
