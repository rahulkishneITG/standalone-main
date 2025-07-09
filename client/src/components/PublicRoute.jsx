// components/PublicRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FullPageLoader from './Loader';

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <FullPageLoader/>;
  return user ? <Navigate to="/" replace /> : children;
}
