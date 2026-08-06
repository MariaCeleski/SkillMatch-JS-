/**
 * APP.JS
 *
 * Arquivo que conecta o backend com o frontend HTML
 * Gerencia a interação entre a interface e a lógica de negócio
 *
 * Demonstra conceitos: Event Listeners, DOM Manipulation, Async/Await
 */

// ============================================================================
// VARIÁVEIS GLOBAIS
// ============================================================================

let currentCandidate = null;
let analysisResults = null;
let recommendations = null;

// ============================================================================
// FUNÇÃO PRINCIPAL: ANALISAR CANDIDATO
// ============================================================================

/**
 * Função assíncrona que realiza toda a análise
 * Conecta com o backend e atualiza o frontend
 */
async function analyzeCandidate() {
 try {
 // ========== PASSO 1: Obter dados do formulário ==========
 const candidateData = getFormData();

 if (!candidateData) {
 alert('Por favor, preencha todos os campos corretamente.');
 return;
 }

 // ========== PASSO 2: Criar instância do candidato ==========
 currentCandidate = new Candidate(
 candidateData.name,
 candidateData.area,
 candidateData.skills,
 candidateData.experience
 );

 console.log('👤 Candidato criado:', currentCandidate);

 // Mostrar resumo do candidato
 const summaryShown = displayCandidateSummary(currentCandidate);
 if (!summaryShown) {
 console.warn('⚠️  Aviso: Resumo do candidato não foi exibido correctamente');
 }

 // ========== PASSO 3: Carregar vagas (simulando servidor) ==========
 showLoadingState('Carregando vagas...');

 const jobs = await loadJobsFromServer(1500); // 1.5 segundos de delay

 hideLoadingState();

 // ========== PASSO 4: Analisar compatibilidade ==========
 const skillMatcher = new SkillMatcher();
 analysisResults = skillMatcher.analyzeCandidate(currentCandidate, jobs);

 // ========== PASSO 5: Gerar recomendações ==========
 const recommendationService = createRecommendationService();
 recommendations = recommendationService.generate(analysisResults);

 // ========== PASSO 6: Exibir resultados ==========
 displayResults(analysisResults, recommendations);

 // Salva candidato no ranking
 saveCandidateToRanking(currentCandidate, analysisResults);

 // Scroll para resultados
 document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

 } catch (error) {
 console.error('Erro durante análise:', error);
 alert('Erro ao analisar compatibilidade. Verifique o console para detalhes.');
 }
}

// ============================================================================
// FUNÇÕES DE COLETA DE DADOS
// ============================================================================

/**
 * Obtém dados do formulário e valida
 * @returns {object|null} Dados validados ou null
 */
function getFormData() {
 const name = document.getElementById('candidateName').value.trim();
 const area = document.getElementById('areaOfInterest').value.trim();
 const experience = parseInt(document.getElementById('experience').value) || 0;

 // Obter skills selecionadas (checkboxes)
 const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
 const skills = Array.from(skillCheckboxes).map(checkbox => checkbox.value);

 // Validação
 if (!name || !area) {
 console.warn('⚠️  Aviso: Nome ou área não foram preenchidos');
 return null;
 }

 if (skills.length === 0) {
 console.warn('⚠️  Aviso: Nenhuma habilidade foi selecionada');
 return null;
 }

 return {
 name,
 area,
 experience,
 skills
 };
}

// ============================================================================
// FUNÇÕES DE EXIBIÇÃO - RESUMO DO CANDIDATO
// ============================================================================

/**
 * Exibe o resumo do perfil do candidato
 * @param {Candidate} candidate
 */
