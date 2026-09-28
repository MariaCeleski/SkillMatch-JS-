2. DESAFIO
Você foi efetivado na startup de recrutamento onde fez o protótipo do SkillMatch. O time gostou do motor de análise, mas pediu: "o RH não vai abrir o console do navegador para usar isso, precisamos de uma tela de verdade, que rode em qualquer dispositivo, lembre do perfil de quem usou e puxe as vagas de uma fonte de dados."
Sua missão é evoluir o SkillMatch de script de console para uma aplicação web (Single
Page) em HTML, CSS e JavaScript puro, reaproveitando o motor de compatibilidade que você já escreveu e cobrindo tudo o que foi trabalhado no Módulo 01.
Ao construir a aplicação, você coloca em prática os aprendizados em:
	◦	﻿﻿Lógica e JavaScript (S02-S06): tipos, condicionais, operadores, laços, funções, arrow functions, arrays e seus métodos, objetos, POO (classes, herança, this), callbacks, closures, Promises e async/await, o motor do SkillMatch.
	◦	﻿﻿HTML e CSS (S07/S10): marcação, CSS externo, Flexbox, box model, e responsividade mobile-first (a página funciona em qualquer tela).
	◦	﻿﻿DOM e eventos (S08/S09): capturar formulário, validar entradas, reagir a eventos e desenhar a tela com JavaScript (innerHTML/classList).
	◦	﻿﻿Semântica, acessibilidade e SEO (S11): tags que significam algo, label/for, alt, title/meta description.
	◦	﻿﻿Persistência e rede (S11): localStorage para lembrar do usuário e fetch + async/await para carregar as vagas, tratando os três estados (carregando/vazio/erro).
	◦	﻿﻿Organização(S12): dividir o JavaScript em módulos ES (import/export).
	◦	﻿﻿Processo profissional: Git/GitHub (branches, commits descritivos), Trello (Kanban) eREADME, tratar suas alterações como algo que impacta o projeto inteiro.

