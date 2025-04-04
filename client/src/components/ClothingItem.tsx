import { forwardRef } from "react";
import { ClothingItem as ClothingItemType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useDrag } from "react-dnd";
import { useClothing } from "@/lib/stores/useClothing";

interface ClothingItemProps {
  item: ClothingItemType;
  onClick?: () => void;
}

const ClothingItem = forwardRef<HTMLDivElement, ClothingItemProps>(
  ({ item, onClick }, ref) => {
    const { addSelectedItem } = useClothing();
    
    // Setup drag and drop
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "clothing-item",
      item: { id: item.id },
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
          addSelectedItem(item as ClothingItemType);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
    
    // Apply ref
    const applyRef = (element: HTMLDivElement) => {
      // Apply both refs
      drag(element);
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        } else {
          ref.current = element;
        }
      }
    };
    
    const handleClick = () => {
      addSelectedItem(item);
      if (onClick) onClick();
    };
    
    return (
      <Card 
        ref={applyRef}
        className={`w-full cursor-pointer transition-transform ${
          isDragging ? "opacity-50 scale-95" : "hover:scale-105"
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-2">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden mb-2 flex items-center justify-center">
            <img 
              src={item.thumbnailUrl} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 right-0 bg-white dark:bg-gray-900 text-xs px-2 py-1 rounded-bl-md">
              {item.size}
            </div>
          </div>
          <div className="text-sm font-medium truncate">{item.name}</div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {item.brand}
            </div>
            <div className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
              {item.category}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ClothingItem.displayName = "ClothingItem";

export default ClothingItem;
