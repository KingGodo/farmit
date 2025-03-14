import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WeatherCard = ({ loading, weatherData }) => {
  const weatherConditions = {
    clear: { description: 'Clear Sky', icon: 'sunny-outline', color: '#FFD54F' },
    clouds: { description: 'Cloudy', icon: 'cloudy-outline', color: '#90A4AE' },
    rain: { description: 'Rainy', icon: 'rainy-outline', color: '#64B5F6' },
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud-outline" size={40} color="#4a6c2f" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.weatherContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
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
    marginTop: 10,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  weatherDetailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  weatherIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherForecast: {
    marginTop: 15,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 16,
    color: '#333',
  },
  forecastTempMin: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  weatherButton: {
    backgroundColor: '#4a6c2f',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  weatherButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeatherCard;