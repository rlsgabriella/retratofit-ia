import { analisarFoto, buscarAnalise } from '../services/analysisService.js';

export async function criarAnalise(req, res, next) {
  try {
    const userId = req.auth.userId;
    const { photoId, imagemBase64 } = req.body;
    if (!photoId || !imagemBase64) {
      return res.status(400).json({ error: 'photoId e imagemBase64 são obrigatórios' });
    }
    const analysis = await analisarFoto(userId, photoId, imagemBase64);
    res.status(201).json(analysis);
  } catch (err) {
    next(err);
  }
}

export async function getAnalise(req, res, next) {
  try {
    const userId = req.auth.userId;
    const analysis = await buscarAnalise(req.params.photoId, userId);
    res.json(analysis);
  } catch (err) {
    next(err);
  }
}
