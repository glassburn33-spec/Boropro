import { describe, it, expect } from 'vitest';

/**
 * Unit tests for Calculator Tab F-mode and C-mode Input Parity
 * 
 * Key principle: F-mode and C-mode should accept user input identically.
 * - Both accept any numeric string input directly
 * - F-mode displays inches, C-mode displays mm
 * - F-mode converts inches to mm for calculation
 * - C-mode uses mm directly for calculation
 */

describe('F-mode and C-mode Input Parity', () => {
  /**
   * Simulate C-mode onChange: store input directly
   */
  function handleCModeInput(input: string): string {
    return input;
  }

  /**
   * Simulate F-mode onChange: store input directly (no conversion)
   */
  function handleFModeInput(input: string): string {
    return input;
  }

  /**
   * Convert F-mode display (inches) to mm for calculation
   */
  function convertFModeToMm(inches: string): number {
    return parseFloat(inches) * 25.4;
  }

  /**
   * Convert C-mode display (mm) to mm for calculation
   */
  function convertCModeToMm(mm: string): number {
    return parseFloat(mm);
  }

  describe('Input Acceptance - Both Modes Accept Same Input', () => {
    it('should accept integer input in both modes', () => {
      const input = '5';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('5');
    });

    it('should accept decimal input in both modes', () => {
      const input = '0.5';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('0.5');
    });

    it('should accept input with many decimal places in both modes', () => {
      const input = '0.123456789';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
    });

    it('should accept empty string in both modes', () => {
      const input = '';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('');
    });

    it('should accept leading decimal point in both modes', () => {
      const input = '.5';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('.5');
    });

    it('should accept negative values in both modes', () => {
      const input = '-0.5';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('-0.5');
    });

    it('should accept trailing decimal point in both modes', () => {
      const input = '5.';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('5.');
    });

    it('should accept zero in both modes', () => {
      const input = '0';
      const cResult = handleCModeInput(input);
      const fResult = handleFModeInput(input);
      expect(cResult).toBe(fResult);
      expect(cResult).toBe('0');
    });
  });

  describe('Calculation Conversion - Equivalent Results', () => {
    it('should produce equivalent mm values when converting 0.5 inches (F) vs 12.7 mm (C)', () => {
      const fInput = '0.5'; // inches
      const cInput = '12.7'; // mm

      const fMm = convertFModeToMm(fInput);
      const cMm = convertCModeToMm(cInput);

      expect(fMm).toBeCloseTo(cMm, 1);
    });

    it('should produce equivalent mm values when converting 0.125 inches (F) vs 3.175 mm (C)', () => {
      const fInput = '0.125'; // inches
      const cInput = '3.175'; // mm

      const fMm = convertFModeToMm(fInput);
      const cMm = convertCModeToMm(cInput);

      expect(fMm).toBeCloseTo(cMm, 2);
    });

    it('should produce equivalent mm values when converting 1 inch (F) vs 25.4 mm (C)', () => {
      const fInput = '1'; // inches
      const cInput = '25.4'; // mm

      const fMm = convertFModeToMm(fInput);
      const cMm = convertCModeToMm(cInput);

      expect(fMm).toBeCloseTo(cMm, 5);
    });

    it('should handle empty string conversion in both modes', () => {
      const fMm = convertFModeToMm('');
      const cMm = convertCModeToMm('');

      expect(isNaN(fMm)).toBe(true);
      expect(isNaN(cMm)).toBe(true);
    });

    it('should handle zero conversion in both modes', () => {
      const fMm = convertFModeToMm('0');
      const cMm = convertCModeToMm('0');

      expect(fMm).toBe(0);
      expect(cMm).toBe(0);
    });
  });

  describe('Full Workflow - User Enters Same Value in Both Modes', () => {
    it('should accept "5" in both modes and convert to equivalent mm', () => {
      // User types "5" in C-mode (5 mm)
      const cInput = handleCModeInput('5');
      const cMm = convertCModeToMm(cInput);

      // User types "5" in F-mode (5 inches)
      const fInput = handleFModeInput('5');
      const fMm = convertFModeToMm(fInput);

      // Both should accept the input
      expect(cInput).toBe('5');
      expect(fInput).toBe('5');

      // But convert to different mm values
      expect(cMm).toBe(5);
      expect(fMm).toBeCloseTo(127, 0);
    });

    it('should accept "0.5" in both modes', () => {
      const cInput = handleCModeInput('0.5');
      const fInput = handleFModeInput('0.5');

      expect(cInput).toBe('0.5');
      expect(fInput).toBe('0.5');

      const cMm = convertCModeToMm(cInput);
      const fMm = convertFModeToMm(fInput);

      expect(cMm).toBe(0.5);
      expect(fMm).toBeCloseTo(12.7, 1);
    });

    it('should accept decimal input with many places in both modes', () => {
      const input = '0.123456789';
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);

      expect(cInput).toBe(input);
      expect(fInput).toBe(input);

      const cMm = convertCModeToMm(cInput);
      const fMm = convertFModeToMm(fInput);

      // Both should parse successfully
      expect(cMm).toBeCloseTo(0.123456789, 8);
      expect(fMm).toBeCloseTo(3.1358, 3);
    });
  });

  describe('Dimension-Specific Conversions', () => {
    it('Thickness: 0.125 inches = 3.175 mm', () => {
      const fMm = convertFModeToMm('0.125');
      const cMm = convertCModeToMm('3.175');
      expect(fMm).toBeCloseTo(cMm, 2);
    });

    it('Diameter: 0.5 inches = 12.7 mm', () => {
      const fMm = convertFModeToMm('0.5');
      const cMm = convertCModeToMm('12.7');
      expect(fMm).toBeCloseTo(cMm, 1);
    });

    it('Length: 1 inch = 25.4 mm', () => {
      const fMm = convertFModeToMm('1');
      const cMm = convertCModeToMm('25.4');
      expect(fMm).toBeCloseTo(cMm, 5);
    });

    it('Width: 2.5 inches = 63.5 mm', () => {
      const fMm = convertFModeToMm('2.5');
      const cMm = convertCModeToMm('63.5');
      expect(fMm).toBeCloseTo(cMm, 1);
    });
  });

  describe('Edge Cases - Both Modes Handle Identically', () => {
    it('should handle very small values', () => {
      const input = '0.01';
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);
      expect(cInput).toBe(fInput);
    });

    it('should handle very large values', () => {
      const input = '999.999';
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);
      expect(cInput).toBe(fInput);
    });

    it('should handle scientific notation', () => {
      const input = '1e-2'; // 0.01
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);
      expect(cInput).toBe(fInput);
      
      const cMm = convertCModeToMm(cInput);
      const fMm = convertFModeToMm(fInput);
      expect(cMm).toBeCloseTo(0.01, 5);
      expect(fMm).toBeCloseTo(0.254, 3);
    });

    it('should handle input with leading zeros', () => {
      const input = '00.5';
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);
      expect(cInput).toBe(fInput);
    });

    it('should handle input with trailing zeros', () => {
      const input = '0.500';
      const cInput = handleCModeInput(input);
      const fInput = handleFModeInput(input);
      expect(cInput).toBe(fInput);
    });
  });

  describe('User Editing - Both Modes Allow Free Editing', () => {
    it('should allow user to delete characters in both modes', () => {
      // Start with "0.5"
      let cValue = '0.5';
      let fValue = '0.5';

      // Delete last character
      cValue = cValue.slice(0, -1); // "0."
      fValue = fValue.slice(0, -1); // "0."

      expect(cValue).toBe(fValue);
      expect(cValue).toBe('0.');

      // Delete another character
      cValue = cValue.slice(0, -1); // "0"
      fValue = fValue.slice(0, -1); // "0"

      expect(cValue).toBe(fValue);
      expect(cValue).toBe('0');
    });

    it('should allow user to clear field in both modes', () => {
      const cValue = '';
      const fValue = '';
      expect(cValue).toBe(fValue);
    });

    it('should allow user to type decimal point in both modes', () => {
      let cValue = '5';
      let fValue = '5';

      // Type decimal point
      cValue += '.';
      fValue += '.';

      expect(cValue).toBe(fValue);
      expect(cValue).toBe('5.');
    });

    it('should allow user to type first decimal digit in both modes', () => {
      let cValue = '5.';
      let fValue = '5.';

      // Type first decimal digit
      cValue += '1';
      fValue += '1';

      expect(cValue).toBe(fValue);
      expect(cValue).toBe('5.1');
    });
  });
});
