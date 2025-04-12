import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CreateEditEventScreen from '../screens/CreateEditEventScreen';
import FavoriteEventsScreen from '../screens/FavoriteEventsScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading screen while Firebase is checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a000c8" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {!user ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CreateEditEvent" component={CreateEditEventScreen} />
          <Stack.Screen name="FavoriteEvents" component={FavoriteEventsScreen} />
          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;