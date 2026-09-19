const PROFILE_STORAGE_KEY = 'skillmatch_profile';

/**
 * Converte o perfil do domínio em dados seguros para armazenamento local.
 * O aplicativo não armazena dados sensíveis.
 */
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

/** Salva o perfil preenchido para a próxima visita. */
export function saveProfile(profile) {
 const normalizedProfile = normalizeProfile(profile);
 if (!normalizedProfile) return false;

 localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
 return true;
}

/** Obtém o perfil salvo ou null quando é a primeira visita/dado inválido. */
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

/** Remove apenas o perfil persistido, sem afetar o ranking. */
export function clearSavedProfile() {
 localStorage.removeItem(PROFILE_STORAGE_KEY);
}
