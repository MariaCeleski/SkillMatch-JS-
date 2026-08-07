# 📋 Mapeamento de Requisitos — SkillMatch JS

> Documento de rastreabilidade: onde cada requisito está implementado no projeto.

---

## 🗂️ Estrutura do Projeto

```
Skill_match/
│
├── backend/
│   ├── models/
│   │   ├── Candidate.js        ← Req 1, 9, 11
│   │   ├── Job.js              ← Req 2, 9
│   │   └── SkillMatcher.js     ← Req 3, 4, 5, 6, 8, 10, 11
│   │
│   └── services/
│       ├── dataLoader.js       ← Req 12, 13, 14
│       └── recommendationEngine.js  ← Req 7, 8, 12
│
├── data/
│   └── mockJobs.js             ← Req 2
│
├── frontend/
│   ├── app.js                  ← Req 14, 15 (frontend)
│   ├── index.html              ← Req 15 (exibição)
│   ├── styles.css              ← Req 16 (apresentação)
│   ├── main.js                 ← Req 15, 16
│   └── console/
│       └── reportGenerator.js  ← Req 15
│       └── docs/                                             │          └── MAPEAMENTO_REQUISITOS.md
│          └── METODOS_COMENTADOS.md                              │
└── Readme.md         ← Documento de origem dos requisitos
```

---

## ✅ Requisitos e Implementações

---

### Req 1 — Criar Perfil do Candidato

**Status:** ✅ Implementado

**Descrição:** O sistema cria um objeto `Candidate_Profile` com nome, área de interesse, lista de habilidades e tempo de experiência.

**Onde está implementado:**

| Arquivo | Caminho | O que faz |
|---|---|---|
| `Candidate.js` | `backend/models/Candidate.js` | Define a classe `Candidate` com construtor que recebe `name`, `areaOfInterest`, `skills[]` e `yearsOfExperience` |
| `app.js` | `frontend/app.js` | Instancia `new Candidate(...)` com dados do formulário HTML |
| `mockJobs.js` | `data/mockJobs.js` | Define `mockCandidate` como exemplo de uso |

**Trecho chave em** `backend/models/Candidate.js`:
```js
class Candidate {
  constructor(name, areaOfInterest, skills, yearsOfExperience) {
    this.name = name;
    this.areaOfInterest = areaOfInterest;
    this.skills = skills;           // array de strings
    this.yearsOfExperience = yearsOfExperience; // number
    this.isValid = true;            // boolean
  }
}
```

---

### Req 2 — Criar Lista de Vagas (Job List)

**Status:** ✅ Implementado

**Descrição:** O sistema define uma lista de vagas fictícias com pelo menos 3 objetos `Job`.

**Onde está implementado:**

| Arquivo | Caminho | O que faz |
|---|---|---|
| `Job.js` | `backend/models/Job.js` | Define a classe `Job` com `company`, `title` e `requiredSkills[]` |
| `mockJobs.js` | `data/mockJobs.js` | Declara `const mockJobs = [...]` com 5 vagas fictícias |
| `dataLoader.js` | `backend/services/dataLoader.js` | Retorna `mockJobs` via Promise simulando um servidor |

**Trecho chave em** `data/mockJobs.js`:
```js
const mockJobs = [
  new Job('Tech StartUp XYZ', 'Front-End Developer Júnior', ['HTML', 'CSS', 'JavaScript']),
  new Job('Digital Agency Pro', 'Junior Web Developer', ['JavaScript', 'React', 'CSS']),
  // ... 3 mais
];
```

---

### Req 3 — Calcular Porcentagem de Compatibilidade

**Status:** ✅ Implementado

**Descrição:** Calcula `(skills encontradas / skills requeridas) × 100` para cada vaga.

**Onde está implementado:**

| Arquivo | Caminho | Método |
|---|---|---|
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `calculateCompatibility(candidate, job)` |

**Fórmula exata:**
```js
// backend/models/SkillMatcher.js — linha ~55
const matchingSkills = requiredSkills.filter(skill =>
  candidateSkills.includes(skill)
);
const compatibility = (matchingSkills.length / requiredSkills.length) * 100;
return Math.round(compatibility * 100) / 100;
```

**Casos cobertos:**
- 0 skills batem → retorna `0`
- Todas skills batem → retorna `100`
- Match parcial → retorna percentual proporcional

---

### Req 4 — Classificar Compatibilidade

**Status:** ✅ Implementado

**Descrição:** Classifica o score em Alta / Média / Baixa, sem sobreposição de faixas.

**Onde está implementado:**

| Arquivo | Caminho | Método |
|---|---|---|
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `classifyCompatibility(score)` |