function displayCandidateSummary(candidate) {
 const summaryDiv = document.getElementById('candidateSummary');
 const summaryContent = document.querySelector('.summary-content');

 if (!summaryDiv) {
 console.error('❌ Erro: Elemento candidateSummary não encontrado no DOM');
 return false;
 }

 if (!summaryContent) {
 console.error('❌ Erro: Elemento .summary-content não encontrado no DOM');
 return false;
 }

 if (!candidate) {
 console.error('❌ Erro: Candidato não foi passado corretamente');
 return false;
 }

 try {
 // Validar que o candidato tem as propriedades esperadas
 if (!candidate.name) {
 console.warn('⚠️  Aviso: candidate.name está vazio ou undefined');
 }

 // Preencher cada campo de forma segura
 const nameElement = document.getElementById('summaryName');
 const areaElement = document.getElementById('summaryArea');
 const expElement = document.getElementById('summaryExp');
 const skillsElement = document.getElementById('summarySkills');

 // Verificar se todos os elementos existem
 if (!nameElement || !areaElement || !expElement || !skillsElement) {
 console.error('❌ Erro: Um ou mais elementos span não encontrados no DOM');
 console.error('summaryName:', nameElement ? '✓' : '✗');
 console.error('summaryArea:', areaElement ? '✓' : '✗');
 console.error('summaryExp:', expElement ? '✓' : '✗');
 console.error('summarySkills:', skillsElement ? '✓' : '✗');
 return false;
 }

 // Extrair dados do candidato
 const name = candidate.name || 'N/A';
 const area = candidate.areaOfInterest || 'N/A';
 const experience = candidate.yearsOfExperience !== undefined ? candidate.yearsOfExperience : 0;
 const skillsText = (candidate.skills && candidate.skills.length > 0) 
 ? candidate.skills.join(', ') 
 : 'Nenhuma habilidade informada';

 // Atualizar elementos do resumo
 nameElement.textContent = name;
 areaElement.textContent = area;
 expElement.textContent = experience;
 skillsElement.textContent = skillsText;

 // Garantir que o resumo está visível (remover display:none)
 summaryDiv.style.display = 'block';
 summaryContent.style.display = 'block';

 // Adicionar animação de entrada (fade-in)
 summaryDiv.style.animation = 'slideIn 0.3s ease-in-out';

 console.log('✅ Resumo do candidato exibido com sucesso');
 console.log('👤 Dados carregados:', {
 nome: name,
 area: area,
 experiência: experience,
 habilidades: skillsText
 });

 return true;
 } catch (error) {
 console.error('❌ Erro ao exibir resumo do candidato:', error);
 console.error('Stack:', error.stack);
 return false;
 }
}

// ============================================================================
// FUNÇÕES DE EXIBIÇÃO - RESULTADOS
// ============================================================================

/**
 * Exibe todos os resultados da análise
 * @param {array} results - Resultados da análise
 * @param {array} recs - Recomendações
 */
function displayResults(results, recs) {
 // Limpar resultados anteriores
 document.getElementById('jobResultsGrid').innerHTML = '';

 // Exibir cards de vagas
 results.forEach((result, index) => {
 const card = createJobCard(result, index);
 document.getElementById('jobResultsGrid').appendChild(card);
 });

 // Exibir melhor oportunidade
 const bestResult = results.find(r => r.isBestMatch);
 if (bestResult && bestResult.score > 0) {
 displayBestOpportunity(bestResult);
 }

 // Exibir recomendações
 if (recs && recs.length > 0) {
 displayRecommendations(recs);
 }

 // Exibir estatísticas
 displayStatistics(results, recs);

 // Atualizar medidor de prontidão no resumo
 updateReadinessMeter(results);

 // Mostrar seções
 document.getElementById('resultsSection').style.display = 'block';
 if (bestResult && bestResult.score > 0) {
 document.getElementById('bestOpportunitySection').style.display = 'block';
 }
 if (recs && recs.length > 0) {
 document.getElementById('recommendationsSection').style.display = 'block';
 }
 document.getElementById('statisticsSection').style.display = 'block';
}

/**
 * Atualiza o medidor de prontidão para o mercado no resumo do candidato
 * Calcula a média das compatibilidades e exibe nível + mensagem
 * @param {array} results - Resultados da análise
 */
