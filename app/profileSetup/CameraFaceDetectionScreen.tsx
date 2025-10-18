import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ChevronLeft, Camera as CameraIcon } from 'lucide-react-native';
import { SafeAreaContainer } from '@/components/SafeAreaContainer';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Layout } from '@/constants/Layout';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.75;

export default function CameraFaceDetectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    setError('');
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        if (photo) {
          const isValidFace = await validateFaceInCircle(photo.uri);
          if (isValidFace) {
            setCapturedImage(photo.uri);
            setShowPreview(true);
          } else {
            setError('Keep your face in the circle');
            setTimeout(() => setError(''), 3000);
          }
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        setError('Failed to capture photo');
      }
    }
  };

  const validateFaceInCircle = async (uri: string): Promise<boolean> => {
    return true;
  };

  const handleContinue = () => {
    if (capturedImage) {
      router.push({
        pathname: '/profileSetup/UploadPictureScreen',
        params: { userId, capturedImage }
      });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowPreview(false);
    setError('');
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

  if (showPreview && capturedImage) {
    return (
      <SafeAreaContainer style={styles.safeArea}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={handleRetake} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Review Photo</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.previewContainer}>
          <View style={styles.previewImageCircle}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          </View>
          <Text style={styles.previewSubtitle}>Are you satisfied with this photo?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Use This Photo"
            onPress={handleContinue}
            variant="primary"
            size="large"
          />
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeButtonText}>Retake Photo</Text>
          </TouchableOpacity>
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
          <View style={styles.topDarkOverlay} />

          <View style={styles.middleRow}>
            <View style={styles.sideDarkOverlay} />
            <View style={styles.circleContainer}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                <Defs>
                  <LinearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                    <Stop offset="50%" stopColor="#ec4899" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#f59e0b" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={CIRCLE_SIZE / 2 - 4}
                  stroke="url(#circleGrad)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="12 8"
                />
              </Svg>
            </View>
            <View style={styles.sideDarkOverlay} />
          </View>

          <View style={styles.bottomDarkOverlay}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>Position your face in the circle</Text>
              </View>
            )}
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

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },

  previewTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },

  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },

  previewImageCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: Colors.background.secondary,
    marginBottom: Layout.spacing.xl,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  previewSubtitle: {
    fontSize: Fonts.sizes.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: Fonts.weights.regular,
  },

  buttonContainer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },

  retakeButton: {
    height: 56,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.primary.purple,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  retakeButtonText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.primary.purple,
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
  },

  topDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  middleRow: {
    flexDirection: 'row',
    height: CIRCLE_SIZE,
  },

  sideDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 140,
  },

  instructionBox: {
    backgroundColor: Colors.text.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },

  instructionText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
    color: Colors.background.primary,
  },

  errorBox: {
    backgroundColor: '#ff334b',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
  },

  errorText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
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
