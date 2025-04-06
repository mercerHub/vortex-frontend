// hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectUser, 
  selectIsAuthenticated, 
  selectAuthLoading, 
  selectAuthError,
  login,
  logoutUser as logout,
  fetchCurrentUser
} from '../redux/features/auth/authSlice';
import { AppDispatch } from '../redux/store';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const loginUser = (credentials: LoginCredentials) => {
    return dispatch(login(credentials));
  };

  const logoutUser = () => {
    return dispatch(logout());
  };

  const refreshUser = () => {
    return dispatch(fetchCurrentUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    logout: logoutUser,
    refreshUser
  };
};