export type Level = "Low" | "Moderate" | "High";

export interface Zone {
  id: string;
  name: string;
  x: number; // % on map
  y: number;
  level: Level;
  vehicles: number;
  speed: number;
  predicted: Level;
}

export const zones: Zone[] = [
  { id: "cp", name: "Connaught Place", x: 50, y: 48, level: "High", vehicles: 1240, speed: 14, predicted: "High" },
  { id: "kg", name: "Kashmere Gate", x: 53, y: 33, level: "Moderate", vehicles: 870, speed: 26, predicted: "High" },
  { id: "rohini", name: "Rohini", x: 28, y: 22, level: "Low", vehicles: 430, speed: 46, predicted: "Moderate" },
  { id: "dwarka", name: "Dwarka", x: 17, y: 63, level: "Moderate", vehicles: 690, speed: 31, predicted: "Moderate" },
  { id: "saket", name: "Saket", x: 44, y: 78, level: "Moderate", vehicles: 720, speed: 28, predicted: "High" },
  { id: "lajpat", name: "Lajpat Nagar", x: 56, y: 68, level: "High", vehicles: 1105, speed: 17, predicted: "High" },
  { id: "karol", name: "Karol Bagh", x: 40, y: 45, level: "High", vehicles: 990, speed: 19, predicted: "Moderate" },
  { id: "dilshad", name: "Dilshad Garden", x: 78, y: 27, level: "Low", vehicles: 380, speed: 49, predicted: "Low" },
  { id: "anand", name: "Anand Vihar", x: 76, y: 46, level: "High", vehicles: 1310, speed: 15, predicted: "High" },
  { id: "noida", name: "Noida Border", x: 82, y: 62, level: "Moderate", vehicles: 940, speed: 24, predicted: "High" },
];

export const hourly = Array.from({ length: 24 }, (_, h) => {
  const peak = Math.exp(-((h - 9) ** 2) / 8) + Math.exp(-((h - 18.5) ** 2) / 6);
  const congestion = Math.round(24 + peak * 62 + (h % 3) * 2);
  return {
    hour: `${String(h).padStart(2, "0")}:00`,
    congestion,
    vehicles: Math.round(280 + peak * 1250 + (h % 4) * 40),
    speed: Math.max(11, Math.round(56 - peak * 38)),
  };
});

export const distribution = [
  { name: "Low", value: 1832, color: "var(--signal-green)" },
  { name: "Moderate", value: 1946, color: "var(--signal-yellow)" },
  { name: "High", value: 1196, color: "var(--signal-red)" },
];

export const locationCompare = zones.map((z) => ({
  name: z.name.split(" ")[0],
  congestion: Math.round((z.vehicles / 1400) * 100),
  speed: z.speed,
}));

export const featureImportance = [
  { feature: "Route Density", value: 0.28 },
  { feature: "Vehicle Count", value: 0.24 },
  { feature: "Hour of Day", value: 0.17 },
  { feature: "Average Speed", value: 0.13 },
  { feature: "Location", value: 0.09 },
  { feature: "Weather", value: 0.05 },
  { feature: "Day Type", value: 0.04 },
];

export const confusion = [
  { label: "Low", row: [372, 21, 4] },
  { label: "Moderate", row: [18, 402, 26] },
  { label: "High", row: [3, 29, 320] },
];

export const weatherOptions = ["Clear", "Cloudy", "Rain", "Fog", "Haze"] as const;
export const densityOptions = ["Sparse", "Normal", "Dense", "Very Dense"] as const;

export const levelColor: Record<Level, string> = {
  Low: "var(--signal-green)",
  Moderate: "var(--signal-yellow)",
  High: "var(--signal-red)",
};

export const levelEmoji: Record<Level, string> = {
  Low: "🟢",
  Moderate: "🟡",
  High: "🔴",
};

const locNames = zones.map((z) => z.name);
const weathers = ["Clear", "Cloudy", "Rain", "Fog", "Haze"];
const densities = ["Sparse", "Normal", "Dense", "Very Dense"];

export const datasetRows = Array.from({ length: 160 }, (_, i) => {
  const hour = (i * 7) % 24;
  const loc = locNames[i % locNames.length];
  const vehicles = 180 + ((i * 137) % 1400);
  const speed = Math.max(10, 60 - Math.round(vehicles / 32));
  const level: Level = vehicles > 1050 ? "High" : vehicles > 620 ? "Moderate" : "Low";
  return {
    id: i + 1,
    location: loc,
    hour,
    density: densities[(i + hour) % densities.length],
    vehicles,
    speed,
    weather: weathers[(i * 3) % weathers.length],
    level,
  };
});
