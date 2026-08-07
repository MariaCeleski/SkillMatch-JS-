#!/bin/bash

# ============================================================
# SCRIPT: runAll.sh
# Executa todos os arquivos de teste do reportGenerator.js
# Uso: bash runAll.sh
# ============================================================

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  EXECUTANDO TODOS OS TESTES                    ║"
echo "║                                                                ║"
echo "║  Analisando o arquivo reportGenerator.js                      ║"
echo "║  Um arquivo de teste por função                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"

echo ""
echo "📁 Pasta atual: $(pwd)"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não está instalado!"
    echo "   Instale Node.js em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# ============================================================
# TESTE 1: createSeparator.js
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 [1/5] Executando: 1-createSeparator.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node 1-createSeparator.js

if [ $? -eq 0 ]; then
    echo "✅ [1/5] createSeparator.js - SUCESSO"
else
    echo "❌ [1/5] createSeparator.js - ERRO"
    exit 1
fi

echo ""
sleep 1

# ============================================================
# TESTE 2: formatPercentage.js
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 [2/5] Executando: 2-formatPercentage.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node 2-formatPercentage.js

if [ $? -eq 0 ]; then
    echo "✅ [2/5] formatPercentage.js - SUCESSO"
else
    echo "❌ [2/5] formatPercentage.js - ERRO"
    exit 1
fi

echo ""
sleep 1

# ============================================================
# TESTE 3: printFullReport.js
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 [3/5] Executando: 3-printFullReport.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node 3-printFullReport.js

if [ $? -eq 0 ]; then
    echo "✅ [3/5] printFullReport.js - SUCESSO"
else
    echo "❌ [3/5] printFullReport.js - ERRO"
    exit 1
fi

echo ""
sleep 1

# ============================================================
# TESTE 4: printQuickSummary.js
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 [4/5] Executando: 4-printQuickSummary.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node 4-printQuickSummary.js

if [ $? -eq 0 ]; then
    echo "✅ [4/5] printQuickSummary.js - SUCESSO"
else
    echo "❌ [4/5] printQuickSummary.js - ERRO"
    exit 1
fi

echo ""
sleep 1

# ============================================================
# TESTE 5: printCompatibilityTable.js
# ============================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 [5/5] Executando: 5-printCompatibilityTable.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node 5-printCompatibilityTable.js

if [ $? -eq 0 ]; then
    echo "✅ [5/5] printCompatibilityTable.js - SUCESSO"
else
    echo "❌ [5/5] printCompatibilityTable.js - ERRO"
    exit 1
fi

# ============================================================
# RESUMO FINAL
# ============================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ TODOS OS TESTES CONCLUÍDOS!               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Resumo de Execução:"
echo "   ✅ 1. createSeparator()       - Loops (for)"
echo "   ✅ 2. formatPercentage()      - Métodos de número (toFixed)"
echo "   ✅ 3. printFullReport()       - forEach, for, find"
echo "   ✅ 4. printQuickSummary()     - while, operador ternário"
echo "   ✅ 5. printCompatibilityTable() - map, console.table"
echo ""
echo "📁 Arquivos criados:"
echo "   1. 1-createSeparator.js"
echo "   2. 2-formatPercentage.js"
echo "   3. 3-printFullReport.js"
echo "   4. 4-printQuickSummary.js"
echo "   5. 5-printCompatibilityTable.js"
echo "   6. INDEX_EXECUTAR.md (documentação)"
echo ""
echo "🚀 Próximos passos:"
echo "   - Execute cada arquivo individualmente:"
echo "     node 1-createSeparator.js"
echo "   - Ou execute todos com:"
echo "     bash runAll.sh"
echo ""
echo "📚 Conceitos demonstrados:"
echo "   • Loops: for, forEach, while"
echo "   • Métodos de Array: map, find, join"
echo "   • Operadores: ternário, comparação, lógicos"
echo "   • Formatação: template literals, toFixed"
echo "   • Console: log, table, clear"
echo ""
