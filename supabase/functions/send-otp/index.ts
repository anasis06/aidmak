import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SendOTPRequest {
  phoneNumber: string;
  countryCode: string;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
  otpForTesting?: string;
}

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  console.log(`[MOCK SMS] Sending OTP ${otp} to ${phoneNumber}`);
  return true;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { phoneNumber, countryCode }: SendOTPRequest = await req.json();

    if (!phoneNumber || !countryCode) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Phone number and country code are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    await supabase
      .from('otps')
      .update({ is_valid: false })
      .eq('phone_number', fullPhoneNumber)
      .eq('is_valid', true);

    const otp = generateOTP();

    const { error: insertError } = await supabase.from('otps').insert({
      phone_number: fullPhoneNumber,
      country_code: countryCode,
      generated_otp: otp,
      is_valid: true,
      attempts: 0,
    });

    if (insertError) {
      console.error('Error inserting OTP:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to generate OTP',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await sendSMS(fullPhoneNumber, otp);

    const response: SendOTPResponse = {
      success: true,
      message: 'OTP sent successfully',
      otpForTesting: otp,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
