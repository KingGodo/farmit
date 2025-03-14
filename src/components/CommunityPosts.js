import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CommunityPosts = ({ posts }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Farmer Community</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>View All</Text>
          <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
        </TouchableOpacity>
      </View>

      {posts.map((post) => (
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
  );
};

const styles = StyleSheet.create({
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
});

export default CommunityPosts;