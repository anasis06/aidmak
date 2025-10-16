import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { validateOTP as validateOTPFormat } from '@/utils/validators';
import { validateOTP, sendOTP } from '@/services/otpService';

interface OtpVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  phoneNumber?: string;
  countryCode?: string;
}

export default function OtpVerificationModal({
  visible,
  onClose,
  onVerify,
  phoneNumber = '',
  countryCode = '+91',
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(32);
  const [canResend, setCanResend] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (visible) {
      setTimer(32);
      setCanResend(false);
      setOtp(['', '', '', '']);
      setError('');
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [visible]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (visible && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, timer]);

  const maskPhoneNumber = (phone: string) => {
    if (phone.length <= 2) return phone;
    const visibleDigits = phone.slice(0, 3);
    const masked = '*'.repeat(Math.max(phone.length - 6, 0));
    const lastDigits = phone.slice(-3);
    return visibleDigits + masked + lastDigits;
  };

  const handleChange = async (text: string, index: number) => {
    if (!/^\d*$/.test(text)) {
      return;
    }

    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (text && index === 3) {
      const completeOtp = newOtp.join('');
      if (completeOtp.length === 4) {
        await handleAutoValidate(completeOtp);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoValidate = async (otpString: string) => {
    const formatError = validateOTPFormat(otpString);

    if (formatError) {
      setError(formatError);
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await validateOTP(phoneNumber, countryCode, otpString);

      if (response.success && response.valid) {
        onVerify(otpString);
      } else {
        setError(response.message || 'Incorrect OTP. Please try again.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to validate OTP');
    } finally {
      setIsValidating(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    await handleAutoValidate(otpString);
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const response = await sendOTP(phoneNumber, countryCode);

      if (response.success) {
        if (response.otpForTesting) {
          console.log('OTP for testing:', response.otpForTesting);
        }
        Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number');
        setOtp(['', '', '', '']);
        setError('');
        setTimer(32);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>OTP Verification Sent!</Text>
            <Text style={styles.subtitle}>
              A verification code will be sent to the Phone Number{' '}
              <Text style={styles.phoneNumber}>
                {countryCode} {maskPhoneNumber(phoneNumber)}
              </Text>{' '}
              for your account verification process.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpBox}>
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            {isValidating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary.purple} />
                <Text style={styles.loadingText}>Validating OTP...</Text>
              </View>
            )}

            {error && !isValidating ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resendSection}>
              <Text style={styles.resendText}>
                Resend code in{' '}
                <Text style={styles.timerText}>
                  {timer} seconds.
                </Text>
              </Text>
            </View>

            <Button
              title="Submit"
              onPress={handleVerify}
              variant="primary"
              size="large"
              style={styles.submitButton}
              disabled={!isOtpComplete || isValidating}
              loading={isValidating}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.xxl,
    paddingTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xxl,
    width: '90%',
    maxWidth: 400,
  },

  backButton: {
    alignSelf: 'flex-start',
    padding: Layout.spacing.xs,
    marginBottom: Layout.spacing.lg,
  },

  contentContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },

  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl * 1.5,
    lineHeight: 20,
  },

  phoneNumber: {
    color: Colors.text.primary,
    fontWeight: Fonts.weights.semibold,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.md,
    width: '100%',
    marginBottom: Layout.spacing.md,
  },

  otpBox: {
    flex: 1,
    maxWidth: 70,
  },

  otpInput: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: Colors.text.primary,
    fontSize: 40,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    padding: 0,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.md,
  },

  loadingText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.medium,
  },

  errorText: {
    fontSize: Fonts.sizes.sm,
    color: '#ff334b',
    fontWeight: Fonts.weights.medium,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },

  resendSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },

  resendText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
  },

  timerText: {
    color: Colors.text.primary,
    fontWeight: Fonts.weights.semibold,
  },

  submitButton: {
    width: '100%',
  },
});
