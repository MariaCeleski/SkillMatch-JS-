
//JOB.JS
 
//Classe que representa uma vaga de emprego com seus requisitos.
//Demonstra conceitos: Classes, Construtor, Métodos, This
 

class Job {
 /**
 * Construtor da classe Job
 * @param {string} company - Nome da empresa
 * @param {string} title - Título da vaga
 * @param {array} requiredSkills - Habilidades requeridas
 */
 constructor(company, title, requiredSkills) {
 this.company = company;
 this.title = title;
 this.requiredSkills = requiredSkills; // Array de strings: ['HTML', 'CSS', 'JavaScript']
 this.description = `Vaga de ${title} na empresa ${company}`; // String
 this.salary = 0; // Número
 this.remote = true; // Boolean (requisito de tipo de dado)
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


