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
  Animated,
  RefreshControl,
  Modal,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Community = ({ navigation }) => {
  // State variables
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Mock categories
  const categories = [
    { id: '1', name: 'Crop Management', icon: 'leaf-outline' },
    { id: '2', name: 'Livestock', icon: 'paw-outline' },
    { id: '3', name: 'Market Prices', icon: 'cash-outline' },
    { id: '4', name: 'Weather Updates', icon: 'cloud-outline' },
    { id: '5', name: 'Equipment', icon: 'construct-outline' },
    { id: '6', name: 'Organic Farming', icon: 'flower-outline' }
  ];

  // Mock trending topics
  const trendingTopics = [
    '#DroughtResistant',
    '#OrganicFarming',
    '#SmartAgriculture',
    '#LocalProduce',
    '#SustainableFarming'
  ];

  // Mock community posts with more farming-specific content
  const mockPosts = [
    {
      id: '1',
      author: 'Sarah Kamau',
      avatar: 'https://picsum.photos/id/64/100/100',
      time: '2 hours ago',
      content: 'Just implemented drip irrigation in my tomato farm. The water efficiency is amazing! Here are some tips on setting it up...',
      images: ['https://picsum.photos/id/123/400/300'],
      likes: 45,
      comments: 12,
      shares: 8,
      tags: ['#Irrigation', '#WaterConservation'],
      verified: true
    },
    {
      id: '2',
      author: 'John Mwangi',
      avatar: 'https://picsum.photos/id/65/100/100',
      time: '4 hours ago',
      content: 'Market Alert: Current maize prices in Nakuru region have increased by 15%. Good time to consider selling your harvest.',
      likes: 32,
      comments: 18,
      shares: 25,
      tags: ['#MarketPrices', '#Maize'],
    },
    {
      id: '3',
      author: 'Grace Odhiambo',
      avatar: 'https://picsum.photos/id/66/100/100',
      time: '6 hours ago',
      content: 'Success story: My organic pest control mixture (neem oil + garlic extract) worked wonders on aphids! Swipe for before/after photos →',
      images: [
        'https://picsum.photos/id/124/400/300',
        'https://picsum.photos/id/125/400/300'
      ],
      likes: 89,
      comments: 34,
      shares: 42,
      tags: ['#OrganicFarming', '#PestControl'],
      verified: true
    },
    {
      id: '4',
      author: 'David Kirui',
      avatar: 'https://picsum.photos/id/67/100/100',
      time: '1 day ago',
      content: 'Question: Anyone using solar-powered water pumps? Looking for recommendations on reliable brands and installation tips.',
      likes: 27,
      comments: 45,
      shares: 5,
      tags: ['#SolarEnergy', '#Irrigation']
    }
  ];

  useEffect(() => {
    // Simulate loading posts
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    }, 1500);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderPostCard = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View>
            <View style={styles.authorNameContainer}>
              <Text style={styles.authorName}>{item.author}</Text>
              {item.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#4a6c2f" style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={styles.postTime}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.tags && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {item.images && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.postImage} />
          ))}
        </ScrollView>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={22} color="#666" />
          <Text style={styles.actionText}>{item.shares || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={24} color="#4a6c2f" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search discussions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Trending Topics */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingContainer}>
        {trendingTopics.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.trendingTopic}>
            <Text style={styles.trendingText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
          onPress={() => setActiveTab('trending')}
        >
          <Text style={[styles.tabText, activeTab === 'trending' && styles.activeTabText]}>Trending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'latest' && styles.activeTab]}
          onPress={() => setActiveTab('latest')}
        >
          <Text style={[styles.tabText, activeTab === 'latest' && styles.activeTabText]}>Latest</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.activeTabText]}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <Animated.View style={[styles.postsContainer, { opacity: fadeAnim }]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading community posts...</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostCard}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </Animated.View>

      {/* New Post Button */}
      <TouchableOpacity 
        style={styles.newPostButton}
        onPress={() => setShowNewPostModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal
        visible={showNewPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.postInput}
              placeholder="Share your farming experience..."
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
              placeholderTextColor="#888"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.mediaButton}>
                <Ionicons name="image-outline" size={24} color="#4a6c2f" />
                <Text style={styles.mediaButtonText}>Add Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.postButton,
                  !newPostContent && styles.disabledButton
                ]}
                disabled={!newPostContent}
              >
                <Text style={styles.postButtonText}>Post</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  trendingContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  trendingTopic: {
    backgroundColor: '#4a6c2f20',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  trendingText: {
    color: '#4a6c2f',
    fontSize: 14,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4a6c2f',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4a6c2f',
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 15,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 5,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  postTime: {
    fontSize: 14,
    color: '#666',
  },
  postContent: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#4a6c2f15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4a6c2f',
    fontSize: 14,
  },
  imageScrollView: {
    marginBottom: 10,
  },
  postImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  newPostButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a6c2f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  postInput: {
    minHeight: 120,
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  mediaButtonText: {
    marginLeft: 5,
    color: '#4a6c2f',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#4a6c2f',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Community;