
// This is a mock service for sending OTPs
// In a production environment, you would integrate with actual SMS and email services

// Generate a random OTP code
export function generateOTP(): string {
  // Generate a 6-digit OTP code
  const otpNumber = Math.floor(100000 + Math.random() * 900000);
  return otpNumber.toString();
}

// Send OTP via SMS (mock implementation)
export async function sendSmsOTP(phoneNumber: string, otp: string): Promise<boolean> {
  console.log(`[SMS OTP Service] Sending OTP ${otp} to ${phoneNumber}`);
  
  // In a real implementation, you would use an SMS gateway service
  // For this example, we'll just simulate a successful send
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

// Send OTP via Email (mock implementation)
export async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  console.log(`[Email OTP Service] Sending OTP ${otp} to ${email}`);
  
  // In a real implementation, you would use an email service
  // For this example, we'll just simulate a successful send
  
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Log for demo purposes
  console.log(`Email body would contain OTP: ${otp}`);
  
  // Add debug info for tracking specific email issues
  console.log(`DEBUG: Email service attempted to send OTP to ${email} at ${new Date().toISOString()}`);
  
  return true;
}

// Get OTP expiration time (5 minutes from now)
export function getOTPExpiration(): Date {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 5);
  return expiration;
}

// Format phone number for display (hide part of it)
export function formatPhoneForDisplay(phone: string): string {
  if (!phone) return '';
  
  // If the phone has at least 10 digits, mask the middle part
  if (phone.length >= 10) {
    const firstPart = phone.slice(0, 3);
    const lastPart = phone.slice(phone.length - 3);
    return `${firstPart}•••••${lastPart}`;
  }
  
  // Otherwise, mask half of it
  const visibleLength = Math.ceil(phone.length / 2);
  const firstPart = phone.slice(0, visibleLength);
  return `${firstPart}${'•'.repeat(phone.length - visibleLength)}`;
}

// Format email for display (hide part of it)
export function formatEmailForDisplay(email: string): string {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const [username, domain] = parts;
  
  // Show first and last character of username, mask the rest
  let maskedUsername;
  if (username.length <= 2) {
    maskedUsername = username;
  } else {
    maskedUsername = username[0] + '•'.repeat(username.length - 2) + username[username.length - 1];
  }
  
  return `${maskedUsername}@${domain}`;
}

// Configuration for demo OTP recipients
// These are only used for display purposes in the UI when no real contact is provided
export const DEMO_PHONE_NUMBER = "+1234567890";
export const DEMO_EMAIL = "user@example.com";
