import type { Photo } from '../types';
import { InsightCard } from './InsightCard';

interface Props {
  photos: Photo[];
  onAnalisar: (photo: Photo) => void;
  analisando?: string | null;
}

function formatarData(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function Timeline({ photos, onAnalisar, analisando }: Props) {
  if (photos.length === 0) {
    return (
      <div className="timeline-empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p>Nenhuma foto ainda</p>
        <p className="timeline-empty__sub">Tire sua primeira foto na aba câmera!</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {photos.map((photo) => (
        <article key={photo.id} className="timeline-card">
          <div className="timeline-card__header">
            <img
              src={photo.url}
              alt={`Foto de ${formatarData(photo.criadaEm)}`}
              className="timeline-thumb"
              loading="lazy"
            />
            <div className="timeline-card__meta">
              <time className="timeline-date">{formatarData(photo.criadaEm)}</time>
              {!photo.analysis && (
                <button
                  className="btn btn--sm btn--accent"
                  onClick={() => onAnalisar(photo)}
                  disabled={analisando === photo.id}
                >
                  {analisando === photo.id ? 'Analisando…' : 'Analisar'}
                </button>
              )}
            </div>
          </div>

          {photo.analysis && <InsightCard analysis={photo.analysis} />}
        </article>
      ))}
    </div>
  );
}
