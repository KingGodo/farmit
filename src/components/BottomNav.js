import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNav = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#4a6c2f" />
        <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Calendar')}>
        <Ionicons name="calendar-outline" size={24} color="#888" />
        <Text style={styles.navText}>Calendar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Crops')}>
        <Ionicons name="leaf-outline" size={24} color="#888" />
        <Text style={styles.navText}>Crops</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Community')}>
        <Ionicons name="people-outline" size={24} color="#888" />
        <Text style={styles.navText}>Community</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('More')}>
        <Ionicons name="menu-outline" size={24} color="#888" />
        <Text style={styles.navText}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default BottomNav;