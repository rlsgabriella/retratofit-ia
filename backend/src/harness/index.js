import { MODELOS, chamarModelo } from './models.js';
import { verificarResposta } from './verifier.js';
import { comRetry } from './retry.js';
import { logChamada } from './logger.js';

export async function harnessFailover(payload) {
  let fallback = false;
  for (const modelo of MODELOS) {
    const inicio = Date.now();
    try {
      const resposta = await comRetry(() => chamarModelo(modelo, payload), 2);
      const validada = verificarResposta(resposta);
      logChamada({ modelo: modelo.nome, latenciaMs: Date.now() - inicio, fallback });
      return { ...validada, modeloUsado: modelo.nome };
    } catch (err) {
      logChamada({ modelo: modelo.nome, latenciaMs: Date.now() - inicio, fallback, erro: err.message });
      fallback = true;
    }
  }
  throw new Error('Todos os modelos falharam. Tente novamente mais tarde.');
}
