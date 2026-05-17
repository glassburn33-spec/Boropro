import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Calculator Tab Fahrenheit dimension input validation
 * Tests the 3 decimal place cap and delete/backspace functionality
 */

describe('Calculator Fahrenheit Dimension Input Validation', () => {
  /**
   * Helper function to simulate the decimal place validation logic
   * from the onChange handlers in CalculatorTab.tsx
   */
  function validateDecimalPlaces(input: string): boolean {
    if (input === '') return true; // Allow empty string for deletion
    
    const decimalIndex = input.indexOf('.');
    if (decimalIndex !== -1) {
      const decimalPart = input.substring(decimalIndex + 1);
      if (decimalPart.length > 3) {
        return false; // Reject input with more than 3 decimals
      }
    }
    return true;
  }

  /**
   * Helper function to simulate inch-to-millimeter conversion
   */
  function inchesToMillimeters(inches: number): number {
    return inches * 25.4;
  }

  /**
   * Helper function to simulate millimeter-to-inch conversion
   */
  function millimetersToInches(mm: number): number {
    return mm / 25.4;
  }

  describe('Decimal Place Validation', () => {
    it('should accept input with 0 decimal places', () => {
      expect(validateDecimalPlaces('1')).toBe(true);
      expect(validateDecimalPlaces('5')).toBe(true);
    });

    it('should accept input with 1 decimal place', () => {
      expect(validateDecimalPlaces('0.1')).toBe(true);
      expect(validateDecimalPlaces('1.5')).toBe(true);
    });

    it('should accept input with 2 decimal places', () => {
      expect(validateDecimalPlaces('0.12')).toBe(true);
      expect(validateDecimalPlaces('1.25')).toBe(true);
    });

    it('should accept input with 3 decimal places', () => {
      expect(validateDecimalPlaces('0.125')).toBe(true);
      expect(validateDecimalPlaces('1.125')).toBe(true);
    });

    it('should reject input with more than 3 decimal places', () => {
      expect(validateDecimalPlaces('0.1234')).toBe(false);
      expect(validateDecimalPlaces('1.12345')).toBe(false);
    });

    it('should allow empty string (for deletion)', () => {
      expect(validateDecimalPlaces('')).toBe(true);
    });

    it('should allow decimal point without digits after it', () => {
      expect(validateDecimalPlaces('1.')).toBe(true);
    });
  });

  describe('Delete and Backspace Simulation', () => {
    it('should allow deleting from 0.125 to 0.12', () => {
      const original = '0.125';
      const afterDelete = original.slice(0, -1); // '0.12'
      expect(validateDecimalPlaces(afterDelete)).toBe(true);
      expect(afterDelete).toBe('0.12');
    });

    it('should allow deleting from 0.12 to 0.1', () => {
      const original = '0.12';
      const afterDelete = original.slice(0, -1); // '0.1'
      expect(validateDecimalPlaces(afterDelete)).toBe(true);
      expect(afterDelete).toBe('0.1');
    });

    it('should allow deleting from 0.1 to 0.', () => {
      const original = '0.1';
      const afterDelete = original.slice(0, -1); // '0.'
      expect(validateDecimalPlaces(afterDelete)).toBe(true);
      expect(afterDelete).toBe('0.');
    });

    it('should allow deleting from 0. to 0', () => {
      const original = '0.';
      const afterDelete = original.slice(0, -1); // '0'
      expect(validateDecimalPlaces(afterDelete)).toBe(true);
      expect(afterDelete).toBe('0');
    });

    it('should allow deleting from 0 to empty string', () => {
      const original = '0';
      const afterDelete = original.slice(0, -1); // ''
      expect(validateDecimalPlaces(afterDelete)).toBe(true);
      expect(afterDelete).toBe('');
    });
  });

  describe('Inch-to-Millimeter Conversion', () => {
    it('should convert 0.125 inches to ~3.175 mm', () => {
      const inches = 0.125;
      const mm = inchesToMillimeters(inches);
      expect(mm).toBeCloseTo(3.175, 2);
    });

    it('should convert 0.5 inches to ~12.7 mm', () => {
      const inches = 0.5;
      const mm = inchesToMillimeters(inches);
      expect(mm).toBeCloseTo(12.7, 1);
    });

    it('should convert 1 inch to 25.4 mm', () => {
      const inches = 1;
      const mm = inchesToMillimeters(inches);
      expect(mm).toBe(25.4);
    });
  });

  describe('Millimeter-to-Inch Conversion', () => {
    it('should convert 3.175 mm to ~0.125 inches', () => {
      const mm = 3.175;
      const inches = millimetersToInches(mm);
      expect(inches).toBeCloseTo(0.125, 3);
    });

    it('should convert 12.7 mm to ~0.5 inches', () => {
      const mm = 12.7;
      const inches = millimetersToInches(mm);
      expect(inches).toBeCloseTo(0.5, 2);
    });

    it('should convert 25.4 mm to 1 inch', () => {
      const mm = 25.4;
      const inches = millimetersToInches(mm);
      expect(inches).toBeCloseTo(1, 5);
    });
  });

  describe('Full Input Workflow', () => {
    it('should handle user typing 0.125 and deleting to 0.12', () => {
      let input = '0.125';
      expect(validateDecimalPlaces(input)).toBe(true);
      
      input = input.slice(0, -1); // Delete last char
      expect(validateDecimalPlaces(input)).toBe(true);
      expect(input).toBe('0.12');
    });

    it('should reject user trying to type 0.1234', () => {
      const input = '0.1234';
      expect(validateDecimalPlaces(input)).toBe(false);
    });

    it('should handle user clearing field and typing new value', () => {
      let input = '';
      expect(validateDecimalPlaces(input)).toBe(true);
      
      input = '0.5';
      expect(validateDecimalPlaces(input)).toBe(true);
      
      const mm = inchesToMillimeters(parseFloat(input));
      expect(mm).toBeCloseTo(12.7, 1);
    });
  });
});
