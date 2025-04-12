import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'; // Import Firebase Auth methods

const SignUpScreen = ({ navigation }) => {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { label: 'Weak', color: 'red', width: '33%' };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
      return { label: 'Strong', color: 'green', width: '100%' };
    return { label: 'Medium', color: 'orange', width: '66%' };
  };

  const handleSignUp = async () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
  
    try {
      const auth = getAuth(); // Initialize Firebase Auth instance

      // Check if email is already registered in Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        // Email is already in use
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'This email is already registered. Please log in.'
        }));
        return; // Don't proceed with sign up
      }
  
      // Proceed with sign up if email is not already in use
      await createUserWithEmailAndPassword(auth, email, password);
      setIsSignUpSuccessful(true);
      Alert.alert('Congratulations! You have signed up successfully!');
  
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'This email is already registered. Please log in.'
        }));
      } else {
        Alert.alert('Signup Failed', error.message);
      }
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Image source={require('../assets/signup.png')} style={styles.loginIcon} />
          <Text style={styles.header}>Join Organizer Account</Text>

          <View style={styles.formCard}>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (!text) setErrors((prev) => ({ ...prev, name: 'Name is required.' }));
                else setErrors((prev) => ({ ...prev, name: '' }));
              }}
              style={styles.input}
            />
            {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (!validateEmail(text)) setErrors((prev) => ({ ...prev, email: 'Enter a valid email.' }));
                else setErrors((prev) => ({ ...prev, email: '' }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (text.length < 6)
                    setErrors((prev) => ({ ...prev, password: 'Minimum 6 characters.' }));
                  else setErrors((prev) => ({ ...prev, password: '' }));
                }}
                secureTextEntry={!showPassword}
                style={styles.inputPassword}
              />
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#888"
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            <View style={styles.strengthBar}>
              <View
                style={{
                  width: passwordStrength.width,
                  backgroundColor: passwordStrength.color,
                  height: 8,
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ marginBottom: 6, color: passwordStrength.color }}>
              {password ? `Password Strength: ${passwordStrength.label}` : ''}
            </Text>
            {errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (text !== password)
                  setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
                else setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            {errors.confirmPassword ? <Text style={styles.error}>{errors.confirmPassword}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => {
                  if (isSignUpSuccessful) {
                    // Navigate only when the signup is successful
                    navigation.navigate('SignIn');
                  }
                }}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loginIcon: {
    width: 120,
    height: 120,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4b0082',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    width: '110%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 6,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  strengthBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#a000c8',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#4b0082',
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 12,
    color: 'green',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SignUpScreen;