function updateReadinessMeter(results) {
 const meter = document.getElementById('readinessMeter');
 const badge = document.getElementById('readinessBadge');
 const fill = document.getElementById('readinessBarFill');
 const scoreEl = document.getElementById('readinessScore');
 const messageEl = document.getElementById('readinessMessage');

 if (!meter || !results || results.length === 0) return;

 // Calcula a pontuação média de todas as vagas
 const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
 const rounded = Math.round(avg);

 // Define nível, cor e mensagem com base na média
 let level, color, message, emoji;

 if (avg >= 80) {
 level = 'Pronto para o Mercado';
 color = '#10b981'; // verde
 message = 'Seu perfil atende bem à maioria das vagas. Candidate-se com confiança!';
 emoji = '🟢';
 } else if (avg >= 60) {
 level = 'Quase lá';
 color = '#6366f1'; // índigo
 message = 'Bom perfil! Algumas skills a mais vão abrir muitas portas.';
 emoji = '🔵';
 } else if (avg >= 40) {
 level = 'Em Desenvolvimento';
 color = '#f59e0b'; // amarelo
 message = 'Você está no caminho certo. Foque nas recomendações abaixo.';
 emoji = '🟡';
 } else {
 level = 'Iniciante';
 color = '#ef4444'; // vermelho
 message = 'Comece pelos fundamentos. Cada skill aprendida abre novas oportunidades!';
 emoji = '🔴';
 }

 // Aplica os valores
 badge.textContent = `${emoji} ${level}`;
 badge.style.background = color;

 fill.style.width = `${rounded}%`;
 fill.style.background = color;

 scoreEl.textContent = `Média: ${rounded}%`;
 messageEl.textContent = message;

 meter.style.display = 'block';
}

/**
 * Cria um card de vaga
 * @param {object} result - Resultado da análise de uma vaga
 * @param {number} index - Índice da vaga
 * @returns {HTMLElement}
 */
function createJobCard(result, index) {
 const card = document.createElement('div');
 card.className = 'job-card';
 card.style.animationDelay = `${index * 0.1}s`;

 const { job, score, classification, missingSkills, isBestMatch } = result;

 // Badge de melhor oportunidade
 const bestBadge = isBestMatch && score > 0 ? ' ' : '';

 card.innerHTML = `
 <div class="job-header">
 <div class="job-company">${job.company}</div>
 <div class="job-title">${bestBadge}${job.title}</div>
 </div>

 <div class="compatibility-score">
 <div class="score-value">${score.toFixed(1)}%</div>
 <div class="score-bar">
 <div class="score-fill score-fill-${classification.toLowerCase().split(' ')[0]}" style="width: ${score}%"></div>
 </div>
 <div class="score-label ${classification.toLowerCase().split(' ')[0]}">
 ${classification}
 </div>
 </div>

 <div class="required-skills">
 <div class="skills-label">Habilidades Requeridas:</div>
 <div class="skills-container">
 ${job.requiredSkills.map(skill => {
 const isMatched = currentCandidate.hasSkill(skill);
 const className = isMatched ? 'matched' : 'missing';
 const icon = isMatched ? '' : '';
 return `
 <span class="skill-tag ${className}">
 ${icon} ${skill}
 </span>
 `;
 }).join('')}
 </div>
 </div>

 ${missingSkills.length > 0 ? `
 <div class="required-skills" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
 <div class="skills-label">Skills Faltantes:</div>
 <div class="skills-container">
 ${missingSkills.map(skill => `
 <span class="skill-tag missing">
 ${skill}
 </span>
 `).join('')}
 </div>
 </div>
 ` : `
 <div class="required-skills" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
 <div class="skills-label"> Você tem todas as skills necessárias!</div>
 </div>
 `}
 `;

 return card;
}

/**
 * Exibe a melhor oportunidade
 * @param {object} bestResult
 */
