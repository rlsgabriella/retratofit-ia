export function logChamada({ modelo, latenciaMs, fallback, erro }) {
  const prefixo = fallback ? '[HARNESS][FALLBACK]' : '[HARNESS]';
  if (erro) {
    console.error(`${prefixo} modelo=${modelo} erro=${erro}`);
  } else {
    console.log(`${prefixo} modelo=${modelo} latencia=${latenciaMs}ms`);
  }
}
