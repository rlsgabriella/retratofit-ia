import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthToken, uploadFoto, criarAnalise } from '../services/api';
import type { Analysis, Photo } from '../types';

export function useAnalysis() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  async function analisar(file: File) {
    setLoading(true);
    setErro(null);
    try {
      const token = await getToken();
      if (token) setAuthToken(token);

      const fotoUpload = await uploadFoto(file);
      setPhoto(fotoUpload);

      const base64 = await fileToBase64(file);
      const resultado = await criarAnalise(fotoUpload.id, base64);
      setAnalysis(resultado);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao processar análise');
    } finally {
      setLoading(false);
    }
  }

  function resetar() {
    setPhoto(null);
    setAnalysis(null);
    setErro(null);
  }

  return { loading, erro, photo, analysis, analisar, resetar };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
