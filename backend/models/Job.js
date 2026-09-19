
//JOB.JS
 
//Classe que representa uma vaga de emprego com seus requisitos.
//Demonstra conceitos: Classes, Construtor, Métodos, This
 

export class Job {
 /**
 * Construtor da classe Job
 * @param {string} company - Nome da empresa
 * @param {string} title - Título da vaga
 * @param {array} requiredSkills - Habilidades requeridas
 */
 constructor(company, title, requiredSkills, details = {}) {
 this.id = details.id ?? null;
 this.company = company;
 this.title = title;
 this.requiredSkills = requiredSkills; // Array de strings: ['HTML', 'CSS', 'JavaScript']
 this.description = details.description || `Vaga de ${title} na empresa ${company}`;
 this.salary = details.salary ?? 0;
 this.modality = details.modality || 'Remoto';
 this.remote = details.remote ?? this.modality === 'Remoto';
 }

 /**
 * Método que retorna um resumo da vaga
 * Demonstração de uso de 'this' para acessar atributos
 * @returns {string} Resumo formatado
 */
 getSummary() {
 return `${this.company} - ${this.title} | Skills requeridas: ${this.requiredSkills.join(', ')}`;
 }

 /**
 * Método para obter lista de habilidades requeridas
 * @returns {array} Cópia do array de skills requeridas
 */
 getRequiredSkills() {
 return [...this.requiredSkills];
 }

 /**
 * Método para verificar quantas skills requeridas existem
 * @returns {number}
 */
 getSkillCount() {
 return this.requiredSkills.length;
 }
}