**Faixas implementadas:**
```js
// backend/models/SkillMatcher.js — linha ~75
if (score >= 80)      return 'Alta compatibilidade';   // 80–100
else if (score >= 50) return 'Média compatibilidade';  // 50–79
else                  return 'Baixa compatibilidade';  // 0–49
```

**Exibição visual em:** `frontend/app.js` → `createJobCard()` — aplica classes CSS `alta`, `media`, `baixa`.

---

### Req 5 — Listar Skills Faltantes

**Status:** ✅ Implementado

**Descrição:** Identifica quais habilidades da vaga o candidato não possui.

**Onde está implementado:**

| Arquivo | Caminho | Método |
|---|---|---|
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `getMissingSkills(candidate, job)` |

**Lógica:**
```js
// backend/models/SkillMatcher.js — linha ~88
const missingSkills = requiredSkills.filter(skill =>
  !candidateSkills.includes(skill)
);
return missingSkills; // array vazio se tiver tudo
```

**Exibição em:** `frontend/app.js` → `createJobCard()` — renderiza tags vermelhas para skills faltantes e verdes para as que o candidato tem.

---

### Req 6 — Encontrar Vaga Mais Compatível

**Status:** ✅ Implementado

**Descrição:** Identifica e destaca a vaga com maior score de compatibilidade.

**Onde está implementado:**

| Arquivo | Caminho | Método |
|---|---|---|
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `analyzeCandidate()` + `findBestOpportunity()` |
| `app.js` | `frontend/app.js` | `displayBestOpportunity()` |

**Lógica com `reduce()`:**
```js
// backend/models/SkillMatcher.js — linha ~108
const bestMatch = analysisResults.reduce((best, current) =>
  current.score > best.score ? current : best
);
if (bestMatch.score > 0) bestMatch.isBestMatch = true;
```

**Exibição em:** Seção 3 do `index.html` → `#bestOpportunitySection` com card verde em destaque.

---

### Req 7 — Gerar Recomendações de Estudo

**Status:** ✅ Implementado

**Descrição:** Gera lista de skills para estudar, ordenada pela frequência em que aparecem nas vagas (prioridade = skill faltante em mais vagas).

**Onde está implementado:**

| Arquivo | Caminho | Função |
|---|---|---|
| `recommendationEngine.js` | `backend/services/recommendationEngine.js` | `generateRecommendations()` |
| `recommendationEngine.js` | `backend/services/recommendationEngine.js` | `calculateSkillPriority()` |
| `recommendationEngine.js` | `backend/services/recommendationEngine.js` | `createRecommendationService()` |
| `app.js` | `frontend/app.js` | `displayRecommendations()` |

**Critério de prioridade:**
```js
// backend/services/recommendationEngine.js — linha ~40
const skillFrequency = allMissingSkills.reduce((acc, skill) => {
  acc[skill] = (acc[skill] || 0) + 1;
  return acc;
}, {});
// Ordena do mais frequente para o menos
const sortedRecommendations = skillsWithPriority.sort((a, b) => b.priority - a.priority);
```

**Exibição em:** Seção 4 do `index.html` → `#recommendationsSection` com numeração de prioridade.

---

### Req 8 — Usar Array Methods (mínimo 3)

**Status:** ✅ Implementado — 6 métodos usados

**Onde está cada método:**

| Method | Arquivo | Caminho | Contexto de uso |
|---|---|---|---|
| `filter()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Encontra skills que o candidato possui |
| `filter()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Encontra skills faltantes |
| `map()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Transforma cada vaga em objeto de resultado |
| `reduce()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Encontra vaga com maior score |
| `find()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Localiza vaga marcada como `isBestMatch` |
| `every()` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` | Verifica se candidato tem TODAS as skills |
| `forEach()` | `recommendationEngine.js` | `backend/services/recommendationEngine.js` | Coleta todas as skills faltantes |
| `reduce()` | `recommendationEngine.js` | `backend/services/recommendationEngine.js` | Conta frequência de cada skill |
| `sort()` | `recommendationEngine.js` | `backend/services/recommendationEngine.js` | Ordena recomendações por prioridade |

---

### Req 9 — Implementar Classe com Construtor

**Status:** ✅ Implementado — 3 classes com construtores

**Onde está implementado:**

