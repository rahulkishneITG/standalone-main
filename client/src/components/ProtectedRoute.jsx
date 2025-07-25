import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import FullPageLoader from './Loader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader/>;

  return user ? children : <Navigate to="/login" replace />;
}