function displayBestOpportunity(bestResult) {
 const card = document.getElementById('bestOpportunityCard');
 const { job, score, classification } = bestResult;

 card.innerHTML = `
 <h3>${job.company}</h3>
 <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 1rem;">${job.title}</p>

 <div class="opportunity-info">
 <div class="opportunity-info-item">
 <strong>Compatibilidade</strong>
 <span>${score.toFixed(1)}%</span>
 </div>
 <div class="opportunity-info-item">
 <strong>Classificação</strong>
 <span>${classification}</span>
 </div>
 <div class="opportunity-info-item">
 <strong>Skills Requeridas</strong>
 <span>${job.requiredSkills.length}</span>
 </div>
 </div>
 `;
}

/**
 * Exibe as recomendações de estudo
 * @param {array} recs - Recomendações
 */
function displayRecommendations(recs) {
 const list = document.getElementById('recommendationsList');
 list.innerHTML = '';

 if (recs.length === 0) {
 list.innerHTML = '<p class="no-results">Parabéns! Você tem todas as skills necessárias.</p>';
 return;
 }

 recs.forEach((skill, index) => {
 const item = document.createElement('div');
 item.className = 'recommendation-item';
 item.style.animationDelay = `${index * 0.1}s`;

 item.innerHTML = `
 <div class="recommendation-priority">${index + 1}</div>
 <div class="recommendation-text">
 <strong>${skill}</strong>
 <small>Aprenda esta habilidade para melhorar suas oportunidades</small>
 </div>
 `;

 list.appendChild(item);
 });
}

/**
 * Exibe as estatísticas
 * @param {array} results
 * @param {array} recs
 */
function displayStatistics(results, recs) {
 const totalJobs = results.length;
 const maxScore = Math.max(...results.map(r => r.score));
 const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);
 const skillsCount = recs ? recs.length : 0;

 document.getElementById('totalJobs').textContent = totalJobs;
 document.getElementById('maxCompatibility').textContent = `${maxScore.toFixed(1)}%`;
 document.getElementById('avgCompatibility').textContent = `${avgScore}%`;
 document.getElementById('skillsToLearn').textContent = skillsCount;
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS - LOADING STATE
// ============================================================================

/**
 * Mostra estado de carregamento
 * @param {string} message
 */
function showLoadingState(message) {
 const btn = document.querySelector('.btn-primary');
 btn.disabled = true;
 btn.innerHTML = `<div class="loading"></div> ${message}`;
}

/**
 * Esconde estado de carregamento
 */
function hideLoadingState() {
 const btn = document.querySelector('.btn-primary');
 btn.disabled = false;
 btn.innerHTML = ' Analisar Compatibilidade';
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Adiciona listeners quando o DOM está carregado
 */
document.addEventListener('DOMContentLoaded', function() {
 console.log('✅ Aplicação carregada e pronta!');

 // Renderiza ranking salvo do localStorage ao iniciar
 renderRankingTable();

 // Sincronizar slider com número de experiência
 const slider = document.getElementById('experienceSlider');
 const numberInput = document.getElementById('experience');
 const experienceDisplay = document.getElementById('experienceDisplay');

 if (slider && numberInput && experienceDisplay) {
 // Atualizar número quando slider muda
 slider.addEventListener('input', function() {
 numberInput.value = this.value;
 experienceDisplay.textContent = `${this.value} ano${this.value !== '1' ? 's' : ''}`;
 });

 // Atualizar slider quando número muda
 numberInput.addEventListener('input', function() {
 slider.value = this.value;
 experienceDisplay.textContent = `${this.value} ano${this.value !== '1' ? 's' : ''}`;
 });

 // Inicializar display
 experienceDisplay.textContent = `${slider.value} ano${slider.value !== '1' ? 's' : ''}`;
 }

 // Permitir análise ao pressionar Enter em qualquer input
 document.querySelectorAll('.form-input, .form-select').forEach(element => {
 element.addEventListener('keypress', function(e) {
 if (e.key === 'Enter') {
 analyzeCandidate();
 }
 });
 });

 console.log('🎯 Selecione suas habilidades e clique em Analisar');
});

/**
 * Função para auto-fill do formulário (útil para testes)
 */
function autoFillForm() {
 document.getElementById('candidateName').value = 'Maria de Lourdes Celeski';
 document.getElementById('areaOfInterest').value = 'Front-End';
 document.getElementById('experience').value = '0';
 document.getElementById('experienceSlider').value = '0';

 // Pré-selecionar algumas skills
 const skillsToSelect = ['HTML', 'CSS', 'JavaScript', 'Git'];
 document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
 if (skillsToSelect.includes(checkbox.value)) {
 checkbox.checked = true;
 }
 });

 // Atualizar display de experiência
 document.getElementById('experienceDisplay').textContent = '0 anos';
 
 console.log('✅ Formulário preenchido com dados de exemplo');
}

