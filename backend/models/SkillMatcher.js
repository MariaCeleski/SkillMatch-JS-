
// SKILLMATCHER.JS
 
// Classe que realiza a análise de compatibilidade entre candidatos e vagas.
// Demonstra conceitos: Herança, This, Array Methods (map, filter, find, reduce)
 

// Classe base (parent class)
class BaseMatcher {
 constructor() {
 this.results = [];
 }

 /**
 * Método para armazenar resultado
 * Demonstra 'this' em classe base
 * @param {object} result
 */
 storeResult(result) {
 this.results.push(result);
 }

 /**
 * Método para obter todos os resultados
 * @returns {array}
 */
 getResults() {
 return [...this.results];
 }

 /**
 * Limpar resultados
 */
 clearResults() {
 this.results = [];
 }
}

// Classe filha (child class) - Demonstra herança
class SkillMatcher extends BaseMatcher {
 constructor() {
 super(); // Chama construtor da classe pai
 }

 /**
 * MÉTODO PRINCIPAL: Calcula compatibilidade entre candidato e vaga
 * Fórmula: (skills encontradas / skills requeridas) × 100
 *
 * @param {Candidate} candidate - Objeto candidato
 * @param {Job} job - Objeto vaga
 * @returns {number} Percentual de compatibilidade (0-100)
 */
 calculateCompatibility(candidate, job) {
 // Validação básica
 if (!candidate || !job) return 0;

 const candidateSkills = candidate.getSkillsList();
 const requiredSkills = job.getRequiredSkills();

 // Garantir que temos skills requeridas
 if (requiredSkills.length === 0) return 0;

 // ARRAY METHOD 1: filter() - Encontrar skills que o candidato possui
 const matchingSkills = requiredSkills.filter(skill =>
 candidateSkills.includes(skill)
 );

 // Calcular percentual
 const compatibility = (matchingSkills.length / requiredSkills.length) * 100;

 // Retornar percentual arredondado para 2 casas decimais
 return Math.round(compatibility * 100) / 100;
 }

 /**
 * Encontra as habilidades faltantes para uma vaga específica
 *
 * @param {Candidate} candidate
 * @param {Job} job
 * @returns {array} Lista de skills faltantes
 */
 getMissingSkills(candidate, job) {
 const candidateSkills = candidate.getSkillsList();
 const requiredSkills = job.getRequiredSkills();

 // ARRAY METHOD 2: filter() - Skills que não estão no candidato
 const missingSkills = requiredSkills.filter(skill =>
 !candidateSkills.includes(skill)
 );

 return missingSkills;
 }

 /**
 * Classifica a compatibilidade em faixas (Alta, Média, Baixa)
 * Demonstra estrutura de decisão (if-else)
 *
 * @param {number} compatibilityScore
 * @returns {string} Classificação
 */
 classifyCompatibility(compatibilityScore) {
 if (compatibilityScore >= 80) {
 return 'Alta compatibilidade';
 } else if (compatibilityScore >= 50) {
 return 'Média compatibilidade';
 } else {
 return 'Baixa compatibilidade';
 }
 }

 /**
 * Analisa um candidato contra uma lista de vagas
 * Demonstra uso de 'this' e array methods avançados
 *
 * @param {Candidate} candidate
 * @param {array} jobList - Array de objetos Job
 * @returns {array} Array com análise completa
 */
 analyzeCandidate(candidate, jobList) {
 this.clearResults(); // Limpa resultados anteriores (use de 'this')

 // ARRAY METHOD 3: map() - Mapear cada vaga para um resultado
 const analysisResults = jobList.map(job => {
 const score = this.calculateCompatibility(candidate, job);
 const missing = this.getMissingSkills(candidate, job);
 const classification = this.classifyCompatibility(score);

 const result = {
 job: job,
 score: score,
 classification: classification,
 missingSkills: missing,
 isBestMatch: false // Será atualizado depois
 };

 this.storeResult(result); // Armazena resultado
 return result;
 });

 // ARRAY METHOD 4: reduce() - Encontrar vaga com maior compatibilidade
 if (analysisResults.length > 0) {
 const bestMatch = analysisResults.reduce((best, current) =>
 current.score > best.score ? current : best
 );

 // Marcar o melhor match (apenas se score > 0)
 if (bestMatch.score > 0) {
 bestMatch.isBestMatch = true;
 }
 }

 return analysisResults;
 }

 /**
 * Encontra a vaga com maior compatibilidade
 * Demonstra ARRAY METHOD 5: find()
 *
 * @param {array} analysisResults
 * @returns {object} Melhor vaga ou null
 */
 findBestOpportunity(analysisResults) {
 // ARRAY METHOD 5: find() - Encontrar primeira vaga marcada como melhor match
 const bestJob = analysisResults.find(result => result.isBestMatch);
 return bestJob || null;
 }

 /**
 * Demonstra uso de ARRAY METHOD 6: every()
 * Verifica se candidato atende TODAS as skills de uma vaga
 *
 * @param {Candidate} candidate
 * @param {Job} job
 * @returns {boolean}
 */
 meetsAllRequirements(candidate, job) {
 const candidateSkills = candidate.getSkillsList();
 const requiredSkills = job.getRequiredSkills();

 // ARRAY METHOD 6: every() - Verifica se TODOS os skills são encontrados
 return requiredSkills.every(skill => candidateSkills.includes(skill));
 }
}



