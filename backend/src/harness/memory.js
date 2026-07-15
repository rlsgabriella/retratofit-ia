import { redis } from '../config/redis.js';

const TTL_SEGUNDOS = 60 * 60 * 24 * 30; // 30 dias

export async function salvarResumoUsuario(userId, resumo) {
  await redis.set(`memoria:${userId}`, resumo, 'EX', TTL_SEGUNDOS);
}

export async function buscarResumoUsuario(userId) {
  return redis.get(`memoria:${userId}`);
}
