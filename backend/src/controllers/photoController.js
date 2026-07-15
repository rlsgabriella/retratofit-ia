import { uploadFoto, listarFotosUsuario, buscarFotoPorId } from '../services/photoService.js';

export async function uploadPhoto(req, res, next) {
  try {
    const userId = req.auth.userId;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
    const photo = await uploadFoto(userId, req.file.buffer, req.file.mimetype);
    res.status(201).json(photo);
  } catch (err) {
    next(err);
  }
}

export async function getPhotos(req, res, next) {
  try {
    const userId = req.auth.userId;
    const photos = await listarFotosUsuario(userId);
    res.json(photos);
  } catch (err) {
    next(err);
  }
}

export async function getPhoto(req, res, next) {
  try {
    const userId = req.auth.userId;
    const photo = await buscarFotoPorId(req.params.id, userId);
    res.json(photo);
  } catch (err) {
    next(err);
  }
}
