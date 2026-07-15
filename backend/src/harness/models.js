import { env } from '../config/env.js';

export const MODELOS = [
  { nome: 'gemini-2.5-flash', tipo: 'primario' },
  { nome: 'gemini-2.0-flash', tipo: 'reserva' },
];

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function chamarModelo(modelo, payload) {
  const url = `${GEMINI_API_BASE}/${modelo.nome}:generateContent?key=${env.geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: payload.contents,
      systemInstruction: payload.systemInstruction
        ? { parts: [{ text: payload.systemInstruction }] }
        : undefined,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`[${modelo.nome}] HTTP ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error(`[${modelo.nome}] Resposta vazia ou malformada`);

  return JSON.parse(text);
}
