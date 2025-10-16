import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { validatePhoneNumber } from '@/utils/validators';
import OtpVerificationModal from './OtpVerificationModal';

export default function LoginScreen() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOTP = () => {
    const phoneError = validatePhoneNumber(phoneNumber);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    setError('');
    setShowOtpModal(true);
  };

  const handleVerifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Logged in successfully!');
      setShowOtpModal(false);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Enter your phone number and the OTP we sent to securely log in to your account.
            </Text>
          </View>

          <View style={styles.formSection}>
            <PhoneNumberInput
              label="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              error={error}
              placeholder="Enter your Mobile Number"
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Get OTP"
              onPress={handleGetOTP}
              variant="primary"
              size="large"
              loading={isLoading}
              style={styles.otpButton}
            />

            <View style={styles.signUpSection}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/authentication/SignUpScreen')}>
                <Text style={styles.signUpLink}>Sign up here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <OtpVerificationModal
        visible={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOTP}
        phoneNumber={phoneNumber}
        countryCode={countryCode}
      />
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    justifyContent: 'space-between',
  },

  headerSection: {
    marginTop: Layout.spacing.xxl,
  },

  title: {
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },

  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  formSection: {
    flex: 1,
    marginTop: Layout.spacing.xxl,
  },

  footer: {
    paddingBottom: Layout.spacing.xl,
  },

  otpButton: {
    marginBottom: Layout.spacing.lg,
  },

  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signUpText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
  },

  signUpLink: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary.purple,
    fontWeight: Fonts.weights.semibold,
  },
});
