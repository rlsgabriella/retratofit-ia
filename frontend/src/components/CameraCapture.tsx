import { useEffect } from 'react';
import { useCamera } from '../hooks/useCamera';

interface Props {
  onConfirmar: (file: File) => void;
}

export function CameraCapture({ onConfirmar }: Props) {
  const {
    videoRef,
    canvasRef,
    capturedFile,
    previewUrl,
    erro,
    iniciarCamera,
    capturar,
    descartar,
    pararCamera,
  } = useCamera();

  useEffect(() => {
    iniciarCamera();
    return () => pararCamera();
  }, [iniciarCamera, pararCamera]);

  return (
    <div className="camera-wrap">
      {erro && (
        <div className="camera-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p>{erro}</p>
        </div>
      )}

      {!erro && !previewUrl && (
        <>
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
          <div className="camera-controls">
            <button
              className="camera-shutter"
              onClick={capturar}
              aria-label="Capturar foto"
            />
          </div>
        </>
      )}

      {previewUrl && (
        <>
          <img src={previewUrl} alt="Prévia da foto" className="camera-preview-img" />
          <div className="camera-controls camera-controls--preview">
            <button className="btn btn--ghost" onClick={descartar}>
              Refazer
            </button>
            <button
              className="btn btn--accent"
              onClick={() => capturedFile && onConfirmar(capturedFile)}
            >
              Confirmar
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
