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
        "fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-2 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-lg" 
          : "p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md"
      )}
      style={{
        backgroundColor: scrolled 
          ? `${settings.primaryColor}30` // 30% opacity when scrolled
          : `${settings.primaryColor}10`, // 10% opacity when at top
        borderBottom: `1px solid ${settings.primaryColor}${scrolled ? '60' : '40'}`, // More opacity when scrolled
        transform: scrolled ? 'translateY(0)' : 'translateY(0)',
        boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
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
          "fixed top-16 left-0 w-full bg-white/98 dark:bg-gray-900/98 backdrop-blur-md shadow-lg md:hidden transition-all duration-300 ease-in-out z-[9998]",
          isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
        style={{
          backgroundColor: `${settings.primaryColor}20`,
          borderBottom: `1px solid ${settings.primaryColor}50`
        }}
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
