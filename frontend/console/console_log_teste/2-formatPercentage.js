/**
 * FORMATPERCENTAGE.JS
 * 
 * Formata um número como percentual com 2 casas decimais
 * Demonstra conceito: Métodos de número, Template literals
 */

function formatPercentage(value) {
  return `${value.toFixed(2)}%`;
}

// ========== TESTES E DEMONSTRAÇÃO ==========

console.log('\n');
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║ FUNÇÃO: formatPercentage()                                  ║');
console.log('║ Demonstra: toFixed(), Template literals, Formatação         ║');
console.log('╚═════════════════════════════════════════════════════════════╝');

console.log('\n--- Teste 1: Valor exato (85) ---');
console.log(`Input: 85`);
console.log(`Output: ${formatPercentage(85)}`);

console.log('\n--- Teste 2: Valor com decimais (75.555) ---');
console.log(`Input: 75.555`);
console.log(`Output: ${formatPercentage(75.555)}`);

console.log('\n--- Teste 3: Valor zero ---');
console.log(`Input: 0`);
console.log(`Output: ${formatPercentage(0)}`);

console.log('\n--- Teste 4: Valor 100 (máximo) ---');
console.log(`Input: 100`);
console.log(`Output: ${formatPercentage(100)}`);

console.log('\n--- Teste 5: Valor com muitos decimais (33.33333) ---');
console.log(`Input: 33.33333`);
console.log(`Output: ${formatPercentage(33.33333)}`);

console.log('\n--- Teste 6: Valor pequeno (0.5) ---');
console.log(`Input: 0.5`);
console.log(`Output: ${formatPercentage(0.5)}`);

console.log('\n--- Teste 7: Valor negativo (-25) ---');
console.log(`Input: -25`);
console.log(`Output: ${formatPercentage(-25)}`);

console.log('\n--- Teste 8: Múltiplos valores (compatibilidades) ---');
const compatibilidades = [85.5, 92.1, 45.678, 100, 0.1];
console.log('Array: [85.5, 92.1, 45.678, 100, 0.1]');
console.log('Formatados:');
compatibilidades.forEach((valor, index) => {
  console.log(`  ${index + 1}. ${formatPercentage(valor)}`);
});

console.log('\n✅ Função formatPercentage() testada com sucesso!\n');
