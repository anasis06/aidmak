export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return 'Password must contain uppercase, lowercase, and numbers';
  }

  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (
  value: number | string,
  min?: number,
  max?: number
): string | null => {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return 'Please enter a valid number';
  }

  if (min !== undefined && num < min) {
    return `Value must be at least ${min}`;
  }

  if (max !== undefined && num > max) {
    return `Value must be no more than ${max}`;
  }

  return null;
};

export const validateHeight = (height: number): string | null => {
  return validateNumber(height, 100, 250);
};

export const validateWeight = (weight: number): string | null => {
  return validateNumber(weight, 30, 300);
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) {
    return 'Please enter a valid 4-digit OTP';
  }

  if (otp.length !== 4) {
    return 'Please enter a valid 4-digit OTP';
  }

  if (!/^\d+$/.test(otp)) {
    return 'Please enter a valid 4-digit OTP';
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'Full name is required';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
    return 'Please enter a valid phone number';
  }

  return null;
};
