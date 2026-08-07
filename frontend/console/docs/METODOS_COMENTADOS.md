# 📖 Métodos do Projeto — Explicados

> Todos os métodos encontrados nos arquivos JS do projeto, com descrição do que fazem e para que servem.

---

## 📁 `backend/models/Candidate.js`

Classe `Candidate` — representa o candidato.

---

### `constructor(name, areaOfInterest, skills, yearsOfExperience)`

**O que faz:**
Cria um novo candidato. É chamado automaticamente quando você escreve `new Candidate(...)`.
Valida que o nome não está vazio e que a experiência não é negativa. Armazena todos os dados na instância.

**Parâmetros:**
- `name` — string com o nome do candidato
- `areaOfInterest` — área como `"Front-End"`, `"Backend"`, etc.
- `skills` — array de strings com as habilidades, ex: `['HTML', 'CSS', 'JavaScript']`
- `yearsOfExperience` — número inteiro com anos de experiência (mínimo 0)

**Retorna:** instância do objeto `Candidate`

**Exemplo de uso:**
```js
const candidato = new Candidate('Maria', 'Front-End', ['HTML', 'CSS'], 2);
```

---

### `getSummary()`

**O que faz:**
Monta e retorna uma string legível com os dados principais do candidato — nome, área, experiência e lista de skills separadas por vírgula.

**Retorna:** `string` formatada, ex: `"Maria - Área: Front-End | Exp: 2 ano(s) | Skills: HTML, CSS"`

**Exemplo de uso:**
```js
console.log(candidato.getSummary());
// "Maria - Área: Front-End | Exp: 2 ano(s) | Skills: HTML, CSS"
```

---

### `hasSkill(skill)`

**O que faz:**
Verifica se o candidato possui uma habilidade específica. Olha dentro do array `this.skills` e retorna `true` se a skill estiver lá, `false` se não estiver.
É usado pelo `SkillMatcher` para comparar skills do candidato com as skills exigidas pela vaga.

**Parâmetro:**
- `skill` — string com o nome da habilidade, ex: `"React"`

**Retorna:** `boolean` — `true` se tem, `false` se não tem

**Exemplo de uso:**
```js
candidato.hasSkill('HTML');    // true
candidato.hasSkill('React');   // false
```

---

### `addSkill(skill)`

**O que faz:**
Adiciona uma nova habilidade à lista de skills do candidato. Primeiro verifica se a skill já existe para não duplicar. Se já existir, não faz nada.

**Parâmetro:**
- `skill` — string com o nome da habilidade a adicionar

**Retorna:** nada (`void`)

**Exemplo de uso:**
```js
candidato.addSkill('React');
// agora this.skills inclui 'React'
```

---

### `getSkillsList()`

**O que faz:**
Retorna uma **cópia** do array de skills do candidato usando o operador spread `[...this.skills]`. Retorna uma cópia (não o original) para evitar que código externo modifique a lista diretamente sem usar `addSkill`.

**Retorna:** `array` de strings — cópia das skills

**Exemplo de uso:**
```js
const lista = candidato.getSkillsList();
// ['HTML', 'CSS', 'JavaScript']
```

---

## 📁 `backend/models/Job.js`

Classe `Job` — representa uma vaga de emprego.

---

### `constructor(company, title, requiredSkills)`

**O que faz:**
Cria uma nova vaga. Valida que `requiredSkills` existe e tem pelo menos 1 skill. Gera automaticamente uma `description` e define valores padrão para `salary` (0) e `remote` (true).

**Parâmetros:**
- `company` — string com o nome da empresa
- `title` — string com o título da vaga
- `requiredSkills` — array com pelo menos 1 skill exigida

**Retorna:** instância do objeto `Job`

**Exemplo de uso:**
```js
const vaga = new Job('Tech StartUp', 'Dev Frontend', ['HTML', 'CSS', 'JavaScript']);
```

---

### `getSummary()`

