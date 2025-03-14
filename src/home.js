import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  ImageBackground,
  StatusBar,
  FlatList,
  Animated,
  Dimensions,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  // State variables
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {id: '1', text: 'Hello! I am Sekai, your farming assistant. How can I help you today?', isUser: false}
  ]);
  const [messageInput, setMessageInput] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(30))[0];

  // Mock data for the app
  const upcomingTasks = [
    { id: '1', title: 'Maize Planting', date: 'May 15', icon: 'leaf-outline', color: '#4CAF50' },
    { id: '2', title: 'Fertilizer Application', date: 'May 18', icon: 'water-outline', color: '#2196F3' },
    { id: '3', title: 'Pest Control', date: 'May 22', icon: 'bug-outline', color: '#FF5722' },
  ];

  const communityPosts = [
    { 
      id: '1', 
      author: 'John Mwangi', 
      avatar: 'https://picsum.photos/id/1/100/100', 
      time: '2 hours ago', 
      content: 'Has anyone used the new drought-resistant maize variety? Looking for feedback before planting.', 
      likes: 24, 
      comments: 8 
    },
    { 
      id: '2', 
      author: 'Sarah Kamau', 
      avatar: 'https://picsum.photos/id/2/100/100', 
      time: '5 hours ago', 
      content: 'Sharing my success with crop rotation! Soil health has improved significantly over the past year.', 
      likes: 42, 
      comments: 15,
      image: 'https://picsum.photos/id/123/400/200'
    },
    { 
      id: '3', 
      author: 'Daniel Ochieng', 
      avatar: 'https://picsum.photos/id/3/100/100', 
      time: '1 day ago', 
      content: 'Weather alert: Heavy rains expected in the Central region next week. Secure your crops and livestock!', 
      likes: 56, 
      comments: 12 
    },
  ];

  const farmingTips = [
    { id: '1', title: 'Soil Preparation', description: 'Ensure proper soil preparation before planting', image: 'https://picsum.photos/id/112/300/200' },
    { id: '2', title: 'Water Conservation', description: 'Techniques to conserve water during dry seasons', image: 'https://picsum.photos/id/113/300/200' },
    { id: '3', title: 'Pest Management', description: 'Natural ways to manage pests in your farm', image: 'https://picsum.photos/id/114/300/200' },
    { id: '4', title: 'Crop Rotation', description: 'Benefits of implementing crop rotation', image: 'https://picsum.photos/id/115/300/200' },
  ];

  // Weather conditions
  const weatherConditions = {
    'clear': { icon: 'sunny-outline', color: '#FFD54F', description: 'Clear Sky' },
    'clouds': { icon: 'cloudy-outline', color: '#90A4AE', description: 'Cloudy' },
    'rain': { icon: 'rainy-outline', color: '#64B5F6', description: 'Rainy' },
    'thunderstorm': { icon: 'thunderstorm-outline', color: '#5C6BC0', description: 'Thunderstorm' },
    'drizzle': { icon: 'water-outline', color: '#81D4FA', description: 'Drizzle' },
    'snow': { icon: 'snow-outline', color: '#E1F5FE', description: 'Snow' },
    'mist': { icon: 'water-outline', color: '#B0BEC5', description: 'Mist' },
  };

  // Mock weather data
  const mockWeatherData = {
    current: {
      temp: 24,
      humidity: 65,
      wind_speed: 12,
      weather: [{ main: 'clouds' }],
      dt: new Date().getTime() / 1000,
    },
    daily: [
      { dt: new Date().getTime() / 1000, temp: { max: 24, min: 18 }, weather: [{ main: 'clear' }] },
      { dt: new Date().getTime() / 1000 + 86400, temp: { max: 26, min: 19 }, weather: [{ main: 'clouds' }] },
      { dt: new Date().getTime() / 1000 + 172800, temp: { max: 23, min: 17 }, weather: [{ main: 'rain' }] },
      { dt: new Date().getTime() / 1000 + 259200, temp: { max: 22, min: 16 }, weather: [{ main: 'rain' }] },
      { dt: new Date().getTime() / 1000 + 345600, temp: { max: 25, min: 18 }, weather: [{ main: 'clouds' }] },
    ],
  };

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const farmerDetailsString = await AsyncStorage.getItem('farmerDetails');
        if (farmerDetailsString) {
          const farmerDetails = JSON.parse(farmerDetailsString);
          setUserName(farmerDetails.name);
          setFarmName(farmerDetails.farmName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
    
    // Simulate fetching weather data
    setTimeout(() => {
      setWeatherData(mockWeatherData);
      setLoading(false);
      
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
    }, 1500);
  }, []);

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Handle chatbot interaction
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: messageInput,
      isUser: true
    };
    
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setMessageInput('');
    
    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse;
      const userText = messageInput.toLowerCase();
      
      if (userText.includes('weather')) {
        botResponse = "Based on the forecast, expect partly cloudy conditions with temperatures around 24°C today. There's a chance of rain in the next few days.";
      } else if (userText.includes('plant') || userText.includes('planting')) {
        botResponse = "For planting this season, ensure your soil is well-prepared. May is ideal for maize, beans, and vegetables in many regions.";
      } else if (userText.includes('pest') || userText.includes('disease')) {
        botResponse = "To manage pests naturally, consider companion planting or neem oil spray. For specific crop diseases, please provide more details.";
      } else if (userText.includes('fertilizer') || userText.includes('nutrient')) {
        botResponse = "For balanced nutrition, consider combining organic compost with targeted NPK fertilizers based on your soil test results.";
      } else {
        botResponse = "Thank you for your question. I'm here to help with farming advice, weather information, planting schedules, and pest management. Could you provide more details?";
      }
      
      const newBotMessage = {
        id: Date.now().toString(),
        text: botResponse,
        isUser: false
      };
      
      setChatMessages(prevMessages => [...prevMessages, newBotMessage]);
    }, 1000);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName || 'Farmer'}!</Text>
          <Text style={styles.farmName}>{farmName || 'Your Farm'}</Text>
        </View>
        <TouchableOpacity 
      style={styles.profileButton} 
      onPress={() => navigation.navigate('Profile')} 
    >
      <Ionicons name="person-circle-outline" size={40} color="#4a6c2f" />
    </TouchableOpacity>
  );
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops, tips, or communities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
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
          {/* Weather Section */}
          <View style={styles.weatherContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="cloud-outline" size={40} color="#4a6c2f" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
              </View>
            ) : (
              <>
                <View style={styles.currentWeather}>
                  <View>
                    <Text style={styles.weatherTitle}>Today's Weather</Text>
                    <Text style={styles.temperature}>{Math.round(weatherData.current.temp)}°C</Text>
                    <Text style={styles.weatherDescription}>
                      {weatherConditions[weatherData.current.weather[0].main.toLowerCase()]?.description || 'Clear Sky'}
                    </Text>
                    <View style={styles.weatherDetails}>
                      <View style={styles.weatherDetail}>
                        <Ionicons name="water-outline" size={16} color="#64B5F6" />
                        <Text style={styles.weatherDetailText}>{weatherData.current.humidity}%</Text>
                      </View>
                      <View style={styles.weatherDetail}>
                        <Ionicons name="speedometer-outline" size={16} color="#90A4AE" />
                        <Text style={styles.weatherDetailText}>{weatherData.current.wind_speed} km/h</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.weatherIconContainer}>
                    <Ionicons 
                      name={weatherConditions[weatherData.current.weather[0].main.toLowerCase()]?.icon || 'sunny-outline'} 
                      size={70} 
                      color={weatherConditions[weatherData.current.weather[0].main.toLowerCase()]?.color || '#FFD54F'} 
                    />
                  </View>
                </View>
                
                <View style={styles.weatherForecast}>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={weatherData.daily.slice(1, 5)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.forecastItem}>
                        <Text style={styles.forecastDay}>{formatDate(item.dt)}</Text>
                        <Ionicons 
                          name={weatherConditions[item.weather[0].main.toLowerCase()]?.icon || 'sunny-outline'} 
                          size={30} 
                          color={weatherConditions[item.weather[0].main.toLowerCase()]?.color || '#FFD54F'} 
                        />
                        <Text style={styles.forecastTemp}>{Math.round(item.temp.max)}°</Text>
                        <Text style={styles.forecastTempMin}>{Math.round(item.temp.min)}°</Text>
                      </View>
                    )}
                  />
                </View>
                
                <TouchableOpacity style={styles.weatherButton}>
                  <Text style={styles.weatherButtonText}>View 10-Day Forecast</Text>
                  <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
                </TouchableOpacity>
              </>
            )}
          </View>
          
          {/* Farming Calendar Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>View Calendar</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tasksContainer}>
              {upcomingTasks.map((task) => (
                <TouchableOpacity key={task.id} style={styles.taskCard}>
                  <View style={[styles.taskIconContainer, { backgroundColor: task.color }]}>
                    <Ionicons name={task.icon} size={24} color="white" />
                  </View>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskDate}>{task.date}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Farming Tips Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Farming Tips & Best Practices</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {farmingTips.map((tip) => (
                <TouchableOpacity key={tip.id} style={styles.tipCard}>
                  <ImageBackground 
                    source={{ uri: tip.image }} 
                    style={styles.tipImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.tipOverlay}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipDescription}>{tip.description}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Community Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Farmer Community</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            {communityPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.avatar} />
                  <View>
                    <Text style={styles.authorName}>{post.author}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                
                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                )}
                
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={20} color="#555" />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#555" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={20} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.communityButton}>
              <Text style={styles.communityButtonText}>Join the Conversation</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Floating Chatbot Button */}
      <TouchableOpacity 
  style={styles.chatbotButton} 
  onPress={() => navigation.navigate('Chat')} 
