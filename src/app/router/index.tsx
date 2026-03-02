import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { SystemsListPage } from '@/features/systems/pages/SystemsListPage';
import { CreateSystemPage } from '@/features/systems/pages/CreateSystemPage';
import { EditSystemPage } from '@/features/systems/pages/EditSystemPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/systems" element={<SystemsListPage />} />
            <Route path="/systems/new" element={<CreateSystemPage />} />
            <Route path="/systems/:id/edit" element={<EditSystemPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
