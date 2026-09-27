# Testes automatizados

Execute `npm test` para validar o motor do SkillMatch, a recomendação e o carregamento do catálogo. A suíte usa o executor nativo do Node.js, sem bibliotecas externas.

Os cenários do `fetch` cobrem:

- sucesso: JSON válido é transformado em instâncias usadas pelo motor;
- vazio: uma lista vazia é retornada para a interface anunciar que não há vagas;
- erro: uma resposta HTTP inválida rejeita a Promise para que a interface apresente a mensagem de falha.

Os testes de console existentes continuam sendo executados após a nova suíte.