4.2. REQUISITOS FUNCIONAIS (RF)
Os RF estão agrupados por camada. Os grupos A-D são obrigatórios (cobrem o semestre inteiro). Os itens marcados × são bônus (valem como diferencial — ver 4.3 e seção 6).
Grupo A — O motor SkillMatch (reaproveitado do mini • S02-S06)
	◦	﻿﻿RFO1 — Perfil do candidato: representar o candidato como objeto (nome, área de interesse, habilidades em array e o tempo de experiência). Dê um uso ao tempo de experiência (ex.: exibir no card de perfil e/ou usá-lo como critério de desempate entre vagas de mesma compatibilidade). Diferente do mini, o perfil agora é preenchido pelc 4 de usuário no formulário (RF10) e persistido (RF14).
	◦	﻿﻿RFO2 — Catálogo de vagas: uma lista (array) de pelo menos 4 vagas, cada uma um objeto (ia, empresa, cargo, requisitos, salário, modalidade, etc). As vagas são carregadas via fetch (RF13), não escritas à mão no HTML.
	◦	﻿﻿RF03 — Cálculo de compatibilidade: para cada vaga, calcular o percentual e separar habilidades encontradas × faltantes.
	◦	﻿﻿RF04 — Classificação: classificar cada vaga (Alta 80-100% • Média 50-79% • Baixa0-49%) usando if/else, switch ou ternário.
	◦	﻿﻿RF05 — Melhor vaga + recomendação de estudo: identificar a vaga de maior compatibilidade e gerar uma recomendação com base nas habilidades que mais faltam.
	◦	﻿﻿RF06 — Métodos de array: usar pelo menos 3 entre map, filter, find, every, reduce (ex.: map para gerar os resultados, filter para faltantes, reduce para a melhor vaga).
	◦	﻿﻿RF07 — POO: ter pelo menos uma classe (ex.: Vaga) com construtor, atributos e método usando this (ex.: o próprio cálculo de compatibilidade como método, usando this.requisitos), e uma classe que herda de outra com um motivo claro - ex.:VagaFrontEnd extends Vaga que acrescenta um atributo (stack ou senioridade) e sobrescreve um método (um rótulo de exibição, ou um peso extra em certos requisitos). A herança precisa de um propósito que você saiba explicar (não "só para cumprir a tabela").
	◦	﻿﻿RF08 — Callback e closure: usar pelo menos um callback (função que recebe outra função) e uma closure (ex.: um contador de quantas análises foram feitas na sessão).
	◦	Como o JSON vira objeto do motor (liga RF13 → RF06 → RF07): depois do fetch, use map para transformar cada objeto do vagas.json numa instância de Vaga (new Vaga(...)). Assim os dados (JSON) viram regras (o motor com seus métodos), e o cálculo de compatibilidade fica dentro da classe (this.requisitos), não como função solta nem com as vagas escritas à mão.
	◦	Grupo B-Intertace (S07 • S08 • 509 • SIO ST1)
	◦	• RF09 — HTML semântico, acessível e com SEO: estruturar a página com landmarks (header/nav/main/section/footer), um único hl e hierarquia de títulos, label/for nos campos e lang no html. Inclua ao menos uma imagem (ex: um logo no header com alt informativo e/ou um ícone decorativo com alt='") para exercitar a distinção
	◦	
	◦	decorativo × informativo. Incluir SEO on-page: title descritivo e meta description.
	◦	(Rode o Lighthouse para conferir Acessibilidade/SEO, como na S1l.)
	◦	RF1O — Formulário de perfil com validação e eventos: um formulário onde o usuário informa nome, área e habilidades, o tempo de experiência e/ou demais campos.
	◦	Capturar com addEventListener, impedir o reload com preventDefault, e validar as entradas (campos obrigatórios; feedback de erro acessível).
	◦	﻿﻿RF11 — Render dinâmico no DOM: os cards de vaga devem ser gerados por JavaScript a partir dos dados (innerHTML/createElement/classList), não escritos à mão no HTML.Cada card mostra empresa, cargo, % de compatibilidade, classificação, habilidades encontradas, habilidades faltantes e outros campos opcionais (como no resultado do mini). Os cards se reorganizam em colunas com Flexbox (flex-wrap + gap).
	◦	﻿﻿RF12 — Layout responsivo (mobile-first): meta viewport, unidades relativas/fluidas (%, rem, vw/clamp()), media queries e mídia fluida (max-width: 100%, object-fit). Layout em Flexbox. A página tem que funcionar bem do celular ao desktop (testar no modo responsivo do DevTools).
	◦	Grupo C — Dados e persistência (S11)
	◦	﻿﻿RF13 — fetch das vagas com os 3 estados: carregar o catálogo de vagas com fetch +async/await a partir de um arquivo local. Tratar explicitamente os três estados da S1l: carregando (feedback "Carregando vagas..."), vazio (nenhuma vaga / nenhum resultado → "Nada encontrado") e erro (a rede falhou → mensagem clara). O caminho normal: sucesso (renderizar os cards), não é um dos três tratamentos. Usar try/catch, checar response.ok e anunciar a mensagem de erro/vazio. Lembre o conceito cliente-servidor do mini: o fetch é o cliente pedindo dados, a Promise que você antes simulava agora é rede de verdade.
	◦	﻿﻿RF14 — Persistência com localStorage: lembrar do perfil do candidato (e/ou preferências, como uma ordenação) entre recarregamentos - setltem/getitem, JSON.stringify/JSON.parse, e tratar o null da primeira visita. Reforce a fronteira de segurança: nunca guardar dados sensíveis.
	◦	Grupo D - Organização e qualidade (S12)
	◦	• RF15 — Módulos ES: organizar o JavaScript em módulos com import/export e ‹script type="module">, separando motor (regras) × ui (tela) × dados (fetch/localStorage).
	◦	Nada de um único js gigante.
	◦	* Bônus (diferencial — não obrigatórios)
	◦	﻿﻿* Browser API: "clima/contexto onde estou" com Geolocation (tratando permissãonegada), ou outra API nativa.
	◦	﻿﻿Deploy no GitHub Pages e link no README (serve via https — também resolve o file://.Tema claro/escuro persistido no localStorage.
	◦	* Filtro/ordenação de vagas (por modalidade, salário ou compatibilidade).
	◦	Conteúdo (semana)
	◦	Obrigatório?
	◦	Como demonstrar
	◦	felse peradores, condicionais
	◦	switch, ternário) (S02-503)
	◦	Sim
	◦	Cálculo de compatibilidade e classificação
	◦	Laços (for/while) ou métodos de array que iteram (S03-S04)
	◦	Sim
	◦	Iterar requisitos/habilidades (os métodos de array já contam; ≥1 laço explícito é bem-vindo)
	◦	Funções e arrow functions (S03)
	◦	Sim
	◦	Regras do motor; callbacks dos eventos
	◦	Arrays + metodos
	◦	map/filter/find/every/reduce (S04)
	◦	Sim (≥3)
	◦	Processar vagas e habilidades
	◦	Objetos (chaves/valores) (S04)
	◦	Sim
	◦	Candidato e vagas
	◦	POO: classe, construtor, atributos, método, this, herança (S05)
	◦	Sim
	◦	Classe Vaga + VagaFrontEnd
	◦	Callback e closure (S06)
	◦	Sim
	◦	Mensagem final; contador de análises
	◦	Promises / async/await (S06)
	◦	Sim
	◦	No fetch (RF13) — agora real, não simulado
	◦	HTML semântico (S07/S11)
	◦	Sim
	◦	Landmarks, um hl, hierarquia
	◦	CSS externo, box model, Flexbox
	◦	(S07/S10)
	◦	Sim
	◦	Layout dos cards e do formulário
	◦	Responsividade mobile-first (media queries, unidades fluidas) (S10)
	◦	Sim
	◦	Funciona do celular ao desktop
	◦	DOM + eventos: addEventListener, innerHTML, createElement, classList, preventDefault (S08/S09)
	◦	Sim
	◦	Formulário + render dos cards
	◦	Validação de formulário (S09)
	◦	Sim
	◦	Campos obrigatórios + erro acessível
	◦	Acessibilidade: label/for, alt, lang
	◦	(S11)
	◦	Sim
	◦	Página navegável por teclado
	◦	SEO on-page: title, meta description (S11)
	◦	Sim
	◦	No <head>
	◦	fetch + 3 estados
	◦	(carregando/vazio/erro), try/catch, response.ok (S11)
	◦	Sim
	◦	Carregar as vagas
	◦	localStorage + JSON stringify/parse
	◦	+ tratar null (S11)
	◦	Sim
	◦	Lembrar do perfil
	◦	Módulos ES import/export (S12)
	◦	Sim
	◦	motor/ui/dados separados
	◦	Git: branches, commits descritivos, GitHub (S06+)
	◦	Sim
	◦	Histórico do repositório
	◦	Kanban (Trello)
	◦	Sim
	◦	Quadro do projeto
	◦	Fora do escopo do Módulo 01 (não usar): React ou qualquer framework JS (Vue/Angular), TypeScript, bundlers/build (Webpack/Vite/Babel), CSS Grid como sistema de layout (foi só menção, use Flexbox), Sass/CSS-in-JS, back-end/servidor/banco de dados, fetch com POST/PUT/DELETE que grave em servidor, jQuery/axios e bibliotecas não vistas. Tudo isso chega no Módulo 02 — aqui o mérito é fazer com o que aprendemos.
	◦	Faça assim (Módulo 01)
	◦	HTML + DOM puro (createElement)
	◦	JavaScript puro
	◦	módulos ES locais (./motor.js) ou CDN
	◦	Flexbox
	◦	fetch / document.querySelector
	◦	vagas.json local + localStorage
	◦	nunca dados sensíveis
5. ROTEIRO DA APLICAÇÃO
Abaixo segue um detalhamento de como a aplicação deve se comportar (exemplos de telas, modelagem de sistemas, banco de dados, etc.)
5.1. FORMATO DO SISTEMA
A aplicação é uma página web única (Single Page) em HTML, CSS e JavaScript puro, rodando no navegador (via Live Server). O fluxo do usuário:
[abrir a página ]
1 (se já usou antes, o perfil volta do localStorage)
[formulário de perfil ] → preenche nome / área / habilidades → valida
[ análise ] motor compara o perfil com as vagas (carregadas via fetch)
| enquanto carrega: "Carregando vagas.." | se falhar: mensagem de erro acessível
[resultado ] CARDS de vaga numa grade responsiva (Flexbox: flex-wrap + gap):
empresa • cargo • % compatibilidade • classificação • habilidades encontradas/faltantes
+ destaque da VAGA MAIS COMPATIVEL + recomendação de estudo
[ persistência ] o perfil fica salvo (localStorage) para a próxima visita
Telas/áreas mínimas: (1) cabeçalho/identidade; (2) formulário de perfil; (3) área de resultados (cards + destaque da melhor vaga + recomendação); (4) rodapé. Tudo semântico, responsivo e acessível. Você pode esboçar isso no Excalidraw antes de codar (como fizemos em aula).

