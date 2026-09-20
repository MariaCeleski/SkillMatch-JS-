# SkillMatch JS

Aplicação web em JavaScript puro que compara o perfil de uma pessoa candidata com vagas fictícias de Front-End. Ela calcula a compatibilidade, aponta habilidades faltantes, recomenda estudos e mantém um ranking local no navegador.

## Recursos

- Formulário com nome, área, experiência e habilidades.
- Catálogo carregado de `data/jobs.json` com `fetch`, `async/await` e tratamento de carregamento, vazio e erro.
- Motor de compatibilidade com classes, herança e métodos de array.
- Cards com descrição, modalidade, salário, senioridade, stack, habilidades encontradas e faltantes.
- Filtros por modalidade e nível de compatibilidade, além de ordenação por compatibilidade, salário ou empresa.
- Tema claro/escuro com preferência persistida em `localStorage`.
- Ranking de análises persistido localmente.

## Executar localmente

O catálogo é carregado por `fetch`; portanto, abra a aplicação por um servidor HTTP, e não diretamente por `file://`.

Com a extensão Live Server do VS Code:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito em `frontend/index.html`.
3. Escolha **Open with Live Server**.

Também é possível iniciar um servidor local na raiz do projeto:

```bash
python3 -m http.server 8000
```

Depois, abra `http://localhost:8000/frontend/`.

## Testes

```bash
npm test
```

O comando executa a suíte nativa do Node.js e os testes de console já existentes. A cobertura automatizada valida o motor de compatibilidade, a recomendação de habilidades e o carregamento do catálogo nos cenários de sucesso, lista vazia e erro HTTP. Veja também [docs/TESTES.md](docs/TESTES.md).

## Estrutura

```text
backend/
  models/       # Candidate, Job, FrontEndJob e SkillMatcher
  services/     # carregamento do catálogo e recomendações
data/jobs.json  # vagas usadas pela aplicação
frontend/
  index.html    # interface
  app.js        # eventos, renderização e estado da tela
  styles.css    # estilos responsivos
tests/          # testes automatizados com node:test
```

## Como a compatibilidade é calculada

```text
compatibilidade = habilidades encontradas / habilidades requeridas × 100
```

As faixas são: alta (80% a 100%), média (50% a 79%) e baixa (0% a 49%). A recomendação prioriza as habilidades ausentes com maior frequência nas vagas analisadas.

## Conceitos praticados

- Módulos ES com `import` e `export`.
- Classes, construtores, `this` e herança (`FrontEndJob extends Job`).
- `map`, `filter`, `find`, `reduce`, `every` e `sort`.
- Callbacks, closure, Promises e `async/await`.
- DOM, eventos, renderização dinâmica e responsividade.
- `fetch` e `localStorage`.

## Documentação complementar

- [Cenários de teste](docs/TESTES.md)
- [Mapeamento de requisitos do console](frontend/console/docs/MAPEAMENTO_REQUISITOS.md)

## Autora

Maria de Lourdes Celeski
