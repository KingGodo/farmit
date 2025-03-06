import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Registration = () => {
  // State variables for user and farm information
  const [step, setStep] = useState(1); // Track the current step
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [crops, setCrops] = useState('');
  const [manualLocation, setManualLocation] = useState('');

  const handleNext = async () => {
    if (step === 1) {
      // Validate Password
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match!");
        return;
      }
      // Store farmer info
      try {
        await AsyncStorage.setItem('farmerInfo', JSON.stringify({ name, phone, email }));
        setStep(2); // Move to farm info step
      } catch (error) {
        Alert.alert("Error", "Failed to save information.");
      }
    } else if (step === 2) {
      // Validate Farm Information
      if (!farmName || !farmSize) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      try {
        await AsyncStorage.setItem('farmInfo', JSON.stringify({ farmName, farmSize }));
        setStep(3); // Move to review step
      } catch (error) {
        Alert.alert("Error", "Failed to save farm information.");
      }
    } else if (step === 3) {
      // Submit Data
      const farmerDetails = {
        name,
        phone,
        email,
        farmName,
        farmSize,
        crops,
        manualLocation,
      };
      try {
        await AsyncStorage.setItem('farmerDetails', JSON.stringify(farmerDetails));
        Alert.alert("Success", "Your information has been submitted and saved.");
        // Navigate to another screen or reset state
        // navigation.navigate('SomeNextScreen'); // Uncomment and replace with your next screen
      } catch (error) {
        Alert.alert("Error", "Failed to save farmer details.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Farmer Information</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Farm Information</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Farm Name"
              value={farmName}
              onChangeText={setFarmName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="leaf-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Farm Size (acres)"
              value={farmSize}
              onChangeText={setFarmSize}
              keyboardType="numeric"
            />
          </View>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Review Your Details</Text>
          <Text style={styles.info}>Name: {name}</Text>
          <Text style={styles.info}>Phone: {phone}</Text>
          <Text style={styles.info}>Email: {email}</Text>
          <Text style={styles.info}>Farm Name: {farmName}</Text>
          <Text style={styles.info}>Farm Size: {farmSize}</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="leaf-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Crops"
              value={crops}
              onChangeText={setCrops}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={manualLocation}
              onChangeText={setManualLocation}
            />
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{step === 3 ? 'Submit' : 'Next'}</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
  },
  icon: {
    padding: 10,
    backgroundColor: '#d0d0d0',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  button: {
    backgroundColor: '#48bb78',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Registration;