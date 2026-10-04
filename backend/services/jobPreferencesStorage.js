/** Chave única usada para armazenar as preferências dos filtros no navegador. */
export const JOB_PREFERENCES_STORAGE_KEY = 'skillmatch_job_preferences';

/** Valores aceitos pelo filtro de compatibilidade. */
const COMPATIBILITY_LEVELS = new Set(['all', 'alta', 'media', 'baixa']);
/** Valores aceitos pelo controle de ordenação das vagas. */
const SORT_OPTIONS = new Set(['compatibility-desc', 'salary-desc', 'salary-asc', 'company-asc']);

/**
 * Converte dados recebidos do formulário ou do localStorage em preferências seguras.
 *
 * O localStorage pode conter dados antigos, corrompidos ou alterados manualmente. Por
 * isso, a função nunca usa os valores diretamente: ela valida cada campo e substitui
 * valores ausentes ou inválidos pelos padrões esperados pela interface.
 *
 * @param {unknown} preferences Dados que representam as preferências de vagas.
 * @returns {{modality: string, compatibility: string, sort: string} | null}
 * Preferências normalizadas; retorna `null` quando a entrada não é um objeto.
 */
function normalizePreferences(preferences) {
 // Sem um objeto não há como montar preferências confiáveis para salvar ou restaurar.
 if (!preferences || typeof preferences !== 'object') return null;

 return {
  // A modalidade é dinâmica, pois vem das modalidades presentes no catálogo de vagas.
  // Aceitamos apenas texto não vazio e removemos espaços nas extremidades.
  modality: typeof preferences.modality === 'string' && preferences.modality.trim()
   ? preferences.modality.trim()
   : 'all',
  // A compatibilidade precisa corresponder a uma das opções que o filtro oferece.
  compatibility: COMPATIBILITY_LEVELS.has(preferences.compatibility)
   ? preferences.compatibility
   : 'all',
  // A ordenação também é limitada às opções implementadas na tela.
  sort: SORT_OPTIONS.has(preferences.sort)
   ? preferences.sort
   : 'compatibility-desc'
 };
}

/** Salva somente preferências válidas dos controles de vagas. */
export function saveJobPreferences(preferences) {
 const normalizedPreferences = normalizePreferences(preferences);
 if (!normalizedPreferences) return false;

 localStorage.setItem(JOB_PREFERENCES_STORAGE_KEY, JSON.stringify(normalizedPreferences));
 return true;
}

/** Restaura as preferências salvas ou usa os padrões na primeira visita. */
export function loadJobPreferences() {
 const storedPreferences = localStorage.getItem(JOB_PREFERENCES_STORAGE_KEY);
 if (!storedPreferences) return null;

 try {
  return normalizePreferences(JSON.parse(storedPreferences));
 } catch (error) {
  console.warn('Não foi possível restaurar os filtros salvos:', error);
  return null;
 }
}
