import axios from 'axios';
import type { Photo, Analysis, User } from '../types';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(async (config) => {
  // O token Clerk é injetado pelos hooks que usam esta instância
  return config;
});

export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function syncUser(payload: { email: string; nome?: string }): Promise<User> {
  const { data } = await api.post<User>('/users/sync', payload);
  return data;
}

export async function uploadFoto(file: File): Promise<Photo> {
  const form = new FormData();
  form.append('foto', file);
  const { data } = await api.post<Photo>('/photos', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function listarFotos(): Promise<Photo[]> {
  const { data } = await api.get<Photo[]>('/photos');
  return data;
}

export async function buscarFoto(id: string): Promise<Photo> {
  const { data } = await api.get<Photo>(`/photos/${id}`);
  return data;
}

export async function criarAnalise(photoId: string, imagemBase64: string): Promise<Analysis> {
  const { data } = await api.post<Analysis>('/analysis', { photoId, imagemBase64 });
  return data;
}

export async function buscarAnalise(photoId: string): Promise<Analysis> {
  const { data } = await api.get<Analysis>(`/analysis/${photoId}`);
  return data;
}
