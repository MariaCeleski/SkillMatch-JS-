# Guia de requisitos e implementações — SkillMatch JS

Este documento relaciona os requisitos do desafio com os arquivos que os implementam. Ele serve para estudar o projeto, revisar a entrega e estruturar uma apresentação em vídeo.

> O enunciado completo está em [DESAFIO_E_REQUISITOS.md](DESAFIO_E_REQUISITOS.md). Este guia não o substitui: ele mostra **onde** cada requisito aparece no código e **como** demonstrá-lo.

## Visão geral do fluxo

```text
Pessoa usuária preenche o formulário
        ↓ validação e eventos
Candidate + perfil salvo no localStorage
        ↓
fetch de data/jobs.json → Job ou FrontEndJob
        ↓
SkillMatcher calcula compatibilidade e melhor vaga
        ↓
recomendações, cards, filtros, ranking e medidor são renderizados no DOM
```

## Mapa rápido dos arquivos

| Camada | Arquivos principais | Responsabilidade |
| --- | --- | --- |
| Estrutura e acessibilidade | `frontend/index.html` | Página semântica, formulário, seções, navegação e regiões de status. |
| Coordenação | `frontend/app.js` | Inicializa a aplicação e coordena análise, carregamento, persistência e tela. |
| Regras de negócio | `backend/models/Candidate.js`, `Job.js`, `FrontEndJob.js`, `SkillMatcher.js` | Modelos, herança e cálculo de compatibilidade. |
| Dados e persistência | `backend/services/dataLoader.js`, `profileStorage.js` | `fetch`, conversão do JSON em objetos, callback, closure e `localStorage`. |
| Interface modular | `frontend/ui/*.js` | Validação, resultados, ranking e tema. |
| Aparência responsiva | `frontend/styles.css` | Flexbox, estilos mobile-first, media queries e temas. |
| Fonte de vagas | `data/jobs.json` | Catálogo de cinco vagas; não há vagas escritas manualmente no HTML. |
| Testes | `tests/skillmatch.test.js` | Verificações automatizadas dos comportamentos principais. |

## Rastreabilidade dos requisitos funcionais

