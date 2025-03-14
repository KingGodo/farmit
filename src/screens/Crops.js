import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  RefreshControl,
  StatusBar,
  Switch,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Crops = ({ navigation }) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [userCrops, setUserCrops] = useState([]);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [cropDetailModalVisible, setCropDetailModalVisible] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [activeCropCategory, setActiveCropCategory] = useState('All');
  const [newCropData, setNewCropData] = useState({
    cropName: '',
    cropType: 'Grain',
    plantingDate: '',
    expectedHarvestDate: '',
    quantity: '',
    location: '',
    notes: ''
  });
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(30))[0];

  // Crop categories
  const cropCategories = [
    { id: '0', name: 'All', icon: 'apps-outline' },
    { id: '1', name: 'Grains', icon: 'nutrition-outline' },
    { id: '2', name: 'Vegetables', icon: 'leaf-outline' },
    { id: '3', name: 'Fruits', icon: 'flower-outline' },
    { id: '4', name: 'Tubers', icon: 'earth-outline' },
    { id: '5', name: 'Legumes', icon: 'water-outline' },
  ];

  // Crop type options for new crop
  const cropTypeOptions = [
    'Grain', 'Vegetable', 'Fruit', 'Tuber', 'Legume', 'Cash Crop', 'Other'
  ];

  // Recommended crops data
  const recommendedCrops = [
    {
      id: '1',
      name: 'Maize',
      type: 'Grain',
      image: 'https://picsum.photos/id/136/300/200',
      growingPeriod: '90-120 days',
      waterNeeds: 'Moderate',
      soilType: 'Well-drained loamy soil',
      season: 'Warm season',
      description: 'Maize (Zea mays) is a cereal grain that was domesticated in Mesoamerica. It is now the most widely grown grain crop throughout the Americas.',
      tips: ['Plant when soil temperature reaches 60°F (16°C)', 'Space plants 8-12 inches apart', 'Requires regular watering especially during tasseling', 'Apply nitrogen-rich fertilizer'],
      pests: ['Fall armyworm', 'Corn earworm', 'Corn rootworm'],
      diseases: ['Gray leaf spot', 'Northern corn leaf blight', 'Common rust']
    },
    {
      id: '2',
      name: 'Tomatoes',
      type: 'Vegetable',
      image: 'https://picsum.photos/id/292/300/200',
      growingPeriod: '70-85 days',
      waterNeeds: 'Regular',
      soilType: 'Rich, well-drained soil',
      season: 'Warm season',
      description: 'Tomatoes (Solanum lycopersicum) are the fruit of the tomato plant, a member of the Nightshade family. They are rich in vitamins and antioxidants.',
      tips: ['Start seeds indoors 6-8 weeks before last frost', 'Transplant when soil warms to 60°F (16°C)', 'Provide support with stakes or cages', 'Pinch off suckers for larger fruit'],
      pests: ['Tomato hornworm', 'Whiteflies', 'Aphids'],
      diseases: ['Early blight', 'Late blight', 'Fusarium wilt']
    },
    {
      id: '3',
      name: 'Beans',
      type: 'Legume',
      image: 'https://picsum.photos/id/175/300/200',
      growingPeriod: '50-60 days',
      waterNeeds: 'Moderate',
      soilType: 'Well-drained, fertile soil',
      season: 'Warm season',
      description: 'Beans are seeds from the Fabaceae family and are a great source of protein and fiber. They help fix nitrogen in the soil.',
      tips: ['Plant after all danger of frost has passed', 'Sow seeds 1 inch deep, 3-4 inches apart', 'Provide support for climbing varieties', 'Avoid overwatering to prevent root rot'],
      pests: ['Bean beetles', 'Aphids', 'Cutworms'],
      diseases: ['Anthracnose', 'Bacterial blight', 'Bean mosaic virus']
    },
    {
      id: '4',
      name: 'Potatoes',
      type: 'Tuber',
      image: 'https://picsum.photos/id/137/300/200',
      growingPeriod: '70-120 days',
      waterNeeds: 'Moderate',
      soilType: 'Loose, well-drained soil',
      season: 'Cool season',
      description: 'Potatoes (Solanum tuberosum) are starchy tubers that are a staple food in many countries. They are rich in carbohydrates and vitamin C.',
      tips: ['Plant seed potatoes 4-6 inches deep', 'Space plants 12 inches apart', 'Hill soil around plants as they grow', 'Harvest after tops die back'],
      pests: ['Colorado potato beetle', 'Potato aphid', 'Wireworms'],
      diseases: ['Late blight', 'Early blight', 'Scab']
    },
    {
      id: '5',
      name: 'Cabbage',
      type: 'Vegetable',
      image: 'https://picsum.photos/id/170/300/200',
      growingPeriod: '80-180 days',
      waterNeeds: 'Regular',
      soilType: 'Rich, well-drained soil',
      season: 'Cool season',
      description: 'Cabbage (Brassica oleracea) is a leafy green or purple biennial plant grown as an annual vegetable for its dense-leaved heads.',
      tips: ['Start seeds indoors 6-8 weeks before last frost', 'Transplant when seedlings have 4-6 leaves', 'Space plants 12-24 inches apart', 'Keep soil consistently moist'],
      pests: ['Cabbage worms', 'Aphids', 'Flea beetles'],
      diseases: ['Black rot', 'Clubroot', 'Downy mildew']
    },
    {
      id: '6',
      name: 'Mango',
      type: 'Fruit',
      image: 'https://picsum.photos/id/139/300/200',
      growingPeriod: '3-5 years to fruit',
      waterNeeds: 'Moderate',
      soilType: 'Well-drained, sandy loam',
      season: 'Warm season',
      description: 'Mango (Mangifera indica) is a juicy stone fruit that belongs to the flowering plant family Anacardiaceae. It is native to South Asia.',
      tips: ['Plant in full sun', 'Protect from frost', 'Prune to maintain shape and size', 'Water deeply but infrequently once established'],
      pests: ['Mango seed weevil', 'Fruit flies', 'Scale insects'],
      diseases: ['Anthracnose', 'Powdery mildew', 'Bacterial black spot']
    }
  ];

  // Load user crops from AsyncStorage
  useEffect(() => {
    const loadUserCrops = async () => {
      try {
        const storedCrops = await AsyncStorage.getItem('userCrops');
        if (storedCrops) {
          setUserCrops(JSON.parse(storedCrops));
        }
      } catch (error) {
        console.error('Error loading user crops:', error);
      }
    };

    loadUserCrops();
    
    // Animate content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Save user crops to AsyncStorage
  const saveUserCrops = async (crops) => {
    try {
      await AsyncStorage.setItem('userCrops', JSON.stringify(crops));
    } catch (error) {
      console.error('Error saving user crops:', error);
    }
  };

  // Add a new crop
  const addNewCrop = () => {
    // Validate inputs
    if (!newCropData.cropName || !newCropData.plantingDate) {
      Alert.alert('Missing Information', 'Please fill in at least the crop name and planting date.');
      return;
    }

    const newCrop = {
      id: Date.now().toString(),
      name: newCropData.cropName,
      type: newCropData.cropType,
      plantingDate: newCropData.plantingDate,
      harvestDate: newCropData.expectedHarvestDate,
      quantity: newCropData.quantity,
      location: newCropData.location,
      notes: newCropData.notes,
      status: 'Growing',
      progress: Math.floor(Math.random() * 70) + 10, // Random progress for demo
      image: `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 100}/300/200`,
      lastUpdated: new Date().toISOString(),
    };

    const updatedCrops = [...userCrops, newCrop];
    setUserCrops(updatedCrops);
    saveUserCrops(updatedCrops);
    
    // Reset form and close modal
    setNewCropData({
      cropName: '',
      cropType: 'Grain',
      plantingDate: '',
      expectedHarvestDate: '',
      quantity: '',
      location: '',
      notes: ''
    });
    setCropModalVisible(false);
  };

  // Delete a crop
  const deleteCrop = (cropId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this crop?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCrops = userCrops.filter(crop => crop.id !== cropId);
            setUserCrops(updatedCrops);
            saveUserCrops(updatedCrops);
            if (selectedCrop && selectedCrop.id === cropId) {
              setCropDetailModalVisible(false);
            }
          }
        }
      ]
    );
  };

  // Update crop status
  const updateCropStatus = (cropId, newStatus) => {
    const updatedCrops = userCrops.map(crop => {
      if (crop.id === cropId) {
        return {
          ...crop,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return crop;
    });
    
    setUserCrops(updatedCrops);
    saveUserCrops(updatedCrops);
    
    // Update selected crop if it's the one being modified
    if (selectedCrop && selectedCrop.id === cropId) {
      setSelectedCrop({...selectedCrop, status: newStatus, lastUpdated: new Date().toISOString()});
    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Filter crops based on search query and active category
  const filteredCrops = userCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCropCategory === 'All') {
      return matchesSearch;
    } else {
      return matchesSearch && crop.type.includes(activeCropCategory.slice(0, -1)); // Remove 's' from category name
    }
  });

  // Filter recommended crops based on search query
  const filteredRecommendedCrops = recommendedCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCropCategory === 'All') {
      return matchesSearch;
    } else {
      return matchesSearch && crop.type.includes(activeCropCategory.slice(0, -1)); // Remove 's' from category name
    }
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days remaining until harvest
  const calculateDaysRemaining = (harvestDate) => {
    if (!harvestDate) return 'N/A';
    
    const today = new Date();
    const harvest = new Date(harvestDate);
    const diffTime = Math.abs(harvest - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (today > harvest) {
      return 'Past due';
    }
    
    return `${diffDays} days`;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Growing':
        return '#4CAF50';
      case 'Harvested':
        return '#FFC107';
      case 'Completed':
        return '#2196F3';
      case 'Failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Crops</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setCropModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops by name or type..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          style={[styles.filterButton, filterActive && styles.filterButtonActive]}
          onPress={() => setFilterActive(!filterActive)}
        >
          <Ionicons name="filter" size={20} color={filterActive ? "#4a6c2f" : "#888"} />
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={cropCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryItem, 
                activeCropCategory === item.name && styles.activeCategoryItem
              ]}
              onPress={() => setActiveCropCategory(item.name)}
            >
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={activeCropCategory === item.name ? '#4a6c2f' : '#888'} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  activeCropCategory === item.name && styles.activeCategoryText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a6c2f']}
          />
        }
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateY }]
          }
        ]}>
          {/* My Crops Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Crops</Text>
              <Text style={styles.cropCount}>{userCrops.length} crops</Text>
            </View>
            
            {userCrops.length === 0 ? (
              <View style={styles.emptyCropsContainer}>
                <Ionicons name="leaf-outline" size={70} color="#ddd" />
                <Text style={styles.emptyCropsText}>You haven't added any crops yet</Text>
                <TouchableOpacity 
                  style={styles.addCropButton}
                  onPress={() => setCropModalVisible(true)}
                >
                  <Text style={styles.addCropButtonText}>Add Your First Crop</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.cropsContainer}>
                {filteredCrops.map((crop) => (
                  <TouchableOpacity 
                    key={crop.id} 
                    style={styles.cropCard}
                    onPress={() => {
                      setSelectedCrop(crop);
                      setCropDetailModalVisible(true);
                    }}
                  >
                    <Image source={{ uri: crop.image }} style={styles.cropImage} />
                    <View style={styles.cropInfo}>
                      <View style={styles.cropNameContainer}>
                        <Text style={styles.cropName}>{crop.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(crop.status) }]}>
                          <Text style={styles.statusText}>{crop.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.cropType}>{crop.type}</Text>
                      
                      <View style={styles.cropDetails}>
                        <View style={styles.cropDetail}>
                          <Ionicons name="calendar-outline" size={16} color="#4a6c2f" />
                          <Text style={styles.cropDetailText}>Planted: {formatDate(crop.plantingDate)}</Text>
                        </View>
                        
                        <View style={styles.cropDetail}>
                          <Ionicons name="time-outline" size={16} color="#4a6c2f" />
                          <Text style={styles.cropDetailText}>Harvest in: {calculateDaysRemaining(crop.harvestDate)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { width: `${crop.progress}%`, backgroundColor: getStatusColor(crop.status) }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>{crop.progress}%</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Recommended Crops Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Crops</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredRecommendedCrops.map((crop) => (
                <TouchableOpacity 
                  key={crop.id} 
                  style={styles.recommendedCropCard}
                  onPress={() => {
                    setSelectedCrop(crop);
                    setCropDetailModalVisible(true);
                  }}
                >
                  <Image source={{ uri: crop.image }} style={styles.recommendedCropImage} />
                  <View style={styles.recommendedCropInfo}>
                    <Text style={styles.recommendedCropName}>{crop.name}</Text>
                    <Text style={styles.recommendedCropType}>{crop.type}</Text>
                    <View style={styles.recommendedCropDetails}>
                      <View style={styles.recommendedCropDetail}>
                        <Ionicons name="time-outline" size={14} color="#4a6c2f" />
                        <Text style={styles.recommendedCropDetailText}>{crop.growingPeriod}</Text>
                      </View>
                      <View style={styles.recommendedCropDetail}>
                        <Ionicons name="water-outline" size={14} color="#4a6c2f" />
                        <Text style={styles.recommendedCropDetailText}>{crop.waterNeeds}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Crop Calendar Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Crop Calendar</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>Full Calendar</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>May 2023</Text>
                <View style={styles.calendarControls}>
                  <TouchableOpacity style={styles.calendarButton}>
                    <Ionicons name="chevron-back" size={20} color="#555" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.calendarButton}>
                    <Ionicons name="chevron-forward" size={20} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.calendarContent}>
                {userCrops.length === 0 ? (
                  <View style={styles.emptyCalendarContainer}>
                    <Ionicons name="calendar-outline" size={40} color="#ddd" />
                    <Text style={styles.emptyCalendarText}>No scheduled activities</Text>
                    <Text style={styles.emptyCalendarSubtext}>Add crops to see your planting and harvesting schedule</Text>
                  </View>
                ) : (
                  <View>
                    {userCrops.slice(0, 3).map((crop) => (
                      <View key={crop.id} style={styles.calendarEvent}>
                        <View style={[styles.eventDot, { backgroundColor: getStatusColor(crop.status) }]} />
                        <View style={styles.eventInfo}>
                          <Text style={styles.eventTitle}>{crop.name}</Text>
                          <Text style={styles.eventDescription}>
                            {crop.status === 'Growing' ? 'Expected harvest' : 'Harvested'}: {formatDate(crop.harvestDate)}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                      </View>
                    ))}
                    {userCrops.length > 3 && (
                      <TouchableOpacity style={styles.moreEventsButton}>
                        <Text style={styles.moreEventsText}>View {userCrops.length - 3} more events</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Add New Crop Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cropModalVisible}
        onRequestClose={() => setCropModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Crop</Text>
              <TouchableOpacity onPress={() => setCropModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Crop Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter crop name"
                  value={newCropData.cropName}
                  onChangeText={(text) => setNewCropData({...newCropData, cropName: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Crop Type</Text>
                <View style={styles.cropTypeContainer}>
                  {cropTypeOptions.map((type) => (
                    <TouchableOpacity 
                      key={type}
                      style={[
                        styles.cropTypeOption,
                        newCropData.cropType === type && styles.cropTypeOptionSelected
                      ]}
                      onPress={() => setNewCropData({...newCropData, cropType: type})}
                    >
                      <Text 
                        style={[
                          styles.cropTypeText,
                          newCropData.cropType === type && styles.cropTypeTextSelected
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Planting Date *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newCropData.plantingDate}
                  onChangeText={(text) => setNewCropData({...newCropData, plantingDate: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Expected Harvest Date</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={newCropData.expectedHarvestDate}
                  onChangeText={(text) => setNewCropData({...newCropData, expectedHarvestDate: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Quantity (e.g., acres, plants)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter quantity"
                  value={newCropData.quantity}
                  onChangeText={(text) => setNewCropData({...newCropData, quantity: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location/Field</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter location"
                  value={newCropData.location}
                  onChangeText={(text) => setNewCropData({...newCropData, location: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Add any additional notes"
                  value={newCropData.notes}
                  onChangeText={(text) => setNewCropData({...newCropData, notes: text})}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCropModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addNewCrop}
              >
                <Text style={styles.saveButtonText}>Save Crop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Crop Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cropDetailModalVisible}
        onRequestClose={() => setCropDetailModalVisible(false)}
      >
        {selectedCrop && (
          <View style={styles.modalOverlay}>
            <View style={styles.detailModalContainer}>
              <View style={styles.detailModalHeader}>
                <TouchableOpacity onPress={() => setCropDetailModalVisible(false)}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                
                <View style={styles.detailModalActions}>
                  {userCrops.some(crop => crop.id === selectedCrop.id) && (
                    <TouchableOpacity 
                      style={styles.detailModalAction}
                      onPress={() => deleteCrop(selectedCrop.id)}
                    >
                      <Ionicons name="trash-outline" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity style={styles.detailModalAction}>
                    <Ionicons name="share-social-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <ScrollView style={styles.detailModalContent}>
                <Image source={{ uri: selectedCrop.image }} style={styles.detailCropImage} />
                
                <View style={styles.detailCropHeader}>
                  <View>
                    <Text style={styles.detailCropName}>{selectedCrop.name}</Text>
                    <Text style={styles.detailCropType}>{selectedCrop.type}</Text>
                  </View>
                  
                  {userCrops.some(crop => crop.id === selectedCrop.id) && (
                    <View style={[styles.detailStatusBadge, { backgroundColor: getStatusColor(selectedCrop.status) }]}>
                      <Text style={styles.detailStatusText}>{selectedCrop.status}</Text>
                    </View>
                  )}
                </View>
                
                {userCrops.some(crop => crop.id === selectedCrop.id) && (
                  <View>
                    <View style={styles.progressContainer}>
                      <View style={styles.detailProgressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${selectedCrop.progress}%`, backgroundColor: getStatusColor(selectedCrop.status) }
                          ]} 
                        />
                      </View>
                      <Text style={styles.detailProgressText}>{selectedCrop.progress}% Complete</Text>
                    </View>
                    
                    <View style={styles.cropTimeline}>
                      <View style={styles.timelineItem}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineDate}>{formatDate(selectedCrop.plantingDate)}</Text>
                          <Text style={styles.timelineEvent}>Planted</Text>
                        </View>
                      </View>
                      
                      <View style={styles.timelineConnector} />
                      
                      <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: '#ccc' }]} />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineDate}>{formatDate(selectedCrop.harvestDate)}</Text>
                          <Text style={styles.timelineEvent}>Expected Harvest</Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Crop Details</Text>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="location-outline" size={20} color="#4a6c2f" />
                          <Text style={styles.detailItemTitle}>Location</Text>
                        </View>
                        <Text style={styles.detailItemContent}>{selectedCrop.location || 'Not specified'}</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="analytics-outline" size={20} color="#4a6c2f" />
                          <Text style={styles.detailItemTitle}>Quantity</Text>
                        </View>
                        <Text style={styles.detailItemContent}>{selectedCrop.quantity || 'Not specified'}</Text>
                      </View>
                      
                      <View style={styles.detailItem}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="calendar-outline" size={20} color="#4a6c2f" />
                          <Text style={styles.detailItemTitle}>Last Updated</Text>
                        </View>
                        <Text style={styles.detailItemContent}>{formatDate(selectedCrop.lastUpdated)}</Text>
                      </View>
                      
                      {selectedCrop.notes && (
                        <View style={styles.detailItem}>
                          <View style={styles.detailItemHeader}>
                            <Ionicons name="document-text-outline" size={20} color="#4a6c2f" />
                            <Text style={styles.detailItemTitle}>Notes</Text>
                          </View>
                          <Text style={styles.detailItemContent}>{selectedCrop.notes}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.statusUpdateSection}>
                      <Text style={styles.statusUpdateTitle}>Update Crop Status</Text>
                      
                      <View style={styles.statusOptions}>
                        {['Growing', 'Harvested', 'Completed', 'Failed'].map((status) => (
                          <TouchableOpacity 
                            key={status}
                            style={[
                              styles.statusOption,
                              selectedCrop.status === status && styles.statusOptionSelected,
                              { borderColor: getStatusColor(status) }
                            ]}
                            onPress={() => updateCropStatus(selectedCrop.id, status)}
                          >
                            <Text 
                              style={[
                                styles.statusOptionText,
                                selectedCrop.status === status && styles.statusOptionTextSelected,
                                { color: selectedCrop.status === status ? 'white' : getStatusColor(status) }
                              ]}
                            >
                              {status}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
                
                {/* Crop Information for all crops */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Growing Information</Text>
                  
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={24} color="#4a6c2f" />
                      <Text style={styles.infoLabel}>Growing Period</Text>
                      <Text style={styles.infoValue}>{selectedCrop.growingPeriod || '90-120 days'}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                      <Ionicons name="water-outline" size={24} color="#4a6c2f" />
                      <Text style={styles.infoLabel}>Water Needs</Text>
                      <Text style={styles.infoValue}>{selectedCrop.waterNeeds || 'Moderate'}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                      <Ionicons name="earth-outline" size={24} color="#4a6c2f" />
                      <Text style={styles.infoLabel}>Soil Type</Text>
                      <Text style={styles.infoValue}>{selectedCrop.soilType || 'Well-drained'}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                      <Ionicons name="sunny-outline" size={24} color="#4a6c2f" />
                      <Text style={styles.infoLabel}>Season</Text>
                      <Text style={styles.infoValue}>{selectedCrop.season || 'Warm season'}</Text>
                    </View>
                  </View>
                </View>
                
                {selectedCrop.description && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>About {selectedCrop.name}</Text>
                    <Text style={styles.descriptionText}>{selectedCrop.description}</Text>
                  </View>
                )}
                
                {selectedCrop.tips && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Growing Tips</Text>
                    
                    {selectedCrop.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <View style={styles.tipBullet}>
                          <Text style={styles.tipBulletText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {(selectedCrop.pests || selectedCrop.diseases) && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Common Issues</Text>
                    
                    {selectedCrop.pests && (
                      <View style={styles.issueCategory}>
                        <Text style={styles.issueCategoryTitle}>Pests:</Text>
                        <Text style={styles.issueText}>{selectedCrop.pests.join(', ')}</Text>
                      </View>
                    )}
                    
                    {selectedCrop.diseases && (
                      <View style={styles.issueCategory}>
                        <Text style={styles.issueCategoryTitle}>Diseases:</Text>
                        <Text style={styles.issueText}>{selectedCrop.diseases.join(', ')}</Text>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
              
              {!userCrops.some(crop => crop.id === selectedCrop.id) && (
                <View style={styles.detailModalFooter}>
                  <TouchableOpacity 
                    style={styles.addToMyCropsButton}
                    onPress={() => {
                      setNewCropData({
                        ...newCropData,
                        cropName: selectedCrop.name,
                        cropType: selectedCrop.type
                      });
                      setCropDetailModalVisible(false);
                      setCropModalVisible(true);
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="white" />
                    <Text style={styles.addToMyCropsText}>Add to My Crops</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      </Modal>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar-outline" size={24} color="#888" />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Crops')}
        >
          <Ionicons name="leaf" size={24} color="#4a6c2f" />
          <Text style={[styles.navText, styles.activeNavText]}>Crops</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Community')}
        >
          <Ionicons name="people-outline" size={24} color="#888" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('More')}
        >
          <Ionicons name="menu-outline" size={24} color="#888" />
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#4a6c2f',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filterButtonActive: {
    backgroundColor: '#f0f8ed',
    borderRadius: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryItem: {
    backgroundColor: '#e8f3e0',
  },
  categoryText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  activeCategoryText: {
    color: '#4a6c2f',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cropCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4a6c2f',
    marginRight: 5,
  },
  emptyCropsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCropsText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 5,
  },
  addCropButton: {
    backgroundColor: '#4a6c2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  addCropButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cropsContainer: {
    marginBottom: 10,
  },
  cropCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropImage: {
    width: '100%',
    height: 150,
  },
  cropInfo: {
    padding: 15,
  },
  cropNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  cropType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  cropDetails: {
    marginBottom: 15,
  },
  cropDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cropDetailText: {
    fontSize: 14,
    color: '#34495e',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 10,
    fontWeight: '500',
  },
  recommendedCropCard: {
    width: 220,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendedCropImage: {
    width: '100%',
    height: 120,
  },
  recommendedCropInfo: {
    padding: 12,
  },
  recommendedCropName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recommendedCropType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  recommendedCropDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendedCropDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedCropDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  calendarControls: {
    flexDirection: 'row',
  },
  calendarButton: {
    padding: 5,
  },
  calendarContent: {
    minHeight: 100,
  },
  emptyCalendarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyCalendarText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  emptyCalendarSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 5,
  },
  calendarEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  eventDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  moreEventsButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  moreEventsText: {
    fontSize: 14,
    color: '#4a6c2f',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalContent: {
    padding: 15,
    maxHeight: height * 0.5,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formTextarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  cropTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cropTypeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  cropTypeOptionSelected: {
    backgroundColor: '#4a6c2f',
    borderColor: '#4a6c2f',
  },
  cropTypeText: {
    fontSize: 14,
    color: '#555',
  },
  cropTypeTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#4a6c2f',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  detailModalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4a6c2f',
  },
  detailModalActions: {
    flexDirection: 'row',
  },
  detailModalAction: {
    marginLeft: 20,
  },
  detailModalContent: {
    flex: 1,
  },
  detailCropImage: {
    width: '100%',
    height: 250,
  },
  detailCropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  detailCropName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailCropType: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  detailStatusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  detailProgressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  detailProgressText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  cropTimeline: {
    padding: 15,
    paddingTop: 5,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginTop: 5,
  },
  timelineConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#e0e0e0',
    marginLeft: 5,
  },
  timelineContent: {
    marginLeft: 15,
    marginBottom: 10,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  timelineEvent: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailItemTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 8,
  },
  detailItemContent: {
    fontSize: 15,
    color: '#34495e',
    paddingLeft: 28,
  },
  statusUpdateSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusUpdateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusOption: {
    width: '48%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  statusOptionSelected: {
    backgroundColor: '#4a6c2f',
    borderColor: '#4a6c2f',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusOptionTextSelected: {
    color: 'white',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4a6c2f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  tipBulletText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  issueCategory: {
    marginBottom: 10,
  },
  issueCategoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  issueText: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
  },
  detailModalFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToMyCropsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a6c2f',
    paddingVertical: 15,
    borderRadius: 8,
  },
  addToMyCropsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  activeNavText: {
    color: '#4a6c2f',
    fontWeight: '500',
  },
});

export default Crops;