**O que faz:**
Monta e retorna uma string legível com os dados principais da vaga — empresa, título e lista de skills requeridas separadas por vírgula.

**Retorna:** `string` formatada, ex: `"Tech StartUp - Dev Frontend | Skills requeridas: HTML, CSS"`

**Exemplo de uso:**
```js
console.log(vaga.getSummary());
// "Tech StartUp - Dev Frontend | Skills requeridas: HTML, CSS, JavaScript"
```

---

### `getRequiredSkills()`

**O que faz:**
Retorna uma **cópia** do array de skills requeridas pela vaga. Igual ao `getSkillsList()` do Candidate — usa spread para proteger o array original de modificações externas.

**Retorna:** `array` de strings — cópia das skills requeridas

**Exemplo de uso:**
```js
const skills = vaga.getRequiredSkills();
// ['HTML', 'CSS', 'JavaScript']
```

---

### `getSkillCount()`

**O que faz:**
Retorna a quantidade de skills requeridas pela vaga. Útil para exibir no card da vaga e para o cálculo do denominador da fórmula de compatibilidade.

**Retorna:** `number` — quantidade de skills

**Exemplo de uso:**
```js
vaga.getSkillCount(); // 3
```

---

## 📁 `backend/models/SkillMatcher.js`

Classe `BaseMatcher` (pai) e `SkillMatcher` (filha) — análise de compatibilidade.

---

### `BaseMatcher.constructor()`

**O que faz:**
Cria a classe base e inicializa o array `this.results = []` que será herdado por `SkillMatcher`. Este array armazena todos os resultados de análise durante uma sessão.

---

### `BaseMatcher.storeResult(result)`

**O que faz:**
Adiciona um resultado de análise ao array `this.results`. É chamado dentro de `analyzeCandidate()` a cada vaga analisada para acumular todos os resultados.

**Parâmetro:**
- `result` — objeto com `{ job, score, classification, missingSkills, isBestMatch }`

**Retorna:** nada (`void`)

---

### `BaseMatcher.getResults()`

**O que faz:**
Retorna uma **cópia** de todos os resultados armazenados. Usa spread para proteger o array interno. Útil para acessar os resultados sem risco de modificá-los.

**Retorna:** `array` com cópia dos resultados acumulados

---

### `BaseMatcher.clearResults()`

**O que faz:**
Limpa todos os resultados anteriores, redefinindo `this.results` como um array vazio. É chamado no início de cada nova análise para garantir que resultados antigos não contaminem os novos.

**Retorna:** nada (`void`)

---

### `SkillMatcher.constructor()`

**O que faz:**
Chama `super()` para executar o construtor da classe pai (`BaseMatcher`), garantindo que `this.results = []` seja inicializado antes de qualquer uso.

---

### `SkillMatcher.calculateCompatibility(candidate, job)`

**O que faz:**
**Método principal do projeto.** Aplica a fórmula de compatibilidade:

```
(skills do candidato que batem com as da vaga / total de skills da vaga) × 100
```

Usa `filter()` para encontrar as skills em comum. Arredonda o resultado para 2 casas decimais.

**Parâmetros:**
- `candidate` — instância de `Candidate`
- `job` — instância de `Job`

**Retorna:** `number` entre 0 e 100

**Exemplos:**
- Candidato tem `['HTML', 'CSS']`, vaga pede `['HTML', 'CSS', 'React']` → retorna `66.67`
- Candidato tem tudo → retorna `100`
- Candidato não tem nada → retorna `0`

---

### `SkillMatcher.getMissingSkills(candidate, job)`

**O que faz:**
Descobre quais skills da vaga o candidato **não possui**. Usa `filter()` para pegar as skills requeridas que **não estão** na lista do candidato. O resultado alimenta as recomendações de estudo.

**Parâmetros:**
- `candidate` — instância de `Candidate`
- `job` — instância de `Job`

**Retorna:** `array` de strings — skills faltantes (array vazio se candidato tem tudo)

