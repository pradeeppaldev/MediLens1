import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Rich Realistic Indian Clinical Profiles for Evaluation
export const DEMO_PROFILES = {
  patient: {
    uid: 'demo_patient_aarav',
    displayName: 'Aarav Sharma',
    email: 'demo@medilens.in',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    bloodGroup: 'B+',
    age: 38,
    gender: 'Male',
    phone: '+91 98765 43210',
    city: 'Bengaluru, Karnataka',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Type 2 Diabetes', 'Hypertension (Stage 1)'],
    emergencyContact: 'Priya Sharma (Spouse) - +91 98765 43211',
    insuranceProvider: 'Star Health Premier Gold (#SH-IND-884920)',
    primaryPhysician: 'Dr. Rajesh Sharma, MD (AIIMS New Delhi)',
    isDemo: true,
    role: 'patient',
    createdAt: new Date('2024-01-15'),
  },
  doctor: {
    uid: 'demo_doctor_rajesh',
    displayName: 'Dr. Rajesh Sharma, MD',
    email: 'dr.rajesh@medilens.in',
    photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    bloodGroup: 'O+',
    specialty: 'Senior Interventional Cardiologist',
    hospital: 'AIIMS New Delhi, Ansari Nagar',
    phone: '+91 11 2658 8500',
    licenseNumber: 'MCI-DEL-2011-89321',
    isDemo: true,
    role: 'doctor',
    createdAt: new Date('2023-06-10'),
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedDemo = localStorage.getItem('medilens_demo_user');
      return savedDemo ? JSON.parse(savedDemo) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Function to create user document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user || user.isDemo) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        const { displayName, email, photoURL } = user;
        await setDoc(userDocRef, {
          displayName: displayName || additionalData.displayName || 'Patient',
          email,
          photoURL: photoURL || '',
          createdAt: new Date(),
          lastLogin: new Date(),
          bloodGroup: 'B+',
          city: 'Bengaluru, India',
          ...additionalData
        });
      } else {
        await setDoc(userDocRef, {
          lastLogin: new Date()
        }, { merge: true });
      }
      return userDocRef;
    } catch (error) {
      console.warn('Firebase Firestore user doc notice:', error?.message);
    }
  };

  const demoLogin = (role = 'patient') => {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.patient;
    setUser(profile);
    try {
      localStorage.setItem('medilens_demo_user', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save demo user in localStorage', e);
    }
    return Promise.resolve({ user: profile });
  };

  const register = async (email, password, displayName) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;
      
      await updateProfile(user, { displayName });
      await createUserDocument(user, { displayName });
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    // Check for demo credentials bypass
    const cleanEmail = email?.trim()?.toLowerCase();
    if (
      cleanEmail === 'demo@medilens.in' ||
      cleanEmail === 'demo@example.com' ||
      cleanEmail === 'demo@medilens.io' ||
      cleanEmail === 'patient@medilens.in'
    ) {
      return demoLogin('patient');
    }
    if (cleanEmail === 'doctor@medilens.in' || cleanEmail === 'dr.rajesh@medilens.in') {
      return demoLogin('doctor');
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      localStorage.removeItem('medilens_demo_user');
      await createUserDocument(user);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('medilens_demo_user');
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.warn('SignOut note:', error?.message);
      setUser(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      localStorage.removeItem('medilens_demo_user');
      await createUserDocument(user);
      return response;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const guestLogin = () => {
    return demoLogin('patient');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        localStorage.removeItem('medilens_demo_user');
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists()) {
            setUser({
              ...firebaseUser,
              ...userSnapshot.data()
            });
          } else {
            setUser(firebaseUser);
          }
        } catch (error) {
          console.warn('Error fetching Firestore user profile:', error?.message);
          setUser(firebaseUser);
        }
      } else {
        // If not signed in via Firebase, check if demo user was active
        const savedDemo = localStorage.getItem('medilens_demo_user');
        if (savedDemo) {
          try {
            setUser(JSON.parse(savedDemo));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    demoLogin,
    logout,
    signInWithGoogle,
    guestLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
