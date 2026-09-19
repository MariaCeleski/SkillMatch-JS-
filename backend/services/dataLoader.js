
 //DATALOADER.JS
 
 //Simula carregamento de dados de um servidor usando Promise e async/await.
 //Demonstra conceitos: Promise, async/await, callback, delay simulado
 

import { Job } from '../models/Job.js';
import { FrontEndJob } from '../models/FrontEndJob.js';

const jobsUrl = new URL('../../data/jobs.json', import.meta.url);

/**
 * Transforma os dados do JSON nas instâncias usadas pelo motor SkillMatch.
 * @param {object} jobData Dados brutos de uma vaga.
 * @returns {Job} Vaga pronta para a análise.
 */
export function mapJobData(jobData) {
 if (!jobData || !jobData.company || !jobData.title || !Array.isArray(jobData.requiredSkills)) {
 throw new Error('O catálogo contém uma vaga inválida.');
 }

 if (jobData.area === 'Front-End') {
 return new FrontEndJob(jobData.company, jobData.title, jobData.requiredSkills, jobData);
 }

 return new Job(jobData.company, jobData.title, jobData.requiredSkills, jobData);
}

/**
 * Carrega o catálogo local de vagas por uma requisição HTTP.
 *
 * @returns {Promise<Job[]>} Vagas transformadas em objetos do domínio.
 */
export async function loadJobsFromServer() {
 const response = await fetch(jobsUrl);

 if (!response.ok) {
 throw new Error(`Não foi possível carregar as vagas (HTTP ${response.status}).`);
 }

 const jobsData = await response.json();

 if (!Array.isArray(jobsData)) {
 throw new Error('O catálogo de vagas possui um formato inválido.');
 }

 return jobsData.map(mapJobData);
}

/**
 * Função async que gerencia o carregamento de dados
 * Demonstra async/await
 *
 * @param {Function} callback - Função de callback executada após carregamento
 * @returns {Promise}
 */
export async function loadDataAsync(callback) {
 console.log('⏳ Carregando vagas do servidor...');

 try {
 // Aguarda o Promise ser resolvido
 const jobs = await loadJobsFromServer();

 console.log(' Vagas carregadas com sucesso!');

 // Executa o callback com os dados carregados
 // Demonstra uso de callback
 if (callback && typeof callback === 'function') {
 callback(null, jobs);
 }

 return jobs;
 } catch (error) {
 console.error(' Erro ao carregar vagas:', error);

 // Callback com erro
 if (callback && typeof callback === 'function') {
 callback(error, null);
 }

 throw error;
 }
}

/**
 * CLOSURE: Cria um "carregador" que mantém estado entre chamadas
 * Demonstra encapsulamento de estado sem variáveis globais
 */
export function createDataLoader() {
 let loadCount = 0; // Valor interno preservado entre chamadas
 const loadedData = []; // Cache de dados carregados

 // Retorna objeto com métodos que acessam as variáveis internas (closure)
 return {
 /**
 * Carrega dados e incrementa contador
 * @returns {Promise}
 */
 async load() {
 loadCount++;
 console.log(` Tentativa de carregamento #${loadCount}`);

 try {
 const jobs = await loadJobsFromServer();
 loadedData.push(...jobs);
 return jobs;
 } catch (error) {
 console.error('Erro no carregamento', error);
 throw error;
 }
 },

 /**
 * Obtém número de vezes que dados foram carregados
 * Demonstra que o valor persiste entre chamadas (closure)
 * @returns {number}
 */
 getLoadCount() {
 return loadCount;
 },

 /**
 * Obtém dados em cache
 * @returns {array}
 */
 getCachedData() {
 return [...loadedData];
 },

 /**
 * Reseta o contador
 */
 resetCounter() {
 loadCount = 0;
 loadedData.length = 0;
 }
 };
}
