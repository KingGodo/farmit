import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/onboarding/Splash';
import Welcome from './src/screens/onboarding/Welcome';
import Login from './src/screens/onboarding/Login';
import Home from './src/screens/Home';
import ReviewAndSubmit from './src/screens/onboarding/ReviewAndSubmit';
import Success from './src/screens/onboarding/Success';
import Registration from './src/screens/onboarding/Registration';
import Profile from './src/screens/Profile';
import Calendar from './src/screens/Calendar';
import Crops from './src/screens/Crops';
import Community from './src/screens/Community';
import Chat from './src/screens/Chat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="ReviewAndSubmit" component={ReviewAndSubmit} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Crops" component={Crops} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}