/**
 * CREATESEPARATOR.JS
 * 
 * Gera separador visual para melhor formatação
 * Demonstra conceito: Loop (for)
 */

function createSeparator(char = '=', length = 60) {
  let separator = '';
  for (let i = 0; i < length; i++) {
    separator += char;
  }
  return separator;
}

// ========== TESTES E DEMONSTRAÇÃO ==========

console.log('\n');
console.log('╔═════════════════════════════════════════════════════════════╗');
console.log('║ FUNÇÃO: createSeparator()                                   ║');
console.log('║ Demonstra: Loop (for), Concatenação de Strings              ║');
console.log('╚═════════════════════════════════════════════════════════════╝');

console.log('\n--- Teste 1: Separador padrão (60 caracteres com =) ---');
console.log(createSeparator());

console.log('\n--- Teste 2: Separador com 40 caracteres ---');
console.log(createSeparator('=', 40));

console.log('\n--- Teste 3: Separador com caractere - (tracejado) ---');
console.log(createSeparator('-', 60));

console.log('\n--- Teste 4: Separador com caractere * (asteriscos) ---');
console.log(createSeparator('*', 50));

console.log('\n--- Teste 5: Separador com caractere # (hashtags) ---');
console.log(createSeparator('#', 45));

console.log('\n--- Teste 6: Separador curto com 10 caracteres ---');
console.log(createSeparator('~', 10));

console.log('\n--- Teste 7: Usando em um contexto de relatório ---');
console.log(createSeparator('=', 70));
console.log(' RELATÓRIO DE TESTE');
console.log(createSeparator('=', 70));
console.log('Dados do candidato aqui...');
console.log(createSeparator('-', 70));

console.log('\n✅ Função createSeparator() testada com sucesso!\n');