// ============================================================================
// FUNÇÕES AUXILIARES PARA COMPATIBILIDADE
// ============================================================================

/**
 * Função para permitir teste rápido
 * Executa análise automaticamente com dados de exemplo
 */
function quickTest() {
 autoFillForm();
 analyzeCandidate();
}

/**
 * Reseta o formulário e resultados
 */
function resetAnalysis() {
 document.getElementById('candidateName').value = '';
 document.getElementById('areaOfInterest').value = '';
 document.getElementById('experience').value = '0';
 document.getElementById('skillsInput').value = '';

 document.getElementById('candidateSummary').style.display = 'none';
 document.getElementById('resultsSection').style.display = 'none';
 document.getElementById('bestOpportunitySection').style.display = 'none';
 document.getElementById('recommendationsSection').style.display = 'none';
 document.getElementById('statisticsSection').style.display = 'none';

 currentCandidate = null;
 analysisResults = null;
 recommendations = null;

 document.getElementById('candidateName').focus();
}

/**
 * Exporta resultados como JSON
 */
function exportResults() {
 if (!analysisResults) {
 alert('Por favor, realize uma análise primeiro.');
 return;
 }

 const data = {
 candidate: {
 name: currentCandidate.name,
 area: currentCandidate.areaOfInterest,
 experience: currentCandidate.yearsOfExperience,
 skills: currentCandidate.skills
 },
 results: analysisResults.map(r => ({
 company: r.job.company,
 title: r.job.title,
 score: r.score,
 classification: r.classification,
 missingSkills: r.missingSkills
 })),
 recommendations: recommendations,
 timestamp: new Date().toISOString()
 };

 const json = JSON.stringify(data, null, 2);
 const blob = new Blob([json], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `skillmatch_${currentCandidate.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
 a.click();
 URL.revokeObjectURL(url);

 console.log(' Resultados exportados como JSON');
}

// ============================================================================
// RANKING DE CANDIDATOS
// ============================================================================

/**
 * Salva o candidato atual no ranking (localStorage) após análise
 * @param {Candidate} candidate
 * @param {array} results
 */
function saveCandidateToRanking(candidate, results) {
 const existing = JSON.parse(localStorage.getItem('skillmatch_ranking') || '[]');

 const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length;
 const best = results.reduce((top, r) => r.score > top.score ? r : top, results[0]);

 let level;
 if (avg >= 80) level = '🟢 Pronto';
 else if (avg >= 60) level = '🔵 Quase lá';
 else if (avg >= 40) level = '🟡 Desenvolvendo';
 else level = '🔴 Iniciante';

 const entry = {
 id: Date.now(),
 name: candidate.name,
 area: candidate.areaOfInterest,
 experience: candidate.yearsOfExperience,
 skills: candidate.skills,
 avgScore: Math.round(avg),
 bestJob: `${best.job.company} — ${best.job.title}`,
 bestScore: Math.round(best.score),
 level,
 timestamp: new Date().toLocaleString('pt-BR')
 };

 existing.push(entry);
 localStorage.setItem('skillmatch_ranking', JSON.stringify(existing));
 renderRankingTable();
}

/**
 * Renderiza a tabela de ranking com os candidatos salvos
 * Ordena do maior para o menor avgScore
 */
function renderRankingTable() {
 const data = JSON.parse(localStorage.getItem('skillmatch_ranking') || '[]');
 const tbody = document.getElementById('rankingTableBody');
 const wrapper = document.getElementById('rankingTableWrapper');
 const empty = document.getElementById('rankingEmpty');

 if (!tbody) return;

 if (data.length === 0) {
 wrapper.style.display = 'none';
 empty.style.display = 'block';
 return;
 }

 // Ordena por compatibilidade média decrescente
 const sorted = [...data].sort((a, b) => b.avgScore - a.avgScore);

 wrapper.style.display = 'block';
 empty.style.display = 'none';

 tbody.innerHTML = sorted.map((entry, i) => {
 const isTop = i === 0;
 const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}°`;
 const scoreClass = entry.avgScore >= 80 ? 'alta' : entry.avgScore >= 50 ? 'media' : 'baixa';

 return `
 <tr class="${isTop ? 'ranking-row-top' : ''}">
 <td class="ranking-pos">${medal}</td>
 <td class="ranking-name">
 <strong>${entry.name}</strong>
 <small>${entry.timestamp}</small>
 </td>
 <td>${entry.area}</td>
 <td>${entry.experience} ano${entry.experience !== 1 ? 's' : ''}</td>
 <td class="ranking-skills">${entry.skills.slice(0, 4).join(', ')}${entry.skills.length > 4 ? ` +${entry.skills.length - 4}` : ''}</td>
 <td>
 <div class="ranking-score-cell">
 <span class="score-label ${scoreClass}">${entry.avgScore}%</span>
 <div class="ranking-mini-bar">
 <div class="ranking-mini-fill ${scoreClass}" style="width:${entry.avgScore}%"></div>
 </div>
 </div>
 </td>
 <td class="ranking-best-job">
 <small>${entry.bestJob}</small>
 <span class="ranking-best-score">${entry.bestScore}%</span>
 </td>
 <td>${entry.level}</td>
 <td>
 <button class="btn-remove-ranking" onclick="removeCandidateFromRanking(${entry.id})" title="Remover">✕</button>
 </td>
 </tr>
 `;
 }).join('');
}

