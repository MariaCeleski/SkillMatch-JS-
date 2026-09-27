/**
 * Camada de apresentação dos resultados, filtros e recomendações.
 * Mantém seu próprio estado de visualização para que app.js apenas orquestre o fluxo.
 */
export function createResultsView() {
 let analysisResults = [];
 let currentCandidate = null;
 const preferences = { modality: 'all', compatibility: 'all', sort: 'compatibility-desc' };

 function setupControls() {
  const modalityFilter = document.getElementById('modalityFilter');
  const compatibilityFilter = document.getElementById('compatibilityFilter');
  const jobSort = document.getElementById('jobSort');

  if (modalityFilter) modalityFilter.addEventListener('change', function() {
   preferences.modality = this.value;
   renderFilteredJobResults();
  });
  if (compatibilityFilter) compatibilityFilter.addEventListener('change', function() {
   preferences.compatibility = this.value;
   renderFilteredJobResults();
  });
  if (jobSort) jobSort.addEventListener('change', function() {
   preferences.sort = this.value;
   renderFilteredJobResults();
  });
 }

 function configureJobControls() {
  const controls = document.getElementById('jobControls');
  const modalityFilter = document.getElementById('modalityFilter');
  if (!controls || !modalityFilter) return;

  const modalities = [...new Set(analysisResults.map(result => result.job.modality).filter(Boolean))].sort();
  modalityFilter.innerHTML = '<option value="all">Todas as modalidades</option>';
  modalities.forEach(modality => {
   const option = document.createElement('option');
   option.value = modality;
   option.textContent = modality;
   modalityFilter.appendChild(option);
  });

  preferences.modality = 'all';
  preferences.compatibility = 'all';
  preferences.sort = 'compatibility-desc';
  modalityFilter.value = preferences.modality;
  document.getElementById('compatibilityFilter').value = preferences.compatibility;
  document.getElementById('jobSort').value = preferences.sort;
  controls.hidden = false;
 }

 function getVisibleJobResults() {
  return analysisResults
   .filter(result => preferences.modality === 'all' || result.job.modality === preferences.modality)
   .filter(result => {
    if (preferences.compatibility === 'alta') return result.score >= 80;
    if (preferences.compatibility === 'media') return result.score >= 50 && result.score < 80;
    if (preferences.compatibility === 'baixa') return result.score < 50;
    return true;
   })
   .sort((first, second) => {
    if (preferences.sort === 'salary-desc') return second.job.salary - first.job.salary;
    if (preferences.sort === 'salary-asc') return first.job.salary - second.job.salary;
    if (preferences.sort === 'company-asc') return first.job.company.localeCompare(second.job.company, 'pt-BR');
    return second.score - first.score;
   });
 }

 function renderFilteredJobResults() {
  const grid = document.getElementById('jobResultsGrid');
  const status = document.getElementById('jobsFilterStatus');
  if (!grid || !status) return;

  const visibleResults = getVisibleJobResults();
  grid.innerHTML = '';
  if (visibleResults.length === 0) {
   grid.innerHTML = '<p class="jobs-empty-message">Nada encontrado com os filtros selecionados.</p>';
   status.textContent = 'Nenhuma vaga encontrada com os filtros selecionados.';
   return;
  }

  visibleResults.forEach((result, index) => grid.appendChild(createJobCard(result, index)));
  const totalLabel = analysisResults.length === 1 ? 'vaga disponível' : 'vagas disponíveis';
  status.textContent = `Exibindo ${visibleResults.length} de ${analysisResults.length} ${totalLabel}.`;
 }

 function createJobCard(result, index) {
  const card = document.createElement('div');
  card.className = 'job-card';
  card.style.animationDelay = `${index * 0.1}s`;

  const { job, score, classification, missingSkills, isBestMatch } = result;
  const salary = formatSalary(job.salary);
  const stack = job.stack?.length > 0 ? job.stack.join(', ') : 'Não informada';
  const seniority = job.seniority || 'Não informada';
  const bestBadge = isBestMatch && score > 0 ? '⭐ ' : '';

  card.innerHTML = `
   <div class="job-header">
    <div class="job-company">${job.company}</div>
    <div class="job-title">${bestBadge}${job.title}</div>
   </div>
   <p class="job-description">${job.description}</p>
   <dl class="job-details">
    <div><dt>Modalidade</dt><dd>${job.modality}</dd></div>
    <div><dt>Salário</dt><dd>${salary}</dd></div>
    <div><dt>Senioridade</dt><dd>${seniority}</dd></div>
    <div><dt>Stack</dt><dd>${stack}</dd></div>
   </dl>
   <div class="compatibility-score">
    <div class="score-value">${score.toFixed(1)}%</div>
    <div class="score-bar"><div class="score-fill score-fill-${classification.toLowerCase().split(' ')[0]}" style="width: ${score}%"></div></div>
    <div class="score-label ${classification.toLowerCase().split(' ')[0]}">${classification}</div>
   </div>
   <div class="required-skills">
    <div class="skills-label">Habilidades Requeridas:</div>
    <div class="skills-container">
     ${job.requiredSkills.map(skill => {
      const isMatched = currentCandidate.hasSkill(skill);
      return `<span class="skill-tag ${isMatched ? 'matched' : 'missing'}">${isMatched ? '✓' : '✗'} ${skill}</span>`;
     }).join('')}
    </div>
   </div>
   ${missingSkills.length > 0 ? `
    <div class="required-skills" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
     <div class="skills-label">Skills Faltantes:</div>
     <div class="skills-container">${missingSkills.map(skill => `<span class="skill-tag missing">✗ ${skill}</span>`).join('')}</div>
    </div>` : `
    <div class="required-skills" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
     <div class="skills-label">✓ Você tem todas as skills necessárias!</div>
    </div>`}
  `;
  return card;
 }

 function displayBestOpportunity(bestResult) {
  const card = document.getElementById('bestOpportunityCard');
  const { job, score, classification } = bestResult;
  const stack = job.stack?.length > 0 ? job.stack.join(', ') : 'Não informada';
  card.innerHTML = `
   <h3>${job.company}</h3>
   <p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 1rem;">${job.title}</p>
   <div class="opportunity-info">
    <div class="opportunity-info-item"><strong>Compatibilidade</strong><span>${score.toFixed(1)}%</span></div>
    <div class="opportunity-info-item"><strong>Classificação</strong><span>${classification}</span></div>
    <div class="opportunity-info-item"><strong>Skills Requeridas</strong><span>${job.requiredSkills.length}</span></div>
    <div class="opportunity-info-item"><strong>Modalidade</strong><span>${job.modality}</span></div>
    <div class="opportunity-info-item"><strong>Salário</strong><span>${formatSalary(job.salary)}</span></div>
    <div class="opportunity-info-item"><strong>Stack</strong><span>${stack}</span></div>
   </div>`;
 }

 function displayRecommendations(recommendations) {
  const list = document.getElementById('recommendationsList');
  list.innerHTML = '';
  recommendations.forEach((skill, index) => {
   const item = document.createElement('div');
   item.className = 'recommendation-item';
   item.style.animationDelay = `${index * 0.1}s`;
   item.innerHTML = `<div class="recommendation-priority">${index + 1}</div><div class="recommendation-text"><strong>${skill}</strong><small>Aprenda esta habilidade para melhorar suas oportunidades</small></div>`;
   list.appendChild(item);
  });
 }

 function displayStatistics(recommendations) {
  const maxScore = Math.max(...analysisResults.map(result => result.score));
  const avgScore = (analysisResults.reduce((sum, result) => sum + result.score, 0) / analysisResults.length).toFixed(1);
  document.getElementById('totalJobs').textContent = analysisResults.length;
  document.getElementById('maxCompatibility').textContent = `${maxScore.toFixed(1)}%`;
  document.getElementById('avgCompatibility').textContent = `${avgScore}%`;
  document.getElementById('skillsToLearn').textContent = recommendations.length;
 }

 function updateReadinessMeter() {
  const meter = document.getElementById('readinessMeter');
  const badge = document.getElementById('readinessBadge');
  const fill = document.getElementById('readinessBarFill');
  const scoreEl = document.getElementById('readinessScore');
  const messageEl = document.getElementById('readinessMessage');
  if (!meter || analysisResults.length === 0) return;

  const avg = analysisResults.reduce((sum, result) => sum + result.score, 0) / analysisResults.length;
  const rounded = Math.round(avg);
  let level = 'Iniciante', color = '#ef4444', message = 'Comece pelos fundamentos. Cada skill aprendida abre novas oportunidades!', emoji = '🔴';
  if (avg >= 80) [level, color, message, emoji] = ['Pronto para o Mercado', '#10b981', 'Seu perfil atende bem à maioria das vagas. Candidate-se com confiança!', '🟢'];
  else if (avg >= 60) [level, color, message, emoji] = ['Quase lá', '#6366f1', 'Bom perfil! Algumas skills a mais vão abrir muitas portas.', '🔵'];
  else if (avg >= 40) [level, color, message, emoji] = ['Em Desenvolvimento', '#f59e0b', 'Você está no caminho certo. Foque nas recomendações abaixo.', '🟡'];
  badge.textContent = `${emoji} ${level}`;
  badge.style.background = color;
  fill.style.width = `${rounded}%`;
  fill.style.background = color;
  scoreEl.textContent = `Média: ${rounded}%`;
  messageEl.textContent = message;
  meter.style.display = 'block';
 }

 function display(results, recommendations, candidate) {
  analysisResults = results;
  currentCandidate = candidate;
  configureJobControls();
  renderFilteredJobResults();
  const bestResult = analysisResults.find(result => result.isBestMatch);
  const hasBestResult = bestResult && bestResult.score > 0;
  if (hasBestResult) displayBestOpportunity(bestResult);
  if (recommendations.length > 0) displayRecommendations(recommendations);
  displayStatistics(recommendations);
  updateReadinessMeter();
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('bestOpportunitySection').style.display = hasBestResult ? 'block' : 'none';
  document.getElementById('recommendationsSection').style.display = recommendations.length > 0 ? 'block' : 'none';
  document.getElementById('statisticsSection').style.display = 'block';
 }

 function displayEmpty() {
  document.getElementById('jobResultsGrid').innerHTML = '';
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('bestOpportunitySection').style.display = 'none';
  document.getElementById('recommendationsSection').style.display = 'none';
  document.getElementById('statisticsSection').style.display = 'none';
 }

 return { setupControls, display, displayEmpty };
}

function formatSalary(salary) {
 if (!salary || salary <= 0) return 'Não informado';
 return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(salary);
}
