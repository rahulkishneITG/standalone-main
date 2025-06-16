// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import Dashboard from './components/Main Content/Dashboard/Dashboard'; 
import { Toaster } from 'react-hot-toast';
import FullPageLoader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayouts';
import Event from './components/Main Content/Event/Event';
import Attendee from './components/Main Content/Attendee/Attendee';
import CreateEvent from './components/Main Content/Event/Create Event/CreateEvent';
import EditEvent from './components/Main Content/Event/Edit Event/EditEvent';
import EventList from './components/Main Content/Event/EventList/EventList';
import { PageNotFound } from './components/404Page/PageNotFound';

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
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ProtectedLayout/>
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
