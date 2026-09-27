import { Candidate } from '../backend/models/Candidate.js';
import { SkillMatcher } from '../backend/models/SkillMatcher.js';
import { createDataLoader } from '../backend/services/dataLoader.js';
import { createRecommendationService } from '../backend/services/recommendationEngine.js';
import { loadProfile, saveProfile } from '../backend/services/profileStorage.js';
import { getProfileFormData, restoreProfileForm } from './ui/profileForm.js';
import { createResultsView } from './ui/resultsView.js';
import { setupRanking, saveCandidateToRanking } from './ui/rankingView.js';
import { setupThemePreference } from './ui/theme.js';

/** Coordena o formulário, motor e módulos visuais da página. */
let currentCandidate = null;
let analysisResults = null;
let recommendations = null;
const dataLoader = createDataLoader();
const resultsView = createResultsView();

async function analyzeCandidate() {
 try {
  const candidateData = getProfileFormData();
  if (!candidateData) return;

  currentCandidate = new Candidate(candidateData.name, candidateData.area, candidateData.skills, candidateData.experience);
  saveProfile(currentCandidate);
  displayCandidateSummary(currentCandidate);

  showLoadingState('Carregando vagas...');
  showDataStatus('Carregando vagas...', 'loading');
  const jobs = await dataLoader.load((error, loadedJobs) => {
   if (error) return console.warn('O callback recebeu uma falha ao carregar as vagas.', error);
   console.info(`Catálogo carregado pelo callback: ${loadedJobs.length} vaga(s).`);
  });
  hideLoadingState();

  if (jobs.length === 0) {
   showDataStatus('Nenhuma vaga está disponível no momento.', 'empty');
   resultsView.displayEmpty();
   return;
  }

  hideDataStatus();
  analysisResults = new SkillMatcher().analyzeCandidate(currentCandidate, jobs);
  recommendations = createRecommendationService().generate(analysisResults);
  resultsView.display(analysisResults, recommendations, currentCandidate);
  saveCandidateToRanking(currentCandidate, analysisResults);
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
 } catch (error) {
  hideLoadingState();
  console.error('Erro durante análise:', error);
  showDataStatus('Não foi possível carregar as vagas. Tente novamente em instantes.', 'error');
 }
}

function displayCandidateSummary(candidate) {
 const summary = document.getElementById('candidateSummary');
 const content = document.querySelector('.summary-content');
 const name = document.getElementById('summaryName');
 const area = document.getElementById('summaryArea');
 const experience = document.getElementById('summaryExp');
 const skills = document.getElementById('summarySkills');
 if (!summary || !content || !name || !area || !experience || !skills) return false;

 name.textContent = candidate.name || 'N/A';
 area.textContent = candidate.areaOfInterest || 'N/A';
 experience.textContent = candidate.yearsOfExperience ?? 0;
 skills.textContent = candidate.skills?.length ? candidate.skills.join(', ') : 'Nenhuma habilidade informada';
 summary.style.display = 'block';
 content.style.display = 'block';
 summary.style.animation = 'slideIn 0.3s ease-in-out';
 return true;
}

function showLoadingState(message) {
 const button = document.querySelector('.btn-primary');
 if (!button) return;
 button.disabled = true;
 button.innerHTML = `<span class="loading" aria-hidden="true"></span> ${message}`;
}

function hideLoadingState() {
 const button = document.querySelector('.btn-primary');
 if (!button) return;
 button.disabled = false;
 button.textContent = 'Analisar Compatibilidade';
}

function showDataStatus(message, statusType) {
 const status = document.getElementById('dataStatus');
 if (!status) return;
 status.textContent = message;
 status.className = `data-status data-status-${statusType}`;
 status.hidden = false;
}

function hideDataStatus() {
 const status = document.getElementById('dataStatus');
 if (status) status.hidden = true;
}

function setupExperienceInputs() {
 const slider = document.getElementById('experienceSlider');
 const numberInput = document.getElementById('experience');
 const display = document.getElementById('experienceDisplay');
 if (!slider || !numberInput || !display) return;
 const updateDisplay = value => { display.textContent = `${value} ano${value !== '1' ? 's' : ''}`; };
 slider.addEventListener('input', function() {
  numberInput.value = this.value;
  updateDisplay(this.value);
 });
 numberInput.addEventListener('input', function() {
  slider.value = this.value;
  updateDisplay(this.value);
 });
 updateDisplay(slider.value);
}

function autoFillForm() {
 document.getElementById('candidateName').value = 'Maria de Lourdes Celeski';
 document.getElementById('areaOfInterest').value = 'Front-End';
 document.getElementById('experience').value = '0';
 document.getElementById('experienceSlider').value = '0';
 document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
  checkbox.checked = ['HTML', 'CSS', 'JavaScript', 'Git'].includes(checkbox.value);
 });
 document.getElementById('experienceDisplay').textContent = '0 anos';
}

function resetAnalysis() {
 document.getElementById('candidateForm').reset();
 document.getElementById('experienceSlider').value = '0';
 document.getElementById('experienceDisplay').textContent = '0 anos';
 ['candidateSummary', 'resultsSection', 'bestOpportunitySection', 'recommendationsSection', 'statisticsSection'].forEach(id => {
  document.getElementById(id).style.display = 'none';
 });
 currentCandidate = null;
 analysisResults = null;
 recommendations = null;
 document.getElementById('candidateName').focus();
}

function exportResults() {
 if (!analysisResults || !currentCandidate) {
  alert('Por favor, realize uma análise primeiro.');
  return;
 }
 const data = {
  candidate: { name: currentCandidate.name, area: currentCandidate.areaOfInterest, experience: currentCandidate.yearsOfExperience, skills: currentCandidate.skills },
  results: analysisResults.map(result => ({ company: result.job.company, title: result.job.title, score: result.score, classification: result.classification, missingSkills: result.missingSkills })),
  recommendations,
  timestamp: new Date().toISOString()
 };
 const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
 const link = document.createElement('a');
 link.href = url;
 link.download = `skillmatch_${currentCandidate.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
 link.click();
 URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
 setupThemePreference();
 restoreProfileForm(loadProfile());
 resultsView.setupControls();
 setupRanking();
 setupExperienceInputs();
 const form = document.getElementById('candidateForm');
 if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  analyzeCandidate();
 });
});

window.SkillMatchDebug = {
 getCurrentCandidate: () => currentCandidate,
 getResults: () => analysisResults,
 getRecommendations: () => recommendations,
 autoFill: autoFillForm,
 reset: resetAnalysis,
 export: exportResults,
 quickTest: () => { autoFillForm(); analyzeCandidate(); }
};
