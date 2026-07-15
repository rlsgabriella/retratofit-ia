export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  if (status >= 500) {
    console.error('[Error]', err);
  }

  res.status(status).json({ error: message });
}
