import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Halaman Login Mahasiswa / Pengguna
 * Kriteria Penilaian:
 * 1. Menerapkan useState (form input username & password, pesan status)
 * 2. Menerapkan useEffect (reset status kesalahan setelah beberapa detik)
 * 3. Menerapkan router.replace() saat berhasil login (agar tidak bisa back ke login)
 * 4. Menerapkan router.back() untuk tombol kembali
 */
export default function LoginScreen() {
  const router = useRouter();

  // Penerapan hook useState
  const [username, setUsername] = useState<string>('yaasmin');
  const [password, setPassword] = useState<string>('123456');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Penerapan hook useEffect
  // Menghilangkan pesan error secara otomatis setelah 3 detik
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Fungsi submit login
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username dan Password wajib diisi!');
      return;
    }

    // Menggunakan router.replace() dengan meneruskan parameter username (Modul 2 hal 21-22 & 33)
    Alert.alert('Login Berhasil', `Selamat datang kembali, ${username}!`, [
      {
        text: 'Lanjut',
        onPress: () => {
          router.replace({
            pathname: '/home',
            params: { username: username.trim() },
          });
        },
      },
    ]);
  };

  // Navigasi kembali menggunakan router.back()
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Tombol Back Atas */}
        <TouchableOpacity style={styles.topBackBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#445738" />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color="#ffffff" />
          </View>
          <Text style={styles.title}>Masuk Akun</Text>
          <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan eksplorasi</Text>

          {/* Pesan Error jika ada */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#d32f2f" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Input Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Pengguna / NIM</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#687a55" />
              <TextInput
                style={styles.input}
                placeholder="Masukkan username"
                placeholderTextColor="#94a580"
                value={username}
                onChangeText={(text) => setUsername(text)}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Form Input Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="key-outline" size={18} color="#687a55" />
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                placeholderTextColor="#94a580"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </View>
          </View>

          {/* Tombol Masuk (router.replace) */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Masuk (router.replace)</Text>
          </TouchableOpacity>

          {/* Tombol Kembali (router.back) */}
          <TouchableOpacity style={styles.cancelBtn} onPress={handleBack}>
            <Text style={styles.cancelBtnText}>Batal & Kembali (router.back)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbfad3',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  topBackBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#445738',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#445738',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#35432b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#687a55',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginLeft: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#35432b',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfad3',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e7c8',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#35432b',
  },
  loginBtn: {
    backgroundColor: '#445738',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#687a55',
    fontSize: 13,
    fontWeight: '600',
  },
});
