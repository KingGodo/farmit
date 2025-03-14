import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Import the necessary navigation hook

const Registration = () => {
  const navigation = useNavigation(); // Add this line
  const [currentStep, setCurrentStep] = useState(1); // Renamed from 'step' to 'currentStep'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [crops, setCrops] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    if (currentStep === 1) {
      // Validate Personal Information
      if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }

      // Validate Password
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match!");
        setIsLoading(false);
        return;
      }
      
      // Store farmer info
      try {
        await AsyncStorage.setItem('farmerInfo', JSON.stringify({ name, phone, email }));
        setCurrentStep(2); // Move to farm info step
      } catch (error) {
        Alert.alert("Error", "Failed to save information.");
      }
    } else if (currentStep === 2) {
      // Validate Farm Information
      if (!farmName.trim() || !farmSize.trim()) {
        Alert.alert("Error", "Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      if (isNaN(farmSize) || parseFloat(farmSize) <= 0) {
        Alert.alert("Error", "Please enter a valid farm size.");
        setIsLoading(false);
        return;
      }

      try {
        await AsyncStorage.setItem('farmInfo', JSON.stringify({ farmName, farmSize }));
        setCurrentStep(3); // Move to review step
      } catch (error) {
        Alert.alert("Error", "Failed to save farm information.");
      }
    } else if (currentStep === 3) {
      // Validate final details
      if (!crops.trim()) {
        Alert.alert("Error", "Please enter your crops information.");
        setIsLoading(false);
        return;
      }
      
      // Submit Data
      const farmerDetails = {
        name,
        phone,
        email,
        farmName,
        farmSize,
        crops,
        manualLocation: manualLocation.trim() || "Not specified",
      };
      
      try {
        await AsyncStorage.setItem('farmerDetails', JSON.stringify(farmerDetails));
        Alert.alert(
          "Registration Successful", 
          "Your information has been submitted and saved successfully.",
          [{ text: "OK", onPress: () => navigation.navigate('Success') }] // Navigate to Success.js
        );
      } catch (error) {
        Alert.alert("Error", "Failed to save farmer details.");
      }
    }
    
    setIsLoading(false);
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.stepIndicator}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle, 
              currentStep >= 1 ? styles.activeStep : styles.inactiveStep,
              currentStep > 1 ? styles.completedStep : null
            ]}>
              {currentStep > 1 ? (
                <Ionicons name="checkmark" size={20} color="white" />
              ) : (
                <Text style={styles.stepText}>1</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, currentStep >= 1 ? styles.activeLabel : styles.inactiveLabel]}>
              Personal
            </Text>
          </View>

          {/* Connector Line 1-2 */}
          <View style={[styles.connector, currentStep > 1 ? styles.activeConnector : styles.inactiveConnector]} />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle, 
              currentStep >= 2 ? styles.activeStep : styles.inactiveStep,
              currentStep > 2 ? styles.completedStep : null
            ]}>
              {currentStep > 2 ? (
                <Ionicons name="checkmark" size={20} color="white" />
              ) : (
                <Text style={styles.stepText}>2</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, currentStep >= 2 ? styles.activeLabel : styles.inactiveLabel]}>
              Farm
            </Text>
          </View>

          {/* Connector Line 2-3 */}
          <View style={[styles.connector, currentStep > 2 ? styles.activeConnector : styles.inactiveConnector]} />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={[
              styles.stepCircle, 
              currentStep >= 3 ? styles.activeStep : styles.inactiveStep
            ]}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <Text style={[styles.stepLabel, currentStep >= 3 ? styles.activeLabel : styles.inactiveLabel]}>
              Review
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Farmer Registration</Text>
        
        {renderStepIndicator()}

        <View style={styles.formContainer}>
          {currentStep === 1 && (
            <>
              <Text style={styles.title}>Personal Information</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </View>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Text style={styles.title}>Farm Information</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Farm Name"
                  value={farmName}
                  onChangeText={setFarmName}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="resize-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Farm Size (acres)"
                  value={farmSize}
                  onChangeText={setFarmSize}
                  keyboardType="numeric"
                  placeholderTextColor="#888"
                />
              </View>
              <Text style={styles.infoText}>
                In the next step, you'll review your information and add additional details about your crops.
              </Text>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Text style={styles.title}>Review Your Details</Text>
              
              <View style={styles.reviewSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Name:</Text>
                  <Text style={styles.reviewValue}>{name}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Phone:</Text>
                  <Text style={styles.reviewValue}>{phone}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Email:</Text>
                  <Text style={styles.reviewValue}>{email}</Text>
                </View>
              </View>
              
              <View style={styles.reviewSection}>
                <Text style={styles.sectionTitle}>Farm Information</Text>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Farm Name:</Text>
                  <Text style={styles.reviewValue}>{farmName}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Farm Size:</Text>
                  <Text style={styles.reviewValue}>{farmSize} acres</Text>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="leaf-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Main Crops (e.g., Maize, Rice, Wheat)"
                  value={crops}
                  onChangeText={setCrops}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#4a6c2f" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Location (Optional)"
                  value={manualLocation}
                  onChangeText={setManualLocation}
                  placeholderTextColor="#888"
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBack}
                disabled={isLoading}
              >
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.nextButton, 
                isLoading && styles.disabledButton,
                currentStep === 1 && styles.fullWidthButton
              ]} 
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.buttonText}>Loading...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>{currentStep === 3 ? 'Submit' : 'Next'}</Text>
                  {currentStep !== 3 && <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'start',
    marginVertical: 30,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  stepItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeStep: {
    backgroundColor: '#4a6c2f',
  },
  inactiveStep: {
    backgroundColor: '#d0d0d0',
  },
  completedStep: {
    backgroundColor: '#6b9b37',
  },
  connector: {
    height: 3,
    width: 60,
    marginHorizontal: 5,
  },
  activeConnector: {
    backgroundColor: '#6b9b37',
  },
  inactiveConnector: {
    backgroundColor: '#d0d0d0',
  },
  stepText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 14,
  },
  activeLabel: {
    color: '#4a6c2f',
    fontWeight: 'bold',
  },
  inactiveLabel: {
    color: '#888',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  icon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: '#4a6c2f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  fullWidthButton: {
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginLeft: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSection: {
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4a6c2f',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  reviewItem: {flexDirection: 'row',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: '35%',
  },
  reviewValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Registration;