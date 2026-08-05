/**
 * MAIN.JS
 *
 * Arquivo principal que orquestra todo o fluxo do SkillMatch JS.
 * Este é o arquivo que será executado no console do navegador.
 *
 * INSTRUÇÕES:
 * 1. Abra o console do navegador (F12 ou Cmd+Option+J no Mac)
 * 2. Cole o código deste arquivo (e todos os arquivos de modelos e serviços)
 * 3. Execute: runSkillMatch()
 */

// ============= INÍCIO DO PROGRAMA =============

/**
 * Função principal assíncrona que coordena todo o fluxo
 * Demonstra async/await e tratamento de erros
 */
async function runSkillMatch() {
 console.log(' Iniciando SkillMatch JS...\n');

 try {
 // ========== PASSO 1: Criar instâncias ==========
 console.log(' Criando instâncias...');

 const candidate = mockCandidate; // Usar candidato do mockJobs.js
 const skillMatcher = new SkillMatcher();
 const recommendationService = createRecommendationService();

 console.log(' Instâncias criadas!\n');

 // ========== PASSO 2: Carregar vagas (Simulando servidor) ==========
 console.log('⏳ Etapa 1: Carregando vagas de um servidor simulado...');

 let jobs = [];

 // Usar dataLoader para simular Promise e async/await
 await loadDataAsync((error, loadedJobs) => {
 if (error) {
 console.error('Erro ao carregar:', error);
 throw error;
 }
 jobs = loadedJobs;
 });

 console.log(` ${jobs.length} vagas carregadas!\n`);

 // ========== PASSO 3: Analisar compatibilidade ==========
 console.log('⏳ Etapa 2: Analisando compatibilidade...');

 const analysisResults = skillMatcher.analyzeCandidate(candidate, jobs);

 console.log(' Análise concluída!\n');

 // ========== PASSO 4: Gerar recomendações ==========
 console.log('⏳ Etapa 3: Gerando recomendações...');

 // Demonstra uso de callback
 const recommendations = recommendationService.generate(
 analysisResults,
 function(recs) {
 console.log(`Callback: ${recs.length} habilidades recomendadas`);
 }
 );

 console.log(' Recomendações geradas!\n');

 // ========== PASSO 5: Imprimir relatório ==========
 console.log('⏳ Etapa 4: Gerando relatório final...\n');

 // Esperar um pouco para dar tempo do carregamento ser visível
 await new Promise(resolve => setTimeout(resolve, 500));

 // Imprimir relatório completo
 printFullReport(candidate, analysisResults, recommendations);

 // ========== RESUMO FINAL ==========
 console.log('\n ESTATÍSTICAS:');
 console.log(createSeparator('-', 70));
 console.log(`Total de vagas: ${jobs.length}`);
 console.log(`Compatibilidade máxima: ${Math.max(...analysisResults.map(r => r.score)).toFixed(2)}%`);
 console.log(`Compatibilidade média: ${(analysisResults.reduce((sum, r) => sum + r.score, 0) / analysisResults.length).toFixed(2)}%`);
 console.log(`Habilidades recomendadas: ${recommendations.length}`);
 console.log(createSeparator('=', 70));

 console.log('\n SkillMatch JS executado com sucesso!');
 console.log('\n Dicas:');
 console.log(' - Use printQuickSummary(candidate, analysisResults) para resumo rápido');
 console.log(' - Use printCompatibilityTable(analysisResults) para ver tabela');
 console.log(' - Use skilMatcher.findBestOpportunity(analysisResults) para melhor vaga');

 } catch (error) {
 console.error(' Erro durante execução:', error);
 }
}

// ============= FUNÇÕES AUXILIARES =============

/**
 * Demonstra uso de regular function vs arrow function
 * Calcula média de compatibilidade
 *
 * @param {array} results
 * @returns {number}
 */
function calculateAverageCompatibility(results) {
 // Regular function
 return results.reduce((sum, r) => sum + r.score, 0) / results.length;
}

/**
 * Arrow function - Filtra vagas com alta compatibilidade
 */
const getHighCompatibilityJobs = (results) => {
 return results.filter(r => r.score >= 80);
};

/**
 * Arrow function - Filtra vagas com média compatibilidade
 */
const getMediumCompatibilityJobs = (results) => {
 return results.filter(r => r.score >= 50 && r.score < 80);
};

/**
 * CLOSURE: Cria um contador de execuções
 * Demonstra que valor persiste entre chamadas
 */
const executionCounter = (() => {
 let count = 0;

 return {
 increment() {
 count++;
 return count;
 },
 getCount() {
 return count;
 },
 reset() {
 count = 0;
 }
 };
})();

// ============= INSTRUÇÕES DE USO =============

console.log(`
╔════════════════════════════════════════════════════════════════╗
║ SkillMatch JS - Simulador de Compatibilidade ║
║ ║
║ Para executar o programa, rode no console: ║
║ ║
║ >>> runSkillMatch() ║
║ ║
║ Funções auxiliares disponíveis: ║
║ - getHighCompatibilityJobs(results) ║
║ - getMediumCompatibilityJobs(results) ║
║ - calculateAverageCompatibility(results) ║
║ - executionCounter.getCount() ║
║ ║
╚════════════════════════════════════════════════════════════════╝
`);

// ============= FIM DO PROGRAMA =============
