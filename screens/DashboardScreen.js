import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../components/EventCard';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen = () => {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
    });

    return unsubscribe;
  }, []);

  const toggleFavorite = (eventId) => {
    setFavorites((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const removeFavorite = (eventId) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      delete updatedFavorites[eventId];
      return updatedFavorites;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.toolbar}>
        <Text style={styles.title}>Event Organizer App</Text>
        <View style={styles.iconsContainer}>
          {/* Heart Icon for Favorites */}
          <TouchableOpacity
            onPress={() => navigation.navigate('FavoriteEvents', { favorites, setFavorites })}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name="heart"
              size={30}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.iconText}>Favorites</Text>
          </TouchableOpacity>

          {/* Logout Icon */}
          <TouchableOpacity onPress={logout} style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="logout"
              size={30}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.iconText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scheduled Events Heading */}
      <Text style={styles.scheduledEventsTitle}>Scheduled Events</Text>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
            onFavoriteToggle={() => toggleFavorite(item.id)}
            isFavorite={favorites[item.id]}
            onRemoveFavorite={removeFavorite}
          />
        )}
        contentContainerStyle={styles.eventList}
      />

      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.createEventButton}
        onPress={() => navigation.navigate('CreateEditEvent')}>
        <Text style={styles.createEventButtonText}>Create Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1faee',
    paddingBottom: 20,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a000c8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '45%',
  },
  iconContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  icon: {
    marginBottom: 5,
  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  scheduledEventsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  eventList: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  createEventButton: {
    backgroundColor: '#a000c8',
    paddingVertical: 14,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  createEventButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
