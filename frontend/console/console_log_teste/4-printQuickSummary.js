/**
 * PRINTQUICKSUMMARY.JS
 * 
 * Imprime apenas um resumo rápido
 * Útil para testes e verificações rápidas
 * Demonstra conceitos: Loop (while), Condicional (ternário), Operadores
 */

// Funções auxiliares
function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function printQuickSummary(candidate, analysisResults) {
  console.log(`\n ${candidate.name} - ${candidate.areaOfInterest}`);
  console.log(`Skills: ${candidate.skills.join(', ')}`);
  console.log('\nCompatibilidades:');

  // Demonstra loop com while
  let index = 0;
  while (index < analysisResults.length) {
    const result = analysisResults[index];
    // Operador ternário para escolher ícone baseado na compatibilidade
    const statusIcon = result.score >= 80 ? '✅' : result.score >= 50 ? '⚠️ ' : '❌';
    console.log(` ${statusIcon} ${result.job.company}: ${formatPercentage(result.score)}`);
    index++;
  }
}

// ========== DADOS DE TESTE ==========

const candidatoTeste1 = {
  name: 'João Santos',
  areaOfInterest: 'Desenvolvimento Front-End',
  skills: ['HTML', 'CSS', 'JavaScript', 'React']
};

const resultadosAnalise1 = [
  {
    job: {
      company: 'TechCorp',
      title: 'Junior React Developer',
      requiredSkills: ['JavaScript', 'React', 'CSS']
    },
    score: 95,
    classification: 'Excelente',
    missingSkills: [],
    isBestMatch: true
  },
  {
    job: {
      company: 'WebSolutions',
      title: 'Front-End Developer',
      requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Vue.js']
    },
    score: 72,
    classification: 'Bom',
    missingSkills: ['Vue.js'],
    isBestMatch: false
  },
  {
    job: {
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      requiredSkills: ['Node.js', 'MongoDB', 'React']
    },
    score: 45,
    classification: 'Mediano',
    missingSkills: ['Node.js', 'MongoDB'],
    isBestMatch: false
  }
];

// Segundo candidato para teste
const candidatoTeste2 = {
  name: 'Ana Costa',
  areaOfInterest: 'Desenvolvimento Back-End',
  skills: ['JavaScript', 'Node.js', 'MongoDB', 'Express']
};

const resultadosAnalise2 = [
  {
    job: {
      company: 'CloudSys',
      title: 'Node.js Developer',
      requiredSkills: ['JavaScript', 'Node.js', 'Express']
    },
    score: 98,
    classification: 'Excelente',
    missingSkills: [],
    isBestMatch: true
  },
  {
    job: {
      company: 'DataCorp',
      title: 'Backend Developer',
      requiredSkills: ['Node.js', 'MongoDB', 'PostgreSQL', 'Docker']
    },
    score: 68,
    classification: 'Bom',
    missingSkills: ['PostgreSQL', 'Docker'],
    isBestMatch: false
  },
  {
    job: {
      company: 'FinTech Inc',
      title: 'Full Stack Developer',
      requiredSkills: ['React', 'Node.js', 'AWS']
    },
    score: 55,
    classification: 'Mediano',
    missingSkills: ['React', 'AWS'],
    isBestMatch: false
  }
];

// ========== EXECUTAR TESTES ==========

console.log('\n');
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║ FUNÇÃO: printQuickSummary()                                 ║');
console.log('║ Demonstra: Loop while, Operador ternário, Condicional      ║');
console.log('╚═════════════════════════════════════════════════════════════╝');

console.log('\n' + '='.repeat(70));
console.log(' TESTE 1: Candidato Front-End (João Santos)');
console.log('='.repeat(70));
printQuickSummary(candidatoTeste1, resultadosAnalise1);

console.log('\n' + '='.repeat(70));
console.log(' TESTE 2: Candidata Back-End (Ana Costa)');
console.log('='.repeat(70));
printQuickSummary(candidatoTeste2, resultadosAnalise2);

console.log('\n✅ Função printQuickSummary() testada com sucesso!\n');

// ========== EXPLICAÇÃO DO CONCEITO ==========

console.log('\n' + '='.repeat(70));
console.log(' CONCEITOS DEMONSTRADOS:');
console.log('='.repeat(70));
console.log('\n1. LOOP WHILE:');
console.log('   - Semelhante ao for, mas controle manual da variável');
console.log('   - Útil quando a condição não segue um padrão de incremento simples');
console.log('\n2. OPERADOR TERNÁRIO:');
console.log('   - Sintaxe: condição ? valorVerdadeiro : valorFalso');
console.log('   - Usado aqui: score >= 80 ? ✅ : score >= 50 ? ⚠️ : ❌');
console.log('\n3. OPERADORES COMPARAÇÃO:');
console.log('   - >= (maior ou igual)');
console.log('   - < (menor que)');
console.log('\n');
