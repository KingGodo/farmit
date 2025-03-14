import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Success = ({ navigation }) => {
  // Animation values
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successMessageTranslate = useRef(new Animated.Value(50)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First, animate the background circle
      Animated.spring(circleScale, {
        toValue: 1,
        damping: 15,
        useNativeDriver: true,
      }),
      // Then animate the checkmark
      Animated.spring(checkmarkScale, {
        toValue: 1,
        damping: 15,
        useNativeDriver: true,
      }),
      // Animate the success message and button
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(successMessageTranslate, {
          toValue: 0,
          damping: 15,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleContinue = () => {
    navigation.replace('Login'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.circleBackground,
              {
                transform: [{ scale: circleScale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: checkmarkScale }],
              },
            ]}
          >
            <Ionicons name="checkmark" size={80} color="white" />
          </Animated.View>
        </View>

        {/* Animated success message */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: successMessageTranslate }],
            },
          ]}
        >
          <Text style={styles.title}>Welcome Aboard!</Text>
          <Text style={styles.message}>
            Your account has been successfully created. You're now ready to start
            your farming journey with us!
          </Text>
        </Animated.View>

        {/* Animated button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: successMessageTranslate }],
            },
          ]}
        >
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue to Login</Text>
            <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Decorative elements */}
      <View style={styles.decorativeContainer}>
        <Ionicons name="leaf" size={24} color="#6b9b37" style={styles.decorativeIcon1} />
        <Ionicons name="water" size={24} color="#4a6c2f" style={styles.decorativeIcon2} />
        <Ionicons name="sunny" size={24} color="#8bc34a" style={styles.decorativeIcon3} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    width: '100%',
  },
  iconContainer: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circleBackground: {
    position: 'absolute',
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: '#4a6c2f',
  },
  checkmarkContainer: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#4a6c2f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeIcon1: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    transform: [{ rotate: '45deg' }],
  },
  decorativeIcon2: {
    position: 'absolute',
    top: '25%',
    right: '20%',
    transform: [{ rotate: '-15deg' }],
  },
  decorativeIcon3: {
    position: 'absolute',
    bottom: '20%',
    right: '25%',
    transform: [{ rotate: '30deg' }],
  },
});

export default Success;