import type { Metadata } from 'next';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Accede a tu cuenta en Stactical',
};

export default function LoginPage() {
  return <LoginForm />;
}
