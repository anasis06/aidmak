import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { InputField } from '@/components/InputField';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { validateEmail, validateFullName, validatePhoneNumber } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';
import OtpVerificationModal from './OtpVerificationModal';
import { sendOTP } from '@/services/otpService';
import { userService } from '@/services/userService';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, setCustomUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const checkForDuplicates = async (emailValue: string, phoneValue: string, countryCodeValue: string) => {
    if (!emailValue || !phoneValue) return;

    const emailError = validateEmail(emailValue);
    const phoneError = validatePhoneNumber(phoneValue);

    if (emailError || phoneError) return;

    try {
      setIsCheckingDuplicate(true);
      const existsCheck = await userService.checkUserExists(emailValue, phoneValue, countryCodeValue);

      if (existsCheck.exists) {
        const newErrors: Record<string, string> = {};
        if (existsCheck.field === 'email') {
          newErrors.email = existsCheck.message || 'This email already exists.';
        } else if (existsCheck.field === 'phone') {
          newErrors.phoneNumber = existsCheck.message || 'This number already exists.';
        }
        setErrors(prevErrors => ({
          ...prevErrors,
          ...newErrors
        }));
      } else {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          if (existsCheck.field === 'email' || !existsCheck.field) {
            delete newErrors.email;
          }
          if (existsCheck.field === 'phone' || !existsCheck.field) {
            delete newErrors.phoneNumber;
          }
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (email && phoneNumber) {
      debounceTimerRef.current = setTimeout(() => {
        checkForDuplicates(email, phoneNumber, countryCode);
      }, 500);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [email, phoneNumber, countryCode]);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (errors.fullName) {
      const nameError = validateFullName(value);
      if (!nameError) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.fullName;
          return newErrors;
        });
      }
    }
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.phoneNumber && newErrors.phoneNumber.includes('already exists')) {
        delete newErrors.phoneNumber;
      }
      return newErrors;
    });

    if (errors.phoneNumber && !errors.phoneNumber.includes('already exists')) {
      const phoneError = validatePhoneNumber(value);
      if (!phoneError) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.phoneNumber;
          return newErrors;
        });
      }
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.email && newErrors.email.includes('already exists')) {
        delete newErrors.email;
      }
      return newErrors;
    });

    if (errors.email && !errors.email.includes('already exists')) {
      const emailError = validateEmail(value);
      if (!emailError) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameError = validateFullName(fullName);
    if (nameError) newErrors.fullName = nameError;

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) newErrors.phoneNumber = phoneError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetOTP = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const existsCheck = await userService.checkUserExists(email, phoneNumber, countryCode);

      if (existsCheck.exists) {
        const newErrors = { ...errors };
        if (existsCheck.field === 'email') {
          newErrors.email = existsCheck.message || 'This email already exists.';
        } else if (existsCheck.field === 'phone') {
          newErrors.phoneNumber = existsCheck.message || 'This number already exists.';
        }
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const newUser = await userService.createUser({
        fullName,
        email,
        phoneNumber,
        countryCode,
      });

      setCurrentUserId(newUser.id);

      const response = await sendOTP(phoneNumber, countryCode);

      if (response.success) {
        if (response.otpForTesting) {
          console.log('OTP for testing:', response.otpForTesting);
        }
        setShowOtpModal(true);
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      if (currentUserId) {
        await userService.verifyUser(currentUserId);

        setCustomUser({
          id: currentUserId,
          email: email,
          phone: `${countryCode}${phoneNumber}`,
        });
      }

      setShowOtpModal(false);

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push({
              pathname: '/profileSetup/LetsStartScreen',
              params: { userId: currentUserId }
            })
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    }
  };

  const hasNonDuplicateErrors = Object.keys(errors).some(key => {
    const error = errors[key];
    return error && !error.includes('already exists');
  });

  const isFormValid = fullName && phoneNumber && email && !hasNonDuplicateErrors && !isCheckingDuplicate;

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formSection}>
            <Text style={styles.title}>Create Your Style Account</Text>
            <Text style={styles.subtitle}>
              Enter your details to sign up and start your personalized style journey.
            </Text>

            <View style={styles.form}>
              <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={handleFullNameChange}
                error={errors.fullName}
                autoCapitalize="words"
              />

              <PhoneNumberInput
                label="Phone number"
                placeholder="Enter your Mobile Number"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                error={errors.phoneNumber}
                containerStyle={styles.phoneInput}
              />

              <InputField
                label="Email"
                placeholder="Enter your email address"
                value={email}
                onChangeText={handleEmailChange}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                title="Get OTP"
                onPress={handleGetOTP}
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={!isFormValid}
                style={styles.signUpButton}
              />

              <View style={styles.loginSection}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push('/authentication/LoginScreen')}
                >
                  Login here
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
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

  scrollView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
  },

  formSection: {
    flex: 1,
  },

  title: {
    fontSize: Fonts.sizes.xxxl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },

  subtitle: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xxl * 2,
    lineHeight: 22,
  },

  form: {
    width: '100%',
  },

  phoneInput: {
    marginBottom: Layout.spacing.xl,
  },

  signUpButton: {
    marginTop: Layout.spacing.xxl + 170,
  },

  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.lg,
  },

  loginText: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
  },

  loginLink: {
    fontSize: Fonts.sizes.base,
    color: Colors.primary.purple,
    fontWeight: Fonts.weights.semibold,
  },
});
