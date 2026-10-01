/**
 * Padroniza uma skill para que variações de caixa, acentos e espaços não gerem
 * uma incompatibilidade artificial durante a análise.
 */
export function normalizeSkill(skill) {
 if (typeof skill !== 'string') return '';

 const normalized = skill
  .trim()
  .toLocaleLowerCase('pt-BR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ');

 const aliases = {
  'api rest': 'rest api',
  'restful api': 'rest api',
  'js': 'javascript',
  'ts': 'typescript'
 };

 return aliases[normalized] || normalized;
}

/** Retorna uma lista de skills padronizada e sem duplicatas. */
export function normalizeSkillList(skills) {
 if (!Array.isArray(skills)) return [];

 return [...new Set(skills.map(normalizeSkill).filter(Boolean))];
}
