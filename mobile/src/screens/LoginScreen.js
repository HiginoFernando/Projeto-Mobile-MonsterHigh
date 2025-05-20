import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/monster-logo.png')} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Clique para começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  logo: { width: 250, height: 250, marginBottom: 40 },
  button: {
    backgroundColor: '#ff1493',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});