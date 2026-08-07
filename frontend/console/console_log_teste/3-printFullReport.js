/**
 * PRINTFULLREPORT.JS
 * 
 * Gera e imprime o relatório completo no console
 * Demonstra conceitos: Loops (forEach, for), Condicional (if), Métodos de array (find)
 */

// Funções auxiliares
function createSeparator(char = '=', length = 60) {
  let separator = '';
  for (let i = 0; i < length; i++) {
    separator += char;
  }
  return separator;
}

function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

function printFullReport(candidate, analysisResults, recommendations) {
  console.clear(); // Limpar console antes de imprimir

  // ========== CABEÇALHO ==========
  console.log(createSeparator('=', 70));
  console.log(' SkillMatch JS - Simulador de Compatibilidade com Vagas Front-End');
  console.log(createSeparator('=', 70));
  console.log('');

  // ========== RESUMO DO CANDIDATO ==========
  console.log(' PERFIL DO CANDIDATO');
  console.log(createSeparator('-', 70));
  console.log(`Nome: ${candidate.name}`);
  console.log(`Área de Interesse: ${candidate.areaOfInterest}`);
  console.log(`Anos de Experiência: ${candidate.yearsOfExperience}`);
  console.log(`Habilidades: ${candidate.skills.join(', ')}`);
  console.log('');

  // ========== ANÁLISE DE COMPATIBILIDADE ==========
  console.log(' ANÁLISE DE COMPATIBILIDADE POR VAGA');
  console.log(createSeparator('-', 70));

  // Demonstra loop com forEach
  analysisResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.job.company} - ${result.job.title}`);
    console.log(` Compatibilidade: ${formatPercentage(result.score)} (${result.classification})`);
    console.log(` Skills Requeridas: ${result.job.requiredSkills.join(', ')}`);

    // Mostrar skills faltantes se houver
    if (result.missingSkills.length > 0) {
      console.log(` Skills Faltantes: ${result.missingSkills.join(', ')}`);
    } else {
      console.log(` Todas as skills requeridas!`);
    }

    // Marcar se é a melhor oportunidade
    if (result.isBestMatch) {
      console.log(` ⭐ MELHOR OPORTUNIDADE`);
    }
  });

  console.log('');

  // ========== MELHOR OPORTUNIDADE ==========
  const bestResult = analysisResults.find(r => r.isBestMatch);

  if (bestResult) {
    console.log(' MELHOR OPORTUNIDADE');
    console.log(createSeparator('-', 70));
    console.log(`Empresa: ${bestResult.job.company}`);
    console.log(`Cargo: ${bestResult.job.title}`);
    console.log(`Compatibilidade: ${formatPercentage(bestResult.score)}`);
    console.log('');
  } else {
    console.log(' NENHUMA OPORTUNIDADE COM COMPATIBILIDADE POSITIVA');
    console.log('');
  }

  // ========== RECOMENDAÇÕES DE ESTUDO ==========
  console.log(' RECOMENDAÇÕES DE ESTUDO');
  console.log(createSeparator('-', 70));

  if (recommendations.length > 0) {
    console.log('Priorize o estudo dessas habilidades (em ordem de importância):');
    console.log('');

    // Demonstra loop com for
    for (let i = 0; i < recommendations.length; i++) {
      const skill = recommendations[i];
      const priority = i + 1;
      console.log(`${priority}. ${skill}`);
    }
  } else {
    console.log(' Parabéns! Não há habilidades faltantes recomendadas.');
  }

  console.log('');

  // ========== RODAPÉ ==========
  console.log(createSeparator('=', 70));
  console.log('Relatório gerado em: ' + new Date().toLocaleString('pt-BR'));
  console.log(createSeparator('=', 70));
}

// ========== DADOS DE TESTE ==========

const candidatoTeste = {
  name: 'Maria Silva',
  areaOfInterest: 'Desenvolvimento Front-End',
  yearsOfExperience: 3,
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git']
};

const resultadosAnalise = [
  {
    job: {
      company: 'TechCorp',
      title: 'Junior React Developer',
      requiredSkills: ['JavaScript', 'React', 'CSS', 'Git']
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
      requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'TypeScript']
    },
    score: 72,
    classification: 'Bom',
    missingSkills: ['Vue.js', 'TypeScript'],
    isBestMatch: false
  },
  {
    job: {
      company: 'StartupXYZ',
      title: 'Full Stack Developer',
      requiredSkills: ['JavaScript', 'Node.js', 'MongoDB', 'React']
    },
    score: 58,
    classification: 'Mediano',
    missingSkills: ['Node.js', 'MongoDB'],
    isBestMatch: false
  }
];

const recomendacoes = [
  'TypeScript',
  'Vue.js ou Angular',
  'Node.js',
  'MongoDB',
  'Testing (Jest, React Testing Library)'
];

// ========== EXECUTAR TESTE ==========

console.log('\n');
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║ FUNÇÃO: printFullReport()                                   ║');
console.log('║ Demonstra: forEach, for, find, if, join()                  ║');
console.log('╚═════════════════════════════════════════════════════════════╝');
console.log('\n');

printFullReport(candidatoTeste, resultadosAnalise, recomendacoes);

console.log('\n✅ Função printFullReport() executada com sucesso!\n');