| Classe | Arquivo | Caminho |
|---|---|---|
| `Candidate` | `Candidate.js` | `backend/models/Candidate.js` |
| `Job` | `Job.js` | `backend/models/Job.js` |
| `BaseMatcher` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` |
| `SkillMatcher` | `SkillMatcher.js` | `backend/models/SkillMatcher.js` |

**Instanciadas em:**
- `frontend/app.js` → `new Candidate(...)`, `new SkillMatcher()`
- `data/mockJobs.js` → `new Job(...)`, `new Candidate(...)`

---

### Req 10 — Implementar Herança

**Status:** ✅ Implementado

**Descrição:** `SkillMatcher` estende `BaseMatcher` para separar responsabilidades.

**Onde está implementado:**

| Arquivo | Caminho | Detalhe |
|---|---|---|
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `class SkillMatcher extends BaseMatcher` |

**Estrutura:**
```
BaseMatcher (parent)
  └─ storeResult()   — armazena resultados
  └─ getResults()    — retorna resultados
  └─ clearResults()  — limpa resultados
  └─ this.results[]  — array compartilhado

SkillMatcher extends BaseMatcher (child)
  └─ calculateCompatibility()  — cálculo do score
  └─ getMissingSkills()        — identifica gaps
  └─ classifyCompatibility()  — Alta/Média/Baixa
  └─ analyzeCandidate()        — orquestra análise
  └─ findBestOpportunity()     — melhor vaga
  └─ meetsAllRequirements()    — boolean completo
