import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

const Welcome = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <Animated.View style={{ flex: 1, backgroundColor: 'black', opacity: fadeAnim }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 48, fontWeight: 'semi-bold', textAlign: 'center' }}>
          Farm
          <Text style={{ color: 'green', fontStyle: 'italic' }}>It</Text>
        </Text>
      </View>
    </Animated.View>
  );
};

export default Welcome;