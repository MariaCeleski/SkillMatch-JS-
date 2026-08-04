
 //DATALOADER.JS
 
 //Simula carregamento de dados de um servidor usando Promise e async/await.
 //Demonstra conceitos: Promise, async/await, callback, delay simulado
 

/**
 * Simula o carregamento de vagas como se viessem de um servidor
 * Retorna uma Promise que resolve após um delay
 *
 * @param {number} delayMs - Delay em milissegundos (padrão: 2000ms)
 * @returns {Promise} Promise que resolve com array de vagas
 */
function loadJobsFromServer(delayMs = 2000) {
 return new Promise((resolve, reject) => {
 // Simula busca em servidor com setTimeout
 setTimeout(() => {
 // Dados fictícios
 const jobs = [
 new Job('Tech StartUp', 'Front-End Developer', ['HTML', 'CSS', 'JavaScript']),
 new Job('Digital Agency', 'Junior Developer', ['JavaScript', 'React', 'CSS']),
 new Job('E-Commerce Company', 'UI Developer', ['HTML', 'CSS', 'JavaScript', 'Responsive Design'])
 ];

 // Resolve com os dados carregados
 resolve(jobs);
 }, delayMs);
 });
}

/**
 * Função async que gerencia o carregamento de dados
 * Demonstra async/await
 *
 * @param {Function} callback - Função de callback executada após carregamento
 * @returns {Promise}
 */
async function loadDataAsync(callback) {
 console.log('⏳ Carregando vagas do servidor...');

 try {
 // Aguarda o Promise ser resolvido
 const jobs = await loadJobsFromServer(2000);

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
function createDataLoader() {
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
 const jobs = await loadJobsFromServer(1500);
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

