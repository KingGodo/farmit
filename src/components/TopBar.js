import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TopBar = ({ userName, farmName, navigation }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hello, {userName || 'Farmer'}!</Text>
        <Text style={styles.farmName}>{farmName || 'Your Farm'}</Text>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-circle-outline" size={40} color="#4a6c2f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TopBar;