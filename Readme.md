# SkillMatch JS — Simulador de Compatibilidade com Vagas Front-End

> Projeto educacional em JavaScript puro (ES6+) que compara o perfil de um candidato com vagas fictícias, calcula compatibilidade, identifica lacunas de habilidades e gera recomendações de estudo.

---

## 📌 Sobre o Projeto

SkillMatch JS é uma aplicação web completa construída com **JavaScript vanilla**, sem frameworks. O sistema permite que um candidato informe seu perfil (nome, área de interesse, habilidades e experiência) e receba uma análise detalhada de compatibilidade com diversas vagas do mercado front-end.

**Objetivo principal:** Demonstrar domínio de conceitos fundamentais de JavaScript — POO, array methods, async/await, closures, callbacks, herança — através de um projeto funcional e com interface visual.

---

## 🚀 Como Executar

### Opção 1 — Abrir diretamente no navegador (recomendado)

```
1. Navegue até a pasta do projeto
2. Abra o arquivo frontend/index.html em qualquer navegador moderno
3. Preencha o formulário de perfil
4. Clique em "Analisar Compatibilidade"
```

### Opção 2 — Via console do navegador

```
1. Abra qualquer página no navegador
2. Pressione F12 → aba Console
3. Cole o conteúdo de frontend/main.js
4. Execute: runSkillMatch()
```

### Opção 3 — Live Server (VS Code)

```
1. Instale a extensão "Live Server"
2. Clique com o botão direito em frontend/index.html
3. Selecione "Open with Live Server"
```

---

## 🗂️ Estrutura do Projeto

```
Skill_match/
│
├── backend/
│   ├── models/
│   │   ├── Candidate.js          ← Modelo do candidato (Req 1, 9, 11)
│   │   ├── Job.js                ← Modelo de vaga (Req 2, 9)
│   │   └── SkillMatcher.js       ← Motor de compatibilidade (Req 3–6, 8, 10, 11)
│   │
│   └── services/
│       ├── dataLoader.js         ← Carregamento async, closure, callback (Req 12, 13, 14)
│       └── recommendationEngine.js  ← Recomendações de estudo (Req 7, 8, 12)
│
├── data/
│   └── mockJobs.js               ← 5 vagas fictícias de exemplo (Req 2)
│
├── frontend/
│   ├── app.js                    ← Lógica principal da interface web
│   ├── index.html                ← Estrutura HTML da aplicação
│   ├── styles.css                ← Estilização responsiva com CSS Grid/Flexbox
│   ├── main.js                   ← Versão console do simulador
│   └── console/
│       └── reportGenerator.js    ← Gerador de relatório formatado no console
│
├── .kiro/specs/skillmatch-js/
│   ├── requirements.md           ← Requisitos funcionais completos
│   ├── design.md                 ← Documento de design e arquitetura
│   └── tasks.md                  ← Lista de tarefas de implementação
│
├── MAPEAMENTO_REQUISITOS.md      ← Rastreabilidade: requisito × arquivo × método
├── METODOS_COMENTADOS.md         ← Documentação de todos os 34 métodos
└── README.md                     ← Este arquivo
```

---

## 🧮 Regra de Cálculo de Compatibilidade

**Fórmula:**

```
Compatibilidade (%) = (Habilidades Encontradas / Habilidades Requeridas) × 100
```

**Exemplo prático:**
- Vaga requer: `['HTML', 'CSS', 'JavaScript', 'React']`
- Candidato tem: `['HTML', 'CSS', 'JavaScript']`
- Cálculo: `(3 / 4) × 100 = 75%`
- Classificação: **Média compatibilidade**

**Casos extremos:**
- Candidato não tem nenhuma skill da vaga → `0%`
- Candidato tem todas as skills da vaga → `100%`

**Implementado em:** `backend/models/SkillMatcher.js` → método `calculateCompatibility()`

---

## 📊 Classificação de Compatibilidade

| Faixa de Score | Classificação | Cor |
|---|---|---|
| 80% – 100% | Alta compatibilidade | 🟢 Verde |
| 50% – 79% | Média compatibilidade | 🟡 Amarelo |
| 0% – 49% | Baixa compatibilidade | 🔴 Vermelho |

