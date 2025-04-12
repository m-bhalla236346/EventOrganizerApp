import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';  // Make sure this is your firebase configuration

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading after auth state is checked
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

  const logout = () => {
    signOut(auth)
      .then(() => console.log('User signed out successfully.'))
      .catch((error) => console.error('Error during sign out: ', error));
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
