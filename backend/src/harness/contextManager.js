import { buscarResumoUsuario } from './memory.js';
import { SYSTEM_PROMPT } from './guardrails.js';

export async function montarPayload(userId, imagensBase64) {
  const memoriaAnterior = await buscarResumoUsuario(userId);

  const contextoParts = imagensBase64.map((b64) => ({
    inlineData: { mimeType: 'image/jpeg', data: b64 },
  }));

  const textoPrincipal = memoriaAnterior
    ? `Contexto da última análise deste usuário: "${memoriaAnterior}"\n\nAgora analise as novas fotos comparando com esse contexto.`
    : 'Analise as fotos enviadas e descreva as diferenças visuais observadas entre elas.';

  return {
    systemInstruction: SYSTEM_PROMPT,
    contents: [
      {
        role: 'user',
        parts: [...contextoParts, { text: textoPrincipal }],
      },
    ],
  };
}
