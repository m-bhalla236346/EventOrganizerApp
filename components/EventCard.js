import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EventCard = ({ event, onPress, onFavoriteToggle, isFavorite, onRemoveFavorite }) => {
  const navigation = useNavigation();

  const formattedDate = event.date
    ? new Date(event.date.seconds * 1000).toLocaleDateString()
    : 'No Date';
  const formattedTime = event.time
    ? new Date(event.time.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'No Time';

  const handlePress = () => {
    navigation.navigate('EventDetails', { eventId: event.id });
    if (onPress) onPress();
  };

  const handleRemoveFavorite = () => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this event from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove', // <-- Capitalized
          onPress: () => {
            if (onRemoveFavorite) onRemoveFavorite(event.id); // Call parent function
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={require('../assets/image.png')} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.datetime}>{`${formattedDate}, ${formattedTime}`}</Text>

        <View style={styles.infoRow}>
          <View style={styles.iconRow}>
            <Image source={require('../assets/avatar.png')} style={styles.avatar} />
            <Text style={styles.infoText}>+52 Attendees</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={isFavorite ? handleRemoveFavorite : onFavoriteToggle}
        >
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={18}
            color={isFavorite ? 'red' : '#555'}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.favoriteText}>
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <Text onPress={handlePress} style={styles.viewDetails}>
          ➕ View Details
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  image: {
    width: 100,
    height: 130,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  datetime: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#555',
  },
  favoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  favoriteText: {
    fontSize: 12,
    color: '#555',
  },
  viewDetails: {
    marginTop: 5,
    fontSize: 13,
    color: '#a000c8',
    fontWeight: '600',
  },
});

export default EventCard;
