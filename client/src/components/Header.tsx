import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Home, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useBrandSettings } from "@/lib/stores/useBrandSettings";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { settings } = useBrandSettings();
  
  // Add scroll event listener to change header appearance when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md" 
          : "p-4 bg-white dark:bg-gray-900 shadow-md"
      )}
      style={{
        backgroundColor: scrolled 
          ? `${settings.primaryColor}20` // 20% opacity when scrolled
          : `${settings.primaryColor}10`, // 10% opacity when at top
        borderBottom: `1px solid ${settings.primaryColor}${scrolled ? '50' : '40'}` // More opacity when scrolled
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {settings.logo ? (
            <img 
              src={settings.logo} 
              alt={settings.name} 
              className="h-8 w-auto" 
            />
          ) : (
            <span 
              className="text-xl font-bold"
              style={{ color: settings.primaryColor }}
            >
              {settings.name}
            </span>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Brand Settings
            </Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu />
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md md:hidden transition-transform duration-200 ease-in-out",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="container mx-auto py-4 flex flex-col gap-2">
          <Button 
            asChild 
            variant="ghost" 
            className="justify-start"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button 
            asChild 
            variant="ghost" 
            className="justify-start"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Brand Settings
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
