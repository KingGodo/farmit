import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, FlatList } from 'react-native';

const languages = [
  { label: 'Select Language', value: '' },
  { label: 'English', value: 'English' },
  { label: 'Shona', value: 'Shona' },
];

const LanguageSelection = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [height] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    Animated.timing(height, {
      toValue: isOpen ? 0 : languages.length * 40, // Adjust based on item height
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleLanguageSelect = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
    height.setValue(0); // Reset the height when an option is selected

    if (value) {
      navigation.navigate('Registration', { selectedOption: value }); // Navigate to Registration
    }
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert('Error', 'Please select a language.');
    }
  };

  const handleBack = () => {
    navigation.goBack(); // Navigate back to the login screen
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Select Language</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Please choose your preferred language for the registration process.</Text>
        
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>
            {selectedOption ? selectedOption : 'Select Language'}
          </Text>
          <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text> {/* Text indicators for dropdown */}
        </TouchableOpacity>

        <Animated.View style={[styles.dropdown, { height }]}>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={() => handleLanguageSelect(item.value)}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60, // Top padding
    paddingHorizontal: 16,
    backgroundColor: 'white',
    elevation: 2, // Shadow effect for Android
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: 'black',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left', // Left align text
    paddingHorizontal: 20,
    width: '100%', // Ensure it takes full width
  },
  dropdownButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#f7f7f7', // Light light gray background
    alignItems: 'flex-start', // Left align text
    flexDirection: 'row', // Align text and arrow in a row
    justifyContent: 'space-between', // Space between text and arrow
    marginBottom: 10,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
  arrow: {
    fontSize: 16,
    color: 'black',
  },
  dropdown: {
    overflow: 'hidden',
    width: '80%',
  },
  option: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#48bb78',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 20, // Adjust height for space between options and button
  },
});

export default LanguageSelection;