import { Job } from './Job.js';

/**
 * Especialização de uma vaga voltada ao desenvolvimento front-end.
 * Além dos requisitos comuns, mantém informações da stack e senioridade
 * que serão apresentadas nos cards quando o catálogo vier do JSON.
 */
export class FrontEndJob extends Job {
 constructor(company, title, requiredSkills, details = {}) {
 super(company, title, requiredSkills, details);
 this.stack = details.stack || [];
 this.seniority = details.seniority || 'Júnior';
 }

 /**
 * Sobrescreve o resumo da vaga-base para incluir o contexto da especialidade.
 */
 getSummary() {
 const stackLabel = this.stack.length > 0 ? this.stack.join(', ') : 'Stack não informada';
 return `${super.getSummary()} | Senioridade: ${this.seniority} | Stack: ${stackLabel}`;
 }
}
