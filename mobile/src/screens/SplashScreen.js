import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import logo from '../assets/monster-logo.png';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Clique para começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 300, height: 300 },
  button: { backgroundColor: '#ff00a6', padding: 16, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18 }
});
