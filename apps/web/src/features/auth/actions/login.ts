'use server';

import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';

export async function loginUser(data: FormData) {
  const email = data.get('email') as string;
  const password = data.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Faltan credenciales' };
  }

  // Mantenemos los usuarios de prueba solicitados
  if (email === 'admin@stactical.com' && password === 'admin123') {
    return {
      success: true,
      user: { id: '1', name: 'Admin User', email: 'admin@stactical.com', role: 'ADMIN' },
    };
  }

  if (email === 'customer@stactical.com' && password === 'customer123') {
    return {
      success: true,
      user: { id: '2', name: 'Cliente de Prueba', email: 'customer@stactical.com', role: 'CUSTOMER' },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.hashedPassword) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    // Verify password
    const [salt, storedKey] = user.hashedPassword.split(':');
    if (!salt || !storedKey) {
      return { success: false, error: 'Credenciales inválidas' };
    }
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');

    if (derivedKey !== storedKey) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}
