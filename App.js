import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/onboarding/Splash';
import Welcome from './src/screens/onboarding/Welcome';
import Login from './src/screens/onboarding/Login';
import Home from './src/screens/Home';
import LanguageSelection from './src/screens/onboarding/LanguageSelection';
import ReviewAndSubmit from './src/screens/onboarding/ReviewAndSubmit';
import Success from './src/screens/onboarding/Success';
import Registration from './src/screens/onboarding/Registration';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="ReviewAndSubmit" component={ReviewAndSubmit} />
        <Stack.Screen name="Success" component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}