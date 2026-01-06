import { saveAccess } from './saveAccess';

const ACCESS_KEY = 'accessedAt';

export function canAccess(): boolean {
  const timestampString = localStorage.getItem(ACCESS_KEY);

  if (timestampString) {
    const lastAccess = JSON.parse(timestampString) as number; // timestamp em ms
    const now = Date.now();
    const diffMinutes = (now - lastAccess) / (1000 * 60); // diferença em minutos

    if (diffMinutes <= 30) {
      // Acesso permitido
      return true;
    }
  }

  // Se não tiver registro ou passou de 30 minutos, salva o acesso agora
  saveAccess();
  return false;
}