>
  <Ionicons name="chatbubbles" size={24} color="white" />
  <Text style={styles.chatbotButtonText}>Ask Sekai</Text>
</TouchableOpacity>
      
      {/* Chatbot Modal */}
      {showChatbot && (
        <View style={styles.chatbotContainer}>
          <View style={styles.chatbotHeader}>
            <View style={styles.chatbotHeaderContent}>
              <Ionicons name="logo-android" size={24} color="#4a6c2f" />
              <View>
                <Text style={styles.chatbotName}>Sekai</Text>
                <Text style={styles.chatbotStatus}>Farming Assistant</Text>
              </View>
            </View>
            <TouchableOpacity onPress={toggleChatbot}>
              <Ionicons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={chatMessages}
            keyExtractor={item => item.id}
            style={styles.chatMessagesList}
            renderItem={({ item }) => (
              <View style={[
                styles.chatMessage,
                item.isUser ? styles.userMessage : styles.botMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  item.isUser ? styles.userMessageText : styles.botMessageText
                ]}>
                  {item.text}
                </Text>
              </View>
            )}
          />
          
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask Sekai about farming..."
              value={messageInput}
              onChangeText={setMessageInput}
              placeholderTextColor="#888"
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSendMessage}
              disabled={messageInput.trim() === ''}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Home')} // Navigate to Home
      >
        <Ionicons name="home" size={24} color="#4a6c2f" />
        <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Calendar')} // Navigate to Calendar
      >
        <Ionicons name="calendar-outline" size={24} color="#888" />
        <Text style={styles.navText}>Calendar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Crops')} // Navigate to Crops
      >
        <Ionicons name="leaf-outline" size={24} color="#888" />
        <Text style={styles.navText}>Crops</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Community')} // Navigate to Community
      >
        <Ionicons name="people-outline" size={24} color="#888" />
        <Text style={styles.navText}>Community</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('More')} // Navigate to More
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
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  farmName: {
    fontSize: 16,
    color: '#4a6c2f',
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  weatherContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  temperature: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  weatherDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  weatherDetailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  weatherIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherForecast: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginBottom: 15,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 25,
  },
  forecastDay: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  forecastTempMin: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  weatherButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  weatherButtonText: {
    fontSize: 14,
    color: '#4a6c2f',
    fontWeight: '500',
    marginRight: 5,
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
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4a6c2f',
    marginRight: 5,
  },
  tasksContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  taskDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  tipCard: {
    width: 270,
    height: 160,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tipImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  tipOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tipDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  postTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  postContent: {
    fontSize: 15,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 15,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  communityButton: {
    backgroundColor: '#4a6c2f',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  communityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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
  chatbotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6c2f',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  chatbotButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  chatbotContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  chatbotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatbotHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatbotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  chatbotStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 10,
  },
  chatMessagesList: {
    flex: 1,
    padding: 15,
  },
  chatMessage: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a6c2f',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#2c3e50',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4a6c2f',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;