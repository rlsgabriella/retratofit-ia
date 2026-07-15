import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Timeline } from '../components/Timeline';
import { setAuthToken, listarFotos, criarAnalise } from '../services/api';
import type { Photo } from '../types';

export default function TimelinePage() {
  const { getToken } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [analisando, setAnalisando] = useState<string | null>(null);

  const fetchFotos = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) setAuthToken(token);
      const data = await listarFotos();
      setPhotos(data);
    } catch {
      setErro('Não foi possível carregar as fotos.');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFotos();
  }, [fetchFotos]);

  async function handleAnalisar(photo: Photo) {
    setAnalisando(photo.id);
    try {
      const token = await getToken();
      if (token) setAuthToken(token);

      const res = await fetch(photo.url);
      const blob = await res.blob();
      const base64 = await blobToBase64(blob);
      await criarAnalise(photo.id, base64);
      await fetchFotos();
    } catch {
      setErro('Falha ao analisar foto.');
    } finally {
      setAnalisando(null);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Evolução</h1>
        {erro && <p className="error-inline">{erro}</p>}
      </header>

      <main className="page-content">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
          </div>
        ) : (
          <Timeline
            photos={photos}
            onAnalisar={handleAnalisar}
            analisando={analisando}
          />
        )}
      </main>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
