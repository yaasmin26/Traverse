import React from 'react';
import { Stack } from 'expo-router';

/**
 * RootLayout: Mengelola tumpukan navigasi (Stack Navigation)
 * Kriteria Penilaian: Menerapkan _layout dan <Stack.Screen>
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#445738', // Tema hijau zaitun Traverse
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#fbfad3', // Tema krem Traverse
        },
      }}
    >
      {/* 1. Layar Awal / Splash */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* 2. Layar Login */}
      <Stack.Screen
        name="login"
        options={{
          title: 'Masuk Akun',
          headerShown: true,
        }}
      />

      {/* 3. Layar Beranda (Home) */}
      <Stack.Screen
        name="home"
        options={{
          title: 'Traverse - Beranda',
          headerShown: false,
        }}
      />

      {/* 4. Layar Detail Destinasi */}
      <Stack.Screen
        name="detail"
        options={{
          title: 'Detail Wisata',
          headerShown: true,
        }}
      />

      {/* 5. Layar Profil Mahasiswa/Pengguna */}
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profil Pengguna',
          headerShown: true,
        }}
      />

      {/* 6. Layar Demo Modul 3 */}
      <Stack.Screen
        name="demo"
        options={{
          title: 'Demo Modul 3',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
