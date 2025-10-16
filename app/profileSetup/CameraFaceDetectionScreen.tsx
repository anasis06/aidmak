import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ChevronLeft, Camera as CameraIcon } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import { useUser } from '@/hooks/useUser';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const OVAL_WIDTH = SCREEN_WIDTH * 0.7;
const OVAL_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function CameraFaceDetectionScreen() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleContinue = () => {
    if (capturedImage) {
      updateProfile({ profilePicture: capturedImage });
    }
    router.push('/(tabs)');
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaContainer>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <View style={styles.imagePreview}>
            <img
              src={capturedImage}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt="Captured"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <View style={styles.cameraHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.cameraBackButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.faceFrameContainer}>
            <Svg
              width={OVAL_WIDTH}
              height={OVAL_HEIGHT}
              viewBox={`0 0 ${OVAL_WIDTH} ${OVAL_HEIGHT}`}
            >
              <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#ff334b" stopOpacity="1" />
                  <Stop offset="50%" stopColor="#ffeb3b" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#4caf50" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Path
                d={`M ${OVAL_WIDTH / 2} 0
                   Q ${OVAL_WIDTH} 0 ${OVAL_WIDTH} ${OVAL_HEIGHT / 2}
                   Q ${OVAL_WIDTH} ${OVAL_HEIGHT} ${OVAL_WIDTH / 2} ${OVAL_HEIGHT}
                   Q 0 ${OVAL_HEIGHT} 0 ${OVAL_HEIGHT / 2}
                   Q 0 0 ${OVAL_WIDTH / 2} 0`}
                stroke="url(#grad)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="12 8"
              />
            </Svg>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>Keep your phone straight</Text>
          </View>
        </View>
      </CameraView>

      <View style={styles.captureButtonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <Text style={styles.captureText}>Take a selfie</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primary,
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: Fonts.sizes.lg,
    color: Colors.text.secondary,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    gap: Layout.spacing.lg,
  },

  permissionTitle: {
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  permissionText: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  header: {
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.lg,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    paddingLeft: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },

  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePreview: {
    width: '100%',
    height: '100%',
  },

  buttonContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Layout.spacing.xl,
  },

  cameraBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    paddingLeft: Layout.spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    marginLeft: Layout.spacing.lg,
  },

  camera: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  faceFrameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  instructionBox: {
    position: 'absolute',
    bottom: 200,
    backgroundColor: Colors.text.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },

  instructionText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    color: Colors.background.primary,
  },

  captureButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Layout.spacing.md,
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.text.primary,
  },

  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary.purple,
  },

  captureText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },
});
