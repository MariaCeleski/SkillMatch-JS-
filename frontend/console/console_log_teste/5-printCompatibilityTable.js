/**
 * PRINTCOMPATIBILITYTABLE.JS
 * 
 * Imprime tabela de compatibilidade formatada
 * Demonstra conceitos: map(), Operador ternário, console.table()
 */

// Funções auxiliares
function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function printCompatibilityTable(analysisResults) {
  console.table(
    analysisResults.map(result => ({
      Empresa: result.job.company,
      Cargo: result.job.title,
      Compatibilidade: formatPercentage(result.score),
      Classificação: result.classification,
      'Skills Faltantes': result.missingSkills.length > 0 ? result.missingSkills.join(', ') : 'Nenhuma'
    }))
  );
}

// ========== DADOS DE TESTE ==========

const resultadosAnalise1 = [
  {
    job: {
      company: 'TechCorp',
      title: 'Junior React Developer',
      requiredSkills: ['JavaScript', 'React', 'CSS']
    },
    score: 95.5,
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
    score: 72.3,
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
    score: 45.8,
    classification: 'Mediano',
    missingSkills: ['Node.js', 'MongoDB'],
    isBestMatch: false
  },
  {
    job: {
      company: 'DesignStudio',
      title: 'UI Developer',
      requiredSkills: ['HTML', 'CSS', 'JavaScript']
    },
    score: 88.2,
    classification: 'Excelente',
    missingSkills: [],
    isBestMatch: false
  }
];

const resultadosAnalise2 = [
  {
    job: {
      company: 'CloudSys',
      title: 'Node.js Developer',
      requiredSkills: ['JavaScript', 'Node.js', 'Express']
    },
    score: 98.1,
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
    score: 68.5,
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
    score: 55.0,
    classification: 'Mediano',
    missingSkills: ['React', 'AWS'],
    isBestMatch: false
  },
  {
    job: {
      company: 'MicroServices Ltd',
      title: 'Microservices Architect',
      requiredSkills: ['Node.js', 'Docker', 'Kubernetes', 'gRPC']
    },
    score: 38.9,
    classification: 'Fraco',
    missingSkills: ['Docker', 'Kubernetes', 'gRPC'],
    isBestMatch: false
  },
  {
    job: {
      company: 'WebAPI Corp',
      title: 'API Developer',
      requiredSkills: ['Node.js', 'Express', 'REST', 'MongoDB']
    },
    score: 92.0,
    classification: 'Excelente',
    missingSkills: [],
    isBestMatch: false
  }
];

// ========== EXECUTAR TESTES ==========

console.log('\n');
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║ FUNÇÃO: printCompatibilityTable()                           ║');
console.log('║ Demonstra: map(), console.table(), Operador ternário       ║');
console.log('╚═════════════════════════════════════════════════════════════╝');

console.log('\n' + '='.repeat(70));
console.log(' TESTE 1: Tabela de Compatibilidade - Candidato Front-End');
console.log('='.repeat(70));
console.log('\n');
printCompatibilityTable(resultadosAnalise1);

console.log('\n' + '='.repeat(70));
console.log(' TESTE 2: Tabela de Compatibilidade - Candidato Back-End');
console.log('='.repeat(70));
console.log('\n');
printCompatibilityTable(resultadosAnalise2);

// ========== EXPLICAÇÃO DOS CONCEITOS ==========

console.log('\n' + '='.repeat(70));
console.log(' CONCEITOS DEMONSTRADOS:');
console.log('='.repeat(70));

console.log('\n1. MÉTODO map():');
console.log('   - Transforma cada elemento de um array em outro elemento');
console.log('   - Sintaxe: array.map(elemento => ({ novo_objeto }))');
console.log('   - Neste caso: transforma result em um objeto com propriedades formatadas');

console.log('\n2. console.table():');
console.log('   - Imprime um array de objetos como uma tabela formatada');
console.log('   - Muito útil para visualizar dados em formato tabular');
console.log('   - Chaves do objeto se tornam cabeçalhos da tabela');

console.log('\n3. OPERADOR TERNÁRIO (ANINHADO):');
console.log('   - Sintaxe: condicao ? valor1 : valor2');
console.log('   - Neste caso para Skills Faltantes:');
console.log('     result.missingSkills.length > 0 ? result.missingSkills.join(\', \') : \'Nenhuma\'');

console.log('\n4. MÉTODO join():');
console.log('   - Transforma array em string, separando elementos por um delimitador');
console.log('   - Sintaxe: array.join(\', \') cria string "Item1, Item2, Item3"');

console.log('\n✅ Função printCompatibilityTable() testada com sucesso!\n');
