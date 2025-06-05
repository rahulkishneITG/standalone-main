// App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import Dashboard from './components/Dashboard';
import { Toaster } from 'react-hot-toast';
import FullPageLoader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  const { loading } = useLoader();
  return (
    <>
      {loading && <FullPageLoader />}
      <Toaster position="top-center" />
      <AuthProvider>
        <AppProvider i18n={enTranslations}>
          <Router>
            <div className="main-container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Login />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Login />
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <LoaderProvider>
      <AppWrapper />
    </LoaderProvider>
  );
}

export default App;
