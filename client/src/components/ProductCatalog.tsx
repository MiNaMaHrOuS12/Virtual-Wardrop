import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClothing } from "@/lib/stores/useClothing";
import ClothingItem from "./ClothingItem";
import { ClothingType } from "@/types";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function ProductCatalog() {
  const { catalog, loadCatalog } = useClothing();
  
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);
  
  // Filter catalog by clothing type
  const getFilteredItems = (type: ClothingType | "all") => {
    if (type === "all") return catalog;
    return catalog.filter(item => item.type === type);
  };
  
  // Group items for display
  const tops = getFilteredItems("shirt");
  const bottoms = getFilteredItems("pants");
  const dresses = getFilteredItems("dress");
  const outerwear = getFilteredItems("jacket");
  const other = getFilteredItems("skirt").concat(getFilteredItems("shoes"));
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-md shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Our Products</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag items onto the mannequin or click to try them on
          </p>
        </div>
        
        <Tabs defaultValue="tops">
          <div className="p-4 pb-0">
            <TabsList className="grid grid-cols-5 h-auto">
              <TabsTrigger value="tops" className="py-2 text-xs">Tops</TabsTrigger>
              <TabsTrigger value="bottoms" className="py-2 text-xs">Bottoms</TabsTrigger>
              <TabsTrigger value="dresses" className="py-2 text-xs">Dresses</TabsTrigger>
              <TabsTrigger value="outerwear" className="py-2 text-xs">Outerwear</TabsTrigger>
              <TabsTrigger value="other" className="py-2 text-xs">Other</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              <TabsContent value="tops" className="m-0">
                <div className="grid grid-cols-2 gap-3">
                  {tops.map(item => (
                    <ClothingItem key={item.id} item={item} />
                  ))}
                  {tops.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-8">
                      No tops available
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bottoms" className="m-0">
                <div className="grid grid-cols-2 gap-3">
                  {bottoms.map(item => (
                    <ClothingItem key={item.id} item={item} />
                  ))}
                  {bottoms.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-8">
                      No bottoms available
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="dresses" className="m-0">
                <div className="grid grid-cols-2 gap-3">
                  {dresses.map(item => (
                    <ClothingItem key={item.id} item={item} />
                  ))}
                  {dresses.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-8">
                      No dresses available
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="outerwear" className="m-0">
                <div className="grid grid-cols-2 gap-3">
                  {outerwear.map(item => (
                    <ClothingItem key={item.id} item={item} />
                  ))}
                  {outerwear.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-8">
                      No outerwear available
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="other" className="m-0">
                <div className="grid grid-cols-2 gap-3">
                  {other.map(item => (
                    <ClothingItem key={item.id} item={item} />
                  ))}
                  {other.length === 0 && (
                    <p className="text-sm text-gray-500 col-span-2 text-center py-8">
                      No other items available
                    </p>
                  )}
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </DndProvider>
  );
}