**Exemplo:**
- Candidato tem `['HTML', 'CSS']`, vaga pede `['HTML', 'CSS', 'React']` → retorna `['React']`

---

### `SkillMatcher.classifyCompatibility(score)`

**O que faz:**
Converte um score numérico em uma classificação textual com 3 faixas, sem sobreposição. Usa `if-else` para determinar a faixa correta.

**Parâmetro:**
- `score` — number entre 0 e 100

**Retorna:** `string` — uma de três opções:
- `"Alta compatibilidade"` — score ≥ 80
- `"Média compatibilidade"` — score ≥ 50 e < 80
- `"Baixa compatibilidade"` — score < 50

---

### `SkillMatcher.analyzeCandidate(candidate, jobList)`

**O que faz:**
**Orquestrador central da análise.** Para cada vaga da lista:
1. Calcula o score de compatibilidade
2. Identifica as skills faltantes
3. Classifica o resultado
4. Armazena o resultado com `storeResult()`

Após processar todas as vagas, usa `reduce()` para encontrar a de maior score e marca `isBestMatch: true` nela.

**Parâmetros:**
- `candidate` — instância de `Candidate`
- `jobList` — array de instâncias de `Job`

**Retorna:** `array` de objetos com `{ job, score, classification, missingSkills, isBestMatch }`

---

### `SkillMatcher.findBestOpportunity(analysisResults)`

**O que faz:**
Percorre o array de resultados usando `find()` e retorna o primeiro (e único) resultado marcado com `isBestMatch: true`. Se nenhum tiver esse flag (ex: todos com score 0), retorna `null`.

**Parâmetro:**
- `analysisResults` — array retornado por `analyzeCandidate()`

**Retorna:** objeto de resultado ou `null`

---

### `SkillMatcher.meetsAllRequirements(candidate, job)`

**O que faz:**
Verifica se o candidato possui **absolutamente todas** as skills exigidas pela vaga usando `every()`. É um teste binário — ou tem tudo (true) ou falta algo (false).

**Parâmetros:**
- `candidate` — instância de `Candidate`
- `job` — instância de `Job`

**Retorna:** `boolean` — `true` se tem todas, `false` se falta pelo menos uma

**Exemplo:**
- Candidato tem `['HTML', 'CSS', 'React']`, vaga pede `['HTML', 'CSS', 'React']` → `true`
- Candidato tem `['HTML', 'CSS']`, vaga pede `['HTML', 'CSS', 'React']` → `false`

---

## 📁 `backend/services/dataLoader.js`

Funções de carregamento assíncrono de dados.

---

### `loadJobsFromServer(delayMs = 2000)`

**O que faz:**
Simula a busca de vagas em um servidor real, com atraso de rede. Retorna uma `Promise` que, após o tempo de `delayMs`, resolve com o array `mockJobs`. Se `mockJobs` não existir, rejeita com uma mensagem de erro clara.

**Parâmetro:**
- `delayMs` — número em milissegundos para o delay (padrão: 2000ms = 2 segundos)

**Retorna:** `Promise<array>` — resolve com array de objetos `Job`

**Exemplo de uso:**
```js
const vagas = await loadJobsFromServer(1500); // espera 1.5s
```

---

### `loadDataAsync(callback)`

**O que faz:**
Função `async` que aguarda o carregamento das vagas e depois executa um callback com os dados prontos. Usa o padrão **error-first** do Node.js: `callback(null, jobs)` em caso de sucesso, `callback(error, null)` em caso de erro. Imprime mensagens de progresso no console.

**Parâmetro:**
- `callback` — função com assinatura `(error, jobs)` a executar após carregar

**Retorna:** `Promise<array>` — as vagas carregadas

**Exemplo de uso:**
```js
loadDataAsync((err, jobs) => {
  if (err) return console.error(err);
  console.log('Vagas:', jobs.length);
});
```

---

### `createDataLoader()`

