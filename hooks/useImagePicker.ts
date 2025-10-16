import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImageFromGallery = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return {
      camera: cameraPermission.status === 'granted',
      gallery: galleryPermission.status === 'granted',
    };
  };

  const clearImage = () => {
    setImage(null);
  };

  return {
    image,
    isLoading,
    pickImageFromGallery,
    takePhoto,
    requestPermissions,
    clearImage,
  };
};
