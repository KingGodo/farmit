import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  // State variables
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState('https://picsum.photos/id/1005/400/400');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState({ key: '', value: '', label: '' });
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Edited user data
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    phone: '',
    email: '',
    farmName: '',
    farmSize: '',
    crops: '',
    manualLocation: ''
  });

  // Activity data
  const activityData = {
    posts: 24,
    comments: 86,
    likes: 134
  };

  // Badges data
  const badges = [
    { id: '1', name: 'Early Adopter', icon: 'star-outline', color: '#FFD700', earned: true },
    { id: '2', name: 'Weather Watcher', icon: 'cloudy-outline', color: '#64B5F6', earned: true },
    { id: '3', name: 'Community Builder', icon: 'people-outline', color: '#4CAF50', earned: true },
    { id: '4', name: 'Crop Master', icon: 'leaf-outline', color: '#8BC34A', earned: false },
    { id: '5', name: 'Tech Savvy', icon: 'hardware-chip-outline', color: '#9C27B0', earned: false }
  ];

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const farmerDetailsString = await AsyncStorage.getItem('farmerDetails');
        if (farmerDetailsString) {
          const farmerDetails = JSON.parse(farmerDetailsString);
          setUserData(farmerDetails);
          setEditedUserData(farmerDetails);
        } else {
          // Fallback mock data if no data is stored
          const mockData = {
            name: 'John Mwangi',
            phone: '+254 712 345 678',
            email: 'john.mwangi@example.com',
            farmName: 'Green Valley Farm',
            farmSize: '12',
            crops: 'Maize, Beans, Vegetables',
            manualLocation: 'Nakuru County, Kenya'
          };
          setUserData(mockData);
          setEditedUserData(mockData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // Discard changes and exit edit mode
      setEditedUserData(userData);
    }
    setEditMode(!editMode);
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    setSaveLoading(true);
    
    try {
      // Validate data
      if (!editedUserData.name.trim() || !editedUserData.phone.trim() || !editedUserData.email.trim()) {
        Alert.alert("Error", "Name, phone, and email are required fields.");
        setSaveLoading(false);
        return;
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('farmerDetails', JSON.stringify(editedUserData));
      
      // Update state
      setUserData(editedUserData);
      setEditMode(false);
      
      // Show success message
      Alert.alert("Success", "Your profile has been updated successfully.");
    } catch (error) {
      console.error('Error saving profile changes:', error);
      Alert.alert("Error", "Failed to save profile changes. Please try again.");
    }
    
    setSaveLoading(false);
  };

  // Handle logout
  const handleLogout = async () => {
    setShowLogoutModal(false);
    
    // Show loading indicator
    setLoading(true);
    
    try {
      // In a real app, you might want to clear specific items instead of all
      // await AsyncStorage.clear();
      
      // For demo purposes, we'll just simulate a logout delay
      setTimeout(() => {
        Alert.alert(
          "Logged Out", 
          "You have been successfully logged out.",
          [{ 
            text: "OK", 
            onPress: () => {
              // Navigate to login screen
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'Login' }],
              // });
              setLoading(false);
            } 
          }]
        );
      }, 1500);
    } catch (error) {
      console.error('Error during logout:', error);
      setLoading(false);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Open edit modal for a specific field
  const openEditModal = (key, value, label) => {
    setEditField({ key, value, label });
    setShowEditModal(true);
  };

  // Update field value
  const updateFieldValue = (value) => {
    setEditField({ ...editField, value });
  };

  // Save edited field
  const saveEditedField = () => {
    setEditedUserData({
      ...editedUserData,
      [editField.key]: editField.value
    });
    setShowEditModal(false);
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6c2f" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={toggleEditMode}
        >
          <Ionicons 
            name={editMode ? "close-outline" : "create-outline"} 
            size={24} 
            color="#4a6c2f" 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage} 
            />
            {editMode && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.farmName}>{userData.farmName}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#7f8c8d" />
              <Text style={styles.location}>{userData.manualLocation || 'Location not specified'}</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        {!editMode && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={20} color="#4a6c2f" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={20} color="#4a6c2f" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowLogoutModal(true)}
            >
              <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
              <Text style={[styles.actionButtonText, { color: '#e74c3c' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Edit Mode Buttons */}
        {editMode && (
          <View style={styles.editButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={toggleEditMode}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveProfileChanges}
              disabled={saveLoading}
            >
              {saveLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {/* Activity Summary */}
        {!editMode && (
          <View style={styles.activityCard}>
            <Text style={styles.sectionTitle}>Activity Summary</Text>
            <View style={styles.activityStats}>
              <View style={styles.activityStat}>
                <Text style={styles.statNumber}>{activityData.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityStat}>
                <Text style={styles.statNumber}>{activityData.comments}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityStat}>
                <Text style={styles.statNumber}>{activityData.likes}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Personal Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {editMode ? (
            <View style={styles.editableInfoSection}>
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('name', editedUserData.name, 'Full Name')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="person-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Full Name</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('phone', editedUserData.phone, 'Phone Number')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="call-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.phone}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('email', editedUserData.email, 'Email Address')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="mail-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Email Address</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.email}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{userData.name}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="call-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{userData.phone}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="mail-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{userData.email}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        {/* Farm Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Farm Information</Text>
          
          {editMode ? (
            <View style={styles.editableInfoSection}>
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('farmName', editedUserData.farmName, 'Farm Name')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="home-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Farm Name</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.farmName}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('farmSize', editedUserData.farmSize, 'Farm Size (acres)')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="resize-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Farm Size</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.farmSize} acres</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('crops', editedUserData.crops, 'Main Crops')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="leaf-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Main Crops</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.crops}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editableField}
                onPress={() => openEditModal('manualLocation', editedUserData.manualLocation, 'Location')}
              >
                <View style={styles.fieldHeader}>
                  <Ionicons name="location-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.fieldLabel}>Location</Text>
                </View>
                <View style={styles.fieldValueContainer}>
                  <Text style={styles.fieldValue}>{editedUserData.manualLocation || 'Not specified'}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="home-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Farm Name</Text>
                  <Text style={styles.infoValue}>{userData.farmName}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="resize-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Farm Size</Text>
                  <Text style={styles.infoValue}>{userData.farmSize} acres</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="leaf-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Main Crops</Text>
                  <Text style={styles.infoValue}>{userData.crops}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="location-outline" size={20} color="#4a6c2f" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{userData.manualLocation || 'Not specified'}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        {/* Badges */}
        {!editMode && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Achievements & Badges</Text>
            <View style={styles.badgesContainer}>
              {badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.earned ? badge.color : '#e0e0e0' }]}>
                    <Ionicons name={badge.icon} size={24} color="white" />
                  </View>
                  <Text style={[styles.badgeName, !badge.earned && styles.unearnedBadge]}>
                    {badge.name}
                  </Text>
                  {badge.earned && (
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={styles.badgeEarnedIcon} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Settings */}
        {!editMode && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.settingsSection}>
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Ionicons name="notifications-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#b5d48a' }}
                  thumbColor={notificationsEnabled ? '#4a6c2f' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Ionicons name="location-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.settingLabel}>Location Services</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#b5d48a' }}
                  thumbColor={locationEnabled ? '#4a6c2f' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingLabelContainer}>
                  <Ionicons name="moon-outline" size={20} color="#4a6c2f" />
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#b5d48a' }}
                  thumbColor={darkModeEnabled ? '#4a6c2f' : '#f4f3f4'}
                />
              </View>
            </View>
            
            <View style={styles.additionalOptions}>
              <TouchableOpacity style={styles.optionButton}>
                <Ionicons name="help-circle-outline" size={20} color="#4a6c2f" />
                <Text style={styles.optionText}>Help & Support</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton}>
                <Ionicons name="document-text-outline" size={20} color="#4a6c2f" />
                <Text style={styles.optionText}>Terms & Privacy Policy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton}>
                <Ionicons name="information-circle-outline" size={20} color="#4a6c2f" />
                <Text style={styles.optionText}>About FarmIt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Edit Field Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editField.label}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.modalInput}
              value={editField.value}
              onChangeText={updateFieldValue}
              placeholder={`Enter your ${editField.label.toLowerCase()}`}
              keyboardType={editField.key === 'email' ? 'email-address' : 
                            editField.key === 'phone' ? 'phone-pad' : 
                            editField.key === 'farmSize' ? 'numeric' : 'default'}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={saveEditedField}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContainer}>
            <Ionicons name="log-out-outline" size={50} color="#e74c3c" style={styles.logoutIcon} />
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.logoutMessage}>Are you sure you want to log out of your account?</Text>
            
            <View style={styles.logoutButtons}>
              <TouchableOpacity 
                style={styles.cancelLogoutButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelLogoutText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  editButton: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#4a6c2f',
  },
  changePhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4a6c2f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  farmName: {
    fontSize: 16,
    color: '#4a6c2f',
    fontWeight: '500',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#4a6c2f',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#95a5a6',
  },
  cancelButtonText: {
    color: '#95a5a6',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4a6c2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  activityStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4a6c2f',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activityDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoSection: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  editableInfoSection: {
    marginTop: 5,
  },
  editableField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: '#7f8c8d',
    marginRight: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  unearnedBadge: {
    color: '#95a5a6',
  },
  badgeEarnedIcon: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  settingsSection: {
    marginTop: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  additionalOptions: {
    marginTop: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#95a5a6',
  },
  modalCancelButtonText: {
    color: '#95a5a6',
    fontSize: 16,
    fontWeight: '500',
  },
  modalSaveButton: {
    backgroundColor: '#4a6c2f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutModalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutIcon: {
    marginBottom: 15,
  },
  logoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  logoutMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelLogoutButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#95a5a6',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelLogoutText: {
    color: '#95a5a6',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  confirmLogoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Profile;