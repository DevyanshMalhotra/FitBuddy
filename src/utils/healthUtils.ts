export const calculateBMI = (weight: number, height: number): number => {
  return Number((weight / (height * height)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const extractMetrics = (message: string): { weight?: number; height?: number } => {
  const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilograms)/i);
  const heightMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:m|meters)/i);

  return {
    weight: weightMatch ? parseFloat(weightMatch[1]) : undefined,
    height: heightMatch ? parseFloat(heightMatch[1]) : undefined,
  };
};