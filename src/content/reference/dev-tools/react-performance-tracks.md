---
title: React Performance tracks
---

<Intro>

As trilhas de Performance do React são entradas personalizadas especializadas que aparecem na linha do tempo do painel Performance em suas ferramentas de desenvolvedor do navegador.

</Intro>

Essas trilhas são projetadas para fornecer aos desenvolvedores insights abrangentes sobre o desempenho de sua aplicação React, visualizando eventos e métricas específicas do React ao lado de outras fontes de dados críticas, como requisições de rede, execução de JavaScript e atividade do loop de eventos, tudo sincronizado em uma linha do tempo unificada dentro do painel Performance para uma compreensão completa do comportamento da aplicação.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="Trilhas de Performance do React" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="Trilhas de Performance do React" />
</div>

<InlineToc />

---

## Uso {/*usage*/}

As trilhas de Performance do React estão disponíveis apenas em builds de desenvolvimento e profiling do React:

- **Desenvolvimento**: habilitado por padrão.
- **Profiling**: Apenas as trilhas do Scheduler estão habilitadas por padrão. A trilha de Componentes lista apenas Componentes que estão em subárvores envolvidas com [`<Profiler>`](/reference/react/Profiler). Se você tiver a extensão [React Developer Tools](/learn/react-developer-tools) habilitada, todos os Componentes são incluídos na trilha de Componentes, mesmo que não estejam envolvidos em `<Profiler>`. As trilhas do Servidor não estão disponíveis em builds de profiling.

