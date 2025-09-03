// AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Import Firebase methods
import { auth } from '../firebase'; 
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

// 2. (Optional) Firestore imports if you want to store user data
// Make sure db is exported from ../firebase (e.g., export const db = getFirestore(app);)
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 3. Listen for Firebase auth changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  // 4. Log In (Email/Password)
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/');
  };

  // 5. Log Out
  const logout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // 6. Sign Up (Create Account)
  //    Also stores a user document in Firestore (optional)
  const signup = async (email, password) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Optional: store user info in Firestore
    // Remove or adjust if you don't want/need this
    await setDoc(doc(db, 'users', userCred.user.uid), {
      email: userCred.user.email,
      createdAt: new Date(),
    });

    navigate('/');
  };

  // 7. Password Reset (Forgot Password)
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    // No redirect here—often you just show a success message
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        signup,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
