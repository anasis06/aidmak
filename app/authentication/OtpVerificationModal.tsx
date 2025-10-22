import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
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

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setTimer(32);
      setCanResend(false);
      setOtp(['', '', '', '']);
      setError('');

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      });
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
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

  const isOtpComplete = otp.every((digit) => digit !== '');

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      const response = await sendOTP(phoneNumber, countryCode);

      if (response.success) {
        if (response.otpForTesting) {
          console.log('New OTP for testing:', response.otpForTesting);
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
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity style={styles.backButton} onPress={handleClose}>
                <ChevronLeft size={24} color={Colors.text.primary} strokeWidth={2} />
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
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                        placeholderTextColor={Colors.text.tertiary}
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
                  {!canResend ? (
                    <Text style={styles.resendText}>
                      Resend code in <Text style={styles.timerText}>{timer} seconds.</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResend}
                      disabled={isResending}
                      style={styles.resendButton}
                    >
                      <Text style={styles.resendButtonText}>
                        {isResending ? 'Resending...' : 'Resend OTP'}
                      </Text>
                    </TouchableOpacity>
                  )}
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

              <View style={styles.bottomIndicator} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    minHeight: 520,
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
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xxl,
    lineHeight: 22,
    paddingHorizontal: Layout.spacing.xs,
  },

  phoneNumber: {
    color: Colors.text.primary,
    fontWeight: Fonts.weights.semibold,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
  },

  otpBox: {
    flex: 1,
    maxWidth: 70,
  },

  otpInput: {
    width: '100%',
    height: 65,
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: Colors.text.primary,
    fontSize: 48,
    fontWeight: Fonts.weights.regular,
    color: Colors.text.primary,
    textAlign: 'center',
    padding: 0,
    paddingBottom: 8,
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
    marginBottom: Layout.spacing.xl,
    minHeight: 24,
  },

  resendText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  timerText: {
    color: Colors.text.secondary,
    fontWeight: Fonts.weights.regular,
  },

  resendButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
  },

  resendButtonText: {
    fontSize: Fonts.sizes.base,
    color: Colors.primary.purple,
    fontWeight: Fonts.weights.semibold,
  },

  submitButton: {
    width: '100%',
  },

  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: Colors.text.primary,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: Layout.spacing.lg,
  },
});
