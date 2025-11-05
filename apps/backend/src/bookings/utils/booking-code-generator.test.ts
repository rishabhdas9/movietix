import { generateBookingCode, isValidBookingCode } from './booking-code-generator';

describe('BookingCodeGenerator', () => {
  describe('generateBookingCode', () => {
    it('should generate a booking code with correct format', () => {
      const code = generateBookingCode();
      expect(code).toMatch(/^MT-[A-Z0-9]{6}$/);
    });

    it('should generate unique booking codes', () => {
      const codes = new Set<string>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        const code = generateBookingCode();
        codes.add(code);
      }

      // All codes should be unique
      expect(codes.size).toBe(count);
    });

    it('should generate codes that start with MT-', () => {
      const code = generateBookingCode();
      expect(code.startsWith('MT-')).toBe(true);
    });

    it('should generate codes with exactly 6 alphanumeric characters after prefix', () => {
      const code = generateBookingCode();
      const suffix = code.split('-')[1];
      expect(suffix).toHaveLength(6);
      expect(suffix).toMatch(/^[A-Z0-9]{6}$/);
    });
  });

  describe('isValidBookingCode', () => {
    it('should validate correct booking codes', () => {
      expect(isValidBookingCode('MT-ABC123')).toBe(true);
      expect(isValidBookingCode('MT-XYZ789')).toBe(true);
      expect(isValidBookingCode('MT-000000')).toBe(true);
    });

    it('should reject invalid booking codes', () => {
      expect(isValidBookingCode('MT-ABC12')).toBe(false); // Too short
      expect(isValidBookingCode('MT-ABC1234')).toBe(false); // Too long
      expect(isValidBookingCode('ABC123')).toBe(false); // No prefix
      expect(isValidBookingCode('MT-abc123')).toBe(false); // Lowercase
      expect(isValidBookingCode('BK-ABC123')).toBe(false); // Wrong prefix
      expect(isValidBookingCode('MT-ABC-123')).toBe(false); // Extra hyphen
    });
  });
});

