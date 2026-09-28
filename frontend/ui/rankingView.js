const RANKING_STORAGE_KEY = 'skillmatch_ranking';

export function setupRanking() {
 const clearButton = document.getElementById('clearRankingButton');
 const tableBody = document.getElementById('rankingTableBody');
 if (clearButton) clearButton.addEventListener('click', clearCandidateRanking);
 if (tableBody) tableBody.addEventListener('click', event => {
  const removeButton = event.target.closest('[data-ranking-id]');
  if (removeButton) removeCandidateFromRanking(Number(removeButton.dataset.rankingId));
 });
 renderRankingTable();
}

export function saveCandidateToRanking(candidate, results) {
 const entries = getEntries();
 const avg = results.reduce((sum, result) => sum + result.score, 0) / results.length;
 const best = results.reduce((top, result) => result.score > top.score ? result : top, results[0]);
 const level = avg >= 80 ? '🟢 Pronto' : avg >= 60 ? '🔵 Quase lá' : avg >= 40 ? '🟡 Desenvolvendo' : '🔴 Iniciante';
 entries.push({
  id: Date.now(), name: candidate.name, area: candidate.areaOfInterest,
  experience: candidate.yearsOfExperience, skills: candidate.skills, avgScore: Math.round(avg),
  bestJob: `${best.job.company} — ${best.job.title}`, bestScore: Math.round(best.score), level,
  timestamp: new Date().toLocaleString('pt-BR')
 });
 localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(entries));
 renderRankingTable();
}

export function renderRankingTable() {
 const entries = getEntries();
 const tbody = document.getElementById('rankingTableBody');
 const wrapper = document.getElementById('rankingTableWrapper');
 const empty = document.getElementById('rankingEmpty');
 if (!tbody || !wrapper || !empty) return;
 if (entries.length === 0) {
  wrapper.style.display = 'none';
  empty.style.display = 'block';
  return;
 }
 const sorted = [...entries].sort((first, second) => second.avgScore - first.avgScore);
 wrapper.style.display = 'block';
 empty.style.display = 'none';
 tbody.innerHTML = sorted.map((entry, index) => rankingRow(entry, index)).join('');
}

function clearCandidateRanking() {
 if (!confirm('Deseja apagar todo o ranking de candidatos?')) return;
 localStorage.removeItem(RANKING_STORAGE_KEY);
 renderRankingTable();
}

function removeCandidateFromRanking(id) {
 localStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(getEntries().filter(entry => entry.id !== id)));
 renderRankingTable();
}

function getEntries() {
 try {
  const stored = JSON.parse(localStorage.getItem(RANKING_STORAGE_KEY) || '[]');
  return Array.isArray(stored) ? stored : [];
 } catch {
  return [];
 }
}

function rankingRow(entry, index) {
 const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`;
 const scoreClass = entry.avgScore >= 80 ? 'alta' : entry.avgScore >= 50 ? 'media' : 'baixa';
 return `
 <tr class="${index === 0 ? 'ranking-row-top' : ''}">
  <td class="ranking-pos" data-label="Posição">${medal}</td>
  <td class="ranking-name" data-label="Candidato"><strong>${entry.name}</strong><small>${entry.timestamp}</small></td>
  <td data-label="Área">${entry.area}</td>
  <td data-label="Experiência">${entry.experience} ano${entry.experience !== 1 ? 's' : ''}</td>
  <td class="ranking-skills" data-label="Habilidades">${entry.skills.slice(0, 4).join(', ')}${entry.skills.length > 4 ? ` +${entry.skills.length - 4}` : ''}</td>
  <td data-label="Compatibilidade"><div class="ranking-score-cell"><span class="score-label ${scoreClass}">${entry.avgScore}%</span><div class="ranking-mini-bar"><div class="ranking-mini-fill ${scoreClass}" style="width:${entry.avgScore}%"></div></div></div></td>
  <td class="ranking-best-job" data-label="Melhor vaga"><small>${entry.bestJob}</small><span class="ranking-best-score">${entry.bestScore}%</span></td>
  <td data-label="Nível">${entry.level}</td>
  <td data-label="Ações"><button class="btn-remove-ranking" type="button" data-ranking-id="${entry.id}" title="Remover candidato">✕</button></td>
 </tr>`;
}
