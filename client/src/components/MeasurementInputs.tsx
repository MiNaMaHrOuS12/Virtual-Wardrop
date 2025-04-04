import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RangeSlider } from "@/components/ui/range-slider";
import { useMannequin } from "@/lib/stores/useMannequin";
import { Measurements, Gender } from "@/types";
import { useBrandSettings } from "@/lib/stores/useBrandSettings";
import { RefreshCw, User, Users } from "lucide-react";

export default function MeasurementInputs() {
  const { 
    gender, 
    measurements, 
    setGender, 
    updateMeasurement, 
    resetMeasurements 
  } = useMannequin();
  
  const { settings } = useBrandSettings();
  const [activeTab, setActiveTab] = useState<string>("proportions");

  // Min and max values for each measurement (in cm)
  const ranges = {
    height: { min: 150, max: 200 },
    chest: { min: 75, max: 125 },
    waist: { min: 60, max: 110 },
    hips: { min: 75, max: 125 },
    shoulders: { min: 35, max: 55 },
    inseam: { min: 65, max: 90 },
    neckCircumference: { min: 30, max: 45 },
    armLength: { min: 50, max: 75 },
  };

  const handleMeasurementChange = (key: keyof Measurements, value: number) => {
    updateMeasurement(key, value);
  };

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
  };

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="py-2 px-4">
        <CardTitle className="flex justify-between items-center text-sm">
          <span>Your Measurements</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleGenderChange('male')}
              className={gender === 'male' ? 'bg-slate-100 dark:bg-slate-800 px-2' : 'px-2'}
            >
              <User className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleGenderChange('female')}
              className={gender === 'female' ? 'bg-slate-100 dark:bg-slate-800 px-2' : 'px-2'}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetMeasurements}
              title="Reset to default measurements"
              className="px-2"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <Tabs defaultValue="proportions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="proportions" className="text-xs py-1">Body Proportions</TabsTrigger>
            <TabsTrigger value="details" className="text-xs py-1">Detailed Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proportions" className="space-y-3">
            <RangeSlider
              label="Height"
              unit="cm"
              min={ranges.height.min}
              max={ranges.height.max}
              step={1}
              value={[measurements.height]}
              onValueChange={(value) => handleMeasurementChange('height', value[0])}
              className="mt-2"
            />
            
            <RangeSlider
              label="Chest"
              unit="cm"
              min={ranges.chest.min}
              max={ranges.chest.max}
              step={1}
              value={[measurements.chest]}
              onValueChange={(value) => handleMeasurementChange('chest', value[0])}
            />
            
            <RangeSlider
              label="Waist"
              unit="cm"
              min={ranges.waist.min}
              max={ranges.waist.max}
              step={1}
              value={[measurements.waist]}
              onValueChange={(value) => handleMeasurementChange('waist', value[0])}
            />
            
            <RangeSlider
              label="Hips"
              unit="cm"
              min={ranges.hips.min}
              max={ranges.hips.max}
              step={1}
              value={[measurements.hips]}
              onValueChange={(value) => handleMeasurementChange('hips', value[0])}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-3">
            <RangeSlider
              label="Shoulders Width"
              unit="cm"
              min={ranges.shoulders.min}
              max={ranges.shoulders.max}
              step={1}
              value={[measurements.shoulders]}
              onValueChange={(value) => handleMeasurementChange('shoulders', value[0])}
              className="mt-2"
            />
            
            <RangeSlider
              label="Inseam"
              unit="cm"
              min={ranges.inseam.min}
              max={ranges.inseam.max}
              step={1}
              value={[measurements.inseam]}
              onValueChange={(value) => handleMeasurementChange('inseam', value[0])}
            />
            
            <RangeSlider
              label="Neck Circumference"
              unit="cm"
              min={ranges.neckCircumference.min}
              max={ranges.neckCircumference.max}
              step={1}
              value={[measurements.neckCircumference]}
              onValueChange={(value) => handleMeasurementChange('neckCircumference', value[0])}
            />
            
            <RangeSlider
              label="Arm Length"
              unit="cm"
              min={ranges.armLength.min}
              max={ranges.armLength.max}
              step={1}
              value={[measurements.armLength]}
              onValueChange={(value) => handleMeasurementChange('armLength', value[0])}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-3">
          <Button 
            className="w-full text-xs py-1 h-auto" 
            style={{ 
              backgroundColor: settings.primaryColor,
              color: 'white'
            }}
          >
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