**Implementado em:** `backend/models/SkillMatcher.js` → método `classifyCompatibility()`

---

## 📚 Critério de Prioridade nas Recomendações

As recomendações de estudo são ordenadas pela **frequência** — a skill que aparece faltando em mais vagas recebe maior prioridade.

**Algoritmo:**
1. Coleta todas as skills faltantes de todas as vagas analisadas
2. Conta quantas vezes cada skill aparece na lista
3. Ordena do mais frequente para o menos frequente
4. Remove duplicatas mantendo apenas a primeira ocorrência de cada skill

**Exemplo:**
- `"React"` falta em 4 vagas → prioridade 1
- `"TypeScript"` falta em 2 vagas → prioridade 2
- `"GraphQL"` falta em 1 vaga → prioridade 3

**Implementado em:** `backend/services/recommendationEngine.js` → `generateRecommendations()`

---

## 🏗️ Arquitetura em Três Camadas

```
┌─────────────────────────────────────────┐
│              FRONTEND                   │
│   index.html + app.js + styles.css      │
│   Formulário → Análise → Resultados     │
└───────────────────┬─────────────────────┘
                    │ await / callbacks
┌───────────────────▼─────────────────────┐
│           CAMADA DE SERVIÇOS            │
│   dataLoader.js + recommendationEngine  │
│   Promise → Async/Await → Closure       │
└───────────────────┬─────────────────────┘
                    │ instâncias
┌───────────────────▼─────────────────────┐
│            CAMADA DE MODELOS            │
│   Candidate.js + Job.js + SkillMatcher  │
│   Classes → Herança → Array Methods     │
└───────────────────┬─────────────────────┘
                    │ dados
┌───────────────────▼─────────────────────┐
│             CAMADA DE DADOS             │
│              mockJobs.js                │
│         5 vagas fictícias               │
└─────────────────────────────────────────┘
```

---

## 🧩 Conceitos JavaScript Demonstrados

| Conceito | Arquivo | Método / Onde |
|---|---|---|
| **Classes e Construtor** | `Candidate.js`, `Job.js` | `constructor()` |
| **Herança (`extends`)** | `SkillMatcher.js` | `SkillMatcher extends BaseMatcher` |
| **Keyword `this`** | `SkillMatcher.js`, `Candidate.js` | `this.results`, `this.skills` |
| **`filter()`** | `SkillMatcher.js` | Encontrar skills que batem / skills faltantes |
| **`map()`** | `SkillMatcher.js` | Transformar vagas em objetos de resultado |
| **`reduce()`** | `SkillMatcher.js` | Encontrar vaga com maior score |
| **`find()`** | `SkillMatcher.js` | Localizar melhor match |
| **`every()`** | `SkillMatcher.js` | Verificar se candidato tem TODAS as skills |
| **`forEach()`** | `recommendationEngine.js` | Coletar skills faltantes |
| **`sort()`** | `recommendationEngine.js` | Ordenar por prioridade |
| **Callback** | `recommendationEngine.js`, `dataLoader.js` | `onRecommendationReady`, error-first pattern |
| **Closure** | `dataLoader.js` | `createDataLoader()` — estado encapsulado |
| **Promise** | `dataLoader.js` | `loadJobsFromServer()` — simula servidor |
| **Async/Await** | `dataLoader.js`, `app.js` | `loadDataAsync()`, `analyzeCandidate()` |
| **DOM Manipulation** | `app.js` | `document.getElementById()`, template literals |
| **CSS Grid / Flexbox** | `styles.css` | Layout responsivo em 3 breakpoints |
| **localStorage** | `app.js` | Ranking de candidatos persistente |

---

## 🖥️ Funcionalidades da Interface Web

### Formulário de Perfil
- **Nome:** campo de texto livre
- **Área de Interesse:** dropdown com Front-End, Backend e FullStack
- **Anos de Experiência:** slider sincronizado com input numérico
- **Habilidades:** checkboxes organizados em 4 categorias (Frontend, Backend, Banco de Dados, DevOps & Cloud)

