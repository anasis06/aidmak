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
import Svg, { Circle, Ellipse, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const OVAL_WIDTH = SCREEN_WIDTH * 0.65;
const OVAL_HEIGHT = SCREEN_HEIGHT * 0.55;

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
            setError('Your face is not detected');
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
          <View style={styles.ovalContainer}>
            <Svg width={OVAL_WIDTH} height={OVAL_HEIGHT} style={styles.ovalSvg}>
              <Defs>
                <LinearGradient id="ovalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
                  <Stop offset="25%" stopColor="#feca57" stopOpacity="1" />
                  <Stop offset="50%" stopColor="#48dbfb" stopOpacity="1" />
                  <Stop offset="75%" stopColor="#1dd1a1" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#5f27cd" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Ellipse
                cx={OVAL_WIDTH / 2}
                cy={OVAL_HEIGHT / 2}
                rx={OVAL_WIDTH / 2 - 6}
                ry={OVAL_HEIGHT / 2 - 6}
                stroke="url(#ovalGrad)"
                strokeWidth="6"
                fill="none"
                strokeDasharray="15 10"
              />
            </Svg>
          </View>
        </View>
      </CameraView>

      <View style={styles.bottomSection}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.instructionBox}>
            <View style={styles.iconContainer}>
              <View style={styles.phoneIcon} />
            </View>
            <Text style={styles.instructionText}>Keep your phone straight</Text>
          </View>
        )}

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <Text style={styles.captureText}>Take a selfi</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  ovalContainer: {
    width: OVAL_WIDTH,
    height: OVAL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ovalSvg: {
    position: 'absolute',
  },

  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    gap: Layout.spacing.lg,
  },

  instructionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },

  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  phoneIcon: {
    width: 16,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    borderRadius: 3,
  },

  instructionText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },

  errorBox: {
    backgroundColor: '#ff334b',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.xl,
  },

  errorText: {
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text.primary,
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary.purple,
  },

  captureText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text.primary,
  },
});