| Requisito | Implementação | Onde analisar | Como demonstrar no vídeo |
| --- | --- | --- | --- |
| **RF01 — Perfil do candidato** | A classe `Candidate` guarda nome, área, habilidades e anos de experiência. O resumo do perfil exibe esses valores. | `backend/models/Candidate.js` e `frontend/app.js` (`displayCandidateSummary`). | Preencha nome, área, habilidades e experiência; depois mostre o resumo que aparece abaixo do formulário. |
| **RF02 — Catálogo de vagas** | O catálogo contém cinco objetos de vaga, com empresa, cargo, requisitos, salário, modalidade e outros dados. | `data/jobs.json`. | Mostre o JSON e, em seguida, os cards carregados na página. |
| **RF03 — Compatibilidade e habilidades faltantes** | `SkillMatcher` compara as habilidades da pessoa com os requisitos de cada vaga e retorna percentual e faltantes. | `backend/models/SkillMatcher.js` (`calculateCompatibility` e `getMissingSkills`). | Selecione poucas habilidades e aponte os selos ✓/✗ e o percentual de um card. |
| **RF04 — Classificação** | As faixas alta (80–100), média (50–79) e baixa (0–49) são decididas com `if / else if / else`. | `backend/models/SkillMatcher.js` (`classifyCompatibility`). | Mostre cards com classificações distintas ou use os filtros de compatibilidade. |
| **RF05 — Melhor vaga e recomendação** | O `reduce` marca a melhor oportunidade; o serviço de recomendação ordena as habilidades mais ausentes. | `SkillMatcher.js` (`analyzeCandidate`) e `backend/services/recommendationEngine.js`. | Após analisar, apresente as seções “Sua Melhor Oportunidade” e “Recomendações de Estudo”. |
| **RF06 — Métodos de array** | O projeto usa `map`, `filter`, `reduce`, `find`, `every`, `forEach` e `sort`. | Principalmente `SkillMatcher.js`, `recommendationEngine.js` e `frontend/ui/resultsView.js`. | Abra `SkillMatcher.js` e explique `map` (uma análise por vaga), `filter` (faltantes) e `reduce` (melhor vaga). |
| **RF07 — POO e herança** | `Candidate` e `Job` são classes; `FrontEndJob extends Job` acrescenta stack e senioridade e sobrescreve `getSummary`. | `backend/models/Candidate.js`, `Job.js` e `FrontEndJob.js`. | Compare a classe base `Job` com `FrontEndJob`; explique que a especialização existe para exibir dados próprios de vagas front-end. |
| **RF08 — Callback e closure** | O loader aceita callback após o carregamento. `createDataLoader` preserva `loadCount` e cache em closure. | `backend/services/dataLoader.js`; uso em `frontend/app.js`. | Mostre `createDataLoader` e explique que `loadCount` continua existindo entre chamadas, sem ser uma variável global. |
| **RF09 — HTML semântico, acessibilidade e SEO** | Há `header`, `nav`, `main`, `section`, `footer`, um único `h1`, labels, imagens com `alt`, link de pular conteúdo, `title` e meta description. | `frontend/index.html`. | Navegue com Tab, mostre “Pular para o conteúdo principal” e abra o `<head>` para evidenciar título e descrição. |
| **RF10 — Formulário, validação e eventos** | O envio usa `submit` + `preventDefault`; campos vazios recebem mensagem, `aria-invalid` e foco no primeiro erro. | `frontend/app.js` e `frontend/ui/profileForm.js`. | Desmarque todas as habilidades ou apague o nome e clique em “Analisar”; mostre a mensagem de erro e o foco. |
| **RF11 — Renderização dinâmica no DOM** | Os cards são criados por JavaScript com `createElement`, `innerHTML` e dados da análise; o HTML inicia com contêiner vazio. | `frontend/ui/resultsView.js` e `frontend/index.html` (`#jobResultsGrid`). | Mostre que não há cards estáticos no HTML e que eles surgem somente após a análise. |
| **RF12 — Responsividade mobile-first e Flexbox** | O CSS usa base mobile-first, `flex`, `flex-wrap`, tamanhos fluidos e media queries; os cards se rearranjam. | `frontend/styles.css`, especialmente `.jobs-grid`, `.job-card` e as `@media`. | Abra o modo responsivo do DevTools e alterne entre celular e desktop. |
| **RF13 — `fetch` e estados de dados** | `fetch` + `async/await` leem `jobs.json`; `response.ok` e `try/catch` tratam erro. A interface anuncia carregando, vazio e erro. | `backend/services/dataLoader.js` e `frontend/app.js`. | Execute pelo Live Server, clique em analisar e mostre “Carregando vagas...”. Explique que lista vazia chama `displayEmpty` e falha cai no `catch`. |
| **RF14 — Persistência com `localStorage`** | Perfil, tema e ranking são serializados com `JSON.stringify`; leitura usa `JSON.parse` e retorna `null` na primeira visita ou em dado inválido. | `backend/services/profileStorage.js`, `frontend/ui/theme.js` e `frontend/ui/rankingView.js`. | Analise um perfil, recarregue a página e mostre o formulário preenchido. Opcionalmente alterne o tema e recarregue. |
| **RF15 — Módulos ES** | O HTML carrega `app.js` como módulo; `app.js` importa modelos, serviços e módulos de interface. | `frontend/index.html` e `frontend/app.js`. | Mostre `type="module"` e a lista de `import`s. Explique a separação: motor, dados e UI. |

## Detalhamento técnico para estudo

### 1. Do formulário ao objeto de domínio

1. O evento `submit` é registrado em `frontend/app.js` quando o DOM termina de carregar.
2. `getProfileFormData()` em `frontend/ui/profileForm.js` lê os campos, valida os obrigatórios e devolve `{ name, area, experience, skills }`.
3. `app.js` cria `new Candidate(...)` e chama `saveProfile(...)`.
4. O resumo é preenchido com `textContent`, evitando inserir esses dados de perfil como HTML.

Ponto importante para explicar: `preventDefault()` impede que o formulário recarregue a página. Isso permite validar, carregar e atualizar a mesma página, característica de uma SPA simples.

### 2. Do JSON ao motor de compatibilidade

1. `loadJobsFromServer()` faz `fetch` de `data/jobs.json`.
2. Antes de usar o corpo, verifica `response.ok`; assim erros HTTP não passam silenciosamente.
3. `response.json()` produz objetos simples.
4. `mapJobData()` usa `map` para converter cada objeto em `Job` ou `FrontEndJob`.
5. `SkillMatcher.analyzeCandidate()` recebe instâncias de classe, não dados soltos, e produz os resultados.

Esse caminho é importante: o JSON é apenas dado; as classes carregam o comportamento (métodos e regras) usado para analisá-lo.

### 3. Fórmula e classificação

