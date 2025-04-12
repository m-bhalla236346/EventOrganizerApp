import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EventCard from '../components/EventCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const FavoriteEventsScreen = ({ route, navigation }) => {
  const { favorites, setFavorites } = route.params; // Get favorites and setFavorites from route.params

  const [eventDetails, setEventDetails] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);
        const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEventDetails(events);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEventDetails();
  }, []);

  const favoriteEvents = eventDetails.filter(event => favorites[event.id]);

  const handleFavoriteToggle = (id) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this event from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedFavorites = { ...favorites };
            delete updatedFavorites[id]; // Remove from favorites

            // Update state and remove event from favoriteEvents list
            setFavorites(updatedFavorites); // Update the parent's state

            // Optional: Remove the event from the favoriteEvents list immediately to update UI
            const updatedFavoriteEvents = favoriteEvents.filter(event => event.id !== id);
            setEventDetails(updatedFavoriteEvents); // Update the event details list to reflect the change
          },
          style: 'destructive', 
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <EventCard
        event={item}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
        onFavoriteToggle={() => handleFavoriteToggle(item.id)}
        isFavorite={favorites[item.id]} // Determine if event is a favorite
      />
      <TouchableOpacity
        style={styles.unfavouriteButton}
        onPress={() => handleFavoriteToggle(item.id)}
      >
        <Icon name="heart-dislike-outline" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Events</Text>
      {favoriteEvents.length === 0 ? (
        <Text style={styles.noFavoritesText}>No event is added as a favorite yet!</Text>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1faee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#a000c8',
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  unfavouriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: '#ff4d4d',
    borderRadius: 50,
    marginRight: 30,
    marginTop: 35,
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FavoriteEventsScreen;
