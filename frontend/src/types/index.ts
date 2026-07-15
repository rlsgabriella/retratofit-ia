export interface User {
  id: string;
  clerkId: string;
  email: string;
  nome?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Photo {
  id: string;
  url: string;
  userId: string;
  criadaEm: string;
  analysis?: Analysis;
}

export interface Analysis {
  id: string;
  photoId: string;
  resumoTexto: string;
  mudancasDetectadas: boolean;
  regioesComMudanca: string[];
  nivelConfianca: string;
  modeloUsado: string;
  criadaEm: string;
}