**O que faz:**
Cria e retorna um **objeto closure** com estado interno encapsulado. `loadCount` e `loadedData` ficam protegidos dentro da função — não são acessíveis de fora diretamente. Cada vez que `.load()` é chamado, o contador incrementa e o cache acumula. O estado **persiste entre chamadas** sem precisar de variável global.

**Retorna:** objeto com 4 métodos: `load()`, `getLoadCount()`, `getCachedData()`, `resetCounter()`

---

#### `createDataLoader().load()`

**O que faz:**
Carrega as vagas chamando `loadJobsFromServer()`, incrementa o `loadCount` interno e adiciona as vagas ao `loadedData` (cache). Imprime no console em qual tentativa está.

**Retorna:** `Promise<array>` — vagas carregadas

---

#### `createDataLoader().getLoadCount()`

**O que faz:**
Retorna quantas vezes `.load()` foi chamado desde a criação ou último reset. Demonstra que o valor **persiste** entre chamadas graças ao closure.

**Retorna:** `number`

---

#### `createDataLoader().getCachedData()`

**O que faz:**
Retorna uma cópia de todas as vagas acumuladas no cache desde o início. Usa spread para não expor o array interno.

**Retorna:** `array` — cópia das vagas em cache

---

#### `createDataLoader().resetCounter()`

**O que faz:**
Zera o `loadCount` e esvazia o `loadedData`, voltando o estado do loader ao início. Útil para reiniciar o ciclo de carregamento em testes.

**Retorna:** nada (`void`)

---

## 📁 `backend/services/recommendationEngine.js`

Funções para geração de recomendações de estudo.

---

### `calculateSkillPriority(skill, allMissingSkills)`

**O que faz:**
Calcula a prioridade de uma skill contando quantas vezes ela aparece na lista de todas as skills faltantes de todas as vagas. Quanto mais vagas precisam daquela skill, maior a prioridade.

**Parâmetros:**
- `skill` — string com o nome da habilidade
- `allMissingSkills` — array com todas as skills faltantes (pode ter duplicatas)

**Retorna:** `number` — quantidade de ocorrências (prioridade)

**Exemplo:**
- `"React"` aparece 3 vezes → prioridade `3` (alta)
- `"GraphQL"` aparece 1 vez → prioridade `1` (baixa)

---

### `generateRecommendations(analysisResults, onRecommendationReady)`

**O que faz:**
Gera a lista final de skills para estudar, ordenada da mais importante para a menos importante. O processo tem 5 etapas:
1. Coleta todas as skills faltantes de todas as vagas (`forEach`)
2. Conta a frequência de cada skill (`reduce`)
3. Transforma em array de objetos `{skill, priority}` (`map`)
4. Ordena do maior priority para o menor (`sort`)
5. Extrai só os nomes das skills (`map`)

Ao final, executa o `onRecommendationReady` passando o resultado (padrão callback).

**Parâmetros:**
- `analysisResults` — array de resultados de `analyzeCandidate()`
- `onRecommendationReady` — função callback chamada com as recomendações prontas

**Retorna:** `array` de strings — skills ordenadas por prioridade

---

### `createRecommendationService()`

**O que faz:**
Cria um objeto que agrupa os métodos de recomendação com estado interno. É uma fábrica (factory function) que retorna um objeto com 4 métodos para gerenciar recomendações de forma organizada.

**Retorna:** objeto com os métodos abaixo

---

#### `createRecommendationService().generate(analysisResults, callback)`

**O que faz:**
Chama `generateRecommendations()`, armazena o resultado internamente em `this.recommendations` e o retorna. É o ponto de entrada principal do serviço.

**Parâmetros:**
- `analysisResults` — resultados da análise
- `callback` — função opcional executada quando pronto

**Retorna:** `array` de recomendações

---

#### `createRecommendationService().getRecommendations()`

**O que faz:**
Retorna uma cópia das recomendações geradas na última chamada de `.generate()`. Usa spread para proteger o array interno.

