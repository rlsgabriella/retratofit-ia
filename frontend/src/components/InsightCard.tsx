import type { Analysis } from '../types';

interface Props {
  analysis: Analysis;
}

const confiancaLabel: Record<string, string> = {
  alta: 'Alta',
  alto: 'Alta',
  media: 'Média',
  medio: 'Média',
  baixa: 'Baixa',
  baixo: 'Baixa',
};

export function InsightCard({ analysis }: Props) {
  const regioes = Array.isArray(analysis.regioesComMudanca)
    ? (analysis.regioesComMudanca as string[])
    : [];

  return (
    <div className="insight-card">
      <div className="insight-badges">
        <span className={`badge ${analysis.mudancasDetectadas ? 'badge--green' : 'badge--muted'}`}>
          {analysis.mudancasDetectadas ? '↑ Evolução detectada' : 'Sem alterações'}
        </span>
        <span className="badge badge--muted">
          Confiança {confiancaLabel[analysis.nivelConfianca] ?? analysis.nivelConfianca}
        </span>
      </div>

      <p className="insight-resumo">{analysis.resumoTexto}</p>

      {regioes.length > 0 && (
        <div className="insight-regioes">
          {regioes.map((r) => (
            <span key={r} className="tag">{r}</span>
          ))}
        </div>
      )}

      <p className="insight-modelo">{analysis.modeloUsado}</p>
    </div>
  );
}
