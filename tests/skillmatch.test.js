import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { Candidate } from '../backend/models/Candidate.js';
import { FrontEndJob } from '../backend/models/FrontEndJob.js';
import { Job } from '../backend/models/Job.js';
import { SkillMatcher } from '../backend/models/SkillMatcher.js';
import { createDataLoader, mapJobData, loadJobsFromServer } from '../backend/services/dataLoader.js';
import { loadProfile, PROFILE_STORAGE_KEY, saveProfile } from '../backend/services/profileStorage.js';
import { generateRecommendations } from '../backend/services/recommendationEngine.js';

const rawFrontEndJob = {
 id: 'frontend-01',
 company: 'SkillMatch Labs',
 title: 'Pessoa Desenvolvedora Front-End',
 area: 'Front-End',
 requiredSkills: ['HTML', 'CSS', 'JavaScript'],
 stack: ['JavaScript'],
 seniority: 'Júnior',
 salary: 4500,
 modality: 'Remoto'
};

test('formulário usa submit e expõe mensagens de validação acessíveis', () => {
 const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8');
 const app = readFileSync(new URL('../frontend/app.js', import.meta.url), 'utf8');
 const profileForm = readFileSync(new URL('../frontend/ui/profileForm.js', import.meta.url), 'utf8');

 assert.match(html, /<form class="candidate-form" id="candidateForm" novalidate>/);
 assert.match(html, /type="submit"/);
 assert.match(html, /id="candidateNameError" role="alert"/);
 assert.match(html, /id="skillsError" role="alert"/);
 assert.match(app, /candidateForm\.addEventListener\('submit'/);
 assert.match(profileForm, /firstInvalidField\.focus\(\)/);
});

test('interface é separada em módulos ES para formulário e tema', () => {
 const app = readFileSync(new URL('../frontend/app.js', import.meta.url), 'utf8');

 assert.match(app, /from '\.\/ui\/profileForm\.js'/);
 assert.match(app, /from '\.\/ui\/theme\.js'/);
 assert.doesNotMatch(app, /function getFormData\(/);
 assert.doesNotMatch(app, /function setupThemePreference\(/);
});

test('página oferece SEO e atalhos de navegação acessíveis', () => {
 const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8');

 assert.match(html, /<meta name="description"/);
 assert.match(html, /href="#mainContent">Pular para o conteúdo principal/);
 assert.match(html, /<nav class="main-nav" aria-label="Navegação principal">/);
 assert.match(html, /<main class="main-content" id="mainContent" tabindex="-1">/);
 assert.match(html, /<img class="logo-image" src="assets\/skillmatch-logo\.svg" alt="SkillMatch JS">/);
});

test('layout principal usa Flexbox em vez de CSS Grid', () => {
 const css = readFileSync(new URL('../frontend/styles.css', import.meta.url), 'utf8');

 assert.match(css, /\.candidate-form \{\s+display: flex;/);
 assert.match(css, /\.jobs-grid \{\s+display: flex;/);
 assert.match(css, /\.statistics-grid \{\s+display: flex;/);
 assert.doesNotMatch(css, /display:\s*grid|grid-template-columns|grid-column/);
});

test('camada responsiva parte do mobile e expande com min-width', () => {
 const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8');
 const css = readFileSync(new URL('../frontend/styles.css', import.meta.url), 'utf8');

 assert.doesNotMatch(html, /responsive\.css/);
 assert.match(css, /Base mobile-first/);
 assert.match(css, /@media \(min-width: 769px\)/);
});

test('toda habilidade exigida pelo catálogo pode ser selecionada no formulário', () => {
 const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8');
 const catalog = JSON.parse(readFileSync(new URL('../data/jobs.json', import.meta.url), 'utf8'));
 const selectableSkills = new Set(
 [...html.matchAll(/<input type="checkbox" name="skills" value="([^"]+)"[^>]*>/g)].map(([, skill]) => skill)
 );
 const requiredSkills = new Set(catalog.flatMap(job => job.requiredSkills));

 assert.ok(selectableSkills.has('Responsive Design'));
 assert.deepEqual([...requiredSkills].filter(skill => !selectableSkills.has(skill)), []);
});

test('Responsive Design compõe a compatibilidade e deixa de ser habilidade faltante', () => {
 const candidate = new Candidate('Lia', 'Front-End', ['HTML', 'CSS', 'JavaScript', 'Responsive Design'], 1);
 const job = new Job('Empresa UI', 'UI Developer', ['HTML', 'CSS', 'JavaScript', 'Responsive Design']);
 const matcher = new SkillMatcher();

 assert.equal(matcher.calculateCompatibility(candidate, job), 100);
 assert.deepEqual(matcher.getMissingSkills(candidate, job), []);
});

test('ranking oferece rótulos para a versão responsiva em cards', () => {
 const app = readFileSync(new URL('../frontend/app.js', import.meta.url), 'utf8');
 const css = readFileSync(new URL('../frontend/styles.css', import.meta.url), 'utf8');

 assert.match(app, /data-label="Compatibilidade"/);
 assert.match(app, /data-label="Melhor vaga"/);
 assert.match(css, /@media \(max-width: 1440px\)/);
 assert.match(css, /content: attr\(data-label\)/);
});

test('perfil é persistido, restaurado e trata a primeira visita', () => {
 const originalStorage = globalThis.localStorage;
 const originalWarn = console.warn;
 const values = new Map();
 globalThis.localStorage = {
 getItem: key => values.get(key) ?? null,
 setItem: (key, value) => values.set(key, value)
 };

 try {
 assert.equal(loadProfile(), null);
 assert.equal(saveProfile(new Candidate('Bia', 'Front-End', ['HTML', 'CSS'], 2)), true);
 assert.deepEqual(loadProfile(), {
 name: 'Bia',
 areaOfInterest: 'Front-End',
 skills: ['HTML', 'CSS'],
 yearsOfExperience: 2
 });

 values.set(PROFILE_STORAGE_KEY, '{perfil inválido');
 console.warn = () => {};
 assert.equal(loadProfile(), null);
 } finally {
 globalThis.localStorage = originalStorage;
 console.warn = originalWarn;
 }
});

test('motor calcula compatibilidade, skills faltantes e melhor oportunidade', () => {
 const candidate = new Candidate('Ana', 'Front-End', ['HTML', 'CSS', 'JavaScript'], 1);
 const matchingJob = new Job('Empresa A', 'Front-End Júnior', ['HTML', 'CSS', 'JavaScript']);
 const otherJob = new Job('Empresa B', 'Front-End Pleno', ['React', 'TypeScript', 'JavaScript']);
 const results = new SkillMatcher().analyzeCandidate(candidate, [matchingJob, otherJob]);

 assert.equal(results[0].score, 100);
 assert.equal(results[0].classification, 'Alta compatibilidade');
 assert.deepEqual(results[1].missingSkills, ['React', 'TypeScript']);
 assert.equal(results[1].score, 33.33);
 assert.equal(results[0].isBestMatch, true);
});

test('recomendações priorizam a habilidade ausente mais frequente', () => {
 const recommendations = generateRecommendations([
 { missingSkills: ['React', 'TypeScript'] },
 { missingSkills: ['React', 'Node.js'] }
 ]);

 assert.deepEqual(recommendations, ['React', 'TypeScript', 'Node.js']);
});

test('catálogo transforma uma vaga Front-End em FrontEndJob', () => {
 const job = mapJobData(rawFrontEndJob);

 assert.ok(job instanceof FrontEndJob);
 assert.equal(job.salary, 4500);
 assert.deepEqual(job.stack, ['JavaScript']);
});

test('fetch bem-sucedido retorna instâncias prontas para o motor', async () => {
 const originalFetch = globalThis.fetch;
 globalThis.fetch = async () => new Response(JSON.stringify([rawFrontEndJob]), { status: 200 });

 try {
 const jobs = await loadJobsFromServer();
 assert.equal(jobs.length, 1);
 assert.ok(jobs[0] instanceof FrontEndJob);
 } finally {
 globalThis.fetch = originalFetch;
 }
});

test('fetch vazio retorna lista vazia para a interface exibir o estado vazio', async () => {
 const originalFetch = globalThis.fetch;
 globalThis.fetch = async () => new Response('[]', { status: 200 });

 try {
 assert.deepEqual(await loadJobsFromServer(), []);
 } finally {
 globalThis.fetch = originalFetch;
 }
});

test('fetch com erro HTTP rejeita para a interface exibir o estado de erro', async () => {
 const originalFetch = globalThis.fetch;
 globalThis.fetch = async () => new Response('indisponível', { status: 503 });

 try {
 await assert.rejects(loadJobsFromServer(), /HTTP 503/);
 } finally {
 globalThis.fetch = originalFetch;
 }
});

test('loader usado pela interface mantém a closure e executa o callback', async () => {
 const originalFetch = globalThis.fetch;
 const loader = createDataLoader();
 let callbackJobs = null;
 globalThis.fetch = async () => new Response(JSON.stringify([rawFrontEndJob]), { status: 200 });

 try {
 const jobs = await loader.load((error, loadedJobs) => {
 assert.equal(error, null);
 callbackJobs = loadedJobs;
 });
 assert.equal(loader.getLoadCount(), 1);
 assert.equal(loader.getCachedData().length, 1);
 assert.equal(callbackJobs, jobs);
 } finally {
 globalThis.fetch = originalFetch;
 }
});
