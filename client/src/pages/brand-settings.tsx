import { useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandSettings } from "@/lib/stores/useBrandSettings";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function BrandSettings() {
  const { settings, updateSettings, resetSettings, loadSettings } = useBrandSettings();
  
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  const handleSettingChange = (key: string, value: string) => {
    updateSettings({ [key]: value });
  };
  
  const handleReset = () => {
    resetSettings();
    toast.success("Settings reset to defaults");
  };
  
  const handleSave = () => {
    // In a real app, this would save to the server
    // For now, it just shows a success message since we're already updating localStorage
    toast.success("Brand settings saved successfully");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      
      <main className="flex-grow pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Brand Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Identity */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>
                  Customize your brand appearance in the virtual try-on widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input 
                    id="brandName"
                    value={settings.name}
                    onChange={(e) => handleSettingChange("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl"
                    value={settings.logo}
                    placeholder="https://example.com/logo.png"
                    onChange={(e) => handleSettingChange("logo", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Enter a URL to your brand logo (SVG or PNG recommended)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input 
                    id="fontFamily"
                    value={settings.fontFamily}
                    onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Color Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>
                  Choose colors to match your brand identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="primaryColor"
                      type="color"
                      className="w-12 h-10 p-1"
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    />
                    <Input 
                      value={settings.primaryColor}
                      onChange={(e) => handleSettingChange("primaryColor", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="secondaryColor"
                      type="color"
                      className="w-12 h-10 p-1"
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                    />
                    <Input 
                      value={settings.secondaryColor}
                      onChange={(e) => handleSettingChange("secondaryColor", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-3">
                    <Input 
                      id="accentColor"
                      type="color"
                      className="w-12 h-10 p-1"
                      value={settings.accentColor}
                      onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                    />
                    <Input 
                      value={settings.accentColor}
                      onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Brand Preview</CardTitle>
              <CardDescription>
                See how your brand settings will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 border rounded-md" 
                style={{ 
                  backgroundColor: settings.primaryColor + '10',
                  borderColor: settings.primaryColor
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {settings.logo ? (
                    <img 
                      src={settings.logo} 
                      alt={settings.name}
                      className="h-10 w-auto"
                    />
                  ) : (
                    <div 
                      className="text-xl font-bold"
                      style={{ color: settings.primaryColor }}
                    >
                      {settings.name}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    style={{ 
                      backgroundColor: settings.primaryColor,
                      color: "white" 
                    }}
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline" 
                    style={{ 
                      borderColor: settings.secondaryColor,
                      color: settings.secondaryColor
                    }}
                  >
                    Secondary Button
                  </Button>
                  <Button 
                    variant="ghost"
                    style={{ color: settings.accentColor }}
                  >
                    Accent Ghost Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <Button 
              onClick={handleSave}
              style={{ 
                backgroundColor: settings.primaryColor,
                color: "white" 
              }}
            >
              Save Changes
            </Button>
          </div>
          
          {/* Embed Code */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Embed on Your Website</CardTitle>
              <CardDescription>
                Copy this code to embed the virtual try-on widget on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto">
                <code className="text-sm">
{`<div id="virtual-try-on"></div>
<script src="https://virtual-tryon-app.com/embed.js?brandId=${settings.name.replace(/\s+/g, '-').toLowerCase()}" async></script>`}
                </code>
              </pre>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                This will add the virtual try-on widget to your website, customized with your brand settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 shadow-md py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; 2023 Virtual Try-On SaaS Platform | All rights reserved
        </div>
      </footer>
    </div>
  );
}
