import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import Home from '../components/Home'
import AddDollScreen from '../screens/AddDollScreen';
import DollInfoScreen from '../screens/DollInfoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddDoll" component={AddDollScreen} />
      <Stack.Screen name="DollInfo" component={DollInfoScreen} />
    </Stack.Navigator>
  );
}