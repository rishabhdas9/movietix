/**
 * Generates a unique, human-readable booking code
 * Format: MT-XXXXXX (MovieTix + 6 alphanumeric characters)
 * Example: MT-A3B7K9
 */
export function generateBookingCode(): string {
  const prefix = 'MT'; // MovieTix
  const timestamp = Date.now().toString(36).toUpperCase(); // Base-36 encoding of timestamp
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random chars
  
  // Combine and take last 6 characters for consistency
  const combined = (timestamp + random).substring(0, 6);
  
  return `${prefix}-${combined}`;
}

/**
 * Validates a booking code format
 * @param code The booking code to validate
 * @returns true if valid, false otherwise
 */
export function isValidBookingCode(code: string): boolean {
  const pattern = /^MT-[A-Z0-9]{6}$/;
  return pattern.test(code);
}

