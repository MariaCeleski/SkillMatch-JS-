# SkillMatch JS

Simulador simples de compatibilidade entre candidato e vagas (vanilla JavaScript).

## Como usar (rápido)

Opções:

- Abrir no navegador (recomendado para a interface):
  1. Abra `frontend/index.html` no seu navegador (por exemplo, `file:///.../frontend/index.html`).
  2. No console do navegador (F12), chame `runSkillMatch()` para rodar a versão de console.

- Rodar os scripts de console/tests (requer Node.js):
  1. Verifique se Node.js está instalado: `node --version`.
  2. Execute: `bash frontend/console/console_log_teste/runAll.sh` (ou `npm test`).

## Observações sobre dependências

- Não havia `package.json` original (apenas `package-lock.json`). Foi adicionado um `package.json` mínimo para facilitar `npm start` e `npm test`.
- O projeto não depende de pacotes externos (vanilla JS). Portanto `npm install` não é necessário, a menos que adicione pacotes no futuro.

## Recomendações

- Se pretende usar npm para scripts, mantenha `package.json` e `package-lock.json` sincronizados.
- Adicione um `.env.example` se houver variáveis de ambiente no futuro.

## Executando após clonar

1. Clone: `git clone <repo>`
2. Entre na pasta: `cd <repo>` ou abra `frontend/index.html` no navegador.
3. Para rodar os testes/simulador via Node: `bash frontend/console/console_log_teste/runAll.sh` (Node.js requerido).

## Exemplos de saída dos testes

Trecho de exemplo (saída ao rodar `bash frontend/console/console_log_teste/runAll.sh`):

```
✅ Node.js encontrado: v18.16.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 [1/5] Executando: 1-createSeparator.js
✅ [1/5] createSeparator.js - SUCESSO

... (saídas dos outros testes) ...

╔════════════════════════════════════════════════════════════════╗
║                   ✅ TODOS OS TESTES CONCLUÍDOS!               ║
╚════════════════════════════════════════════════════════════════╝
```

Para capturar a saída (útil para incluir prints no README), rode:

```
bash frontend/console/console_log_teste/runAll.sh | tee tests-output.txt
```

Inclua o arquivo `tests-output.txt` ou imagens dos prints no README (ou em uma pasta `docs/`) para exemplos visuais.

## Resultado dos testes (executado em 07/08/2026)

Resumo rápido: todos os 5 testes foram executados com sucesso (createSeparator, formatPercentage, printFullReport, printQuickSummary, printCompatibilityTable).

Saída completa dos testes: docs/tests-output.txt

