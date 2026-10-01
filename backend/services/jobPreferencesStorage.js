export const JOB_PREFERENCES_STORAGE_KEY = 'skillmatch_job_preferences';

const COMPATIBILITY_LEVELS = new Set(['all', 'alta', 'media', 'baixa']);
const SORT_OPTIONS = new Set(['compatibility-desc', 'salary-desc', 'salary-asc', 'company-asc']);

function normalizePreferences(preferences) {
 if (!preferences || typeof preferences !== 'object') return null;

 return {
  modality: typeof preferences.modality === 'string' && preferences.modality.trim()
   ? preferences.modality.trim()
   : 'all',
  compatibility: COMPATIBILITY_LEVELS.has(preferences.compatibility)
   ? preferences.compatibility
   : 'all',
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
