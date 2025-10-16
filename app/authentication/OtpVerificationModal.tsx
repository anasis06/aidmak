import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { validateOTP } from '@/utils/validators';

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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(32);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (visible) {
      setTimer(32);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
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
    if (phone.length <= 4) return phone;
    const lastFour = phone.slice(-4);
    const masked = '*'.repeat(Math.min(phone.length - 4, 6));
    return masked + lastFour;
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(text.length - 1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    const validationError = validateOTP(otpString);

    if (validationError) {
      setError('invalid');
      return;
    }

    setError('');
    onVerify(otpString);
  };

  const handleTryAgain = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const hasError = error === 'invalid';

  const handleResend = () => {
    if (!canResend) return;

    Alert.alert('OTP Resent', 'A new OTP has been sent to your phone number');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(32);
    setCanResend(false);
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
            <ArrowLeft size={24} color={Colors.text.primary} />
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
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, hasError && styles.otpInputError]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!hasError}
                />
              ))}
            </View>

            {hasError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>OTP entered is Invalid</Text>
                <TouchableOpacity onPress={handleTryAgain}>
                  <Text style={styles.tryAgainText}>Try again</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.resendSection}>
              <Text style={[styles.resendText, !canResend && styles.resendTextDisabled]}>
                Resend code in{' '}
                <Text style={styles.timerText}>
                  {timer} seconds
                </Text>
                {canResend && '.'}
              </Text>
              {canResend && (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}> Resend now</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              title="Submit"
              onPress={handleVerify}
              variant="primary"
              size="large"
              style={[styles.submitButton, hasError && styles.submitButtonDisabled]}
              disabled={!isOtpComplete || hasError}
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
    backgroundColor: Colors.background.primary,
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: Layout.borderRadius.xxl,
    borderTopRightRadius: Layout.borderRadius.xxl,
    paddingTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
    minHeight: '70%',
  },

  backButton: {
    alignSelf: 'flex-start',
    padding: Layout.spacing.xs,
    marginBottom: Layout.spacing.lg,
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: Layout.spacing.xxl,
    lineHeight: 20,
    paddingHorizontal: Layout.spacing.md,
  },

  phoneNumber: {
    color: Colors.text.primary,
    fontWeight: Fonts.weights.semibold,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    width: '100%',
    marginBottom: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.sm,
  },

  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  otpInputError: {
    borderColor: Colors.status.error,
  },

  errorContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },

  errorText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.status.error,
    fontWeight: Fonts.weights.medium,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },

  tryAgainText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xxl,
  },

  resendText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text.secondary,
  },

  resendTextDisabled: {
    color: Colors.text.tertiary,
  },

  timerText: {
    color: Colors.text.primary,
    fontWeight: Fonts.weights.semibold,
  },

  resendLink: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary.purple,
    fontWeight: Fonts.weights.semibold,
  },

  submitButton: {
    width: '100%',
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },
});
