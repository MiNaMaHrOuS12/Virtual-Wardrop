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
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Enter Your Measurements</span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleGenderChange('male')}
              className={gender === 'male' ? 'bg-slate-100 dark:bg-slate-800' : ''}
            >
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleGenderChange('female')}
              className={gender === 'female' ? 'bg-slate-100 dark:bg-slate-800' : ''}
            >
              <Users className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={resetMeasurements}
              title="Reset to default measurements"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proportions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="proportions">Body Proportions</TabsTrigger>
            <TabsTrigger value="details">Detailed Measurements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proportions" className="space-y-4">
            <RangeSlider
              label="Height"
              unit="cm"
              min={ranges.height.min}
              max={ranges.height.max}
              step={1}
              value={[measurements.height]}
              onValueChange={(value) => handleMeasurementChange('height', value[0])}
              className="mt-6"
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
          
          <TabsContent value="details" className="space-y-4">
            <RangeSlider
              label="Shoulders Width"
              unit="cm"
              min={ranges.shoulders.min}
              max={ranges.shoulders.max}
              step={1}
              value={[measurements.shoulders]}
              onValueChange={(value) => handleMeasurementChange('shoulders', value[0])}
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

        <div className="mt-6">
          <Button 
            className="w-full" 
            style={{ 
              backgroundColor: settings.primaryColor,
              color: 'white'
            }}
          >
            Apply Measurements
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
