import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomPicker = ({ options, selectedValue, onValueChange, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [translateY] = useState(new Animated.Value(0));

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Animated.timing(translateY, {
      toValue: modalVisible ? 0 : 150,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (value) => {
    onValueChange(value);
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity style={[styles.picker, style]} onPress={toggleModal}>
        <Text style={styles.pickerText}>{selectedValue}</Text>
        <Ionicons
          name={modalVisible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="black"
          style={styles.arrow}
        />
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 50,
    backgroundColor: '#d3d3d3', // Light gray background
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  pickerText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  arrow: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#48bb78',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomPicker;