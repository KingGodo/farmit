import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Farmit',
    description: 'Your complete digital farming companion for smarter agriculture',
    icon: 'leaf',
    backgroundColor: '#4a6c2f',
    textColor: '#ffffff',
    features: [
      'Smart Farm Management',
      'Crop Planning & Monitoring',
      'Weather Insights',
      'Expert Guidance'
    ]
  },
  {
    id: '2',
    title: 'Smart Farming',
    description: 'Get real-time insights and data-driven recommendations for your farm',
    icon: 'analytics',
    backgroundColor: '#4a6c2f',
    textColor: '#ffffff',
    features: [
      'Soil Analysis',
      'Crop Health Monitoring',
      'Yield Predictions',
      'Resource Optimization'
    ]
  },
  {
    id: '3',
    title: 'Weather Intelligence',
    description: 'Make informed decisions with accurate weather forecasts and alerts',
    icon: 'partly-sunny',
    backgroundColor: '#4a6c2f',
    textColor: '#ffffff',
    features: [
      'Local Weather Forecasts',
      'Rain Predictions',
      'Temperature Tracking',
      'Weather Alerts'
    ]
  },
  {
    id: '4',
    title: 'Expert Community',
    description: 'Connect with agricultural experts and fellow farmers',
    icon: 'people',
    backgroundColor: '#4a6c2f',
    textColor: '#ffffff',
    features: [
      'Expert Advice',
      'Community Forums',
      'Knowledge Sharing',
      'Success Stories'
    ]
  },
  {
    id: '5',
    title: 'Market Access',
    description: 'Get better prices for your produce with direct market access',
    icon: 'cart',
    backgroundColor: '#4a6c2f',
    textColor: '#ffffff',
    features: [
      'Price Tracking',
      'Direct Selling',
      'Market Updates',
      'Buyer Connection'
    ]
  }
];

const SplashScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        navigation.navigate('Login');
      } catch (err) {
        console.log('Error @setItem: ', err);
      }
    }
  };

  const skip = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      navigation.navigate('Login');
    } catch (err) {
      console.log('Error @setItem: ', err);
    }
  };

  const Slide = ({ item }) => {
    return (
      <Animated.View 
        style={[
          styles.slide,
          { backgroundColor: item.backgroundColor },
          { opacity: fadeAnim }
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={80} color={item.textColor} />
        </View>

        <Text style={[styles.title, { color: item.textColor }]}>
          {item.title}
        </Text>

        <Text style={[styles.description, { color: item.textColor }]}>
          {item.description}
        </Text>

        <View style={styles.featuresContainer}>
          {item.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={item.textColor} 
                style={styles.featureIcon} 
              />
              <Text style={[styles.featureText, { color: item.textColor }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
              key={index}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={skip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.bottomContainer}>
        <Paginator />
        
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: slides[currentIndex].backgroundColor }
          ]} 
          onPress={scrollTo}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color="#fff" 
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4caf50', // Set to a green color
  },
  slide: {
    flex: 1,
    width,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    opacity: 0.9,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default SplashScreen;