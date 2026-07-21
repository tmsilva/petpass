/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore, setupFirestoreListeners } from './store/useStore';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import PetsList from './pages/PetsList';
import PetProfile from './pages/PetProfile';
import Vaccines from './pages/Vaccines';
import MedicalHistory from './pages/MedicalHistory';
import Medications from './pages/Medications';
import Documents from './pages/Documents';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Settings from './pages/Settings';

export default function App() {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeListeners: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Tutor',
        });
        unsubscribeListeners = setupFirestoreListeners(firebaseUser.uid);
      } else {
        setUser(null);
        if (unsubscribeListeners) {
          unsubscribeListeners();
          unsubscribeListeners = null;
        }
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      if (unsubscribeListeners) unsubscribeListeners();
    };
  }, [setUser]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pets" element={<PetsList />} />
            <Route path="/pets/:id" element={<PetProfile />} />
            <Route path="/vaccines" element={<Vaccines />} />
            <Route path="/history" element={<MedicalHistory />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}
