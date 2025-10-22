import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { AppProvider } from '@/context/AppContext';
import { ProfileSetupProvider } from '@/context/ProfileSetupContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <AuthProvider>
        <UserProvider>
          <ProfileSetupProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" />
              <Stack.Screen name="authentication/OnboardingScreen" />
              <Stack.Screen name="authentication/LoginScreen" />
              <Stack.Screen name="authentication/SignUpScreen" />
              <Stack.Screen name="profileSetup/LetsStartScreen" />
              <Stack.Screen name="profileSetup/GenderChooseScreen" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
          </ProfileSetupProvider>
        </UserProvider>
      </AuthProvider>
    </AppProvider>
  );
}