Se habilitadas, as trilhas devem aparecer automaticamente nos traces que você grava com o painel Performance de navegadores que fornecem [APIs de extensibilidade](https://developer.chrome.com/docs/devtools/performance/extension).

<Pitfall>

A instrumentação de profiling que alimenta as trilhas de Performance do React adiciona alguma sobrecarga adicional, portanto, ela é desabilitada em builds de produção por padrão.
As trilhas de Componentes do Servidor e Requisições do Servidor estão disponíveis apenas em builds de desenvolvimento.

</Pitfall>

### Usando builds de profiling {/*using-profiling-builds*/}

Além dos builds de produção e desenvolvimento, o React também inclui um build de profiling especial.
Para usar builds de profiling, você precisa usar `react-dom/profiling` em vez de `react-dom/client`.
Recomendamos que você crie um alias para `react-dom/client` como `react-dom/profiling` em tempo de build através de aliases do bundler em vez de atualizar manualmente cada importação de `react-dom/client`.
Seu framework pode ter suporte integrado para habilitar o build de profiling do React.

---

## Trilhas {/*tracks*/}

### Scheduler {/*scheduler*/}

O Scheduler é um conceito interno do React usado para gerenciar tarefas com diferentes prioridades. Esta trilha consiste em 4 subtilhas, cada uma representando trabalho de uma prioridade específica:

- **Blocking** - As atualizações síncronas, que poderiam ter sido iniciadas por interações do usuário.
- **Transition** - Trabalho não bloqueante que acontece em segundo plano, geralmente iniciado via [`startTransition`](/reference/react/startTransition).
- **Suspense** - Trabalho relacionado a limites de Suspense, como exibir fallbacks ou revelar conteúdo.
- **Idle** - O trabalho de menor prioridade que é feito quando não há outras tarefas com prioridade mais alta.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="Trilha do Scheduler" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="Trilha do Scheduler" />
</div>

#### Renders {/*renders*/}

Cada passagem de renderização consiste em várias fases que você pode ver em uma linha do tempo:

- **Update** - isso é o que causou uma nova passagem de renderização.
- **Render** - O React renderiza a subárvore atualizada chamando as funções de renderização dos componentes. Você pode ver a subárvore de componentes renderizados na [trilha de Componentes](#components), que segue o mesmo esquema de cores.
- **Commit** - Após renderizar os componentes, o React submeterá as alterações ao DOM e executará efeitos de layout, como [`useLayoutEffect`](/reference/react/useLayoutEffect).
- **Remaining Effects** - O React executa os efeitos passivos de uma subárvore renderizada. Isso geralmente acontece após a pintura, e é quando o React executa hooks como [`useEffect`](/reference/react/useEffect). Uma exceção conhecida são as interações do usuário, como cliques, ou outros eventos discretos. Nesse cenário, essa fase pode ocorrer antes da pintura.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="Trilha do Scheduler: atualizações" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="Trilha do Scheduler: atualizações" />
</div>

[Saiba mais sobre renders e commits](/learn/render-and-commit).

#### Atualizações em cascata {/*cascading-updates*/}

Atualizações em cascata são um dos padrões para regressões de desempenho. Se uma atualização foi agendada durante uma passagem de renderização, o React pode descartar o trabalho concluído e iniciar uma nova passagem.

Em builds de desenvolvimento, o React pode mostrar qual Componente agendou uma nova atualização. Isso inclui atualizações gerais e em cascata. Você pode ver o trace de pilha aprimorado clicando na entrada "Cascading update", que também deve exibir o nome do método que agendou uma atualização.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="Trilha do Scheduler: atualizações em cascata" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="Trilha do Scheduler: atualizações em cascata" />
</div>

[Saiba mais sobre Efeitos](/learn/you-might-not-need-an-effect).

### Componentes {/*components*/}

A trilha de Componentes visualiza as durações dos componentes React. Eles são exibidos como um flamegraph, onde cada entrada representa a duração da renderização do componente correspondente e todos os seus componentes filhos descendentes.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="Trilha de Componentes: durações de renderização" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="Trilha de Componentes: durações de renderização" />
</div>

Semelhante às durações de renderização, as durações de efeitos também são representadas como um flamegraph, mas com um esquema de cores diferente que se alinha com a fase correspondente na trilha do Scheduler.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="Trilha de Componentes: durações de efeitos" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="Trilha de Componentes: durações de efeitos" />
</div>

<Note>

Ao contrário das renderizações, nem todos os efeitos são exibidos na trilha de Componentes por padrão.

Para manter o desempenho e evitar poluição visual da interface, o React exibirá apenas aqueles efeitos que tiveram uma duração de 0,05ms ou mais, ou que acionaram uma atualização.

</Note>

Eventos adicionais podem ser exibidos durante as fases de renderização e efeitos:

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> - Uma subárvore correspondente de renderizações ou efeitos de componentes foi montada.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> - Uma subárvore correspondente de renderizações ou efeitos de componentes foi desmontada.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> - Semelhante a Mount, mas limitado a casos em que [`<Activity>`](/reference/react/Activity) é usado.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> - Semelhante a Unmount, mas limitado a casos em que [`<Activity>`](/reference/react/Activity) é usado.

#### Props alteradas {/*changed-props*/}

Em builds de desenvolvimento, ao clicar em uma entrada de renderização de componente, você pode inspecionar possíveis alterações nas props. Você pode usar essas informações para identificar renderizações desnecessárias.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="Trilha de Componentes: props alteradas" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="Trilha de Componentes: props alteradas" />
</div>

### Servidor {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="Trilhas de Performance do Servidor React" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="Trilhas de Performance do Servidor React" />
</div>

#### Requisições do Servidor {/*server-requests*/}

A trilha de Requisições do Servidor visualiza todas as Promises que eventualmente acabam em um Componente de Servidor React. Isso inclui quaisquer operações `async`, como chamar `fetch` ou operações de arquivo assíncronas do Node.js.

O React tentará combinar Promises que são iniciadas a partir de código de terceiros em um único span que representa a duração de toda a operação que bloqueia o código de primeira parte.
Por exemplo, um método de biblioteca de terceiros chamado `getUser` que chama `fetch` internamente várias vezes será representado como um único span chamado `getUser`, em vez de mostrar múltiplos spans `fetch`.

Clicar em spans mostrará um trace de pilha de onde a Promise foi criada, bem como uma visualização do valor para o qual a Promise foi resolvida, se disponível.

Promises rejeitadas são exibidas em vermelho com seu valor rejeitado.

#### Componentes do Servidor {/*server-components*/}

As trilhas de Componentes do Servidor visualizam as durações das Promises de Componentes de Servidor React que eles aguardaram. Os tempos são exibidos como um flamegraph, onde cada entrada representa a duração da renderização do componente correspondente e todos os seus componentes filhos descendentes.

Se você aguardar uma Promise, o React exibirá a duração dessa Promise. Para ver todas as operações de I/O, use a trilha de Requisições do Servidor.

Cores diferentes são usadas para indicar a duração da renderização do componente. Quanto mais escura a cor, maior a duração.

O grupo de trilhas de Componentes do Servidor sempre conterá uma trilha "Primary". Se o React for capaz de renderizar Componentes do Servidor concorrentemente, ele exibirá trilhas "Parallel" adicionais.
Se mais de 8 Componentes do Servidor forem renderizados concorrentemente, o React os associará à última trilha "Parallel" em vez de adicionar mais trilhas.