'use server';

import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';

export async function registerUser(data: FormData) {
  const name = data.get('name') as string;
  const email = data.get('email') as string;
  const password = data.get('password') as string;
  const company = data.get('company') as string; // Optional

  if (!name || !email || !password) {
    return { success: false, error: 'Faltan campos obligatorios' };
  }

  if (password.length < 8) {
    return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'El correo electrónico ya está registrado' };
    }

    // Hash password using crypto.scrypt
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashedPassword = `${salt}:${derivedKey}`;

    // Note: Since organization logic is required if company is provided,
    // we could create an Organization, but the schema allows organizationId to be null.
    let organizationId = null;

    if (company && company.trim() !== '') {
      const newOrg = await prisma.organization.create({
        data: {
          name: company,
          contactEmail: email,
        },
      });
      organizationId = newOrg.id;
    }

    // Create User
    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: 'CUSTOMER',
        customerType: company ? 'BUSINESS' : 'INDIVIDUAL',
        organizationId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Hubo un problema al crear la cuenta' };
  }
}