```

**Justificativa da herança:** `BaseMatcher` cuida do armazenamento de resultados; `SkillMatcher` cuida da lógica de negócio — separação de responsabilidades.

---

### Req 11 — Demonstrar Uso do `this`

**Status:** ✅ Implementado

**Onde está demonstrado:**

| Arquivo | Caminho | Uso |
|---|---|---|
| `Candidate.js` | `backend/models/Candidate.js` | `this.name`, `this.skills`, `this.yearsOfExperience` no construtor |
| `SkillMatcher.js` | `backend/models/SkillMatcher.js` | `this.clearResults()`, `this.storeResult()`, `this.results` dentro de `analyzeCandidate()` |
| `BaseMatcher` | `backend/models/SkillMatcher.js` | `this.results.push(result)` em `storeResult()` |

---

### Req 12 — Usar Callback

**Status:** ✅ Implementado

**Onde está implementado:**

| Arquivo | Caminho | Função | Como usa callback |
|---|---|---|---|
| `recommendationEngine.js` | `backend/services/recommendationEngine.js` | `generateRecommendations(results, onRecommendationReady)` | Executa `onRecommendationReady(recommendations)` ao finalizar |
| `dataLoader.js` | `backend/services/dataLoader.js` | `loadDataAsync(callback)` | Usa padrão error-first: `callback(null, jobs)` ou `callback(error, null)` |

**Padrão error-first em** `dataLoader.js`:
```js
async function loadDataAsync(callback) {
  const jobs = await loadJobsFromServer();
  callback(null, jobs);   // callback(error, data)
}
```

---

### Req 13 — Usar Closure

**Status:** ✅ Implementado

**Onde está implementado:**

| Arquivo | Caminho | Função |
|---|---|---|
| `dataLoader.js` | `backend/services/dataLoader.js` | `createDataLoader()` |

**Como funciona:**
```js
// backend/services/dataLoader.js
function createDataLoader() {
  let loadCount = 0;       // estado interno — não é global
  const loadedData = [];   // cache interno

  return {
    load()          { loadCount++; /* ... */ },
    getLoadCount()  { return loadCount; },  // persiste entre chamadas
    getCachedData() { return [...loadedData]; },
    resetCounter()  { loadCount = 0; loadedData.length = 0; }
  };
}
```

`loadCount` persiste entre múltiplas chamadas sem uso de variável global.

---

### Req 14 — Usar Promise e Async/Await

**Status:** ✅ Implementado

**Onde está implementado:**

| Arquivo | Caminho | Função | Padrão |
|---|---|---|---|
| `dataLoader.js` | `backend/services/dataLoader.js` | `loadJobsFromServer(delayMs)` | Cria Promise com `setTimeout` |
| `dataLoader.js` | `backend/services/dataLoader.js` | `loadDataAsync(callback)` | Consome com `async/await` |
| `app.js` | `frontend/app.js` | `analyzeCandidate()` | Consome com `await loadJobsFromServer(1500)` |

**Promise em** `dataLoader.js`:
```js
function loadJobsFromServer(delayMs = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(mockJobs);          // resolve após delay
      } catch (error) {
        reject(new Error(...));     // rejeita em caso de erro
      }
    }, delayMs);
  });
}
```

**Async/await em** `app.js`:
```js
async function analyzeCandidate() {
  showLoadingState('Carregando vagas...');
  const jobs = await loadJobsFromServer(1500);  // espera 1.5s
  hideLoadingState();
  // análise prossegue com dados prontos
}
```

---

### Req 15 — Gerar Relatório (Console Report)

**Status:** ✅ Implementado — em duas formas

**Onde está implementado:**

| Arquivo | Caminho | Tipo |
|---|---|---|
| `reportGenerator.js` | `frontend/console/reportGenerator.js` | Relatório formatado no console do browser |
| `main.js` | `frontend/main.js` | Execução completa via console (`runSkillMatch()`) |
| `app.js` | `frontend/app.js` | Exibição visual no HTML (`displayResults`, `displayBestOpportunity`, etc.) |
| `index.html` | `frontend/index.html` | Estrutura HTML das seções de resultado |

**Funções de exibição em** `frontend/app.js`:

| Função | Exibe |
|---|---|
| `displayCandidateSummary()` | Resumo do perfil do candidato |
| `displayResults()` | Orquestra todas as seções |
| `createJobCard()` | Card individual de cada vaga com score |
| `displayBestOpportunity()` | Melhor vaga em destaque |
| `displayRecommendations()` | Lista de skills para estudar |
| `displayStatistics()` | Totais e médias |
| `updateReadinessMeter()` | Medidor de prontidão para o mercado |

**Funções de console em** `frontend/console/reportGenerator.js`:

| Função | O que imprime |
|---|---|
| `printFullReport()` | Relatório completo formatado |
| `printQuickSummary()` | Resumo rápido |
| `printCompatibilityTable()` | Tabela com `console.table()` |
| `createSeparator()` | Linha separadora visual |
| `formatPercentage()` | Formata número como `"75.00%"` |

---

### Req 16 — Restrições Técnicas

**Status:** ✅ Implementado

| Restrição | Status | Onde |
|---|---|---|
| Usar `const` e `let` (não `var`) | ✅ | Todos os arquivos JS |
| Funções regulares e arrow functions | ✅ | `app.js`, `SkillMatcher.js`, `recommendationEngine.js` |
| Pelo menos 2 estruturas de loop diferentes | ✅ | `for` em `reportGenerator.js`, `forEach` em `recommendationEngine.js`, `while` em `main.js` |
| Operadores lógicos e matemáticos | ✅ | `SkillMatcher.js` (divisão, multiplicação, comparação) |
| README.md com documentação | ✅ | `README.md` na raiz do projeto |

---

## 📁 Índice de Arquivos por Responsabilidade

### `backend/models/Candidate.js`
- Req 1 — Perfil do candidato
- Req 9 — Classe com construtor
- Req 11 — Uso do `this`

### `backend/models/Job.js`
- Req 2 — Objeto de vaga
- Req 9 — Classe com construtor

### `backend/models/SkillMatcher.js`
- Req 3 — Cálculo de compatibilidade (`calculateCompatibility`)
- Req 4 — Classificação Alta/Média/Baixa (`classifyCompatibility`)
- Req 5 — Skills faltantes (`getMissingSkills`)
- Req 6 — Melhor vaga (`analyzeCandidate` + `findBestOpportunity`)
- Req 8 — Array methods: `filter`, `map`, `reduce`, `find`, `every`
- Req 10 — Herança: `SkillMatcher extends BaseMatcher`
- Req 11 — Uso do `this`

### `backend/services/dataLoader.js`
- Req 12 — Callback (padrão error-first)
- Req 13 — Closure (`createDataLoader`)
- Req 14 — Promise e async/await (`loadJobsFromServer`, `loadDataAsync`)

### `backend/services/recommendationEngine.js`
- Req 7 — Recomendações por prioridade
- Req 8 — Array methods: `forEach`, `reduce`, `map`, `sort`
- Req 12 — Callback (`onRecommendationReady`)

### `data/mockJobs.js`
- Req 2 — Lista de vagas (`mockJobs[]` com 5 vagas)

### `frontend/app.js`
- Req 14 — Async/await (`analyzeCandidate`)
- Req 15 — Exibição dos resultados no HTML

### `frontend/index.html`
- Req 15 — Estrutura HTML das seções de resultado

### `frontend/styles.css`
- Req 16 — Apresentação visual responsiva

### `frontend/main.js`
- Req 15 — Execução via console do browser (`runSkillMatch()`)
- Req 16 — Múltiplos loops, arrow functions, operadores

### `frontend/console/reportGenerator.js`
- Req 15 — Relatório formatado no console

### `README.md`
- Req 16 — Documentação da fórmula de compatibilidade e critério de prioridade

---

## 🔢 Contagem de Requisitos

| Total de Requisitos | Implementados | Pendentes |
|---|---|---|
| 16 | 16 ✅ | 0 |

---

*Documento gerado em: 06 de Agosto/2026 — SkillMatch JS*
