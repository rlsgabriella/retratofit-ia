import { PrismaClient } from '@prisma/client';
import { harnessFailover } from '../harness/index.js';
import { montarPayload } from '../harness/contextManager.js';
import { salvarResumoUsuario } from '../harness/memory.js';

const prisma = new PrismaClient();

export async function analisarFoto(userId, photoId, imagemBase64) {
  const fotoExistente = await prisma.photo.findFirst({ where: { id: photoId, userId } });
  if (!fotoExistente) {
    const err = new Error('Foto não encontrada ou sem permissão');
    err.status = 404;
    throw err;
  }

  if (fotoExistente.analysis) {
    return fotoExistente.analysis;
  }

  const payload = await montarPayload(userId, [imagemBase64]);
  const resultado = await harnessFailover(payload);

  const analysis = await prisma.analysis.create({
    data: {
      photoId,
      resumoTexto: resultado.resumoTexto,
      mudancasDetectadas: resultado.mudancasDetectadas,
      regioesComMudanca: resultado.regioesComMudanca,
      nivelConfianca: resultado.nivelConfianca,
      modeloUsado: resultado.modeloUsado,
    },
  });

  await salvarResumoUsuario(userId, resultado.resumoTexto);

  return analysis;
}

export async function buscarAnalise(photoId, userId) {
  const analysis = await prisma.analysis.findFirst({
    where: { photoId, photo: { userId } },
  });
  if (!analysis) {
    const err = new Error('Análise não encontrada');
    err.status = 404;
    throw err;
  }
  return analysis;
}