### Resultados após análise
| Seção | O que mostra |
|---|---|
| **Resumo do Perfil** | Dados do candidato + Medidor de Prontidão para o Mercado |
| **Compatibilidade com Vagas** | Cards para cada vaga com score, barra de progresso e skills |
| **Melhor Oportunidade** | Destaque da vaga com maior compatibilidade |
| **Recomendações de Estudo** | Lista priorizada de skills para aprender |
| **Estatísticas** | Total de vagas, score máximo, score médio, skills a aprender |
| **Ranking de Candidatos** | Tabela com todos os candidatos analisados (persiste no navegador) |

### Medidor de Prontidão para o Mercado
Aparece no resumo após a análise, calculando a média geral:

| Média | Nível |
|---|---|
| ≥ 80% | 🟢 Pronto para o Mercado |
| 60–79% | 🔵 Quase lá |
| 40–59% | 🟡 Em Desenvolvimento |
| < 40% | 🔴 Iniciante |

### Ranking de Candidatos
- Acumula todos os candidatos analisados na sessão
- Persiste mesmo após recarregar a página (localStorage)
- Ordenado automaticamente do maior para o menor score médio
- Mostra 🥇🥈🥉 para os 3 primeiros
- Permite remover candidatos individualmente ou limpar tudo

---

## 📋 Requisitos Implementados

Todos os 16 requisitos definidos em `.kiro/specs/skillmatch-js/requirements.md` estão implementados:

| # | Requisito | Status | Arquivo Principal |
|---|---|---|---|
| 1 | Criar Perfil do Candidato | ✅ | `Candidate.js` |
| 2 | Criar Lista de Vagas | ✅ | `Job.js`, `mockJobs.js` |
| 3 | Calcular % de Compatibilidade | ✅ | `SkillMatcher.js` |
| 4 | Classificar Compatibilidade | ✅ | `SkillMatcher.js` |
| 5 | Listar Skills Faltantes | ✅ | `SkillMatcher.js` |
| 6 | Encontrar Melhor Vaga | ✅ | `SkillMatcher.js` |
| 7 | Gerar Recomendações de Estudo | ✅ | `recommendationEngine.js` |
| 8 | Usar Array Methods (mín. 3) | ✅ | 9 métodos usados |
| 9 | Implementar Classe com Construtor | ✅ | `Candidate.js`, `Job.js` |
| 10 | Implementar Herança | ✅ | `SkillMatcher extends BaseMatcher` |
| 11 | Demonstrar uso do `this` | ✅ | `SkillMatcher.js`, `Candidate.js` |
| 12 | Usar Callback | ✅ | `recommendationEngine.js`, `dataLoader.js` |
| 13 | Usar Closure | ✅ | `dataLoader.js` → `createDataLoader()` |
| 14 | Usar Promise e Async/Await | ✅ | `dataLoader.js` → `loadJobsFromServer()` |
| 15 | Gerar Relatório | ✅ | `app.js`, `reportGenerator.js` |
| 16 | Restrições Técnicas | ✅ | Todos os arquivos |

Para o mapeamento completo (requisito → arquivo → método), consulte `MAPEAMENTO_REQUISITOS.md`.

---

## 🔧 Documentação Técnica

| Documento | Descrição |
|---|---|
| `MAPEAMENTO_REQUISITOS.md` | Rastreabilidade completa dos 16 requisitos |
| `METODOS_COMENTADOS.md` | Explicação dos 34 métodos do projeto |
---

## 🌐 Compatibilidade

| Ambiente | Suporte |
|---|---|
| Chrome 88+ | ✅ |
| Firefox 85+ | ✅ |
| Safari 14+ | ✅ |
| Edge 88+ | ✅ |
| Mobile Chrome / Safari | ✅ |
| Node.js | ⚠️ Parcial (sem DOM) |

---

## 👩‍💻 Autora

**Maria de Lourdes Celeski**
Módulo M1S6 — Front-End React T3
Agosto de 2026
