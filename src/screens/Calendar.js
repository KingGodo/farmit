import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
  Image,
  Switch
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Calendar = ({ navigation }) => {
  // State variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    id: '',
    title: '',
    description: '',
    date: new Date(),
    startTime: '08:00',
    endTime: '09:00',
    location: '',
    category: 'Planting',
    isCompleted: false,
    reminderSet: true,
    priority: 'Medium',
    notes: '',
    weatherDependent: true,
    relatedCrop: '',
    labor: 1,
  });
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day', 'agenda'
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const searchBarHeight = useRef(new Animated.Value(0)).current;

  // Constants
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Event categories
  const EVENT_CATEGORIES = [
    { id: 'all', name: 'All', icon: 'apps-outline', color: '#7f8c8d' },
    { id: 'planting', name: 'Planting', icon: 'leaf-outline', color: '#4CAF50' },
    { id: 'harvesting', name: 'Harvesting', icon: 'basket-outline', color: '#FF9800' },
    { id: 'fertilizing', name: 'Fertilizing', icon: 'water-outline', color: '#2196F3' },
    { id: 'pestControl', name: 'Pest Control', icon: 'bug-outline', color: '#F44336' },
    { id: 'irrigation', name: 'Irrigation', icon: 'rainy-outline', color: '#00BCD4' },
    { id: 'maintenance', name: 'Maintenance', icon: 'construct-outline', color: '#795548' },
    { id: 'market', name: 'Market', icon: 'cart-outline', color: '#9C27B0' },
    { id: 'meeting', name: 'Meeting', icon: 'people-outline', color: '#607D8B' },
  ];

  // Priority colors
  const PRIORITY_COLORS = {
    'High': '#F44336',
    'Medium': '#FF9800',
    'Low': '#4CAF50'
  };

  // Load events from AsyncStorage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('calendarEvents');
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents).map(event => ({
            ...event,
            date: new Date(event.date)
          }));
          setEvents(parsedEvents);
        } else {
          // Add some sample events if none exist
          const sampleEvents = generateSampleEvents();
          setEvents(sampleEvents);
          await AsyncStorage.setItem('calendarEvents', JSON.stringify(sampleEvents));
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();
    
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

  // Filter events when filter criteria change
  useEffect(() => {
    filterEvents();
  }, [events, filterCategory, showCompleted, searchQuery, selectedDate, viewMode]);

  // Generate sample events
  const generateSampleEvents = () => {
    const today = new Date();
    const sampleEvents = [
      {
        id: '1',
        title: 'Plant Maize',
        description: 'Plant maize seeds in the north field',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        startTime: '08:00',
        endTime: '12:00',
        location: 'North Field',
        category: 'Planting',
        isCompleted: false,
        reminderSet: true,
        priority: 'High',
        notes: 'Use the new drought-resistant variety',
        weatherDependent: true,
        relatedCrop: 'Maize',
        labor: 3,
      },
      {
        id: '2',
        title: 'Apply Fertilizer',
        description: 'Apply NPK fertilizer to tomato plants',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        startTime: '14:00',
        endTime: '16:00',
        location: 'Vegetable Garden',
        category: 'Fertilizing',
        isCompleted: false,
        reminderSet: true,
        priority: 'Medium',
        notes: '20kg of NPK 17-17-17',
        weatherDependent: false,
        relatedCrop: 'Tomatoes',
        labor: 1,
      },
      {
        id: '3',
        title: 'Harvest Beans',
        description: 'Harvest the first batch of beans',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        startTime: '07:00',
        endTime: '10:00',
        location: 'East Field',
        category: 'Harvesting',
        isCompleted: true,
        reminderSet: false,
        priority: 'Medium',
        notes: 'Got approximately 50kg',
        weatherDependent: false,
        relatedCrop: 'Beans',
        labor: 2,
      },
      {
        id: '4',
        title: 'Meet with Cooperative',
        description: 'Monthly meeting with the farmers cooperative',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        startTime: '10:00',
        endTime: '12:00',
        location: 'Community Center',
        category: 'Meeting',
        isCompleted: false,
        reminderSet: true,
        priority: 'Medium',
        notes: 'Bring production records',
        weatherDependent: false,
        relatedCrop: '',
        labor: 1,
      },
      {
        id: '5',
        title: 'Repair Irrigation System',
        description: 'Fix the leaking pipes in the irrigation system',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        startTime: '09:00',
        endTime: '13:00',
        location: 'Main Water Line',
        category: 'Maintenance',
        isCompleted: false,
        reminderSet: true,
        priority: 'High',
        notes: 'Need to purchase new pipes',
        weatherDependent: false,
        relatedCrop: '',
        labor: 2,
      },
    ];
    
    return sampleEvents;
  };

  // Save events to AsyncStorage
  const saveEvents = async (updatedEvents) => {
    try {
      await AsyncStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  // Filter events based on criteria
  const filterEvents = () => {
    let filtered = [...events];
    
    // Filter by category
    if (filterCategory !== 'All') {
      filtered = filtered.filter(event => event.category === filterCategory);
    }
    
    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(event => !event.isCompleted);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.relatedCrop.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected date/period based on view mode
    if (viewMode === 'day') {
      filtered = filtered.filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      );
    } else if (viewMode === 'week') {
      // Get the start of the week (Sunday)
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      
      // Get the end of the week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      filtered = filtered.filter(event => 
        event.date >= startOfWeek && event.date <= endOfWeek
      );
    } else if (viewMode === 'month') {
      filtered = filtered.filter(event => 
        event.date.getMonth() === currentMonth.getMonth() &&
        event.date.getFullYear() === currentMonth.getFullYear()
      );
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
      const dateComparison = a.date - b.date;
      if (dateComparison !== 0) return dateComparison;
      
      return a.startTime.localeCompare(b.startTime);
    });
    
    setFilteredEvents(filtered);
  };

  // Add a new event
  const addEvent = () => {
    // Validate inputs
    if (!newEvent.title || !newEvent.date) {
      Alert.alert('Missing Information', 'Please provide at least a title and date for the event.');
      return;
    }
    
    const eventToAdd = {
      ...newEvent,
      id: Date.now().toString(),
    };
    
    const updatedEvents = [...events, eventToAdd];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    // Reset form and close modal
    setNewEvent({
      id: '',
      title: '',
      description: '',
      date: new Date(),
      startTime: '08:00',
      endTime: '09:00',
      location: '',
      category: 'Planting',
      isCompleted: false,
      reminderSet: true,
      priority: 'Medium',
      notes: '',
      weatherDependent: true,
      relatedCrop: '',
      labor: 1,
    });
    setModalVisible(false);
  };

  // Update an existing event
  const updateEvent = () => {
    if (!selectedEvent) return;
    
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id ? selectedEvent : event
    );
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setEventModalVisible(false);
  };

  // Delete an event
  const deleteEvent = (eventId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedEvents = events.filter(event => event.id !== eventId);
            setEvents(updatedEvents);
            saveEvents(updatedEvents);
            setEventModalVisible(false);
          }
        }
      ]
    );
  };

  // Toggle event completion status
  const toggleEventCompletion = (eventId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          isCompleted: !event.isCompleted
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    // Update selected event if it's the one being modified
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        isCompleted: !selectedEvent.isCompleted
      });
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Add days from previous month to fill the first row
    const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = prevMonthLastDay - startingDayOfWeek + i + 1;
      days.push({
        day,
        month: currentMonth.getMonth() - 1,
        year: currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear(),
        isCurrentMonth: false
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth.getMonth(),
        year: currentMonth.getFullYear(),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to fill the last row
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear(),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Check if a date has events
  const hasEvents = (day, month, year) => {
    return events.some(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
  };

  // Count events for a specific date
  const countEvents = (day, month, year) => {
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    ).length;
  };

  // Get events for a specific date
  const getEventsForDate = (day, month, year) => {
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Format date for display
  const formatDate = (date) => {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Change view mode
  const changeViewMode = (mode) => {
    setViewMode(mode);
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Toggle search bar visibility
  const toggleSearch = () => {
    if (isSearchVisible) {
      // Hide search bar
      Animated.timing(searchBarHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsSearchVisible(false);
        setSearchQuery('');
      });
    } else {
      // Show search bar
      setIsSearchVisible(true);
      Animated.timing(searchBarHeight, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const categoryObj = EVENT_CATEGORIES.find(cat => cat.name === category);
    return categoryObj ? categoryObj.color : '#7f8c8d';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const categoryObj = EVENT_CATEGORIES.find(cat => cat.name === category);
    return categoryObj ? categoryObj.icon : 'calendar-outline';
  };

  // Render calendar for month view
  const renderMonthCalendar = () => {
    const calendarDays = generateCalendarDays();
    
    return (
      <View style={styles.calendarContainer}>
        {/* Days of week header */}
        <View style={styles.daysHeader}>
          {DAYS.map((day, index) => (
            <Text key={index} style={styles.dayHeaderText}>{day}</Text>
          ))}
        </View>
        
        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((dayObj, index) => {
            const isSelected = 
              selectedDate.getDate() === dayObj.day && 
              selectedDate.getMonth() === dayObj.month && 
              selectedDate.getFullYear() === dayObj.year;
            
            const isToday = 
              new Date().getDate() === dayObj.day && 
              new Date().getMonth() === dayObj.month && 
              new Date().getFullYear() === dayObj.year;
            
            const hasEventsForDay = hasEvents(dayObj.day, dayObj.month, dayObj.year);
            const eventCount = countEvents(dayObj.day, dayObj.month, dayObj.year);
            
            return (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.calendarDay,
                  !dayObj.isCurrentMonth && styles.notCurrentMonth,
                  isSelected && styles.selectedDay,
                  isToday && styles.today
                ]}
                onPress={() => {
                  setSelectedDate(new Date(dayObj.year, dayObj.month, dayObj.day));
                  if (viewMode === 'month') {
                    changeViewMode('day');
                  }
                }}
              >
                <Text style={[
                  styles.calendarDayText,
                  !dayObj.isCurrentMonth && styles.notCurrentMonthText,
                  isSelected && styles.selectedDayText,
                  isToday && styles.todayText
                ]}>
                  {dayObj.day}
                </Text>
                
                {hasEventsForDay && (
                  <View style={styles.eventIndicatorContainer}>
                    {eventCount > 3 ? (
                      <View style={styles.multipleEventsIndicator}>
                        <Text style={styles.eventCountText}>{eventCount}</Text>
                      </View>
                    ) : (
                      getEventsForDate(dayObj.day, dayObj.month, dayObj.year)
                        .slice(0, 3)
                        .map((event, eventIndex) => (
                          <View 
                            key={eventIndex} 
                            style={[
                              styles.eventIndicator, 
                              { backgroundColor: getCategoryColor(event.category) }
                            ]} 
                          />
                        ))
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Render calendar for week view
  const renderWeekCalendar = () => {
    // Get the start of the week (Sunday)
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    
    return (
      <View style={styles.weekCalendarContainer}>
        <View style={styles.weekDaysHeader}>
          {weekDays.map((day, index) => {
            const isSelected = 
              selectedDate.getDate() === day.getDate() && 
              selectedDate.getMonth() === day.getMonth() && 
              selectedDate.getFullYear() === day.getFullYear();
            
            const isToday = 
              new Date().getDate() === day.getDate() && 
              new Date().getMonth() === day.getMonth() && 
              new Date().getFullYear() === day.getFullYear();
            
            return (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.weekDay,
                  isSelected && styles.selectedWeekDay,
                  isToday && styles.todayWeekDay
                ]}
                onPress={() => setSelectedDate(new Date(day))}
              >
                <Text style={styles.weekDayName}>{DAYS[day.getDay()]}</Text>
                <Text style={[
                  styles.weekDayNumber,
                  isSelected && styles.selectedWeekDayText,
                  isToday && styles.todayWeekDayText
                ]}>
                  {day.getDate()}
                </Text>
                
                {hasEvents(day.getDate(), day.getMonth(), day.getFullYear()) && (
                  <View style={[
                    styles.weekDayEventIndicator,
                    isSelected && { backgroundColor: 'white' }
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        
        <ScrollView style={styles.weekEventsContainer}>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDate(day.getDate(), day.getMonth(), day.getFullYear());
            
            if (dayEvents.length === 0) return null;
            
            return (
              <View key={dayIndex} style={styles.weekDayEvents}>
                <Text style={styles.weekDayEventsHeader}>
                  {DAYS[day.getDay()]}, {MONTHS[day.getMonth()]} {day.getDate()}
                </Text>
                
                {dayEvents.map((event, eventIndex) => (
                  <TouchableOpacity 
                    key={eventIndex}
                    style={[
                      styles.weekEvent,
                      { borderLeftColor: getCategoryColor(event.category) },
                      event.isCompleted && styles.completedEvent
                    ]}
                    onPress={() => {
                      setSelectedEvent(event);
                      setEventModalVisible(true);
                    }}
                  >
                    <View style={styles.weekEventHeader}>
                      <Text style={styles.weekEventTime}>
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </Text>
                      <View style={[
                        styles.priorityIndicator, 
                        { backgroundColor: PRIORITY_COLORS[event.priority] }
                      ]}>
                        <Text style={styles.priorityText}>{event.priority}</Text>
                      </View>
                    </View>
                    
                    <Text style={[
                      styles.weekEventTitle,
                      event.isCompleted && styles.completedEventText
                    ]}>
                      {event.title}
                    </Text>
                    
                    <View style={styles.weekEventDetails}>
                      {event.location && (
                        <View style={styles.weekEventDetail}>
                          <Ionicons name="location-outline" size={14} color="#7f8c8d" />
                          <Text style={styles.weekEventDetailText}>{event.location}</Text>
                        </View>
                      )}
                      
                      <View style={styles.weekEventDetail}>
                        <Ionicons name={getCategoryIcon(event.category)} size={14} color={getCategoryColor(event.category)} />
                        <Text style={[
                          styles.weekEventDetailText, 
                          { color: getCategoryColor(event.category) }
                        ]}>
                          {event.category}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[
                        styles.completeButton,
                        event.isCompleted && styles.uncompleteButton
                      ]}
                      onPress={() => toggleEventCompletion(event.id)}
                    >
                      <Ionicons 
                        name={event.isCompleted ? 'refresh-outline' : 'checkmark-outline'} 
                        size={16} 
                        color="white" 
                      />
                      <Text style={styles.completeButtonText}>
                        {event.isCompleted ? 'Undo' : 'Complete'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // Render calendar for day view
  const renderDayCalendar = () => {
    const dayEvents = getEventsForDate(
      selectedDate.getDate(), 
      selectedDate.getMonth(), 
      selectedDate.getFullYear()
    );
    
    // Create time slots for the day
    const timeSlots = [];
    for (let hour = 5; hour < 21; hour++) {
      timeSlots.push(`${hour < 10 ? '0' + hour : hour}:00`);
    }
    
    return (
      <View style={styles.dayCalendarContainer}>
        <Text style={styles.selectedDateHeader}>
          {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}
        </Text>
        
        {dayEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ddd" />
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
            <TouchableOpacity 
              style={styles.addEventButton}
              onPress={() => {
                setNewEvent({
                  ...newEvent,
                  date: new Date(selectedDate)
                });
                setModalVisible(true);
              }}
            >
              <Text style={styles.addEventButtonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.dayEventsContainer}>
            {timeSlots.map((timeSlot, index) => {
              const hour = parseInt(timeSlot.split(':')[0]);
              const eventsAtTime = dayEvents.filter(event => {
                const eventStartHour = parseInt(event.startTime.split(':')[0]);
                const eventEndHour = parseInt(event.endTime.split(':')[0]);
                return eventStartHour <= hour && eventEndHour > hour;
              });
              
              return (
                <View key={index} style={styles.timeSlot}>
                  <Text style={styles.timeSlotLabel}>{formatTime(timeSlot)}</Text>
                  
                  <View style={styles.timeSlotContent}>
                    {eventsAtTime.length === 0 ? (
                      <View style={styles.emptyTimeSlot} />
                    ) : (
                      eventsAtTime.map((event, eventIndex) => (
                        <TouchableOpacity 
                          key={eventIndex}
                          style={[
                            styles.timeSlotEvent,
                            { backgroundColor: getCategoryColor(event.category) + '20', borderLeftColor: getCategoryColor(event.category) },
                            event.isCompleted && styles.completedTimeSlotEvent
                          ]}
                          onPress={() => {
                            setSelectedEvent(event);
                            setEventModalVisible(true);
                          }}
                        >
                          <Text style={[
                            styles.timeSlotEventTitle,
                            { color: getCategoryColor(event.category) },
                            event.isCompleted && styles.completedEventText
                          ]}>
                            {event.title}
                          </Text>
                          
                          <Text style={styles.timeSlotEventTime}>
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </Text>
                          
                          {event.location && (
                            <View style={styles.timeSlotEventDetail}>
                              <Ionicons name="location-outline" size={12} color="#7f8c8d" />
                              <Text style={styles.timeSlotEventDetailText}>{event.location}</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  // Render calendar for agenda view
  const renderAgendaView = () => {
    // Group events by month and date
    const groupedEvents = {};
    
    filteredEvents.forEach(event => {
      const monthYear = `${MONTHS[event.date.getMonth()]} ${event.date.getFullYear()}`;
      const dateKey = `${event.date.getFullYear()}-${event.date.getMonth()}-${event.date.getDate()}`;
      
      if (!groupedEvents[monthYear]) {
        groupedEvents[monthYear] = {};
      }
      
      if (!groupedEvents[monthYear][dateKey]) {
        groupedEvents[monthYear][dateKey] = {
          date: new Date(event.date),
          events: []
        };
      }
      
      groupedEvents[monthYear][dateKey].events.push(event);
    });
    
    return (
      <ScrollView style={styles.agendaContainer}>
        {Object.keys(groupedEvents).length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ddd" />
            <Text style={styles.noEventsText}>No events match your filters</Text>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={() => {
                setFilterCategory('All');
                setShowCompleted(true);
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetFiltersButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          Object.keys(groupedEvents).map((monthYear, monthIndex) => (
            <View key={monthYear} style={styles.agendaMonth}>
              <Text style={styles.agendaMonthHeader}>{monthYear}</Text>
              
              {Object.values(groupedEvents[monthYear]).map((dateGroup, dateIndex) => (
                <View key={dateIndex} style={styles.agendaDateGroup}>
                  <View style={styles.agendaDateHeader}>
                    <Text style={styles.agendaDate}>
                      {DAYS[dateGroup.date.getDay()]}, {dateGroup.date.getDate()}
                    </Text>
                    <View style={styles.agendaDateLine} />
                  </View>
                  
                  {dateGroup.events.map((event, eventIndex) => (
                    <TouchableOpacity 
                      key={eventIndex}
                      style={[
                        styles.agendaEvent,
                        event.isCompleted && styles.completedAgendaEvent
                      ]}
                      onPress={() => {
                        setSelectedEvent(event);
                        setEventModalVisible(true);
                      }}
                    >
                      <View style={[
                        styles.agendaEventCategory,
                        { backgroundColor: getCategoryColor(event.category) }
                      ]}>
                        <Ionicons name={getCategoryIcon(event.category)} size={20} color="white" />
                      </View>
                      
                      <View style={styles.agendaEventContent}>
                        <View style={styles.agendaEventHeader}>
                          <Text style={[
                            styles.agendaEventTitle,
                            event.isCompleted && styles.completedEventText
                          ]}>
                            {event.title}
                          </Text>
                          <View style={[
                            styles.priorityBadge,
                            { backgroundColor: PRIORITY_COLORS[event.priority] }
                          ]}>
                            <Text style={styles.priorityBadgeText}>{event.priority}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.agendaEventDetails}>
                          <View style={styles.agendaEventDetail}>
                            <Ionicons name="time-outline" size={14} color="#7f8c8d" />
                            <Text style={styles.agendaEventDetailText}>
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </Text>
                          </View>
                          
                          {event.location && (
                            <View style={styles.agendaEventDetail}>
                              <Ionicons name="location-outline" size={14} color="#7f8c8d" />
                              <Text style={styles.agendaEventDetailText}>{event.location}</Text>
                            </View>
                          )}
                          
                          {event.relatedCrop && (
                            <View style={styles.agendaEventDetail}>
                              <Ionicons name="leaf-outline" size={14} color="#4CAF50" />
                              <Text style={styles.agendaEventDetailText}>{event.relatedCrop}</Text>
                            </View>
                          )}
                        </View>
                        
                        {event.description && (
                          <Text style={[
                            styles.agendaEventDescription,
                            event.isCompleted && styles.completedEventText
                          ]} numberOfLines={2}>
                            {event.description}
                          </Text>
                        )}
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.agendaEventAction}
                        onPress={() => toggleEventCompletion(event.id)}
                      >
                        <Ionicons 
                          name={event.isCompleted ? 'refresh-outline' : 'checkmark-circle-outline'} 
                          size={24} 
                          color={event.isCompleted ? '#F44336' : '#4CAF50'} 
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={toggleSearch}
          >
            <Ionicons name="search-outline" size={24} color="#555" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerAction}
            onPress={() => {
              setNewEvent({
                ...newEvent,
                date: new Date(selectedDate)
              });
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
        {isSearchVisible && (
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearch}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
      
      {/* Calendar Navigation */}
      <View style={styles.calendarNav}>
        <View style={styles.monthSelector}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToPreviousMonth}
          >
            <Ionicons name="chevron-back" size={24} color="#555" />
          </TouchableOpacity>
          
          <Text style={styles.currentMonthText}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={goToNextMonth}
          >
            <Ionicons name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.todayButton}
          onPress={goToToday}
        >
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      
      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['month', 'week', 'day', 'agenda'].map((mode) => (
            <TouchableOpacity 
              key={mode}
              style={[
                styles.viewModeButton,
                viewMode === mode && styles.activeViewModeButton
              ]}
              onPress={() => changeViewMode(mode)}
            >
              <Text style={[
                styles.viewModeText,
                viewMode === mode && styles.activeViewModeText
              ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {EVENT_CATEGORIES.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryFilterButton,
                filterCategory === category.name && {
                  backgroundColor: category.color + '20',
                  borderColor: category.color
                }
              ]}
              onPress={() => setFilterCategory(category.name)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={filterCategory === category.name ? category.color : '#888'} 
              />
              <Text style={[
                styles.categoryFilterText,
                filterCategory === category.name && { color: category.color }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.showCompletedContainer}>
          <Text style={styles.showCompletedText}>Show Completed</Text>
          <Switch
            value={showCompleted}
            onValueChange={setShowCompleted}
            trackColor={{ false: '#ddd', true: '#4a6c2f50' }}
            thumbColor={showCompleted ? '#4a6c2f' : '#f4f3f4'}
          />
        </View>
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
          {/* Calendar Views */}
          {viewMode === 'month' && renderMonthCalendar()}
          {viewMode === 'week' && renderWeekCalendar()}
          {viewMode === 'day' && renderDayCalendar()}
          {viewMode === 'agenda' && renderAgendaView()}
          
          {/* Event Summary */}
          {viewMode !== 'agenda' && (
            <View style={styles.eventSummaryContainer}>
              <Text style={styles.eventSummaryTitle}>
                {viewMode === 'month' 
                  ? `Events in ${MONTHS[currentMonth.getMonth()]}`
                  : viewMode === 'week'
                    ? 'This Week'
                    : `Events on ${formatDate(selectedDate)}`
                }
              </Text>
              
              {filteredEvents.length === 0 ? (
                <View style={styles.noEventsSummary}>
                  <Ionicons name="calendar-outline" size={40} color="#ddd" />
                  <Text style={styles.noEventsSummaryText}>No events to display</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredEvents.slice(0, 5)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.eventSummaryItem,
                        item.isCompleted && styles.completedEventSummaryItem
                      ]}
                      onPress={() => {
                        setSelectedEvent(item);
                        setEventModalVisible(true);
                      }}
                    >
                      <View style={[
                        styles.eventSummaryCategory,
                        { backgroundColor: getCategoryColor(item.category) }
                      ]}>
                        <Ionicons name={getCategoryIcon(item.category)} size={18} color="white" />
                      </View>
                      
                      <View style={styles.eventSummaryContent}>
                        <Text style={[
                          styles.eventSummaryItemTitle,
                          item.isCompleted && styles.completedEventText
                        ]}>
                          {item.title}
                        </Text>
                        
                        <View style={styles.eventSummaryDetails}>
                          <Text style={styles.eventSummaryDate}>
                            {formatDate(item.date)} • {formatTime(item.startTime)}
                          </Text>
                          
                          {item.location && (
                            <View style={styles.eventSummaryDetail}>
                              <Ionicons name="location-outline" size={12} color="#7f8c8d" />
                              <Text style={styles.eventSummaryDetailText}>{item.location}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.eventSummaryAction}
                        onPress={() => toggleEventCompletion(item.id)}
                      >
                        <Ionicons 
                          name={item.isCompleted ? 'refresh-outline' : 'checkmark-circle-outline'} 
                          size={20} 
                          color={item.isCompleted ? '#F44336' : '#4CAF50'} 
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                  style={styles.eventSummaryList}
                />
              )}
              
              {filteredEvents.length > 5 && (
                <TouchableOpacity 
                  style={styles.viewAllEventsButton}
                  onPress={() => changeViewMode('agenda')}
                >
                  <Text style={styles.viewAllEventsText}>
                    View All {filteredEvents.length} Events
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Weather Forecast for Farm Activities */}
          <View style={styles.weatherContainer}>
            <View style={styles.weatherHeader}>
              <Text style={styles.weatherTitle}>Weather Forecast</Text>
              <TouchableOpacity style={styles.weatherAction}>
                <Text style={styles.weatherActionText}>10-Day Forecast</Text>
                <Ionicons name="arrow-forward" size={16} color="#4a6c2f" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weatherContent}>
              <View style={styles.todayWeather}>
                <View style={styles.todayWeatherIcon}>
                  <Ionicons name="partly-sunny" size={40} color="#FF9800" />
                </View>
                
                <View style={styles.todayWeatherInfo}>
                  <Text style={styles.todayWeatherTemp}>24°C</Text>
                  <Text style={styles.todayWeatherDescription}>Partly Cloudy</Text>
                  <Text style={styles.todayWeatherDetails}>Humidity: 65% • Wind: 12 km/h</Text>
                </View>
              </View>
              
              <Text style={styles.weatherForecastTitle}>Next 5 Days</Text>
              
              <View style={styles.weatherForecast}>
                {[
                  { day: 'Mon', temp: 26, icon: 'sunny-outline', condition: 'Clear' },
                  { day: 'Tue', temp: 24, icon: 'partly-sunny-outline', condition: 'Partly Cloudy' },
                  { day: 'Wed', temp: 23, icon: 'rainy-outline', condition: 'Rainy' },
                  { day: 'Thu', temp: 22, icon: 'rainy-outline', condition: 'Rainy' },
                  { day: 'Fri', temp: 25, icon: 'partly-sunny-outline', condition: 'Partly Cloudy' },
                ].map((day, index) => (
                  <View key={index} style={styles.forecastDay}>
                    <Text style={styles.forecastDayName}>{day.day}</Text>
                    <Ionicons name={day.icon} size={24} color="#555" />
                    <Text style={styles.forecastDayTemp}>{day.temp}°</Text>
                    <Text style={styles.forecastDayCondition}>{day.condition}</Text>
                  </View>
                ))}
              </View>
              
              <Text style={styles.weatherImpactTitle}>Weather Impact on Farm Activities</Text>
              
              <View style={styles.weatherImpactContainer}>
                {filteredEvents
                  .filter(event => event.weatherDependent && !event.isCompleted)
                  .slice(0, 3)
                  .map((event, index) => (
                    <View key={index} style={styles.weatherImpactItem}>
                      <View style={[
                        styles.weatherImpactStatus,
                        { backgroundColor: index === 0 ? '#F44336' : index === 1 ? '#FF9800' : '#4CAF50' }
                      ]}>
                        <Ionicons 
                          name={index === 0 ? 'alert-circle' : index === 1 ? 'warning' : 'checkmark-circle'} 
                          size={16} 
                          color="white" 
                        />
                      </View>
                      
                      <View style={styles.weatherImpactContent}>
                        <Text style={styles.weatherImpactEvent}>{event.title}</Text>
                        <Text style={styles.weatherImpactDate}>{formatDate(event.date)}</Text>
                        <Text style={styles.weatherImpactMessage}>
                          {index === 0 
                            ? 'Not recommended due to heavy rain forecast' 
                            : index === 1
                              ? 'Proceed with caution, light showers expected'
                              : 'Favorable weather conditions'
                          }
                        </Text>
                      </View>
                    </View>
                  ))}
                
                {filteredEvents.filter(event => event.weatherDependent && !event.isCompleted).length === 0 && (
                  <View style={styles.noWeatherImpact}>
                    <Ionicons name="sunny-outline" size={30} color="#ddd" />
                    <Text style={styles.noWeatherImpactText}>No weather-dependent activities scheduled</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      {/* Add Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Event</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Event Title *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter event title"
                  value={newEvent.title}
                  onChangeText={(text) => setNewEvent({...newEvent, title: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Date *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  value={formatDate(newEvent.date)}
                  editable={false}
                />
                {/* Note: In a real app, you would use a DatePicker here */}
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.formLabel}>Start Time</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="HH:MM"
                    value={newEvent.startTime}
                    onChangeText={(text) => setNewEvent({...newEvent, startTime: text})}
                  />
                  {/* Note: In a real app, you would use a TimePicker here */}
                </View>
                
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>End Time</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="HH:MM"
                    value={newEvent.endTime}
                    onChangeText={(text) => setNewEvent({...newEvent, endTime: text})}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Location</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter location"
                  value={newEvent.location}
                  onChangeText={(text) => setNewEvent({...newEvent, location: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Related Crop</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter crop name"
                  value={newEvent.relatedCrop}
                  onChangeText={(text) => setNewEvent({...newEvent, relatedCrop: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                  {EVENT_CATEGORIES.slice(1).map((category) => (
                    <TouchableOpacity 
                      key={category.id}
                      style={[
                        styles.categoryOption,
                        newEvent.category === category.name && {
                          backgroundColor: category.color + '20',
                          borderColor: category.color
                        }
                      ]}
                      onPress={() => setNewEvent({...newEvent, category: category.name})}
                    >
                      <Ionicons 
                        name={category.icon} 
                        size={16} 
                        color={newEvent.category === category.name ? category.color : '#888'} 
                      />
                      <Text style={[
                        styles.categoryOptionText,
                        newEvent.category === category.name && { color: category.color }
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {['Low', 'Medium', 'High'].map((priority) => (
                    <TouchableOpacity 
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newEvent.priority === priority && {
                          backgroundColor: PRIORITY_COLORS[priority] + '20',
                          borderColor: PRIORITY_COLORS[priority]
                        }
                      ]}
                      onPress={() => setNewEvent({...newEvent, priority: priority})}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newEvent.priority === priority && { color: PRIORITY_COLORS[priority] }
                      ]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Labor Required</Text>
                <View style={styles.laborContainer}>
                  {[1, 2, 3, 4, 5].map((laborCount) => (
                    <TouchableOpacity 
                      key={laborCount}
                      style={[
                        styles.laborOption,
                        newEvent.labor === laborCount && styles.laborOptionSelected
                      ]}
                      onPress={() => setNewEvent({...newEvent, labor: laborCount})}
                    >
                      <Text style={[
                        styles.laborOptionText,
                        newEvent.labor === laborCount && styles.laborOptionTextSelected
                      ]}>
                        {laborCount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.laborHelperText}>Number of people needed</Text>
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Weather Dependent</Text>
                  <Switch
                    value={newEvent.weatherDependent}
                    onValueChange={(value) => setNewEvent({...newEvent, weatherDependent: value})}
                    trackColor={{ false: '#ddd', true: '#4a6c2f50' }}
                    thumbColor={newEvent.weatherDependent ? '#4a6c2f' : '#f4f3f4'}
                  />
                </View>
                <Text style={styles.switchHelperText}>
                  Weather-dependent activities will receive alerts based on forecast
                </Text>
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Set Reminder</Text>
                  <Switch
                    value={newEvent.reminderSet}
                    onValueChange={(value) => setNewEvent({...newEvent, reminderSet: value})}
                    trackColor={{ false: '#ddd', true: '#4a6c2f50' }}
                    thumbColor={newEvent.reminderSet ? '#4a6c2f' : '#f4f3f4'}
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Notes</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Additional notes"
                  value={newEvent.notes}
                  onChangeText={(text) => setNewEvent({...newEvent, notes: text})}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={addEvent}
              >
                <Text style={styles.saveButtonText}>Save Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Event Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => setEventModalVisible(false)}
      >
        {selectedEvent && (
          <View style={styles.modalOverlay}>
            <View style={styles.eventDetailContainer}>
              <View style={[
                styles.eventDetailHeader,
                { backgroundColor: getCategoryColor(selectedEvent.category) }
              ]}>
                <View style={styles.eventDetailHeaderActions}>
                  <TouchableOpacity onPress={() => setEventModalVisible(false)}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                  
                  <View style={styles.eventDetailHeaderRight}>
                    <TouchableOpacity 
                      style={styles.eventDetailAction}
                      onPress={() => {
                        // In a real app, you would open an edit form
                        Alert.alert('Edit Event', 'Edit functionality would be implemented in a real app.');
                      }}
                    >
                      <Ionicons name="create-outline" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.eventDetailAction}
                      onPress={() => deleteEvent(selectedEvent.id)}
                    >
                      <Ionicons name="trash-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.eventDetailHeaderContent}>
                  <Ionicons name={getCategoryIcon(selectedEvent.category)} size={40} color="white" />
                  <View style={styles.eventDetailHeaderInfo}>
                    <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                    <Text style={styles.eventDetailCategory}>{selectedEvent.category}</Text>
                  </View>
                </View>
              </View>
              
              <ScrollView style={styles.eventDetailContent}>
                <View style={styles.eventDetailSection}>
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="calendar-outline" size={20} color="#555" />
                    <Text style={styles.eventDetailItemLabel}>Date:</Text>
                    <Text style={styles.eventDetailItemValue}>{formatDate(selectedEvent.date)}</Text>
                  </View>
                  
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="time-outline" size={20} color="#555" />
                    <Text style={styles.eventDetailItemLabel}>Time:</Text>
                    <Text style={styles.eventDetailItemValue}>
                      {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                    </Text>
                  </View>
                  
                  {selectedEvent.location && (
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="location-outline" size={20} color="#555" />
                      <Text style={styles.eventDetailItemLabel}>Location:</Text>
                      <Text style={styles.eventDetailItemValue}>{selectedEvent.location}</Text>
                    </View>
                  )}
                  
                  {selectedEvent.relatedCrop && (
                    <View style={styles.eventDetailItem}>
                      <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
                      <Text style={styles.eventDetailItemLabel}>Crop:</Text>
                      <Text style={styles.eventDetailItemValue}>{selectedEvent.relatedCrop}</Text>
                    </View>
                  )}
                  
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="alert-circle-outline" size={20} color={PRIORITY_COLORS[selectedEvent.priority]} />
                    <Text style={styles.eventDetailItemLabel}>Priority:</Text>
                    <Text style={[
                      styles.eventDetailItemValue,
                      { color: PRIORITY_COLORS[selectedEvent.priority] }
                    ]}>
                      {selectedEvent.priority}
                    </Text>
                  </View>
                  
                  <View style={styles.eventDetailItem}>
                    <Ionicons name="people-outline" size={20} color="#555" />
                    <Text style={styles.eventDetailItemLabel}>Labor:</Text>
                    <Text style={styles.eventDetailItemValue}>{selectedEvent.labor} person(s)</Text>
                  </View>
                  
                  <View style={styles.eventDetailStatus}>
                    <Text style={styles.eventDetailStatusLabel}>Status:</Text>
                    <View style={[
                      styles.eventStatusBadge,
                      { backgroundColor: selectedEvent.isCompleted ? '#4CAF50' : '#FF9800' }
                    ]}>
                      <Text style={styles.eventStatusText}>
                        {selectedEvent.isCompleted ? 'Completed' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {selectedEvent.description && (
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventDetailSectionTitle}>Description</Text>
                    <Text style={styles.eventDetailDescription}>{selectedEvent.description}</Text>
                  </View>
                )}
                
                {selectedEvent.notes && (
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventDetailSectionTitle}>Notes</Text>
                    <Text style={styles.eventDetailNotes}>{selectedEvent.notes}</Text>
                  </View>
                )}
                
                {selectedEvent.weatherDependent && (
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventDetailSectionTitle}>Weather Forecast</Text>
                    <View style={styles.eventWeatherForecast}>
                      <View style={styles.eventWeatherIcon}>
                        <Ionicons name="partly-sunny" size={40} color="#FF9800" />
                      </View>
                      
                      <View style={styles.eventWeatherInfo}>
                        <Text style={styles.eventWeatherTemp}>24°C</Text>
                        <Text style={styles.eventWeatherDescription}>Partly Cloudy</Text>
                        <Text style={styles.eventWeatherDetails}>
                          Humidity: 65% • Wind: 12 km/h
                        </Text>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.weatherAlert,
                      { backgroundColor: '#F44336' }
                    ]}>
                      <Ionicons name="warning-outline" size={20} color="white" />
                      <Text style={styles.weatherAlertText}>
                        Heavy rain expected on this day. Consider rescheduling.
                      </Text>
                    </View>
                  </View>
                )}
                
                {selectedEvent.relatedCrop && (
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventDetailSectionTitle}>Crop Information</Text>
                    <View style={styles.cropInfoCard}>
                      <Image 
                        source={{ uri: 'https://picsum.photos/id/136/300/200' }} 
                        style={styles.cropInfoImage} 
                      />
                      <View style={styles.cropInfoContent}>
                        <Text style={styles.cropInfoName}>{selectedEvent.relatedCrop}</Text>
                        <Text style={styles.cropInfoStatus}>Status: Growing (45%)</Text>
                        <View style={styles.cropProgressBar}>
                          <View style={[styles.cropProgressFill, { width: '45%' }]} />
                        </View>
                        <TouchableOpacity style={styles.viewCropButton}>
                          <Text style={styles.viewCropButtonText}>View Crop Details</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                
                <View style={styles.eventDetailSection}>
                  <Text style={styles.eventDetailSectionTitle}>Reminders</Text>
                  <View style={styles.reminderSettings}>
                    <View style={styles.reminderSetting}>
                      <Text style={styles.reminderSettingLabel}>Event Reminder</Text>
                      <Switch
                        value={selectedEvent.reminderSet}
                        onValueChange={(value) => {
                          setSelectedEvent({...selectedEvent, reminderSet: value});
                        }}
                        trackColor={{ false: '#ddd', true: '#4a6c2f50' }}
                        thumbColor={selectedEvent.reminderSet ? '#4a6c2f' : '#f4f3f4'}
                      />
                    </View>
                    
                    {selectedEvent.reminderSet && (
                      <View style={styles.reminderOptions}>
                        <TouchableOpacity style={styles.reminderOption}>
                          <Text style={styles.reminderOptionText}>1 day before</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.reminderOption, styles.reminderOptionSelected]}>
                          <Text style={styles.reminderOptionTextSelected}>2 hours before</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.reminderOption}>
                          <Text style={styles.reminderOptionText}>30 minutes before</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.eventDetailFooter}>
                <TouchableOpacity 
                  style={[
                    styles.eventActionButton,
                    selectedEvent.isCompleted ? styles.redoButton : styles.completeButton
                  ]}
                  onPress={() => toggleEventCompletion(selectedEvent.id)}
                >
                  <Ionicons 
                    name={selectedEvent.isCompleted ? 'refresh-outline' : 'checkmark-outline'} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.eventActionButtonText}>
                    {selectedEvent.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
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
          <Ionicons name="calendar" size={24} color="#4a6c2f" />
          <Text style={[styles.navText, styles.activeNavText]}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Crops')}
        >
          <Ionicons name="leaf-outline" size={24} color="#888" />
          <Text style={styles.navText}>Crops</Text>
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
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    padding: 8,
    marginLeft: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearSearch: {
    padding: 5,
  },
  calendarNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 5,
  },
  currentMonthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 10,
  },
  todayButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  viewModeContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewModeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeViewModeButton: {
    backgroundColor: '#4a6c2f',
  },
  viewModeText: {
    fontSize: 14,
    color: '#555',
  },
  activeViewModeText: {
    color: 'white',
    fontWeight: '500',
  },
  categoryFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryFilterText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 5,
  },
  showCompletedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 5,
  },
  showCompletedText: {
    fontSize: 14,
    color: '#555',
  },
  content: {
    paddingBottom: 100,
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayHeaderText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  notCurrentMonth: {
    opacity: 0.4,
  },
  notCurrentMonthText: {
    color: '#95a5a6',
  },
  selectedDay: {
    backgroundColor: '#4a6c2f',
    borderRadius: 20,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: '#4a6c2f',
    borderRadius: 20,
  },
  todayText: {
    color: '#4a6c2f',
    fontWeight: 'bold',
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 2,
  },
  eventIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 1,
  },
  multipleEventsIndicator: {
    backgroundColor: '#4a6c2f',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  eventCountText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  weekCalendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekDay: {
    alignItems: 'center',
  },
  weekDayName: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  weekDayNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 15,
  },
  selectedWeekDay: {
    backgroundColor: '#4a6c2f',
    borderRadius: 15,
  },
  selectedWeekDayText: {
    color: 'white',
  },
  todayWeekDay: {
    borderWidth: 1,
    borderColor: '#4a6c2f',
    borderRadius: 15,
  },
  todayWeekDayText: {
    color: '#4a6c2f',
  },
  weekDayEventIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4a6c2f',
    marginTop: 3,
  },
  weekEventsContainer: {
    maxHeight: 300,
    padding: 15,
  },
  weekDayEvents: {
    marginBottom: 15,
  },
  weekDayEventsHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  weekEvent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weekEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekEventTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  priorityIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  weekEventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 5,
  },
  weekEventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  weekEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 5,
  },
  weekEventDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  completedEvent: {
    backgroundColor: '#f5f5f5',
    borderLeftColor: '#95a5a6',
  },
  completedEventText: {
    color: '#95a5a6',
    textDecorationLine: 'line-through',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    borderRadius: 4,
  },
  uncompleteButton: {
    backgroundColor: '#F44336',
  },
  completeButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    marginLeft: 5,
  },
  dayCalendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noEventsText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 10,
  },
  addEventButton: {
    backgroundColor: '#4a6c2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  addEventButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dayEventsContainer: {
    maxHeight: 300,
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeSlotLabel: {
    width: 70,
    fontSize: 12,
    color: '#7f8c8d',
    paddingTop: 5,
  },
  timeSlotContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 10,
  },
  emptyTimeSlot: {
    height: 10,
  },
  timeSlotEvent: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  completedTimeSlotEvent: {
    opacity: 0.7,
  },
  timeSlotEventTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  timeSlotEventTime: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  timeSlotEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlotEventDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  agendaContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  agendaMonth: {
    marginBottom: 20,
  },
  agendaMonthHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  agendaDateGroup: {
    marginBottom: 15,
  },
  agendaDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  agendaDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginRight: 10,
  },
  agendaDateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  agendaEvent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedAgendaEvent: {
    backgroundColor: '#f5f5f5',
  },
  agendaEventCategory: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agendaEventContent: {
    flex: 1,
  },
  agendaEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  agendaEventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
    marginRight: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  agendaEventDetails: {
    marginBottom: 5,
  },
  agendaEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  agendaEventDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  agendaEventDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  agendaEventAction: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  resetFiltersButton: {
    backgroundColor: '#4a6c2f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  resetFiltersButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  eventSummaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  noEventsSummary: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noEventsSummaryText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
  },
  eventSummaryList: {
    maxHeight: 300,
  },
  eventSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  completedEventSummaryItem: {
    opacity: 0.7,
  },
  eventSummaryCategory: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  eventSummaryContent: {
    flex: 1,
  },
  eventSummaryItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 3,
  },
  eventSummaryDetails: {
    flexDirection: 'column',
  },
  eventSummaryDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  eventSummaryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventSummaryDetailText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  eventSummaryAction: {
    paddingLeft: 10,
  },
  viewAllEventsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 5,
  },
  viewAllEventsText: {
    fontSize: 14,
    color: '#4a6c2f',
    fontWeight: '500',
    marginRight: 5,
  },
  weatherContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  weatherAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherActionText: {
    fontSize: 14,
    color: '#4a6c2f',
    marginRight: 5,
  },
  weatherContent: {
    padding: 15,
  },
  todayWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  todayWeatherIcon: {
    marginRight: 15,
  },
  todayWeatherInfo: {
    flex: 1,
  },
  todayWeatherTemp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  todayWeatherDescription: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  todayWeatherDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  weatherForecastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  weatherForecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  forecastDay: {
    alignItems: 'center',
  },
  forecastDayName: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  forecastDayTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
    marginBottom: 2,
  },
  forecastDayCondition: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  weatherImpactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  weatherImpactContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  weatherImpactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  weatherImpactStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  weatherImpactContent: {
    flex: 1,
  },
  weatherImpactEvent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  weatherImpactDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  weatherImpactMessage: {
    fontSize: 12,
    color: '#34495e',
    lineHeight: 18,
  },
  noWeatherImpact: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noWeatherImpactText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    textAlign: 'center',
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
  formRow: {
    flexDirection: 'row',
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#555',
  },
  laborContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  laborOption: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  laborOptionSelected: {
    backgroundColor: '#4a6c2f',
    borderColor: '#4a6c2f',
  },
  laborOptionText: {
    fontSize: 16,
    color: '#555',
  },
  laborOptionTextSelected: {
    color: 'white',
  },
  laborHelperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#2c3e50',
  },
  switchHelperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
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
  eventDetailContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  eventDetailHeader: {
    padding: 15,
  },
  eventDetailHeaderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventDetailHeaderRight: {
    flexDirection: 'row',
  },
  eventDetailAction: {
    marginLeft: 20,
  },
  eventDetailHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailHeaderInfo: {
    marginLeft: 15,
  },
  eventDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  eventDetailCategory: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  eventDetailContent: {
    flex: 1,
  },
  eventDetailSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventDetailItemLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    width: 60,
    marginLeft: 10,
  },
  eventDetailItemValue: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  eventDetailStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  eventDetailStatusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginRight: 10,
  },
  eventStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  eventStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  eventDetailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  eventDetailDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
  },
  eventDetailNotes: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  eventWeatherForecast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventWeatherIcon: {
    marginRight: 15,
  },
  eventWeatherInfo: {
    flex: 1,
  },
  eventWeatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  eventWeatherDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  eventWeatherDetails: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  weatherAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  weatherAlertText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 10,
    flex: 1,
  },
  cropInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cropInfoImage: {
    width: 100,
    height: 100,
  },
  cropInfoContent: {
    flex: 1,
    padding: 10,
  },
  cropInfoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cropInfoStatus: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  cropProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 10,
  },
  cropProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  viewCropButton: {
    backgroundColor: '#4a6c2f',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  viewCropButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  reminderSettings: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  reminderSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderSettingLabel: {
    fontSize: 14,
    color: '#2c3e50',
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  reminderOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  reminderOptionSelected: {
    backgroundColor: '#4a6c2f',
    borderColor: '#4a6c2f',
  },
  reminderOptionText: {
    fontSize: 12,
    color: '#555',
  },
  reminderOptionTextSelected: {
    color: 'white',
  },
  eventDetailFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  eventActionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  redoButton: {
    backgroundColor: '#F44336',
  },
  eventActionButtonText: {
    fontSize: 16,
    color: 'white',
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

export default Calendar;