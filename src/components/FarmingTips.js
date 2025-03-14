import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure this is imported

const FarmingTips = ({ tips }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Farming Tips & Best Practices</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tips.map((tip) => (
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
});

export default FarmingTips;