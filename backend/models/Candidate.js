
  //CANDIDATE.JS
 
  //Classe que representa um candidato com suas habilidades e experiência.
  //Demonstra conceitos: Classes, Construtor, Métodos, This
 

class Candidate {
 /**
 * Construtor da classe Candidate
 * @param {string} name - Nome do candidato
 * @param {string} areaOfInterest - Área de interesse (ex: "Front-End")
 * @param {array} skills - Lista de habilidades dominadas
 * @param {number} yearsOfExperience - Anos de experiência profissional
 */
 constructor(name, areaOfInterest, skills, yearsOfExperience) {
 this.name = name;
 this.areaOfInterest = areaOfInterest;
 this.skills = skills; // Array de strings: ['HTML', 'CSS', 'JavaScript']
 this.yearsOfExperience = yearsOfExperience;
 this.isValid = true; // Flag de validação (boolean - requisito de tipo de dado)
 }

 /**
 * Método que retorna um resumo do candidato
 * Uso de 'this' para acessar atributos da instância
 * @returns {string} Resumo formatado
 */
 getSummary() {
 return `${this.name} - Área: ${this.areaOfInterest} | Exp: ${this.yearsOfExperience} ano(s) | Skills: ${this.skills.join(', ')}`;
 }

 /**
 * Método para verificar se candidato possui uma skill específica
 * Uso de 'this' e métodos de array (includes)
 * @param {string} skill - Nome da habilidade
 * @returns {boolean}
 */
 hasSkill(skill) {
 return this.skills.includes(skill);
 }

 /**
 * Método para adicionar uma nova skill
 * @param {string} skill - Nova habilidade a adicionar
 */
 addSkill(skill) {
 if (!this.skills.includes(skill)) {
 this.skills.push(skill);
 }
 }

 /**
 * Método que retorna cópia da lista de skills
 * Demonstra uso de spread operator
 * @returns {array} Cópia do array de skills
 */
 getSkillsList() {
 return [...this.skills];
 }
}


