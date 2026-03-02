import { useAuthStore } from '../store/authStore';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, RegisterCredentials } from '../types';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    },
  });

  const logout = () => {
    logoutStore();
    navigate('/auth/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
