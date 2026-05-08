import type { Metadata } from 'next';
import RegisterForm from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Crear Cuenta',
  description: 'Regístrate en Stactical',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
