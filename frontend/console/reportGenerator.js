
 //REPORTGENERATOR.JS
 
 //Gera e imprime o relatório completo no console.
 //Demonstra conceitos: Formatação, loops (for, while), operadores
 

/**
 * Gera separador visual para melhor formatação
 * Demonstra loop (for)
 *
 * @param {string} char - Caractere a repetir
 * @param {number} length - Comprimento do separador
 * @returns {string}
 */
function createSeparator(char = '=', length = 60) {
 let separator = '';
 for (let i = 0; i < length; i++) {
 separator += char;
 }
 return separator;
}

/**
 * Formata um número como percentual com 2 casas decimais
 *
 * @param {number} value
 * @returns {string}
 */
function formatPercentage(value) {
 return `${value.toFixed(2)}%`;
}

/**
 * Gera e imprime o relatório completo no console
 *
 * @param {object} candidate - Objeto candidato
 * @param {array} analysisResults - Resultados da análise
 * @param {array} recommendations - Recomendações de estudo
 */
function printFullReport(candidate, analysisResults, recommendations) {
 console.clear(); // Limpar console antes de imprimir

 // ========== CABEÇALHO ==========
 console.log(createSeparator('=', 70));
 console.log(' SkillMatch JS - Simulador de Compatibilidade com Vagas Front-End');
 console.log(createSeparator('=', 70));
 console.log('');

 // ========== RESUMO DO CANDIDATO ==========
 console.log(' PERFIL DO CANDIDATO');
 console.log(createSeparator('-', 70));
 console.log(`Nome: ${candidate.name}`);
 console.log(`Área de Interesse: ${candidate.areaOfInterest}`);
 console.log(`Anos de Experiência: ${candidate.yearsOfExperience}`);
 console.log(`Habilidades: ${candidate.skills.join(', ')}`);
 console.log('');

 // ========== ANÁLISE DE COMPATIBILIDADE ==========
 console.log(' ANÁLISE DE COMPATIBILIDADE POR VAGA');
 console.log(createSeparator('-', 70));

 // Demonstra loop com forEach
 analysisResults.forEach((result, index) => {
 console.log(`\n${index + 1}. ${result.job.company} - ${result.job.title}`);
 console.log(` Compatibilidade: ${formatPercentage(result.score)} (${result.classification})`);
 console.log(` Skills Requeridas: ${result.job.requiredSkills.join(', ')}`);

 // Mostrar skills faltantes se houver
 if (result.missingSkills.length > 0) {
 console.log(` Skills Faltantes: ${result.missingSkills.join(', ')}`);
 } else {
 console.log(` Todas as skills requeridas!`);
 }

 // Marcar se é a melhor oportunidade
 if (result.isBestMatch) {
 console.log(` MELHOR OPORTUNIDADE`);
 }
 });

 console.log('');

 // ========== MELHOR OPORTUNIDADE ==========
 const bestResult = analysisResults.find(r => r.isBestMatch);

 if (bestResult) {
 console.log(' MELHOR OPORTUNIDADE');
 console.log(createSeparator('-', 70));
 console.log(`Empresa: ${bestResult.job.company}`);
 console.log(`Cargo: ${bestResult.job.title}`);
 console.log(`Compatibilidade: ${formatPercentage(bestResult.score)}`);
 console.log('');
 } else {
 console.log(' NENHUMA OPORTUNIDADE COM COMPATIBILIDADE POSITIVA');
 console.log('');
 }

 // ========== RECOMENDAÇÕES DE ESTUDO ==========
 console.log(' RECOMENDAÇÕES DE ESTUDO');
 console.log(createSeparator('-', 70));

 if (recommendations.length > 0) {
 console.log('Priorize o estudo dessas habilidades (em ordem de importância):');
 console.log('');

 // Demonstra loop com for
 for (let i = 0; i < recommendations.length; i++) {
 const skill = recommendations[i];
 const priority = i + 1;
 console.log(`${priority}. ${skill}`);
 }
 } else {
 console.log(' Parabéns! Não há habilidades faltantes recomendadas.');
 }

 console.log('');

 // ========== RODAPÉ ==========
 console.log(createSeparator('=', 70));
 console.log('Relatório gerado em: ' + new Date().toLocaleString('pt-BR'));
 console.log(createSeparator('=', 70));
}

/**
 * Imprime apenas um resumo rápido
 * Útil para testes e verificações rápidas
 *
 * @param {object} candidate
 * @param {array} analysisResults
 */
function printQuickSummary(candidate, analysisResults) {
 console.log(`\n ${candidate.name} - ${candidate.areaOfInterest}`);
 console.log(`Skills: ${candidate.skills.join(', ')}`);
 console.log('\nCompatibilidades:');

 // Demonstra loop com while
 let index = 0;
 while (index < analysisResults.length) {
 const result = analysisResults[index];
 const statusIcon = result.score >= 80 ? '' : result.score >= 50 ? '' : '';
 console.log(` ${statusIcon} ${result.job.company}: ${formatPercentage(result.score)}`);
 index++;
 }
}

/**
 * Imprime tabela de compatibilidade formatada
 * Demonstra uso de operadores e lógica
 *
 * @param {array} analysisResults
 */
function printCompatibilityTable(analysisResults) {
 console.table(
 analysisResults.map(result => ({
 Empresa: result.job.company,
 Cargo: result.job.title,
 Compatibilidade: formatPercentage(result.score),
 Classificação: result.classification,
 'Skills Faltantes': result.missingSkills.length > 0 ? result.missingSkills.join(', ') : 'Nenhuma'
 }))
 );
}


