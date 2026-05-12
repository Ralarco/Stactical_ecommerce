'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { handleAction } from '@/lib/errors/error-handler';
import { existsSync } from 'fs';

export async function uploadImageAction(formData: FormData) {
  return handleAction(async () => {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = join(uploadsDir, uniqueName);
    
    await writeFile(filePath, buffer);
    
    return `/uploads/${uniqueName}`;
  });
}
