export const PROFILE_STORAGE_KEY = 'skillmatch_profile';

/** Mantém somente dados de perfil adequados para o armazenamento local. */
function normalizeProfile(profile) {
 if (!profile || !profile.name || !profile.areaOfInterest || !Array.isArray(profile.skills)) {
 return null;
 }

 return {
 name: profile.name,
 areaOfInterest: profile.areaOfInterest,
 skills: [...profile.skills],
 yearsOfExperience: Number(profile.yearsOfExperience) || 0
 };
}

/** Salva o perfil para uma próxima visita; não armazene dados sensíveis. */
export function saveProfile(profile) {
 const normalizedProfile = normalizeProfile(profile);
 if (!normalizedProfile) return false;

 localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
 return true;
}

/** Restaura um perfil válido, ou null na primeira visita/dado inválido. */
export function loadProfile() {
 const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
 if (!storedProfile) return null;

 try {
 return normalizeProfile(JSON.parse(storedProfile));
 } catch (error) {
 console.warn('Não foi possível restaurar o perfil salvo:', error);
 return null;
 }
}
