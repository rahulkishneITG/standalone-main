// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import Dashboard from './pages/Dashboard/Dashboard';
import { Toaster } from 'react-hot-toast';
import FullPageLoader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayouts';
import Event from './pages/Event/Event';
import Attendee from './pages/Attendee/Attendee';
import CreateEvent from './pages/Event/Create Event/CreateEvent';
import EditEvent from './pages/Event/Edit Event/EditEvent';
import EventList from './pages/Event/EventList/EventList';
import { PageNotFound } from './pages/404Page/PageNotFound';
import SettingsPage from './pages/Settings/SettingsPage';
import Walkin from './pages/Walkin/Walkin';
import WalkinForm from './pages/Walkin/WalkinForm/WalkinForm';
import WalkinList from './pages/Walkin/WalkinList/WalkinList';
import Email from './pages/Emails/Email';
import PublicRoute from './components/PublicRoute';

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
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                    <Login />
                    </PublicRoute>
                  }
                />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ProtectedLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="event" element={<Event />}>
                    <Route index element={<EventList />} />
                    <Route path="create" element={<CreateEvent />} />
                    <Route path="edit/:id" element={<EditEvent />} />
                  </Route>
                  <Route path="attendee" element={<Attendee />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="walkin" element={<Walkin />}>
                    <Route index element={<WalkinList />} />
                    <Route path="walkin-form/:walkinId" element={<WalkinForm />} />
                    <Route path="edit/:id" element={<EditEvent />} />
                  </Route>
                  <Route path="email" element={<Email />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
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
