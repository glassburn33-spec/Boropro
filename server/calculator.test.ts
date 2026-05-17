import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Calculator Tab Dimension Input Logic
 * Tests simplified F-mode (inches) and C-mode (mm) input handling
 * 
 * Key principle: Both modes accept any numeric input directly.
 * F-mode converts inches to mm for internal storage.
 * C-mode stores mm directly.
 */

describe('Calculator Dimension Input Logic', () => {
  /**
   * Simulate F-mode onChange: convert inches to mm
   */
  function handleFModeInput(inchInput: string): string {
    if (inchInput === '') return '0';
    const parsed = parseFloat(inchInput);
    if (!isNaN(parsed)) {
      return (parsed * 25.4).toString();
    }
    return ''; // Invalid input, no update
  }

  /**
   * Simulate C-mode onChange: store directly
   */
  function handleCModeInput(mmInput: string): string {
    return mmInput;
  }

  /**
   * Convert mm to inches for display
   */
  function mmToInches(mm: string): string {
    return (parseFloat(mm) / 25.4).toString();
  }

  /**
   * Convert inches to mm
   */
  function inchesToMm(inches: number): number {
    return inches * 25.4;
  }

  describe('F-Mode Input (Inches → MM Storage)', () => {
    it('should accept simple numeric input', () => {
      const result = handleFModeInput('0.5');
      expect(result).toBe('12.7');
    });

    it('should accept input with decimal point', () => {
      const result = handleFModeInput('0.125');
      expect(result).toBe('3.175');
    });

    it('should accept integer input', () => {
      const result = handleFModeInput('1');
      expect(result).toBe('25.4');
    });

    it('should handle empty string as zero', () => {
      const result = handleFModeInput('');
      expect(result).toBe('0');
    });

    it('should reject non-numeric input', () => {
      const result = handleFModeInput('abc');
      expect(result).toBe('');
    });

    it('should accept decimal point without leading digit', () => {
      const result = handleFModeInput('.5');
      expect(result).toBe('12.7');
    });

    it('should accept large decimal values', () => {
      const result = handleFModeInput('5.5');
      expect(result).toBe('139.7');
    });
  });

  describe('C-Mode Input (MM Direct Storage)', () => {
    it('should accept numeric input directly', () => {
      const result = handleCModeInput('12.7');
      expect(result).toBe('12.7');
    });

    it('should accept any string input', () => {
      const result = handleCModeInput('25');
      expect(result).toBe('25');
    });

    it('should preserve empty string', () => {
      const result = handleCModeInput('');
      expect(result).toBe('');
    });

    it('should preserve decimal input', () => {
      const result = handleCModeInput('3.175');
      expect(result).toBe('3.175');
    });
  });

  describe('Display Conversion (MM → Inches)', () => {
    it('should convert 12.7 mm to 0.5 inches', () => {
      const result = mmToInches('12.7');
      expect(parseFloat(result)).toBeCloseTo(0.5, 5);
    });

    it('should convert 3.175 mm to 0.125 inches', () => {
      const result = mmToInches('3.175');
      expect(parseFloat(result)).toBeCloseTo(0.125, 5);
    });

    it('should convert 25.4 mm to 1 inch', () => {
      const result = mmToInches('25.4');
      expect(parseFloat(result)).toBeCloseTo(1, 5);
    });

    it('should convert 0 mm to 0 inches', () => {
      const result = mmToInches('0');
      expect(parseFloat(result)).toBe(0);
    });
  });

  describe('Full Input Workflows', () => {
    it('F-mode: user types 0.5 inches, stored as 12.7 mm, displays as 0.5 inches', () => {
      // User types 0.5 in F-mode
      const stored = handleFModeInput('0.5');
      expect(stored).toBe('12.7');

      // Display converts back to inches
      const displayed = mmToInches(stored);
      expect(parseFloat(displayed)).toBeCloseTo(0.5, 5);
    });

    it('F-mode: user types 0.125 inches, stored as 3.175 mm, displays as 0.125 inches', () => {
      const stored = handleFModeInput('0.125');
      expect(stored).toBe('3.175');

      const displayed = mmToInches(stored);
      expect(parseFloat(displayed)).toBeCloseTo(0.125, 5);
    });

    it('C-mode: user types 25 mm, stored as 25 mm, displays as 25 mm', () => {
      const stored = handleCModeInput('25');
      expect(stored).toBe('25');
    });

    it('F-mode: user clears field, defaults to 0', () => {
      const stored = handleFModeInput('');
      expect(stored).toBe('0');

      const displayed = mmToInches(stored);
      expect(parseFloat(displayed)).toBe(0);
    });

    it('F-mode: user types decimal point alone (edge case)', () => {
      const result = handleFModeInput('.');
      // parseFloat('.') returns NaN, so no update occurs
      expect(result).toBe('');
    });

    it('F-mode: user types very small value', () => {
      const result = handleFModeInput('0.01');
      expect(parseFloat(result)).toBeCloseTo(0.254, 3);
    });

    it('F-mode: user types large value', () => {
      const result = handleFModeInput('10');
      expect(result).toBe('254');
    });
  });

  describe('Dimension-Specific Conversions', () => {
    it('Thickness: 0.125 inches (1/8") → 3.175 mm', () => {
      const mm = inchesToMm(0.125);
      expect(mm).toBeCloseTo(3.175, 2);
    });

    it('Diameter: 0.5 inches → 12.7 mm radius', () => {
      const diameterInches = 0.5;
      const diameterMm = inchesToMm(diameterInches);
      const radiusMm = diameterMm / 2;
      expect(radiusMm).toBeCloseTo(6.35, 2);
    });

    it('Length: 1 inch → 25.4 mm', () => {
      const mm = inchesToMm(1);
      expect(mm).toBe(25.4);
    });

    it('Width: 2.5 inches → 63.5 mm', () => {
      const mm = inchesToMm(2.5);
      expect(mm).toBe(63.5);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle negative input gracefully', () => {
      const result = handleFModeInput('-0.5');
      expect(result).toBe('-12.7');
    });

    it('should handle very long decimal input', () => {
      const result = handleFModeInput('0.123456789');
      expect(parseFloat(result)).toBeCloseTo(3.1358, 3);
    });

    it('should handle scientific notation', () => {
      const result = handleFModeInput('1e-1'); // 0.1
      expect(parseFloat(result)).toBeCloseTo(2.54, 2);
    });

    it('should handle input with leading zeros', () => {
      const result = handleFModeInput('00.5');
      expect(result).toBe('12.7');
    });

    it('should handle input with trailing zeros', () => {
      const result = handleFModeInput('0.500');
      expect(result).toBe('12.7');
    });
  });

  describe('Consistency Between Modes', () => {
    it('should produce same internal value when converting between modes', () => {
      // User enters 0.5 inches in F-mode
      const fModeResult = handleFModeInput('0.5');
      
      // User enters 12.7 mm in C-mode
      const cModeResult = handleCModeInput('12.7');
      
      // Both should be approximately equal
      expect(parseFloat(fModeResult)).toBeCloseTo(parseFloat(cModeResult), 1);
    });

    it('should allow switching between modes without data loss', () => {
      // Start in F-mode with 0.5 inches
      const mmValue = handleFModeInput('0.5');
      expect(mmValue).toBe('12.7');

      // Switch to C-mode display
      const displayed = mmToInches(mmValue);
      expect(parseFloat(displayed)).toBeCloseTo(0.5, 5);

      // Switch back to F-mode
      const backToMm = handleFModeInput(displayed);
      expect(parseFloat(backToMm)).toBeCloseTo(12.7, 1);
    });
  });
});
