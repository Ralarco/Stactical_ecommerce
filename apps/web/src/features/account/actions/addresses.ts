'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getAddresses(userId: string) {
  if (!userId) return [];
  try {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

export async function createAddress(userId: string, data: FormData) {
  if (!userId) return { success: false, error: 'Usuario no autenticado' };

  const title = data.get('title') as string;
  const street = data.get('street') as string;
  const city = data.get('city') as string;
  const region = data.get('region') as string;
  const isDefault = data.get('isDefault') === 'on';

  if (!title || !street || !city || !region) {
    return { success: false, error: 'Faltan campos obligatorios' };
  }

  try {
    // Si la nueva dirección es la predeterminada, quitamos el flag a las demás
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId,
        title,
        street,
        city,
        region,
        isDefault,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error creating address:', error);
    return { success: false, error: 'Error al guardar la dirección' };
  }
}

export async function deleteAddress(userId: string, addressId: string) {
  if (!userId) return { success: false, error: 'Usuario no autenticado' };

  try {
    await prisma.address.delete({
      where: { id: addressId, userId },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: 'Error al eliminar la dirección' };
  }
}

export async function setDefaultAddress(userId: string, addressId: string) {
  if (!userId) return { success: false, error: 'Usuario no autenticado' };

  try {
    // Quitamos el flag a todas
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Se lo ponemos a la seleccionada
    await prisma.address.update({
      where: { id: addressId, userId },
      data: { isDefault: true },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error setting default address:', error);
    return { success: false, error: 'Error al actualizar la dirección predeterminada' };
  }
}
