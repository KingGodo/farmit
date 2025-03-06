import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const Splash = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const screens = [
    {
      text: "Welcome to FarmIt!",
      description: "Your journey in sustainable farming begins here.",
      bgColor: "blue-600",
    },
    {
      text: "Explore Organic Practices",
      description: "Learn about eco-friendly farming techniques.",
      bgColor: "blue-500",
    },
    {
      text: "Connect with Nature",
      description: "Join a community that values nature and sustainability.",
      bgColor: "blue-400",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScreen < screens.length - 1) {
        setCurrentScreen(currentScreen + 1);
      } else {
        navigation.replace('Login');
      }
    }, 2000); // Change screen every 2 seconds

    return () => clearTimeout(timer);
  }, [currentScreen, navigation]);

  return (
    <View className={`flex-1 items-center justify-center bg-${screens[currentScreen].bgColor}`}>
      <Text className="text-white text-3xl font-bold text-center">{screens[currentScreen].text}</Text>
      <Text className="text-white text-lg mt-2 text-center">{screens[currentScreen].description}</Text>
    </View>
  );
};

export default Splash;