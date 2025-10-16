const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

interface SendOTPResponse {
  success: boolean;
  message: string;
  otpForTesting?: string;
}

interface ValidateOTPResponse {
  success: boolean;
  message: string;
  valid?: boolean;
}

export const sendOTP = async (
  phoneNumber: string,
  countryCode: string
): Promise<SendOTPResponse> => {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/send-otp`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        phoneNumber,
        countryCode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw new Error(error.message || 'Failed to send OTP');
  }
};

export const validateOTP = async (
  phoneNumber: string,
  countryCode: string,
  otp: string
): Promise<ValidateOTPResponse> => {
  try {
    const apiUrl = `${SUPABASE_URL}/functions/v1/validate-otp`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        phoneNumber,
        countryCode,
        otp,
      }),
    });

    const data = await response.json();

    if (!response.ok && response.status !== 400 && response.status !== 404) {
      throw new Error(data.message || 'Failed to validate OTP');
    }

    return data;
  } catch (error: any) {
    console.error('Error validating OTP:', error);
    throw new Error(error.message || 'Failed to validate OTP');
  }
};
