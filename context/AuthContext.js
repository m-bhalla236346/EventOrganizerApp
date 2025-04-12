import React, { createContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully.');
    } catch (error) {
      console.error('Error during sign in: ', error.message);
      alert('Error: ' + error.message);
    }
  };

  const signUp = async (email, password) => {
    try {
      // Check if email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert('Email is already in use.');
        return;
      }

      // If email is not already in use, proceed to create the user
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully.');
      return 'success';  // Indicate success
    } catch (error) {
      console.error('Error during sign up: ', error.message);
      alert('Error: ' + error.message);
      return 'error';  // Indicate error
    }
  };

  const logout = () => {
    signOut(auth)
      .then(() => console.log('User signed out successfully.'))
      .catch((error) => console.error('Error during sign out: ', error));
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
