/**
 * Password validation requirements
 */
interface PasswordRequirements {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

/**
 * Recursively validates password complexity by checking each requirement
 * @param password - The password to validate
 * @param requirements - The requirements object to check against
 * @param index - Current index in the password (default: 0)
 * @returns true if all requirements are met, false otherwise
 */
export function validatePasswordComplexity(
  password: string,
  requirements: PasswordRequirements = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSymbol: false,
  },
  index: number = 0
): boolean {
  if (index >= password.length) {
    return (
      requirements.hasUpperCase &&
      requirements.hasLowerCase &&
      requirements.hasNumber &&
      requirements.hasSymbol
    );
  }

  const char: string = password[index];
  const updatedRequirements: PasswordRequirements = { ...requirements };

  if (char >= 'A' && char <= 'Z') {
    updatedRequirements.hasUpperCase = true;
  } else if (char >= 'a' && char <= 'z') {
    updatedRequirements.hasLowerCase = true;
  } else if (char >= '0' && char <= '9') {
    updatedRequirements.hasNumber = true;
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(char)) {
    updatedRequirements.hasSymbol = true;
  }

  return validatePasswordComplexity(password, updatedRequirements, index + 1);
}

/**
 * Validates that a password meets minimum length requirement
 * @param password - The password to validate
 * @param minLength - Minimum length required (default: 8)
 * @returns true if password meets minimum length, false otherwise
 */
export function validatePasswordLength(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}

/**
 * Get password validation error message
 * @param password - The password to validate
 * @returns Error message if invalid, null if valid
 */
export function getPasswordValidationError(password: string): string | null {
  if (!validatePasswordLength(password)) {
    return 'Password must be at least 8 characters long';
  }

  if (!validatePasswordComplexity(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol';
  }

  return null;
}
