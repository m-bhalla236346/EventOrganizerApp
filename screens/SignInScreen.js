import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields.');
    await signIn(email, password);
  };

  return (
    <View style={styles.container}>
      {/* Soft Gradient Background */}
      <Svg height="100%" width="100%" style={styles.svgBackground}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#f1faee" stopOpacity="1" />
            <Stop offset="100%" stopColor="#e0c3fc" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad1)" />
      </Svg>

      {/* Form Overlay */}
      <View style={styles.overlay}>
        <Image source={require('../assets/login.png')} style={styles.loginIcon} />
        <Text style={styles.header}>Ready to Organize? Go Ahead!!</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('SignUp')}
        >
          Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loginIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b0082',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: '#a000c8',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#333',
    textAlign: 'center',
    fontSize: 15,
  },
  linkHighlight: {
    color: '#a000c8',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