**Retorna:** `array` de strings

---

#### `createRecommendationService().clear()`

**O que faz:**
Limpa as recomendações armazenadas, zerando `this.recommendations`. Útil para reiniciar uma sessão de análise sem precisar criar um novo serviço.

**Retorna:** nada (`void`)

---

#### `createRecommendationService().count()`

**O que faz:**
Retorna a quantidade de recomendações atualmente armazenadas. Útil para verificar rapidamente se há skills para estudar sem precisar acessar o array completo.

**Retorna:** `number`

---

## 📊 Resumo — Todos os Métodos por Arquivo

| Arquivo | Método | Retorno | Finalidade |
|---|---|---|---|
| `Candidate.js` | `constructor()` | instância | Cria candidato com validação |
| `Candidate.js` | `getSummary()` | string | Resumo legível do perfil |
| `Candidate.js` | `hasSkill(skill)` | boolean | Verifica se possui skill |
| `Candidate.js` | `addSkill(skill)` | void | Adiciona nova skill |
| `Candidate.js` | `getSkillsList()` | array | Cópia das skills |
| `Job.js` | `constructor()` | instância | Cria vaga com validação |
| `Job.js` | `getSummary()` | string | Resumo legível da vaga |
| `Job.js` | `getRequiredSkills()` | array | Cópia das skills requeridas |
| `Job.js` | `getSkillCount()` | number | Quantidade de skills exigidas |
| `BaseMatcher` | `constructor()` | instância | Inicializa array de resultados |
| `BaseMatcher` | `storeResult(result)` | void | Adiciona resultado ao array |
| `BaseMatcher` | `getResults()` | array | Cópia dos resultados |
| `BaseMatcher` | `clearResults()` | void | Zera o array de resultados |
| `SkillMatcher` | `constructor()` | instância | Chama `super()` da classe pai |
| `SkillMatcher` | `calculateCompatibility()` | number 0-100 | **Cálculo principal de compatibilidade** |
| `SkillMatcher` | `getMissingSkills()` | array | Lista de skills que faltam |
| `SkillMatcher` | `classifyCompatibility()` | string | Classifica score em faixa |
| `SkillMatcher` | `analyzeCandidate()` | array | Analisa candidato vs todas as vagas |
| `SkillMatcher` | `findBestOpportunity()` | objeto/null | Encontra vaga com maior score |
| `SkillMatcher` | `meetsAllRequirements()` | boolean | Verifica se tem TODAS as skills |
| `dataLoader.js` | `loadJobsFromServer()` | Promise | Simula busca em servidor |
| `dataLoader.js` | `loadDataAsync()` | Promise | Carrega com callback error-first |
| `dataLoader.js` | `createDataLoader()` | objeto | Cria loader com estado encapsulado |
| `dataLoader.js` | `.load()` | Promise | Carrega e incrementa contador |
| `dataLoader.js` | `.getLoadCount()` | number | Retorna número de carregamentos |
| `dataLoader.js` | `.getCachedData()` | array | Retorna dados em cache |
| `dataLoader.js` | `.resetCounter()` | void | Zera estado do loader |
| `recommendationEngine.js` | `calculateSkillPriority()` | number | Conta frequência de uma skill |
| `recommendationEngine.js` | `generateRecommendations()` | array | Gera lista priorizada de skills |
| `recommendationEngine.js` | `createRecommendationService()` | objeto | Cria serviço com estado interno |
| `recommendationEngine.js` | `.generate()` | array | Gera e armazena recomendações |
| `recommendationEngine.js` | `.getRecommendations()` | array | Retorna recomendações salvas |
| `recommendationEngine.js` | `.clear()` | void | Limpa recomendações |
| `recommendationEngine.js` | `.count()` | number | Quantidade de recomendações |

---

**Total: 34 métodos documentados**

*SkillMatch JS — 06Agosto/2026*
