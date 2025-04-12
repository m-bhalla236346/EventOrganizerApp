import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { db } from '../firebase';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CreateEditEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useContext(AuthContext);

  // Retrieve eventId from route parameters (if passed)
  const { eventId } = route.params || {};

  // States to store event data
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [time, setTime] = useState(new Date());
  const [eventType, setEventType] = useState('Conference');
  const [customEventType, setCustomEventType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);

  const eventTypes = ['Conference', 'Workshop', 'Meetup', 'Festival', 'Celebration', 'Music Event', 'Other'];

  useEffect(() => {
    // If eventId exists, fetch the event data from Firestore
    if (eventId) {
      setEditMode(true);
      const fetchEvent = async () => {
        try {
          const eventRef = doc(db, 'events', eventId);
          const eventDoc = await getDoc(eventRef);
          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            setTitle(eventData.title);
            setDescription(eventData.description);
            setLocation(eventData.location);
            setDate(new Date(eventData.date.seconds * 1000)); // Convert Firestore timestamp to Date
            setTime(new Date(eventData.time.seconds * 1000));  // Convert Firestore timestamp to Date
            setEventType(eventData.eventType);
            setCustomEventType(eventData.eventType === 'Other' ? eventData.customEventType : '');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to load event data.');
        }
      };
      fetchEvent();
    } else {
      setEditMode(false);
    }
  }, [eventId]);

  const handleSubmit = async () => {
    if (!title || !description || !location || !time || !eventType || (eventType === 'Other' && !customEventType)) {
      Alert.alert('Validation Error', 'Please fill out all fields.');
      return;
    }

    try {
      const eventData = {
        title,
        description,
        location,
        eventType: eventType === 'Other' ? customEventType : eventType,
        date,
        time,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      if (editMode) {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, eventData);
        Alert.alert('Success', 'Event updated successfully!');
      } else {
        await addDoc(collection(db, 'events'), eventData);
        Alert.alert('Success', 'Event created successfully!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDateChange = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const handleTimeChange = (selectedTime) => {
    setShowTimePicker(false);
    setTime(selectedTime);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Event Type Dropdown */}
        <Text style={styles.label}>Event Type</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowEventTypeModal(true)}>
          <MaterialCommunityIcons name="tune" size={20} color="#7C7C7C" style={styles.icon} />
          <Text style={styles.selectedText}>{eventType}</Text>
        </TouchableOpacity>

        {/* Event Type Modal */}
        <Modal
          transparent={true}
          visible={showEventTypeModal}
          onRequestClose={() => setShowEventTypeModal(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              {eventTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setEventType(type);
                    if (type !== 'Other') setCustomEventType(''); // Clear custom type if not "Other"
                    setShowEventTypeModal(false);
                  }}>
                  <Text style={styles.modalOptionText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Custom Event Type Input (only shown when "Other" is selected) */}
        {eventType === 'Other' && (
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#7C7C7C" style={styles.icon} />
            <TextInput
              placeholder="Enter Custom Event Type"
              style={styles.input}
              value={customEventType}
              onChangeText={setCustomEventType}
            />
          </View>
        )}

        <Text style={styles.label}>Event Title</Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#7C7C7C" style={styles.icon} />
          <TextInput
            placeholder="Event Title"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <Text style={styles.label}>Location</Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color="#7C7C7C" style={styles.icon} />
          <TextInput
            placeholder="Location"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <Text style={styles.label}>Event Time</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.inputWrapper}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#7C7C7C" style={styles.icon} />
          <Text style={styles.dateText}>{time.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showTimePicker}
          mode="time"
          date={time}
          onConfirm={handleTimeChange}
          onCancel={() => setShowTimePicker(false)}
        />

        <Text style={styles.label}>Event Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputWrapper}>
          <MaterialCommunityIcons name="calendar-outline" size={20} color="#7C7C7C" style={styles.icon} />
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          date={date}
          onConfirm={handleDateChange}
          onCancel={() => setShowDatePicker(false)}
        />

        <Text style={styles.label}>Description</Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="text-box-outline" size={20} color="#7C7C7C" style={styles.icon} />
          <TextInput
            placeholder="Event Description"
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{editMode ? 'Update Event' : 'Create Event'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 20,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 0,
    color: '#333',
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  icon: {
    marginLeft: 10,
  },
  multiline: {
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#a000c8',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CreateEditEventScreen;
