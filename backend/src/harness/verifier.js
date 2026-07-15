import { z } from 'zod';

const analysisSchema = z.object({
  resumoTexto: z.string().min(10),
  mudancasDetectadas: z.boolean(),
  regioesComMudanca: z.array(z.string()),
  nivelConfianca: z.enum(['baixo', 'medio', 'alto']),
});

export function verificarResposta(raw) {
  const resultado = analysisSchema.safeParse(raw);
  if (!resultado.success) {
    throw new Error(`Resposta do modelo fora do schema: ${resultado.error.message}`);
  }

  const { resumoTexto } = resultado.data;
  const padroesBloqueados = [/\d+\s*%\s*(de\s+)?gordura/i, /diagnóstico/i, /laudo\s+médico/i];
  for (const padrao of padroesBloqueados) {
    if (padrao.test(resumoTexto)) {
      throw new Error('Resposta do modelo contém conteúdo bloqueado pelos guardrails');
    }
  }

  return resultado.data;
}
