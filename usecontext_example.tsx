import React, { createContext, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

/**
 * CODELAB-1: Penggunaan useContext untuk Dark Mode
 * Modul 2 - State, Hooks, & Navigasi Page (Halaman 17)
 */

// Membuat Context
const ThemeContext = createContext<any>(null);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    // Membungkus komponen dengan ThemeContext.Provider
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Home />
    </ThemeContext.Provider>
  );
}

function Home() {
  return <Profile />;
}

function Profile() {
  return <UserCard />;
}

function UserCard() {
  return <UserName />;
}

function UserName() {
  // Mengambil nilai dari Context menggunakan useContext
  const theme = useContext(ThemeContext);
  const darkMode = theme.darkMode;
  const setDarkMode = theme.setDarkMode;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#ffffff' },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: darkMode ? '#ffffff' : '#000000' },
        ]}
      >
        {darkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Button
        title="Toggle Theme"
        onPress={() => setDarkMode(!darkMode)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
