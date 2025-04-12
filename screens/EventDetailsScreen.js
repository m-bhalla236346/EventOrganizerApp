import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Image,
  ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { db } from '../firebase';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';  // Material Icons for Edit and Delete
import { useIsFocused } from '@react-navigation/native';  // Import this hook

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params || {};
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused(); // Hook to detect when the screen is focused

  // Fetch event details
  const fetchEventDetails = async () => {
    if (!eventId) {
      console.warn('eventId is missing');
      setLoading(false);
      return;
    }

    try {
      const ref = doc(db, 'events', eventId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.warn('Event not found');
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.date instanceof Timestamp) {
        data.date = data.date.toDate();
      }
      if (data.time instanceof Timestamp) {
        data.time = data.time.toDate();
      }

      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch event when screen is focused or eventId changes
  useEffect(() => {
    fetchEventDetails();
  }, [eventId, isFocused]); // Add isFocused as a dependency

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
            try {
              await deleteDoc(doc(db, 'events', eventId));
              navigation.goBack();  // Go back after deletion
            } catch (error) {
              console.error('Error deleting event: ', error);
            }
          }
        },
      ],
      { cancelable: false }
    );
  };

  const handleEdit = () => {
    navigation.navigate('CreateEditEvent', { eventId });  // Navigate to edit screen
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />;
  }
  if (!event) {
    return <Text style={styles.errorText}>Event not found</Text>;
  }

  const formattedDate = event.date instanceof Date
    ? event.date.toLocaleDateString()
    : 'N/A';
  const formattedTime = event.time instanceof Date
    ? event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/avatar1.png')} style={styles.heroImage} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.eventTitle}>{event.title || 'Untitled Event'}</Text>
        <Text style={styles.eventType}>{event.eventType || 'General'}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Event Schedule</Text>
          <View style={styles.schedule}>
            <Text style={styles.cardContent}>
              <Text style={styles.bold}>Date:</Text> {formattedDate}
            </Text>
            <Text style={styles.cardContent}>
              <Text style={styles.bold}>Time:</Text> {formattedTime}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Event Description</Text>
          <Text style={styles.cardContent}>{event.description || 'No description provided.'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Event Location</Text>
          <Text style={styles.cardContent}>
            <Text style={styles.bold}>Location:</Text> {event.location || 'Not specified'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center' },
  container: { 
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa', 
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth: 4,
    borderColor: '#a000c8',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a000c8',
    marginBottom: 8,
    textAlign: 'center',
  },
  eventType: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#a000c8',
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  schedule: {
    paddingLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    marginTop: -10,
  },
  editButton: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 100,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default EventDetailsScreen;