/**
 * Remove um candidato específico do ranking
 * @param {number} id
 */
function removeCandidateFromRanking(id) {
 const data = JSON.parse(localStorage.getItem('skillmatch_ranking') || '[]');
 const updated = data.filter(entry => entry.id !== id);
 localStorage.setItem('skillmatch_ranking', JSON.stringify(updated));
 renderRankingTable();
}

/**
 * Limpa todo o ranking
 */
function clearCandidateRanking() {
 if (!confirm('Deseja apagar todo o ranking de candidatos?')) return;
 localStorage.removeItem('skillmatch_ranking');
 renderRankingTable();
}

// ============================================================================
// CONSOLE API PARA DEBUG
// ============================================================================

/**
 * Funções expostas no console para debug e teste
 */
window.SkillMatchDebug = {
 getCurrentCandidate: () => currentCandidate,
 getResults: () => analysisResults,
 getRecommendations: () => recommendations,
 autoFill: autoFillForm,
 reset: resetAnalysis,
 export: exportResults,
 quickTest: quickTest
};

console.log(`
╔════════════════════════════════════════════════════════╗
║ SkillMatch JS ║
║ Simulador de Compatibilidade ║
║ ║
║ Comandos disponíveis no console (window.SkillMatchDebug):
║ • quickTest() - Teste rápido com dados ║
║ • autoFill() - Preenche com dados de exemplo ║
║ • reset() - Limpa tudo e recomeça ║
║ • export() - Exporta resultados como JSON ║
║ • getCurrentCandidate() - Vê dados do candidato ║
║ • getResults() - Vê resultados da análise ║
║ • getRecommendations() - Vê recomendações ║
╚════════════════════════════════════════════════════════╝
`);
