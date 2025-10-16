import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ValidateOTPRequest {
  phoneNumber: string;
  countryCode: string;
  otp: string;
}

interface ValidateOTPResponse {
  success: boolean;
  message: string;
  valid?: boolean;
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

    const { phoneNumber, countryCode, otp }: ValidateOTPRequest = await req.json();

    if (!phoneNumber || !countryCode || !otp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Phone number, country code, and OTP are required',
          valid: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    const { data: otpRecords, error: fetchError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone_number', fullPhoneNumber)
      .eq('is_valid', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !otpRecords || otpRecords.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No valid OTP found. Please request a new one.',
          valid: false,
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const otpRecord = otpRecords[0];
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);

    if (now > expiresAt) {
      await supabase
        .from('otps')
        .update({ is_valid: false })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'OTP has expired. Please request a new one.',
          valid: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (otpRecord.attempts >= 3) {
      await supabase
        .from('otps')
        .update({ is_valid: false })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many attempts. Please request a new OTP.',
          valid: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (otpRecord.generated_otp !== otp) {
      await supabase
        .from('otps')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Incorrect OTP. Please try again.',
          valid: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase
      .from('otps')
      .update({
        is_valid: false,
        validated_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id);

    const response: ValidateOTPResponse = {
      success: true,
      message: 'OTP validated successfully',
      valid: true,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in validate-otp function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        valid: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
