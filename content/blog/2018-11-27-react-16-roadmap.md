---
title: "Roteiro do React 16.x"
author: [gaearon]
---

Você pode ter ouvido falar sobre funcionalidades como "Hooks", "Suspense", e "Renderização Concorrente" em postagens passadas no blog ou em palestras. Nesta postagem, nós vamos ver como elas se encaixam e a linha do tempo esperada para seus lançamentos em versões estáveis do React.

> Uma Atualização de Agosto de 2019
>
> Você pode encontrar uma atualização de roteiro nessa [postagem de lançamento do React 16.9](/blog/2019/08/08/react-v16.9.0.html#an-update-to-the-roadmap).

## Em Resumo {#tldr}

Planejamos separar o desenvolvimento de novas funcionalidades do React nos seguintes marcos:

* React 16.6 com [Suspense para Divisão de Código (Code Splitting)](#react-166-shipped-the-one-with-suspense-for-code-splitting) (*já lançado*)
* Um lançamento minor do 16.x com [React Hooks](#react-16x-q1-2019-the-one-with-hooks) (~1º Quadrimestre de 2019)
* Um lançamento minor do 16.x com [Modo Concorrente](#react-16x-q2-2019-the-one-with-concurrent-mode) (~2º Quadrimestre de 2019)
* Um lançamento minor do 16.x com [Suspense para Busca de Dados](#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) (~meio de 2019)

*(A versão original dessa postagem usava números exatos de versões. Nós editamos para refletir que pode ser necessário outros lançamentos minor entre esses acima.)*

Estas são estimativas, e os detalhes podem ser modificados conforme nós prosseguirmos. Há ao menos mais dois projetos que nós planejamos completar em 2019. Eles requerem mais pesquisas e não estão atrelados a um lançamento em particular ainda:

* [Modernizando o React DOM](#modernizing-react-dom)
* [Suspense para Renderização no Servidor](#suspense-for-server-rendering)

Nós esperamos clarificar mais essa linha do tempo nos próximos meses.

>Observação
>
>
>Essa postagem é apenas um roteiro -- não há nele nada que requeira sua atenção imediata. Quando cada uma dessas funcionalidades forem lançadas, nós vamos publicar uma postagem completa para anunciá-las.

## Linha do Tempo dos Lançamentos {#release-timeline}

Nós temos uma visão única para como essas funcionalidades se encaixam, mas lançaremos cada parte assim que estiver pronta para que você possa testá-las e começar a usá-las mais cedo. O design da API nem sempre faz sentido quando visto como uma peça isolada; essa postagem estabelece as partes principais dos nossos planos para ajudá-lo a observar o todo. (Veja nossa [política de versão](/docs/faq-versioning.html) para aprender mais sobre nosso compromisso com a estabilidade)

A estratégia de lançamento gradual auxilia-nos a refinar as APIs, mas o período de transição quando algumas coisas não estão prontas podem ser confusas. Vamos olhar o que essas funcionalidades diferentes significam para a sua aplicação, como elas se relacionam umas com as outras e quando você pode esperar para começar a aprender e usá-las.

### [React 16.6](/blog/2018/10/23/react-v-16-6.html) (lançado): O Primeiro com Suspense para Divisão de Código (Code Splitting) {#react-166-shipped-the-one-with-suspense-for-code-splitting}

*Suspense* se refere a nova habilidade do React de "adiar" a renderização enquanto os componentes estão esperando por alguma coisa, e mostra um indicador de carregamento. No React 16.6, Suspense suporta apenas um caso de uso: componentes de carregamento ocioso (lazy loading) com `React.lazy()` e `<React.Suspense>`.

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Divisão de código com `React.lazy()` e com `<React.Suspense>` está documentada [no guia de Divisão de Código](/docs/code-splitting.html#reactlazy). Você pode encontrar outra explicação prática [neste artigo](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d).

Nós estivemos usando Suspense para divisão de código no Facebook desde Julho, e esperamos que ele esteja estável. Houveram algumas falhas no primeiro lançamento público na 16.6.0, mas elas foram resolvidos na 16.6.3.

Divisão de código é apenas o primeiro passo para o Suspense. Nossa visão de longo prazo para o Suspense envolve deixar que ele manipule a busca por dados também (e integrar com bibliotecas como Apollo). Além de um modelo prático de programação, Suspense também proveem uma experiência de usuário melhor no Modo Concorrente. Você vai encontrar informações sobre esse tópico mais abaixo.

**Status no React DOM:** Disponível desde React 16.6.0.

**Status no React DOM Server:** Suspense não está disponível para renderização no servidor ainda. Isso não é por falta de atenção. Nós começamos a trabalhar em um novo servidor de renderização assíncrono que vai suportar o Suspense, mas esse é um projeto grande e vamos tomar uma boa parte de 2019 para completar.

**Status no React Native:** Divisão de pacotes não é muito útil no React Native, mas não há nada tecnicamente evitando `React.lazy()` e `<Suspense>` de trabalharem quando dada uma Promise a um módulo.

**Recomendação:** Se você apenas renderiza no cliente, nós recomendamos fortemente a adoção de `React.lazy()` e `<React.Suspense>` para divisão de código em componentes React. Se você renderiza no servidor, você terá que esperar para adotar até o novo rederizador de servidor estiver pronto.

### React 16.x (~1º Quadrimestre de 2019): O Primeiro com Hooks {#react-16x-q1-2019-the-one-with-hooks}

*Hooks* permitem a você usar funcionalidades como state e ciclo de vida (lifecycle) em componentes de função. Eles também deixam você reusar a lógica stateful entre componentes sem introduzir aninhamentos extras na sua árvore.

```js
function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
   <div>
     <p>You clicked {count} times</p>
     <button onClick={() => setCount(count + 1)}>
       Click me
     </button>
   </div>
 );
}
```

A [introdução](/docs/hooks-intro.html) e [visão geral](/docs/hooks-overview.html) dos Hooks são bons lugares para começar. Veja [essas palestras](https://www.youtube.com/watch?v=V-QO-KO90iQ) para um vídeo introdutório e um mergulho profundo. As [Perguntas Frequentes](/docs/hooks-faq.html) devem responder boa parte de suas possíveis questões. Para aprender mais sobre as motivações por trás dos Hooks, você pode ler [este artigo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889). Algumas das bases lógicas para o design da API dos Hooks são explicadas [nessas respostas do RFC](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884).

Estamos usando os Hooks no Facebook desde Setembro. Nós não esperávamos bugs grandes na implementação. Hooks estarão disponíveis apenas na versão alfa da 16.7 do React. Espera-se que algumas APIS sejam alteradas na versão final (veja o fim [desse comentário](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884) para detalhamentos). É possível que o lançamento minor com Hooks não seja React 16.7.

Hooks representam nossa visão para o futuro do React. Eles resolvem tanto os problemas que usuários do React experienciam diretamente ("inferno de envolvimento" ("wrapper hell") de props de renderização e componentes de alta-ordem, duplicação de lógica nos métodos de ciclo de vida), quanto as questões que nós encontramos otimizando o React a escalar (tal como dificuldades em alinhamento de componentes com um compilador). Hooks não descontinuam as classes. Contudo, se os Hooks forem bem sucedidos, é possível que, em um futuro lançamento *major*, o suporte a classes pode mover a um pacote separado, reduzindo o tamanho padrão do pacote do React.

**Status em React DOM:** A primeira versão do `react` e `react-dom` a suportar Hooks é `16.7.0-alpha.0`. Nós esperamos publicar mais alfas ao longo dos próximos meses (no momento que escrevo, a mais recente é a `16.7.0-alpha.2`). Você pode tentá-los instalando `react@next` com `react-dom@next`. Não esqueça de atualizar `react-dom` -- caso contrário os Hooks não funcionarão.

**Status em React DOM Server:** As mesmas versões alfa da 16.7 do `react-dom` suportam completamente os Hooks com `react-dom/server`.

**Status em React Native:** Não há uma maneira oficial suportada para tentar os Hooks no React Native ainda. Se você estiver com espírito aventureiro, veja [essa conversa](https://github.com/facebook/react-native/issues/21967) para instruções não oficiais. Há uma questão conhecida com o `useEffect` sendo chamada bem atrasada no qual ainda precise ser resolvida.

**Recomendação:** Quando você estiver pronto, nós encorajaremos você a começar a usar os Hooks em novos componentes que escrever. Ter certeza que todo mundo no seu time está integrado em usá-los e familiarizado com sua documentação. Nós não recomendamos reescrever suas classes existentes para Hooks a menos que você planejou reescrevê-los mesmo (por exemplo: para resolver bugs). Leia mais sobre a estratégia de adoção [aqui](/docs/hooks-faq.html#adoption-strategy).

### React 16.x (~2º Quadrimestre de 2019): O Primeiro com Modo Concorrente {#react-16x-q2-2019-the-one-with-concurrent-mode}

*Modo Concorrente* permite aplicações React a serem mais responsivas por renderizar árvores de componentes sem bloquear a thread principal. Isso é permitido pelo usuário e permite ao React a interromper uma renderização de longa duração (por exemplo, renderizando uma história de feed de notícias) para manipular um evento de alta prioridade (por exemplo, entrada de texto ou hover). Modo Concorrente também melhora a experiência do usuário com Suspense por pular carregamento de states desnecessários em conexões rápidas.

>Observação
>
>Você pode ter ouvido previamente o Modo Concorrente ser referenciado como ["modo assíncrono"](/blog/2018/03/27/update-on-async-rendering.html). Nós alteramos o nome para Modo Concorrente para ressaltar a habilidade do React em trabalhar em diferentes níveis de prioridade. Isso o diferencia de outras abordagens para renderização assíncrona.

```js
// Two ways to opt in:

// 1. Part of an app (not final API)
<React.unstable_ConcurrentMode>
  <Something />
</React.unstable_ConcurrentMode>

// 2. Whole app (not final API)
ReactDOM.unstable_createRoot(domNode).render(<App />);
```

Não há documentação para o Modo Concorrente ainda. É importante pontuar que o modelo conceitual poderá ser estranho de primeira. Documentar seus benefícios, como usar isso eficientemente e suas armadilhas são uma prioridade alta para nós e serão um pré-requisito para chamar isso de estável. Até lá, A [palestra do Andrew](https://www.youtube.com/watch?v=ByBPyMBTzM0) é a melhor introdução disponível.

O Modo Concorrente é *muito* menos polido do que Hooks. Algumas APIs não estão corretamente "ligadas" ainda e não fazem o que se espera deles. No momento de escrita dessa postagem, nós não recomendamos usar isso para qualquer coisa exceto experimentação com muita antecedência. Nós não esperamos muito bugs no próprio Modo Concorrente, mas note que componentes que produzem avisos no [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) podem não funcionar corretamente. Em uma nota separada, nós vimos que o Modo Concorrente *apresenta* problemas de desempenho em outro código que às vezes podem ser confundidos com problemas de desempenho no próprio Modo Concorrente. Por exemplo, uma chamada perdida `setInterval(fn, 1)` que executa todo milisegundo pode ter um efeito horrível no Modo Concorrente. Nós planejamos publicar mais guias sobre diagnosticar e resolver problemas como esse como parte de uma documentação de lançamento.

O Modo Concorrente é uma grande parte de nossa visão para o React. Para trabalho CPU-bound, ele permite renderização não-bloqueante e mantém sua aplicação responsiva enquanto renderiza árvores de componentes complexas. Isso é demonstrado na primeira parte de [nossa palestra na JSConf na Islândia](/blog/2018/03/01/sneak-peek-beyond-react-16.html). O Modo Concorrente também produz Suspense melhores. Ele deixa você evitar indicadores de carregamento piscando se a rede é rápida o suficiente. É difícil para explicar sem ver então a [palestra do Andrew](https://www.youtube.com/watch?v=ByBPyMBTzM0) é o melhor recurso disponível hoje. O Modo Concorrente depende de um [escalonador](https://github.com/facebook/react/tree/master/packages/scheduler) cooperativo de thread principal e nós estamos [colaborando com o time do Chrome](https://www.youtube.com/watch?v=mDdgfyRB5kg) para eventualmente mover essa funcionalidade para dentro do próprio navegador.

**Status em React DOM:** Uma versão *muito* instável do Modo Concorrente está disponível atráves de um prefixo `unstable_` no React 16.6 mas não recomendamos tentando isso a menos que você esteja disposto a muitas vezes ultrapassar obstáculos ou funcionalidades faltando. Os alphas 16.7 incluem `React.ConcurrentMode` e `ReactDOM.createRoot` sem um prefixo `unstable_`, mas nós gostaríammos de manter os prefixos em 16.7 e apenas documentar e marcar o Modo Concorrente como estável nesses lançamentos minor futuros.

**Status em React DOM Server:** Modo Concorrente não afeta diretamente a renderização no servidor. Ele vai funcionar com o renderizador de servidor existente.

**Status em React Native:** O plano atual é atrasar a disponibilização do Modo Concorrente no React Native até que o projeto do [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) esteja perto de completar.

**Recomendação:** Se você deseja adotar o Modo Concorrente no futuro, englobar algumas subárvores de componentes em [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode.html) e resolver os alertas resultantes é um bom primeiro passo. No geral não é esperado que código legado vá imediatamente ser compatível. Por exemplo, no Facebook pretendemos usar o Modo Concorrente na maior parte da mais recente base de código desenvolvida e manter aqueles legados executando no modo síncrono pelo futuro próximo.

### React 16.x (~meio de 2019): O Primeiro com Suspense para Busca de Dados {#react-16x-mid-2019-the-one-with-suspense-for-data-fetching}

Como mencionado anteriormente, *Suspense* refere-se a habilidade do react de "suspender" a renderização enquanto os componentes esperam por alguma coisa e mostrar um indicador de carregamento. No já lançado React 16.6, o único caso de uso suportado para Suspense é divisão de código. Nesse futuro lançamento minor, gostaríamos de prover oficialmente maneiras suportadas para usar isso com busca de dados também. Nós vamos prover uma implementação de referência para um básico "React Cache" que é compatível com Suspense, mas você também pode escrever o seu próprio. Bibliotecas de busca de dados como Apollo e Relay vão ser possível de integrar com Suspense seguindo uma simples especificação que nós vamos documentar.

```js
// React Cache for simple data fetching (not final API)
import {unstable_createResource} from 'react-cache';

// Tell React Cache how to fetch your data
const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  // Suspends until the data is in the cache
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // Same Suspense component you already use for code splitting
    // would be able to handle data fetching too.
    <React.Suspense fallback={<Spinner />}>
      <ul>
        {/* Siblings fetch in parallel */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}

// Other libraries like Apollo and Relay can also
// provide Suspense integrations with similar APIs.
```

Não há documentação oficial para como buscar dados com Suspense ainda, mas você pode encontrar alguma informação prévia [nessa palestra](https://youtu.be/ByBPyMBTzM0?t=1312) e [nesse pequeno exemplo](https://github.com/facebook/react/tree/master/fixtures/unstable-async/suspense). Nós vamos escrever uma documentação para o React Cache (e como escrever sua própria biblioteca compatível com Suspense) próximo a esse lançamento do React, mas se você estiver curioso, você pode encontrar esse prévio código fonte [aqui](https://github.com/facebook/react/blob/master/packages/react-cache/src/ReactCache.js).

O mecanismo de baixo nível de Suspense (suspendendo a renderização e mostrando uma alternativa) é esperado ser estável ainda no React 16.6. Nós usamos isso para divisão de código em produção por meses. Entretanto, APIs de alto nível para busca de dados são muito instáveis. React Cache está rapidamente mudando e vai mudar ao menos várias vezes. Existem algumas APIs de baixo nível que estão [faltando](https://github.com/reactjs/rfcs/pull/89) para que uma boa API de alto nível seja possível. Nós não recomendamos usar React Cache em qualquer lugar exceto experimentação com muita antecedência. Note que o próprio React Cache não é estritamente preso a um lançamento do React, mas o atual alpha não possue funcionalidades básicas como invalidação de cache e você vai chegar num limite logo cedo. Nós esperamos ter alguma coisa usável com esse lançamento do React.

Eventualmente nós gostaríamos que boa parte da busca de dados aconteçam através de Suspense, mas isso vai levar um longo tempo até toda integração esteja pronta. Na prática nós esperamos que isso seja adotado muito incrementalmente e boa parte através de camadas como Apollo ou Relay ao invés de diretamente. APIs de alto nível faltando não são o único obstáculo — há também alguns padrões de IU importante que nós não suportamos ainda tais quais [mostrar indicador de progresso fora da hierarquia de visão de carregamento](https://github.com/facebook/react/issues/14248). Como sempre, nós vamos comunicar nosso progresso em notas de lançamento nesse blog.

**Status em React DOM and React Native:** Tecnicamente, um cache compatível já vai funcionar com `<React.Suspense>` no React 16.6. Entretanto , nós não esperamos ter uma boa implementação de cache até esse lançamento minor do React. Se você estiver com espírito aventureiro, você pode tentar escrever seu próprio cache vendo nos alphas do React Cache. Todavia, note que o modelo mental é suficientemente diferente que tem um alto risco de não entendimento até que a documentação esteja pronta.

**Status em React DOM Server:** Suspense não está disponível para renderizador de servidor ainda. Como nós mencionamos anteriormente, nós começamos a trabalhar em um novo rederizador assíncrono que vai suportar Suspense, mas esse é um projeto grande e vai levar uma boa parte de 2019 para completar.

**Recomendação:** Esperar por esse lançamento minor do React para usar Suspense para busca de dados. Não tente usar as funcionalidades de Suspense no 16.6 para isso; Isso não é suportado. Entretanto, seus componentes `<Suspense>` existentes para divisão de código vão poder mostrar estado de carregamento para dados também quando Suspense para Busca de Dados vier oficialmente a ser suportado.

## Outros Projetos {#other-projects}

### Modernizando React DOM {#modernizing-react-dom}

Nós começamos uma investigação para [simplificar e modernizar](https://github.com/facebook/react/issues/13525) o ReactDOM, com um objetivo de reduzir o tamanho do pacote e se aproximar do comportamento do navegador. Ainda é cedo para dizer quais pontos específicos vão "fazer isso" porque o projeto está em uma fase exploratória. Nós vamos comunicar nosso progresso nessa issue.

### Suspense para Renderização em Servidor {#suspense-for-server-rendering}

Nós começamos a projetar um novo renderizador de servidor que suporte Suspense (incluindo espera por dados assíncronos no servidor sem renderização dupla), carregamento progressivo e preenchimento do conteúdo da página em pedaços para um melhor experiência do usuário. Você pode assistir um resumo do protótipo prévio disso [nessa palestra](https://www.youtube.com/watch?v=z-6JC0_cOns). O novo renderizado de servidor será nosso foco principal em 2019, mas é muito cedo para falar qualquer coisa sobre sua programação de lançamento. Seu desenvolvimento, como sempre, [acontecerá no GitHub](https://github.com/facebook/react/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+fizz).

-----

E é isso! Como você pode ver, tem muito a ocupar-nos, mas nós esperamos bastante progresso nos próximos meses.

Nós esperamos que essa postagem dê a você ideias do que nós estamos trabalhando, o que você pode usar hoje, e o que você pode esperar para usar futuramente. Enquanto há várias discussões sobre novas funcionalidades em plataformas de mídias sociais, você não vai perder nada importante se ler esse blog.

Nós estamos sempre abertos para feedback, e amamos ouvir de vocês no [repositório de RFC](https://github.com/reactjs/rfcs), [o rastreador de issue](https://github.com/facebook/react/issues), e [no Twitter](https://mobile.twitter.com/reactjs).
