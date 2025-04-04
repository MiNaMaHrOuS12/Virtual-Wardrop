import { create } from "zustand";
import { Gender, Measurements, MannequinConfig, ScaleFactors } from "../../types";

interface MannequinState {
  gender: Gender;
  measurements: Measurements;
  scaleFactors: ScaleFactors;
  isCustomizing: boolean;
  
  // Actions
  setGender: (gender: Gender) => void;
  updateMeasurement: (key: keyof Measurements, value: number) => void;
  resetMeasurements: () => void;
  setIsCustomizing: (value: boolean) => void;
  getMannequinConfig: () => MannequinConfig;
  calculateScaleFactors: () => void;
}

// Default measurements (in cm)
const maleDefaultMeasurements: Measurements = {
  chest: 100,
  waist: 85,
  hips: 95,
  height: 180,
  shoulders: 45,
  inseam: 82,
  neckCircumference: 38,
  armLength: 65,
};

const femaleDefaultMeasurements: Measurements = {
  chest: 90,
  waist: 70,
  hips: 100,
  height: 165,
  shoulders: 40,
  inseam: 75,
  neckCircumference: 33,
  armLength: 60,
};

// Default scale factors (neutral starting point)
const defaultScaleFactors: ScaleFactors = {
  chest: 1,
  waist: 1,
  hips: 1,
  height: 1,
  shoulders: 1,
  limbs: 1,
  neck: 1,
};

export const useMannequin = create<MannequinState>((set, get) => ({
  gender: "male",
  measurements: { ...maleDefaultMeasurements },
  scaleFactors: { ...defaultScaleFactors },
  isCustomizing: false,
  
  setGender: (gender) => {
    const defaultMeasurements = gender === "male" 
      ? maleDefaultMeasurements 
      : femaleDefaultMeasurements;
      
    set({ 
      gender, 
      measurements: { ...defaultMeasurements }
    });
    
    // Recalculate scale factors
    get().calculateScaleFactors();
  },
  
  updateMeasurement: (key, value) => {
    set((state) => ({
      measurements: {
        ...state.measurements,
        [key]: value
      }
    }));
    
    // Recalculate scale factors
    get().calculateScaleFactors();
  },
  
  resetMeasurements: () => {
    const { gender } = get();
    const defaultMeasurements = gender === "male"
      ? maleDefaultMeasurements
      : femaleDefaultMeasurements;
      
    set({
      measurements: { ...defaultMeasurements },
      scaleFactors: { ...defaultScaleFactors }
    });
  },
  
  setIsCustomizing: (value) => {
    set({ isCustomizing: value });
  },
  
  getMannequinConfig: () => {
    const { gender, measurements } = get();
    return { gender, measurements };
  },
  
  // Calculate scale factors based on measurements comparing to default
  calculateScaleFactors: () => {
    const { gender, measurements } = get();
    const defaultMeasurements = gender === "male"
      ? maleDefaultMeasurements
      : femaleDefaultMeasurements;
    
    // Calculate normalized scale factors (ratio between current and default)
    const chest = measurements.chest / defaultMeasurements.chest;
    const waist = measurements.waist / defaultMeasurements.waist;
    const hips = measurements.hips / defaultMeasurements.hips;
    const height = measurements.height / defaultMeasurements.height;
    const shoulders = measurements.shoulders / defaultMeasurements.shoulders;
    const neck = measurements.neckCircumference / defaultMeasurements.neckCircumference;
    
    // Limbs factor based on height and inseam
    const inseamRatio = measurements.inseam / defaultMeasurements.inseam;
    const armRatio = measurements.armLength / defaultMeasurements.armLength;
    const limbs = (inseamRatio + armRatio) / 2;
    
    set({
      scaleFactors: {
        chest,
        waist,
        hips,
        height,
        shoulders,
        limbs,
        neck
      }
    });
  }
}));
