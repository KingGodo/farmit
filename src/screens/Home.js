import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Animated,
  Dimensions,
  RefreshControl,
  FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherCard from '../components/WeatherCard';
import UpcomingTasks from '../components/UpcomingTasks';
import FarmingTips from '../components/FarmingTips';
import CommunityPosts from '../components/CommunityPosts';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(30))[0];

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

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  // Handle sending messages
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: String(chatMessages.length + 1),
        text: messageInput,
        isUser: true,
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');

      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: String(chatMessages.length + 2),
          text: `You asked: "${newMessage.text}". How can I assist you further?`,
          isUser: false,
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar userName={userName} farmName={farmName} navigation={navigation} />
      
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
          <WeatherCard loading={loading} weatherData={weatherData} />
          <UpcomingTasks tasks={[
            { id: '1', title: 'Maize Planting', date: 'May 15', icon: 'leaf-outline', color: '#4CAF50' },
            { id: '2', title: 'Fertilizer Application', date: 'May 18', icon: 'water-outline', color: '#2196F3' },
            { id: '3', title: 'Pest Control', date: 'May 22', icon: 'bug-outline', color: '#FF5722' },
          ]} />
          <FarmingTips tips={[
            { id: '1', title: 'Soil Preparation', description: 'Ensure proper soil preparation before planting', image: 'https://picsum.photos/id/112/300/200' },
            { id: '2', title: 'Water Conservation', description: 'Techniques to conserve water during dry seasons', image: 'https://picsum.photos/id/113/300/200' },
            { id: '3', title: 'Pest Management', description: 'Natural ways to manage pests in your farm', image: 'https://picsum.photos/id/114/300/200' },
            { id: '4', title: 'Crop Rotation', description: 'Benefits of implementing crop rotation', image: 'https://picsum.photos/id/115/300/200' },
          ]} />
          <CommunityPosts posts={[
            { id: '1', author: 'John Mwangi', avatar: 'https://picsum.photos/id/1/100/100', time: '2 hours ago', content: 'Has anyone used the new drought-resistant maize variety? Looking for feedback before planting.', likes: 24, comments: 8 },
            { id: '2', author: 'Sarah Kamau', avatar: 'https://picsum.photos/id/2/100/100', time: '5 hours ago', content: 'Sharing my success with crop rotation! Soil health has improved significantly over the past year.', likes: 42, comments: 15, image: 'https://picsum.photos/id/123/400/200' },
            { id: '3', author: 'Daniel Ochieng', avatar: 'https://picsum.photos/id/3/100/100', time: '1 day ago', content: 'Weather alert: Heavy rains expected in the Central region next week. Secure your crops and livestock!', likes: 56, comments: 12 },
          ]} />
        </Animated.View>
      </ScrollView>
      
      <BottomNav navigation={navigation} />
      
      {/* Chatbot Button */}
      <TouchableOpacity style={styles.chatbotButton} onPress={toggleChatbot}>
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
        <Text style={styles.chatbotButtonText}>Chat with Sekai</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 30,
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#4a6c2f',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: '#333',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4a6c2f',
    borderRadius: 15,
    padding: 10,
  },
});

export default Home;