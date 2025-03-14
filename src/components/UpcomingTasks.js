import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UpcomingTasks = ({ tasks }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>View Calendar</Text>
          <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tasksContainer}>
        {tasks.map((task) => (
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
});

export default UpcomingTasks;