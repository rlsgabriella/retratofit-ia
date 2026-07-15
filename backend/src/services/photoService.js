import { PrismaClient } from '@prisma/client';
import { supabase } from '../config/supabase.js';

const prisma = new PrismaClient();

export async function uploadFoto(userId, buffer, mimetype) {
  const nomeArquivo = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('fotos')
    .upload(nomeArquivo, buffer, { contentType: mimetype, upsert: false });

  if (error) throw new Error(`Falha no upload: ${error.message}`);

  const { data: urlData } = supabase.storage.from('fotos').getPublicUrl(nomeArquivo);

  const photo = await prisma.photo.create({
    data: { url: urlData.publicUrl, userId },
  });

  return photo;
}

export async function listarFotosUsuario(userId) {
  return prisma.photo.findMany({
    where: { userId },
    include: { analysis: true },
    orderBy: { criadaEm: 'desc' },
  });
}

export async function buscarFotoPorId(photoId, userId) {
  const photo = await prisma.photo.findFirst({
    where: { id: photoId, userId },
    include: { analysis: true },
  });
  if (!photo) {
    const err = new Error('Foto não encontrada');
    err.status = 404;
    throw err;
  }
  return photo;
}
