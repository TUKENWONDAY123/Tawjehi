/**
 * Conversion tables and helper utilities for Score Conversion and Averaging Calculator.
 */

export const CLEP_CONVERSION: Record<number, number> = {
  35: 65, 36: 66, 37: 67, 38: 68, 39: 69, 40: 70, 41: 71, 42: 72, 43: 73, 44: 74,
  45: 75, 46: 76, 47: 77, 48: 78, 49: 79, 50: 80, 51: 81, 52: 82, 53: 83, 54: 83,
  55: 84, 56: 85, 57: 85, 58: 86, 59: 87, 60: 87, 61: 88, 62: 89, 63: 90, 64: 90,
  65: 91, 66: 92, 67: 92, 68: 93, 69: 94, 70: 94, 71: 95, 72: 96, 73: 97, 74: 98,
  75: 99, 76: 100, 77: 100, 78: 100, 79: 100, 80: 100
};

export const AP_CONVERSION: Record<number, number> = {
  2: 77,
  3: 89,
  4: 96,
  5: 100
};

export const SAT_CONVERSION: Record<number, number> = {
  400: 65, 410: 66, 420: 67, 430: 68, 440: 69, 450: 70, 460: 71, 470: 72, 480: 73, 490: 74,
  500: 77, 510: 78, 520: 79, 530: 80, 540: 81, 550: 82, 560: 83, 570: 84, 580: 85, 590: 86,
  600: 87, 610: 88, 620: 89, 630: 90, 640: 91, 650: 92, 660: 93, 670: 94, 680: 95, 690: 96,
  700: 97, 710: 98, 720: 98, 730: 98, 740: 99, 750: 99, 760: 99, 770: 99, 780: 100, 790: 100,
  800: 100
};

export type ExamType = 'CLEP' | 'AP';

export interface ScoreInput {
  value: string;
  isValid: boolean;
  error?: string;
  convertedPercent: number | null;
}

export interface AdditionalScoreInput {
  type: ExamType;
  value: string;
  isValid: boolean;
  error?: string;
  convertedPercent: number | null;
}

/**
 * Validate and retrieve status for SAT score.
 * Range: 400 to 800. Only multiples of 10.
 */
export function getSatEnglishStatus(val: string): { isInvalid: boolean; error?: string; warning?: string; percent: number | null; roundedVal?: number } {
  if (!val.trim()) return { isInvalid: true, error: 'Required', percent: null };
  const num = Number(val);
  if (isNaN(num)) return { isInvalid: true, error: 'Must be a number', percent: null };
  if (num < 400 || num > 800) return { isInvalid: true, error: 'Must be between 400 - 800', percent: null };
  
  if (num % 10 !== 0) {
    const rounded = Math.round(num / 10) * 10;
    const clamped = Math.max(400, Math.min(800, rounded));
    const percent = SAT_CONVERSION[clamped] || 0;
    return { 
      isInvalid: false, 
      warning: `nearest score 10 (${clamped}) used`, 
      percent,
      roundedVal: clamped
    };
  }
  
  return { isInvalid: false, percent: SAT_CONVERSION[num] || 0, roundedVal: num };
}

/**
 * Validate and retrieve status for additional exam scores.
 * CLEP range: 35-80. AP range: 2-5.
 */
export function getAdditionalExamStatus(type: 'CLEP' | 'AP', val: string): { isInvalid: boolean; error?: string; warning?: string; percent: number | null; roundedVal?: number } {
  if (!val.trim()) return { isInvalid: true, error: 'Required', percent: null };
  const num = Number(val);
  if (isNaN(num)) return { isInvalid: true, error: 'Must be a number', percent: null };
  if (type === 'CLEP') {
    if (num < 35 || num > 80) return { isInvalid: true, error: 'Must be between 35 - 80', percent: null };
    const rounded = Math.round(num);
    const roundedWarning = rounded !== num ? `Rounded to ${rounded}` : undefined;
    return { isInvalid: false, percent: CLEP_CONVERSION[rounded] || 0, warning: roundedWarning, roundedVal: rounded };
  } else {
    if (num < 2 || num > 5) return { isInvalid: true, error: 'Must be between 2 - 5', percent: null };
    const rounded = Math.round(num);
    const roundedWarning = rounded !== num ? `Rounded to ${rounded}` : undefined;
    return { isInvalid: false, percent: AP_CONVERSION[rounded] || 0, warning: roundedWarning, roundedVal: rounded };
  }
}

/**
 * Converts SAT score to percentage.
 * Range: 400 to 800.
 */
export function convertSATScore(scoreVal: number): { percent: number; error?: string } {
  if (isNaN(scoreVal)) {
    return { percent: 0, error: 'Please enter a valid number' };
  }
  if (scoreVal < 400 || scoreVal > 800) {
    return { percent: 0, error: 'SAT scores must be between 400 and 800' };
  }
  if (scoreVal % 10 !== 0) {
    const rounded = Math.round(scoreVal / 10) * 10;
    const clamped = Math.max(400, Math.min(800, rounded));
    return { percent: SAT_CONVERSION[clamped] || 0, error: `Nearest official score used (${clamped})` };
  }
  return { percent: SAT_CONVERSION[scoreVal] || 0 };
}

/**
 * Converts CLEP score to percentage.
 * Range: 35 to 80.
 */
export function convertCLEPScore(scoreVal: number): { percent: number; error?: string } {
  if (isNaN(scoreVal)) {
    return { percent: 0, error: 'Please enter a valid number' };
  }
  if (scoreVal < 35 || scoreVal > 80) {
    return { percent: 0, error: 'CLEP scores must be between 35 and 80' };
  }
  const integerScore = Math.round(scoreVal);
  return { percent: CLEP_CONVERSION[integerScore] || 0 };
}

/**
 * Converts AP score to percentage.
 * Range: 2 to 5.
 */
export function convertAPScore(scoreVal: number): { percent: number; error?: string } {
  if (isNaN(scoreVal)) {
    return { percent: 0, error: 'Please enter a valid score' };
  }
  if (scoreVal < 2 || scoreVal > 5) {
    return { percent: 0, error: 'AP scores must be between 2 and 5' };
  }
  const integerScore = Math.round(scoreVal);
  return { percent: AP_CONVERSION[integerScore] || 0 };
}