```text
compatibilidade = (quantidade de habilidades encontradas / quantidade de habilidades exigidas) × 100
```

Exemplo: se uma vaga exige `HTML`, `CSS`, `JavaScript` e `Responsive Design`, e o perfil possui as três primeiras, o resultado é `3 / 4 × 100 = 75%`, ou seja, média compatibilidade.

As faixas usadas são:

| Percentual | Resultado |
| --- | --- |
| 80% a 100% | Alta compatibilidade |
| 50% a 79% | Média compatibilidade |
| 0% a 49% | Baixa compatibilidade |

### 4. Separação em módulos

```text
app.js
 ├─ models/             regras e entidades
 ├─ services/           fetch, persistência e recomendação
 └─ ui/                 formulário, resultados, ranking e tema
```

Essa divisão evita um único arquivo grande: `app.js` coordena, os modelos calculam, os serviços cuidam de dados e os módulos UI manipulam a tela.

## Melhorias implementadas além do mínimo

| Melhoria | Arquivos | Valor para a pessoa usuária |
| --- | --- | --- |
| Filtros e ordenação | `frontend/ui/resultsView.js` | Filtra modalidade e faixa de compatibilidade; ordena por compatibilidade, salário ou empresa. |
| Tema claro/escuro persistente | `frontend/ui/theme.js`, `frontend/styles.css` | Mantém a preferência visual em novas visitas. |
| Ranking local | `frontend/ui/rankingView.js` | Guarda análises, ordena por média e permite remover registros. |
| Medidor de prontidão | `frontend/ui/resultsView.js`, `frontend/index.html` | Converte a média em nível e mensagem de orientação. |
| Exportação de análise | `frontend/app.js` (`exportResults`) | Disponibiliza um JSON baixável após uma análise; pode ser acionado por `window.SkillMatchDebug.export()`. |
| Acessibilidade reforçada | `frontend/index.html`, `profileForm.js`, `styles.css` | Skip link, foco em erro, regiões vivas, rótulos e contraste para os temas. |

## Roteiro sugerido para o vídeo (6 a 8 minutos)

1. **Contexto — 30 s**: apresente o problema: comparar um perfil com vagas e indicar próximos estudos.
2. **Interface — 1 min**: abra a aplicação, mostre header, formulário, navegação, tema e campos de perfil.
3. **Validação e acessibilidade — 45 s**: provoque um erro de formulário; explique `aria-invalid`, mensagem `role="alert"` e foco.
4. **Fluxo principal — 1 min**: preencha o perfil e execute a análise. Mostre carregamento, cards, percentuais, habilidades encontradas/faltantes, melhor oportunidade e recomendações.
5. **Código do motor — 1 min 30 s**: abra `SkillMatcher.js`; explique fórmula, `filter`, `map`, `reduce` e classificação. Depois abra `Job.js` e `FrontEndJob.js` para demonstrar herança.
6. **Dados, async e persistência — 1 min**: mostre `jobs.json`, `dataLoader.js` e `profileStorage.js`; explique `fetch`, `async/await`, callback, closure e `localStorage`. Recarregue a página para comprovar a persistência.
7. **Responsividade e organização — 45 s**: use o modo responsivo e mostre a estrutura de módulos em `app.js` e `frontend/ui/`.
8. **Qualidade — 30 s**: execute `npm test` e mostre que os testes validam motor, fetch, acessibilidade e responsividade.

## Checklist antes de gravar

- [ ] Iniciar um servidor HTTP: `python3 -m http.server 8000` na raiz e abrir `http://localhost:8000/frontend/`.
- [ ] Usar um perfil com algumas habilidades faltantes, para que recomendações e classificações sejam visíveis.
- [ ] Recarregar a página depois de analisar para demonstrar o `localStorage`.
- [ ] Abrir DevTools em modo responsivo para apresentar o mobile-first.
- [ ] Executar `npm test` no terminal antes da gravação.
- [ ] Evitar apresentar dados pessoais ou sensíveis: o projeto guarda apenas dados demonstrativos no armazenamento local.

## Evidências automatizadas

`tests/skillmatch.test.js` cobre, entre outros pontos:

- validação e mensagens acessíveis do formulário;
- módulos ES, SEO e skip link;
- uso de Flexbox e media queries;
- compatibilidade, skills faltantes, melhor vaga e recomendações;
- conversão do catálogo em `FrontEndJob`;
- cenários de `fetch`: sucesso, lista vazia e erro HTTP;
- persistência do perfil e restauração na primeira visita.

Para executar:

```bash
npm test
```
