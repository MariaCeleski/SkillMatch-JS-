
 //RECOMMENDATIONENGINE.JS
 
 //Gera recomendações de estudo com base nas habilidades faltantes.
 //Demonstra conceitos: Callbacks, Array methods (reduce), Lógica
 

/**
 * Calcula prioridade de uma habilidade com base em frequência
 *
 * @param {string} skill - Nome da habilidade
 * @param {array} allMissingSkills - Lista com todas as skills faltantes
 * @returns {number} Pontuação de prioridade
 */
function calculateSkillPriority(skill, allMissingSkills) {
 // Contar quantas vezes a skill aparece na lista de faltantes
 const frequency = allMissingSkills.filter(s => s === skill).length;
 return frequency;
}

/**
 * Gera recomendações de estudo a partir dos resultados da análise
 * Demonstra uso de callbacks e processamento de dados
 *
 * @param {array} analysisResults - Resultados da análise do candidato
 * @param {Function} onRecommendationReady - Callback executado quando recomendação está pronta
 * @returns {array} Lista de habilidades recomendadas
 */
function generateRecommendations(analysisResults, onRecommendationReady) {
 // Coletar TODAS as skills faltantes de TODAS as vagas
 const allMissingSkills = [];

 // Loop com forEach para coletar skills faltantes
 analysisResults.forEach(result => {
 allMissingSkills.push(...result.missingSkills);
 });

 // Se não há skills faltantes, retornar vazio
 if (allMissingSkills.length === 0) {
 const recommendation = [];

 // Executar callback (Demonstra uso de callback)
 if (onRecommendationReady && typeof onRecommendationReady === 'function') {
 onRecommendationReady(recommendation);
 }

 return recommendation;
 }

 // Remover duplicatas e contar frequência
 // ARRAY METHOD: reduce() - Contar frequência de cada skill
 const skillFrequency = allMissingSkills.reduce((acc, skill) => {
 acc[skill] = (acc[skill] || 0) + 1;
 return acc;
 }, {});

 // Converter para array de objetos {skill, frequency}
 const skillsWithPriority = Object.entries(skillFrequency).map(([skill, frequency]) => ({
 skill: skill,
 priority: frequency
 }));

 // Ordenar por prioridade (frequência) em ordem decrescente
 const sortedRecommendations = skillsWithPriority.sort((a, b) =>
 b.priority - a.priority
 );

 // Extrair apenas os nomes das skills (em ordem de prioridade)
 const recommendations = sortedRecommendations.map(item => item.skill);

 // Garantir que há pelo menos uma recomendação
 const finalRecommendations = recommendations.length > 0 ? recommendations : [];

 // Executar callback com os resultados
 // Demonstra uso de callback
 if (onRecommendationReady && typeof onRecommendationReady === 'function') {
 onRecommendationReady(finalRecommendations);
 }

 return finalRecommendations;
}

/**
 * Cria um objeto com métodos para gerenciar recomendações
 * Pode ser usado para agrupar lógica de recomendação
 *
 * @returns {object}
 */
function createRecommendationService() {
 const recommendations = [];

 return {
 /**
 * Gera e armazena recomendações
 * @param {array} analysisResults
 * @param {Function} callback
 */
 generate(analysisResults, callback) {
 const recs = generateRecommendations(analysisResults, callback);
 this.recommendations = recs;
 return recs;
 },

 /**
 * Obtém recomendações armazenadas
 * @returns {array}
 */
 getRecommendations() {
 return [...this.recommendations];
 },

 /**
 * Limpa recomendações
 */
 clear() {
 this.recommendations = [];
 },

 /**
 * Retorna número de recomendações
 * @returns {number}
 */
 count() {
 return this.recommendations.length;
 }
 };
}


