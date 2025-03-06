import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewAndSubmit = ({ route, navigation }) => {
  const { name, phone, email, farmName, farmSize, selectedOption } = route.params;
  const [location, setLocation] = useState({ latitude: '', longitude: '' });

  const handleSubmit = async () => {
    if (!location.latitude || !location.longitude) {
      Alert.alert('Error', 'Please enter valid latitude and longitude.');
      return;
    }

    // Prepare data to be stored
    const farmerDetails = {
      name,
      phone,
      email,
      farmName,
      farmSize,
      selectedOption,
      location,
    };

    try {
      // Store farmer details in AsyncStorage
      await AsyncStorage.setItem('farmerDetails', JSON.stringify(farmerDetails));
      Alert.alert("Success", "Your information has been submitted and saved.");
      
      // Navigate to the success screen
      navigation.navigate('Success'); // Replace with your success screen name
    } catch (error) {
      Alert.alert("Error", "Failed to save farmer details.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Details</Text>
      
      <Text>Name: {name}</Text>
      <Text>Phone: {phone}</Text>
      <Text>Email: {email}</Text>
      <Text>Farm Name: {farmName}</Text>
      <Text>Farm Size: {farmSize}</Text>
      <Text>Language: {selectedOption}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Latitude"
        value={location.latitude}
        onChangeText={(text) => setLocation({ ...location, latitude: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Longitude"
        value={location.longitude}
        onChangeText={(text) => setLocation({ ...location, longitude: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9', // Light background for better contrast
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '80%', // Align with other components
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
  },
});

export default ReviewAndSubmit;