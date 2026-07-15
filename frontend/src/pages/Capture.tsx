import { CameraCapture } from '../components/CameraCapture';
import { InsightCard } from '../components/InsightCard';
import { useAnalysis } from '../hooks/useAnalysis';

export default function CapturePage() {
  const { loading, erro, analysis, analisar, resetar } = useAnalysis();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Analisando com IA…</p>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="result-screen">
        <h2 className="result-screen__title">Análise concluída</h2>
        <InsightCard analysis={analysis} />
        <div className="result-screen__actions">
          <button className="btn btn--ghost" onClick={resetar}>
            Nova foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {erro && <p className="error-toast">{erro}</p>}
      <CameraCapture onConfirmar={analisar} />
    </>
  );
}
