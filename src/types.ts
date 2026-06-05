export interface DiagnosticResult {
  healthy: boolean;
  cropName: string;
  condition: string;
  confidence: number;
  diagnosis: string;
  remedies: string[];
  preventions: string[];
}

export interface SeasonalAdvice {
  month: string;
  region: string;
  crop: string;
  irrigation: string;
  fertilization: string;
  pestControl: string;
  harvestingPrep: string;
  generalTips: string[];
}

export interface CalendarMonthDetails {
  monthName: string;
  phase: string;
  activities: string[];
  precautions: string[];
  fertilizerRequirement: string;
}

export interface CropCalendar {
  cropName: string;
  region: string;
  sowingMonth: string;
  durationMonths: number;
  timeline: CalendarMonthDetails[];
}

export interface MarketPriceItem {
  commodity: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  variety: string;
  unit: string;
}

export interface FarmerDiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: "Activity" | "Expense" | "Income" | "Observation";
  amount?: number;
}
