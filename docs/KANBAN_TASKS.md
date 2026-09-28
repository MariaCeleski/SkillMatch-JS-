# Kanban — Evolução do SkillMatch JS

Este documento reúne os cartões do Kanban do projeto. Crie cada item no GitHub Projects usando o título, a descrição e o status indicados.

## Concluído

### Migrar aplicação para módulos ES

- **Descrição:** Organizar modelos e serviços com `import`/`export`, carregar a aplicação com `script type="module"` e remover eventos inline.
- **Branch:** `feature/es-modules`
- **Critérios de conclusão:** módulos carregam corretamente; eventos continuam funcionando; teste do projeto aprovado.

### Implementar carregamento de vagas via fetch

- **Descrição:** Criar catálogo em `data/jobs.json`; carregar vagas com `fetch`, `async/await`, `try/catch` e `response.ok`; converter JSON em objetos do motor.
- **Branch:** `feature/fetch-jobs`
- **Critérios de conclusão:** tratar sucesso, carregando, vazio e erro; catálogo possuir ao menos quatro vagas.

### Melhorar SEO e acessibilidade da interface

- **Descrição:** Adicionar meta description, navegação semântica, link para pular ao conteúdo, logo com `alt` e associação entre seções e títulos.
- **Branch:** `feature/seo-accessibility`
- **Critérios de conclusão:** página com title, meta description, landmarks, navegação por teclado e imagem com texto alternativo.

### Adaptar layout principal para Flexbox

- **Descrição:** Usar Flexbox com `flex-wrap` e `gap` nos cards, formulário, habilidades, resumo, recomendações e estatísticas.
- **Branch:** `feature/flex-layout`
- **Critérios de conclusão:** layout responsivo do celular ao desktop sem usar CSS Grid como sistema de layout.

### Adicionar validação acessível ao formulário

- **Descrição:** Converter a área de perfil em formulário, usar evento `submit` com `preventDefault` e comunicar erros de forma acessível.
- **Branch:** `feature/accessible-form`
- **Situação:** integrado em `main` pelo PR #12, após resolução do conflito no commit `a2770b1`.
- **Critérios de conclusão:** nome, área e ao menos uma habilidade obrigatórios; erros com `aria-invalid`, `aria-describedby` e foco no primeiro campo inválido.

## Em revisão

### Persistir perfil do candidato

- **Descrição:** Salvar e restaurar nome, área, experiência e habilidades com `localStorage` e JSON.
- **Branch:** `feature/profile-storage`
- **Situação:** implementada e publicada; aguarda revisão e integração.
- **Critérios de conclusão:** primeira visita tratada com `null`; perfil restaurado após recarregar; ranking mantido em chave separada.

## Em andamento

### Exibir detalhes completos das vagas

- **Descrição:** Mostrar descrição, modalidade, salário, senioridade e stack nos cards e na melhor oportunidade.
- **Branch:** `feature/job-card-details`
- **Situação:** implementada no commit local `669d6fe`; aguarda push e pull request.
- **Critérios de conclusão:** salário formatado em real; detalhes apresentados com marcação semântica; compatibilidade permanece inalterada.

## A fazer

### Adicionar filtro e ordenação de vagas

- **Descrição:** Permitir filtrar por modalidade e nível de compatibilidade; ordenar por compatibilidade, salário ou empresa.
- **Branch sugerida:** `feature/job-filters`
- **Critérios de conclusão:** filtros e ordenação atualizam os cards dinamicamente sem novo carregamento.

### Implementar tema claro e escuro persistente

- **Descrição:** Criar controle de tema e guardar a preferência no `localStorage`.
- **Branch sugerida:** `feature/theme-preference`
- **Critérios de conclusão:** tema aplicado ao carregar a página, alternável pelo usuário e acessível por teclado.

### Criar testes do motor e do fluxo web

- **Descrição:** Cobrir cálculo de compatibilidade, classificação, recomendações, transformação do catálogo, persistência e estados do carregamento.
- **Branch sugerida:** `feature/app-tests`
- **Critérios de conclusão:** testes executáveis por `npm test` e cenários de sucesso, vazio e erro documentados.

### Atualizar README final

- **Descrição:** Documentar arquitetura, execução com Live Server, módulos ES, fetch, persistência, testes e processo Git.
- **Branch sugerida:** `docs/update-readme`
- **Critérios de conclusão:** instruções atuais, claras e compatíveis com a versão final da aplicação.

### Publicar no GitHub Pages

- **Descrição:** Configurar hospedagem HTTPS e adicionar o link público ao README.
- **Branch sugerida:** `feature/github-pages`
- **Critérios de conclusão:** aplicação publicada e carregamento de `jobs.json` funcionando em produção.

## Processo contínuo

### Integrar features no fluxo Git

- **Descrição:** Abrir PRs de features para `develop`, revisar, testar e integrar. Ao final, abrir PR de `develop` para `main`.
- **Critérios de conclusão:** todos os recursos aprovados em `main`; branches preservadas após o merge; commits pequenos e descritivos.
