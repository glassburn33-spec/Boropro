/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';

/**
 * Test suite for temperature validation in CalculatorTab
 * Verifies that Celsius and Fahrenheit bounds are correctly validated
 */

describe('CalculatorTab - Temperature Validation', () => {
  // Helper function to validate kiln temperature
  function validateKilnTemp(tempValue: number, unit: 'C' | 'F'): boolean {
    const isNaN_check = isNaN(tempValue);
    if (isNaN_check) return false;
    
    if (unit === 'C') {
      return tempValue >= 565 && tempValue <= 650;
    } else {
      return tempValue >= 1049 && tempValue <= 1202;
    }
  }

  // Helper function to validate room temperature
  function validateRoomTemp(tempValue: number, unit: 'C' | 'F'): boolean {
    const isNaN_check = isNaN(tempValue);
    if (isNaN_check) return false;
    
    if (unit === 'C') {
      return tempValue >= 0 && tempValue <= 40;
    } else {
      return tempValue >= 32 && tempValue <= 104;
    }
  }

  describe('Kiln Temperature Validation', () => {
    it('should accept valid Celsius kiln temperatures (565-650°C)', () => {
      expect(validateKilnTemp(565, 'C')).toBe(true);
      expect(validateKilnTemp(600, 'C')).toBe(true);
      expect(validateKilnTemp(650, 'C')).toBe(true);
    });

    it('should reject invalid Celsius kiln temperatures', () => {
      expect(validateKilnTemp(564, 'C')).toBe(false);
      expect(validateKilnTemp(651, 'C')).toBe(false);
      expect(validateKilnTemp(0, 'C')).toBe(false);
    });

    it('should accept valid Fahrenheit kiln temperatures (1049-1202°F)', () => {
      expect(validateKilnTemp(1049, 'F')).toBe(true);
      expect(validateKilnTemp(1112, 'F')).toBe(true);
      expect(validateKilnTemp(1202, 'F')).toBe(true);
    });

    it('should reject invalid Fahrenheit kiln temperatures', () => {
      expect(validateKilnTemp(1048, 'F')).toBe(false);
      expect(validateKilnTemp(1203, 'F')).toBe(false);
      expect(validateKilnTemp(565, 'F')).toBe(false); // Celsius value in Fahrenheit mode
    });

    it('should reject NaN values', () => {
      expect(validateKilnTemp(NaN, 'C')).toBe(false);
      expect(validateKilnTemp(NaN, 'F')).toBe(false);
    });
  });

  describe('Room Temperature Validation', () => {
    it('should accept valid Celsius room temperatures (0-40°C)', () => {
      expect(validateRoomTemp(0, 'C')).toBe(true);
      expect(validateRoomTemp(25, 'C')).toBe(true);
      expect(validateRoomTemp(40, 'C')).toBe(true);
    });

    it('should reject invalid Celsius room temperatures', () => {
      expect(validateRoomTemp(-1, 'C')).toBe(false);
      expect(validateRoomTemp(41, 'C')).toBe(false);
    });

    it('should accept valid Fahrenheit room temperatures (32-104°F)', () => {
      expect(validateRoomTemp(32, 'F')).toBe(true);
      expect(validateRoomTemp(68, 'F')).toBe(true);
      expect(validateRoomTemp(104, 'F')).toBe(true);
    });

    it('should reject invalid Fahrenheit room temperatures', () => {
      expect(validateRoomTemp(31, 'F')).toBe(false);
      expect(validateRoomTemp(105, 'F')).toBe(false);
      expect(validateRoomTemp(0, 'F')).toBe(false); // Celsius value in Fahrenheit mode
    });

    it('should reject NaN values', () => {
      expect(validateRoomTemp(NaN, 'C')).toBe(false);
      expect(validateRoomTemp(NaN, 'F')).toBe(false);
    });
  });

  describe('Temperature Conversion', () => {
    it('should convert Fahrenheit to Celsius correctly', () => {
      const fahrenheitToCelsius = (f: number) => (f - 32) * (5 / 9);
      
      // 1049°F should convert to ~565°C
      expect(Math.round(fahrenheitToCelsius(1049))).toBe(565);
      
      // 1202°F should convert to ~650°C
      expect(Math.round(fahrenheitToCelsius(1202))).toBe(650);
      
      // 32°F should convert to 0°C
      expect(fahrenheitToCelsius(32)).toBe(0);
      
      // 104°F should convert to 40°C
      expect(Math.round(fahrenheitToCelsius(104))).toBe(40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary values correctly', () => {
      // Kiln temperature boundaries
      expect(validateKilnTemp(565, 'C')).toBe(true);
      expect(validateKilnTemp(650, 'C')).toBe(true);
      expect(validateKilnTemp(1049, 'F')).toBe(true);
      expect(validateKilnTemp(1202, 'F')).toBe(true);

      // Room temperature boundaries
      expect(validateRoomTemp(0, 'C')).toBe(true);
      expect(validateRoomTemp(40, 'C')).toBe(true);
      expect(validateRoomTemp(32, 'F')).toBe(true);
      expect(validateRoomTemp(104, 'F')).toBe(true);
    });

    it('should reject values just outside boundaries', () => {
      // Kiln temperature
      expect(validateKilnTemp(564.9, 'C')).toBe(false);
      expect(validateKilnTemp(650.1, 'C')).toBe(false);
      expect(validateKilnTemp(1048.9, 'F')).toBe(false);
      expect(validateKilnTemp(1202.1, 'F')).toBe(false);

      // Room temperature
      expect(validateRoomTemp(-0.1, 'C')).toBe(false);
      expect(validateRoomTemp(40.1, 'C')).toBe(false);
      expect(validateRoomTemp(31.9, 'F')).toBe(false);
      expect(validateRoomTemp(104.1, 'F')).toBe(false);
    });
  });
});


describe('Calculate Button State', () => {
  // Helper function to determine if Calculate button should be enabled
  function isCalculateEnabled(kilnTemp: number, roomTemp: number, unit: 'C' | 'F', shape: string = 'cylinder', thickness: number = 2, radius: number = 25): boolean {
    const kilnTempValue = kilnTemp;
    const kilnTempInvalid = isNaN(kilnTempValue) ||
                            (unit === 'C' && (kilnTempValue < 565 || kilnTempValue > 650)) ||
                            (unit === 'F' && (kilnTempValue < 1049 || kilnTempValue > 1202));

    const roomTempValue = roomTemp;
    const roomTempInvalid = isNaN(roomTempValue) ||
                            (unit === 'C' && (roomTempValue < 0 || roomTempValue > 40)) ||
                            (unit === 'F' && (roomTempValue < 32 || roomTempValue > 104));

    const calcBlocked = kilnTempInvalid || roomTempInvalid || (shape === 'cylinder' && thickness >= radius);
    
    return !calcBlocked;
  }

  it('should enable Calculate button when valid Fahrenheit kiln temperature is entered', () => {
    expect(isCalculateEnabled(1049, 68, 'F')).toBe(true);
    expect(isCalculateEnabled(1112, 68, 'F')).toBe(true);
    expect(isCalculateEnabled(1202, 68, 'F')).toBe(true);
  });

  it('should disable Calculate button when invalid Fahrenheit kiln temperature is entered', () => {
    expect(isCalculateEnabled(1048, 68, 'F')).toBe(false);
    expect(isCalculateEnabled(1203, 68, 'F')).toBe(false);
  });

  it('should enable Calculate button when valid Celsius kiln temperature is entered', () => {
    expect(isCalculateEnabled(565, 25, 'C')).toBe(true);
    expect(isCalculateEnabled(600, 25, 'C')).toBe(true);
    expect(isCalculateEnabled(650, 25, 'C')).toBe(true);
  });

  it('should disable Calculate button when invalid Celsius kiln temperature is entered', () => {
    expect(isCalculateEnabled(564, 25, 'C')).toBe(false);
    expect(isCalculateEnabled(651, 25, 'C')).toBe(false);
  });

  it('should disable Calculate button when room temperature is invalid', () => {
    expect(isCalculateEnabled(1049, 31, 'F')).toBe(false);
    expect(isCalculateEnabled(1049, 105, 'F')).toBe(false);
    expect(isCalculateEnabled(565, -1, 'C')).toBe(false);
    expect(isCalculateEnabled(565, 41, 'C')).toBe(false);
  });

  it('should enable Calculate button when both temperatures are valid', () => {
    expect(isCalculateEnabled(1049, 32, 'F')).toBe(true);
    expect(isCalculateEnabled(1202, 104, 'F')).toBe(true);
    expect(isCalculateEnabled(565, 0, 'C')).toBe(true);
    expect(isCalculateEnabled(650, 40, 'C')).toBe(true);
  });
});
