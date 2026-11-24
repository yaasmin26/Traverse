/**
 * ============================================================================
 * [TUGAS ORANG 2: CONNECT KAMERA & MEDIA GALLERY]
 * Integrasi sensor kamera perangkat dan pemilihan foto menggunakan expo-image-picker
 * ============================================================================
 */
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface CameraResult {
  cancelled: boolean;
  uri?: string;
  width?: number;
  height?: number;
  base64?: string;
}

class CameraService {
  /**
   * 1. Meminta Izin Akses Kamera Perangkat
   */
  public async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Kamera Ditolak',
          'Aplikasi memerlukan izin kamera untuk mengambil foto profil atau destinasi wisata.'
        );
        return false;
      }
    }
    return true;
  }

  /**
   * 2. Meminta Izin Akses Galeri / Media Library
   */
  public async requestGalleryPermission(): Promise<boolean> {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Galeri Ditolak',
          'Aplikasi memerlukan izin galeri untuk memilih foto dari penyimpanan.'
        );
        return false;
      }
    }
    return true;
  }

  /**
   * 3. Ambil Foto Langsung dari Sensor Kamera (Camera Capture)
   */
  public async takePhoto(): Promise<CameraResult> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      return { cancelled: true };
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          cancelled: false,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };
      }
      return { cancelled: true };
    } catch (error: any) {
      Alert.alert('Gagal Mengakses Kamera', error?.message || 'Terjadi kesalahan saat membuka kamera.');
      return { cancelled: true };
    }
  }

  /**
   * 4. Pilih Foto dari Galeri Penyimpanan (Image Picker)
   */
  public async pickFromGallery(): Promise<CameraResult> {
    const hasPermission = await this.requestGalleryPermission();
    if (!hasPermission) {
      return { cancelled: true };
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          cancelled: false,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };
      }
      return { cancelled: true };
    } catch (error: any) {
      Alert.alert('Gagal Mengakses Galeri', error?.message || 'Terjadi kesalahan saat memilih gambar.');
      return { cancelled: true };
    }
  }

  /**
   * 5. Helper Dialog Memilih Sumber Foto (Kamera atau Galeri)
   */
  public promptImageSource(onSuccess: (uri: string) => void) {
    Alert.alert(
      'Pilih Sumber Foto',
      'Silakan pilih untuk mengambil foto baru melalui kamera atau mengambil dari galeri ponsel:',
      [
        {
          text: '📷 Buka Kamera',
          onPress: async () => {
            const res = await this.takePhoto();
            if (!res.cancelled && res.uri) {
              onSuccess(res.uri);
            }
          },
        },
        {
          text: '🖼 Buka Galeri',
          onPress: async () => {
            const res = await this.pickFromGallery();
            if (!res.cancelled && res.uri) {
              onSuccess(res.uri);
            }
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  }
}

export const cameraService = new CameraService();
