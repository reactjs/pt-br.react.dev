---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* são uma nova adição ao React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

Esta página responde algumas das perguntas mais frequentes sobre [Hooks](/docs/hooks-overview.html).

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[Estratégia de Adoção](#adoption-strategy)**
  * [Quais versões do React incluem Hooks?](#which-versions-of-react-include-hooks)
  * [Preciso reescrever todos os meus componentes com classe?](#do-i-need-to-rewrite-all-my-class-components)
  * [O que eu posso fazer com Hooks que eu não podia fazer com classes?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Quanto do meu conhecimento de React continua relevante?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Devo usar Hooks, classes ou um misto dos dois?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hooks cobrem todos os casos de uso para classes?](#do-hooks-cover-all-use-cases-for-classes)
  * [Hooks substituem render props e HOC (componente de alta-ordem, do inglês *high-order component*)?](#do-hooks-replace-render-props-and-higher-order-components)
  * [O que Hooks significam para APIs populares como o connect() do Redux e o React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hooks funcionam com tipagem estática?](#do-hooks-work-with-static-typing)
  * [Como testar componentes que usam Hooks?](#how-to-test-components-that-use-hooks)
  * [O que exatamente as regras de lint impõem?](#what-exactly-do-the-lint-rules-enforce)
* **[De Classes para Hooks](#from-classes-to-hooks)**
  * [Como os métodos de ciclo de vida correspondem aos Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Como posso fazer a busca de dados com Hooks?](#how-can-i-do-data-fetching-with-hooks)
  * [Existe algo como variáveis de instância?](#is-there-something-like-instance-variables)
  * [Devo usar uma ou muitas variáveis de estado?](#should-i-use-one-or-many-state-variables)
  * [Possso usar um efeito somente em updates?](#can-i-run-an-effect-only-on-updates)
  * [Como acessar as props ou o estado anterior?](#how-to-get-the-previous-props-or-state)
  * [Por que estou vendo props obsoletos ou state dentro da minha função?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [Como implementar getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Existe algo como forceUpdate?](#is-there-something-like-forceupdate)
  * [Posso fazer uma ref para um componente de função?](#can-i-make-a-ref-to-a-function-component)
  * [Como posso medir um nó DOM?](#how-can-i-measure-a-dom-node)
  * [O que const [thing, setThing] = useState() significa?](#what-does-const-thing-setthing--usestate-mean)
* **[Otimizações de Performance](#performance-optimizations)**
  * [Posso pular um efeito nos updates?](#can-i-skip-an-effect-on-updates)
  * [É seguro omitir funções da lista de dependências?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [O que posso fazer se minhas dependências de efeito mudarem com muita frequência?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [Como implementar shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [Como memorizar cálculos?](#how-to-memoize-calculations)
  * [Como criar objetos custosos a demanda?](#how-to-create-expensive-objects-lazily)
  * [Hooks são mais lentos por criar funções no render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Como evitar passar callbacks para baixo?](#how-to-avoid-passing-callbacks-down)
  * [Como ler um valor frequentemente variável de useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Por detrás das cortinas](#under-the-hood)**
  * [Como o React associa chamadas de Hooks com componentes?](#how-does-react-associate-hook-calls-with-components)
  * [Quais são as referências que influênciaram a criação dos Hooks?](#what-is-the-prior-art-for-hooks)

## Estratégia de Adoção {#adoption-strategy}

### Quais versões do React incluem Hooks? {#which-versions-of-react-include-hooks}

Começando com 16.8.0, React inclui uma implementação estável dos Hooks para:

* React DOM
* React Native
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Note que **para habilitar Hooks, todos os pacotes precisam estar na versão 16.8.0 ou maior**. Hooks não vão funcionar se você esquecer de atualizar, por exemplo, o React DOM.

[React Native 0.59](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059) e superiores suportam Hooks.

### Preciso reescrever todos os meus componentes usando classe? {#do-i-need-to-rewrite-all-my-class-components}

Não. Não existe [nenhum plano](/docs/hooks-intro.html#gradual-adoption-strategy) para remover classes do React -- todos nós precisamos continuar entregando produtos e não podemos reescrever tudo. Recomendamos tentar usar Hooks em código novo.

### O que eu posso fazer com Hooks que eu não podia fazer com classes? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hooks oferecem uma nova maneira, poderosa e expressiva, de reutilizar funcionalidade entre componentes. ["Construindo Seu Próprio Hook"](/docs/hooks-custom.html) fornece um vislumbre do que é possível. [Este artigo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) feito por um membro da equipe principal do React mergulha fundo nas novas possibilidades desbloqueadas por Hooks.

### Quanto do meu conhecimento de React continua relevante? {#how-much-of-my-react-knowledge-stays-relevant}

Hooks são uma maneira mais direta de usar as funcionalidades do React que você já conhece -- como estado, ciclo de vida, context e refs. Eles não mudam fundamentalmente como o React funciona e seu conhecimento de componentes, props e fluxo de dados de cima para baixo continua relevante.

Hooks tem sua curva de aprendizado. Se tiver algo faltando nessa documentação, [abra um issue](https://github.com/reactjs/reactjs.org/issues/new) e nós vamos tentar ajudar.

### Devo usar Hooks, classes ou um misto dos dois? {#should-i-use-hooks-classes-or-a-mix-of-both}

Quando você estiver pronto, encorajamos você a começar usando Hooks em novos componentes que você escrever. Tenha certeza que todos no seu time estão de acordo em usá-los e estão familiarizados com a documentação. Nós não recomendamos reescrever suas classes existentes para Hooks a menos que você tenha planejado reescrevê-las previamente (por exemplo, para arrumar bugs).

Você não pode usar Hooks *dentro* de um componente classe, mas você definitivamente pode misturar classes e funções com Hooks em uma única árvore. Se um componente é uma classe ou uma função que usa Hooks é um detalhe de implementação daquele componente. A longo prazo, nós esperamos que Hooks sejam a principal maneira que as pessoas escrevam componentes React.

### Hooks cobrem todos os casos de uso para classes? {#do-hooks-cover-all-use-cases-for-classes}

Nosso objetivo é que Hooks cubra todos os casos de uso o mais rápido possível. Ainda não há Hook equivalente para os ciclos de vida `getSnapshotBeforeUpdate`, `getDerivedStateFromError` e `componentDidCatch`, que são mais incomuns, mas planejamos adiciona-los em breve.

É o início dos Hooks e algumas bibliotecas de terceiros podem não ser compatíveis com Hooks neste momento.

### Hooks substituem render props e HOC (componente de alta-ordem, do inglês *high-order component*)? {#do-hooks-replace-render-props-and-higher-order-components}

Frequentemente, render props e HOC renderizam somente um filho. Nós achamos que Hooks são uma maneira mais simples de atender esse caso de uso. Ainda existe lugar para ambos os padrões (por exemplo, um componente de scroll virtual talvez tenha uma prop `renderItem`, ou um container visual talvez tenha sua própria estrutura DOM). Mas na maioria dos casos, Hooks serão suficiente e podem ajudar a reduzir o aninhamento na sua árvore.

### O que Hooks significam para APIs populares como o `connect()` do Redux e o React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Você pode continuar a usar exatamente as mesmas APIs que sempre usou; elas vão continuar funcionando.

React Redux desde a v7.1.0 [suporta Hooks API](https://react-redux.js.org/api/hooks) e expõe hooks como `useDispatch` ou `useSelector`.

React Router [suporta hooks](https://reacttraining.com/react-router/web/api/Hooks) desde a v5.1.

Outras bibliotecas também podem suportar hooks no futuro.

### Hooks funcionam com tipagem estática? {#do-hooks-work-with-static-typing}

Hooks foram planejados com tipagem estática em mente. Como eles são funções, eles são mais fáceis de tipar corretamente do que padrões como high-order components. As últimas definições do React para Flow e Typescript incluem suporte para React Hooks.

Importante observar, que Hooks customizados te dão o poder de restringir a API do React se você quiser usa-la de alguma maneira mais rigorosa. React te dá as primitivas mas você pode combina-las de diferentes maneiras além das que fornecemos.

### Como testar componentes que usam Hooks? {#how-to-test-components-that-use-hooks}

Do ponto de vista do React, um componente usando Hooks é somente um componente regular. Se sua solução para testes não depende do funcionamento interno do React, testar componentes com Hooks não deveria ser diferente de como você normalmente testa componentes.

>Nota
>
>Em [Testing Recipes](/docs/testing-recipes.html) tem muitos exemplos que você pode copiar e colar.

Por exemplo, digamos que temos este componente contador:

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
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

Nós vamos testa-lo usando React DOM. Para garantir que o comportamento corresponde ao que acontece no browser, nós vamos envolver o código que renderiza e atualiza com [`ReactTestUtils.act()`](/docs/test-utils.html#act):

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Testa a primeira renderização e efeito
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Testa segunda renderização e efeito
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

As chamadas para `act()` também vão descarregar os efeitos dentro dele.

Se você precisa testar um Hook customizado, você pode faze-lo criando um componente no seu teste e usando o seu Hook nele. Então você pode testar o componente que escreveu.

Para reduzir o boilerplate, nós recomendamos usar [React Testing Library](https://testing-library.com/react) que é projetada para incentivar a escrever testes que usam seus componentes como usuários finais usam.

Para mais informações, confira [Testing Recipes](/docs/testing-recipes.html).

### O que exatamente as [regras de lint](https://www.npmjs.com/package/eslint-plugin-react-hooks) impõem? {#what-exactly-do-the-lint-rules-enforce}

Nós fornecems um [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) que impõem [regras de Hooks](/docs/hooks-rules.html) para evitar bugs. Elas assumem que qualquer função começando com "`use`" e uma letra maiúscula em segunda é um Hook. Nós reconhecemos que esta heurística não é perfeita e que talvez aconteçam alguns falso positivos mas sem uma convenção simplesmente não há como fazer Hooks funcionarem bem -- e nomes mais longos iriam desencorajam pessoas tanto de adotar Hooks ou de seguir a convenção.

Em particular, a regra impõe que:

* Chamadas para Hooks ocorrem ou dentro de uma função usando `PascalCase` (tratada como componente) ou dentro de outra função `useSomething` (tratada como um Hook customizado).
* Hooks são chamados na mesma ordem em toda renderização.

Existem mais algumas heurísticas e talvez elas mudem ao longo do tempo conforme nós regulamos as regras para balancear entre encontrar bugs e evitar falsos positivos.

## De Classes para Hooks {#from-classes-to-hooks}

### Como os métodos de ciclo de vida correspondem aos Hooks? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Funções não precisam de um constructor. Você pode inicializar o estado com o [`useState`](/docs/hooks-reference.html#usestate). Se calcular o estado for custoso, você pode passar uma função para o `useState`.

* `getDerivedStateFromProps`: Não é necessário, agende um update [enquanto estiver rendizando](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Veja `React.memo` [abaixo](#how-do-i-implement-shouldcomponentupdate).

* `render`: Este é o próprio corpo da função.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: O [Hook `useEffect`](/docs/hooks-reference.html#useeffect) pode expressar todas as combinações desses, (incluindo casos [menos](#can-i-skip-an-effect-on-updates) [comuns](#can-i-run-an-effect-only-on-updates)).

* `getSnapshotBeforeUpdate`, `componentDidCatch` e `getDerivedStateFromError`: Não há Hooks equivalentes para esses métodos ainda, mas eles serão adicionados em breve.

### Como posso fazer a busca de dados com Hooks? {#how-can-i-do-data-fetching-with-hooks}

Aqui está uma [pequena demonstração](https://codesandbox.io/s/jvvkoo8pq3) para você começar. Para saber mais, confira [o artigo](https://www.robinwieruch.de/react-hooks-fetch-data/) sobre a obtenção de dados com Hooks.

### Existe algo como variáveis de instância? {#is-there-something-like-instance-variables}

Sim! O Hook [`useRef()`](/docs/hooks-reference.html#useref) não é somente para DOM. O objeto "ref" é um container genérico no qual a propriedade `current` é mutável e pode conter qualquer valor, similar a uma propriedade de instância de uma classe.

Você pode escrever nele de dentro do `useEffect`:

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

Se nós só quiséssemos criar um intervalo, não precisaríamos de ref (`id` poderia ser local do efeito), mas é útil se quisermos limpar o intervalo usando um manipulador de eventos:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceitualmente, você pode pensar em refs como similares a variávels de instância em uma classe. A menos que você esteja fazendo [inicialização lazy](#how-to-create-expensive-objects-lazily), evite definir refs durante a renderização -- isso pode levar a comportamentos inesperados. Ao invés disso, normalmente você deseja modificar as refs nos manipuladores de eventos e efeitos.

### Devo usar uma ou muitas variáveis de estado? {#should-i-use-one-or-many-state-variables}

Se você está vindo de classes, você pode ser tentado a sempre chamar `useState()` uma vez e por todo o estado em um único objeto. Você pode fazer isso se quiser. Aqui segue um exemplo de um componente que segue o movimento do mouse. Nós guardamos sua posição e tamanho no estado local:

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

Agora vamos dizer que queremos escrever uma lógica que muda `left` e `top` quando o usuário move o seu mouse. Note que nós temos que mesclar esses campos no estado anterior manualmente:

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Espalhando "...state" garante que width e height não se "percam"
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Nota: essa implementação é um pouco simplificada
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

Isto é porque quando atualizamos uma variável de estado, nós *substituimos* seu valor. É diferente de `this.setState` em uma classe, que *mescla* os campos atualizados no objeto.

Se você sente falta da mesclagem automática, você poderia escrever um Hook customizado, `useLegacyState`, que mescla o update no objeto. No entanto, **nós recomendamos dividir o estado em múltiplas variáveis de estado baseado nos valores que tendem a mudar juntos.**

Por exemplo, poderíamos dividir nosso componente em `position` e `size` e sempre substituir `position` sem a necessidade de mesclar:

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

Separar o estado em variáveis independentes também tem outro benefício. Torna mais fácil para extrair uma lógica relacionada para um Hook customizado posteriormente, como por exemplo:

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

Note como nós conseguimos mover a chamada `useState` da variável de estado `position` e o efeito relacionado para um Hook customizado sem alterar o seu código. Se todo o estado estivesse em um único objeto, extrair seria mais difícil.

Tanto colocar todo estado em um único `useState` e usar múltiplos `useState` para cada campo pode funcionar. Componentes tendem a ser mais legíveis quando você encontra um balanço entre esses dois extremos e agrupa estados relacionados em algunas variáveis de estado independentes. Se a lógica do estado se torna muito complexa, nós recomendamos [gerenciá-la com um reducer](/docs/hooks-reference.html#usereducer) ou com um Hook customizado.

### Possso usar um efeito somente em updates? {#can-i-run-an-effect-only-on-updates}

Esse é um caso de uso raro. Se você precisar, você pode [usar uma ref mutável](#is-there-something-like-instance-variables) para manualmente armazenar um valor boleano correspondente a se você está no primeiro render ou num subsequente, usando então essa flag no seu efeito. (Se você se encontrar fazendo isso regularmente, pode criar um Hook customizado pra isso.)

### Como acessar as props ou o estado anterior? {#how-to-get-the-previous-props-or-state}

Atualmente, você pode fazer isso manualmente [com uma ref](#is-there-something-like-instance-variables):

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

Isso pode ser um pouco confuso mas você pode extrair para um Hook customizado:

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

Note como isso funcionaria para props, state ou qualquer outro valor calculado.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

É possível que no futuro o React forneça um Hook `usePrevious` pois esse é um caso de uso relativamente comum.

Veja também [o padrão recomendado para estado derivado](#how-do-i-implement-getderivedstatefromprops).

### Por que estou vendo props obsoletos ou state dentro da minha função? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Qualquer função dentro de um componente, incluindo manipuladores de eventos e efeitos, "vê" as props e o state da renderização em que foi criado. Por exemplo, considere este código:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('Você clicou: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Mostrar
      </button>
      <button onClick={handleAlertClick}>
        Mostrar aviso
      </button>
    </div>
  );
}
```

Se você clicar primeiro em "Mostrar aviso" e incrementar o contador, o alerta mostrará a variável `count` **no momento em que clicou no botão "Mostrar alerta"**. Isso evita erros causados pelo código assumindo props e state não muda.

Se você intencionalmente queser ler o state *lastest* de algum retorno de chamada assincrono, você poderia mantê-lo em [uma ref](/docs/hooks-faq.html#is-there-something-like-instance-variables), mude-o e leia a partir dele.

Finalmente, outro possível motivo que você está vendo props obsoletos ou state é se você usa a otimização do "array de dependência", mas não especificou corretamente todas as dependências. Por exemplo, se um efeito especifica `[]` como o segundo argumento mas lê `someProp` dentro, ele continuará "vendo" o valor inicial de `someProps`. A solução é remover o array de dependências ou corrigi-lo. Aqui está [como você pode lidar com funções](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), e aqui está [outras estratégias comuns](#what-can-i-do-if-my-effect-dependencies-change-too-often) para executar efeitos com menos frequência sem ignorar incorretamente as dependências.

>Nota
>
>Recomendamos usar as regras do [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) como parte do nosso pacote [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Ele avisa quando as dependências são especificadas incorretamente e sugere uma correção.

### Como implementar `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Enquanto você provavelmente [não precisa dele](/blog/2018/06/07/you-probably-dont-need-derived-state.html), nos raros casos que você precisar (como ao implementar um componente de `<Transition>`), você pode atualizar o estado enquanto estiver renderizando. React vai re-renderizar o componente com o estado atualizado imediatamente após sair do primeiro render, então não seria custoso.

Aqui, nós guardamos o valor anterior da prop `row` em uma variável de estado para que possamos comparar:

```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row mudou desde a ultima renderização. Atualize isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

Isto pode parecer estranho a princípio, mas um update durante o render é exatamente o que `getDerivedStateFromProps` sempre foi conceitualmente.

### Existe algo como forceUpdate? {#is-there-something-like-forceupdate}

Ambos os Hooks `useState` e `useReducer` [evitam atualizações](/docs/hooks-reference.html#bailing-out-of-a-state-update) se o próximo valor é igual ao anterior. Alterar o estado diretamente e chamar `setState` não vai causar uma re-renderização.

Normalmente, você não deve alterar o estado local no React. No entanto, como uma alternativa, você pode usar um contador incremental para forçar um re-render mesmo se o estado não mudou:

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

Tente evitar esse padrão se possível.

### Posso fazer uma ref para um componente de função? {#can-i-make-a-ref-to-a-function-component}

Enquanto você não deve precisar muito disso, você pode expor alguns métodos imperativos para um parente com o Hook [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle).

### Como posso medir um nó DOM? {#how-can-i-measure-a-dom-node}

Uma maneira rudimentar de medir a posição ou o tamanho de um nó DOM é usar um [callback ref](/docs/refs-and-the-dom.html#callback-refs). React chamará esse callback sempre que a ref for anexado a um nó diferente. Aqui está uma [pequena demonstração](https://codesandbox.io/s/l7m0v5x4v9):

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>O header acima tem {Math.round(height)}px de altura</h2>
    </>
  );
}
```

Nós não escolhemos `useRef` neste exemplo porque um objeto ref não nos avisa sobre *alterações* para o valor atual da ref. A utilização de um callback ref garante que [mesmo que um componente filho exiba o nó medido posteriormente](https://codesandbox.io/s/818zzk8m78) (e.g. em resposta a um clique), ainda somos notificados sobre isso no componente pai e podemos atualizar as medições.

Note que nós passamos `[]` como um array de dependências para `useCallback`. Isso garante que nosso ref callback não seja alterado entre as novas renderizações e, portanto, o React não o chamará desnecessariamente.

Neste exemplo, a ref de callback será chamado somente quando o componente for montado e desmontado, pois o componente renderizado `<h1>` permance presente em todos os repetidores. Se você deseja ser notificado sempre que um componente é redimensionado, você pode usar [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) ou uma Hook de terceiros construído sobre ele.

Se você quiser, você pode [extrair essa lógica](https://codesandbox.io/s/m5o42082xy) em um Hook reutilizável:

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>O header acima tem {Math.round(rect.height)}px de altura</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

### O que `const [thing, setThing] = useState()` significa? {#what-does-const-thing-setthing--usestate-mean}

Se essa sintaxe não é familiar para você, confira a [explicação](/docs/hooks-state.html#tip-what-do-square-brackets-mean) na documentação do Hook State.


## Otimizações de Performance {#performance-optimizations}

### Posso pular um efeito nos updates? {#can-i-skip-an-effect-on-updates}

Sim. Veja [disparando um efeito condicionalmente](/docs/hooks-reference.html#conditionally-firing-an-effect). Note que esquecer de lidar com updates geralmente [introduz bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), por isso que este não é o comportamento padrão.

### É seguro omitir funções da lista de dependências? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

De um modo geral, não.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 Isto não é seguro (ele chama `doSomething` que usa` someProp`)
}
```

É difícil lembrar quais props ou state são usados por funções fora do efeito. É por isso que **normalmente você vai querer declarar funções necessárias para um efeito *dentro* dele.** Então é fácil ver em quais valores do escopo do componente esse efeito depende:

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (nosso efeito usa apenas `someProp`)
}
```

Se depois disso ainda não usarmos nenhum valor do escopo do componente, é seguro especificar `[]`:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK neste exemplo porque não usamos *nenhum* dos valores do escopo do componente
```

Dependendo do seu caso de uso, existem mais algumas opções descritas abaixo.

>Nota
>
>Nós fornecemos o [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) regras do ESLint como parte do pacote [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation). Ele ajuda você a encontrar componentes que não lidam com atualizações de forma consistente.

Vamos ver porque isso é importante.

Se você especificar uma [lista de dependências](/docs/hooks-reference.html#conditionally-firing-an-effect) como o último argumento para `useEffect`, `useMemo`, `useCallback`, ou `useImperativeHandle`, ele deve incluir todos os valores usados dentro do callback e participar do fluxo de dados React. Isso inclui props, state e qualquer coisa derivada deles.

É **somente** seguro omitir uma função da lista de dependências se nada nela (ou as funções chamadas por ela) referenciar props, state ou valores derivados deles. Este exemplo tem um erro:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // // Usando productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Inválido porque `fetchProduct` usa `productId`
  // ...
}
```

**A correção recomendada é mover essa função _inside_ do seu efeito**. Isso torna mais fácil ver quais props ou state seu efeito usa e garantir que todos sejam declarados:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Ao mover essa função dentro do efeito, podemos ver claramente os valores que ela usa.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Válido porque nosso efeito usa somente productId
  // ...
}
```

Isso também permite que você gerencie respostas fora de ordem com uma variável local dentro do efeito:

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

Nós movemos a função dentro do efeito para que não precise estar em sua lista de dependências.

>Dica
>
>Confira [esta pequena demostração](https://codesandbox.io/s/jvvkoo8pq3) e [este artigo](https://www.robinwieruch.de/react-hooks-fetch-data/) para saber mais sobre a obtenção de dados com Hooks.

**Se por alguma razão você _não pode_ mover uma função dentro de um efeito, existem mais algumas opções:**

* **Você pode tentar mover essa função para fora do seu componente**. Nesse caso, a função é garantida para não referenciar nenhum props ou state, e também não precisa estar na lista de dependências.
* Se a função que você está chamando é um cálculo puro e é seguro ligar enquanto renderiza, você pode **chamá-lo fora do efeito em vez disso,** e fazer o efeito depender do valor retornado.
* Como último recurso, você pode **adicione uma função na dependência do efeito, mas _envolva sua definição_** no [`useCallback`](/docs/hooks-reference.html#usecallback) Hook. Isso garante que ele não seja alterado em todas as renderizações, a menos que *suas próprias* dependências também sejam alteradas:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Envolva com useCallback para evitar alterações em todos os renderizadores
  const fetchProduct = useCallback(() => {
    // ... Faz algo com productId ...
  }, [productId]); // ✅ Todas as dependências useCallback são especificadas

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ Todas as dependências do useEffect são especificadas
  // ...
}
```

Note que no exemplo acima nós **precisamos** para manter a função na lista de dependências. Isso garante que uma mudança na `productId` prop do `ProductPage` aciona automaticamente uma busca no componente `ProductDetails`.

### O que posso fazer se minhas dependências de efeito mudarem com muita frequência? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

Às vezes, seu efeito pode estar usando o state que muda com muita freqüência. Você pode ser tentado a omitir esse state de uma lista de dependências, mas isso geralmente leva a erros:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Este efeito depende do estado `count`
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` não é especificado como uma dependência

  return <h1>{count}</h1>;
}
```

O conjunto vazio de dependências, `[]`, significa que o efeito só será executado uma vez quando o componente for montado, e não em todas as re-renderizações. O problema é que dentro do callback `setInterval`, o valor de `count` não muda, porque nós criamos um fechamento com o valor de `count` configurando para `0` como era quando o retorno de chamada do efeito era executado. A cada segundo, este callback então chama `setCount(0 + 1)`, então a contagem nunca vai acima de 1.

Especificando `[count]` como uma lista de dependências iria corrigir o bug, mas faria com que o intervalo fosse redefinido em cada alteração. Efetivamente, cada `setInterval` teria uma chance de executar antes de ser limpo (semelhante a um `setTimeout`). Isso pode não ser desejável. Para corrigir isso, podemos usar o [form de atualização funcional do `setState`](/docs/hooks-reference.html#functional-updates). Ele nos permite especificar *como* o state precisa mudar sem referenciar o state *atual*:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ Isso não depende da variável `count` fora
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Nosso efeito não usa nenhuma variável no escopo do componente

  return <h1>{count}</h1>;
}
```

(A identidade da função `setCount` é garantida como estável, então é seguro omitir.)

Agora, o retorno de chamada `setInterval` é executado uma vez por segundo, mas sempre que a chamada interna para `setCount` pode usar um valor atualizado para `count` (chamado `c` no retorno do callback aqui.)

Em casos mais complexos (como se um state dependesse de outro state), tente mover a lógica de atualização de state para fora do efeito com o [`useReducer` Hook](/docs/hooks-reference.html#usereducer). [O artigo](https://adamrackis.dev/state-and-use-reducer/) oferece um exemplo de como você pode fazer isso. **A identidade da função `dispatch` do `useReducer` é sempre estável** — mesmo se a função reducer for declarada dentro do componente e ler seus props.

Como último recurso, se você quer algo como `this` em uma classe, você precisa [usar uma ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) para manter uma variável mutável. Então você pode escrever e ler para ele. Por exemplo:

```js{2-6,10-11,16}
function Example(props) {
  // Mantenha as últimas props em um ref.
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Leia as últimas props a qualquer momento
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // Esse efeito nunca é executado novamente
}
```

Só faça isso se você não conseguir encontrar uma alternativa melhor, confiar em mutação torna os componentes menos previsíveis. Se houver um padrão específico que não seja bem traduzido, [abra uma issue](https://github.com/facebook/react/issues/new) com um código de exemplo executável e podemos tentar ajudar.

### Como implementar `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Você pode envolver o componente de função com `React.memo` para comparar superficialmente suas props:

```js
const Button = React.memo((props) => {
  // seu componente
});
```

Este não é um Hook porque não compõe como um Hook normalmente faz. `React.memo` é o equivalente de `PureComponent`, mas compara somente props. (Você pode também adicionar um segundo argumento para especificar uma função de comparação que recebe as props velhas e novas. Se esta retorna true, o update é evitado.)

`React.memo` não compara estado porque não há nenhum único objeto de estado para comparar. Mas você pode tornar filhos puros também, ou até [otimizar filhos específicos com `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).

### Como memorizar cálculos? {#how-to-memoize-calculations}

O Hook [`useMemo`](/docs/hooks-reference.html#usememo) permite que você evite cáculos entre múltiplas renderizações se "lembrando" dos cálculos feitos anteriormente:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Esse código chama `computeExpensiveValue(a, b)`. Mas se as dependências `[a, b]` não mudaram desde o último valor, `useMemo` não chama a função novamente e simplesmente retorna o valor retornado anteriormente.

Lembre-se que a função passada para `useMemo` é executada durante a renderização. Não faça nada que você normalmente não faria durante a renderização. Por exemplo, efeitos colaterais devem ser feitos usando `useEffect`, não `useMemo`.

**Você pode confiar em `useMemo` como uma otimização de performace, não como uma garantia semântica.** No futuro, React pode optar por "esquecer" alguns valores previamente memorizados e recalcular eles na próxima renderização, por exemplo para liberar memória para componentes fora da tela. Escreva seu código de maneira que ele funcione sem `useMemo` — e então adicione-o para otimizar o desempenho. (Para raros casos aonde um valor *nunca* deve ser recomputado, você pode [inicializar posteriomente](#how-to-create-expensive-objects-lazily) uma ref.)

Convenientemente, `useMemo` também deixa você pular uma re-renderização custosa de um filho:

```js
function Parent({ a, b }) {
  // Somente re-renderizado se `a` muda:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Somente re-renderizado se `b` muda:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note que essa abordagem não vai funcionar em um loop porque Hooks [não podem](/docs/hooks-rules.html) ser postos dentro de loops. Mas você pode extrair um componente separado para os items da lista e chamar `useMemo` nele.

### Como criar objetos custosos a demanda? {#how-to-create-expensive-objects-lazily}

`useMemo` permite [memorizar um cálculo custoso](#how-to-memoize-calculations) se as dependências são as mesmas. No entanto, ele não *garante* que a computação não será re-executada. Algumas vezes você precisa ter certeza que um objeto só é criado uma vez.

**O primeiro caso de uso comum é quando criar o estado inicial é custoso:**

```js
function Table(props) {
  // ⚠️ createRows() é executada em todo render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

Para evitar re-criar o estado inicial, podemos passar uma **função** para `useState`:

```js
function Table(props) {
  // ✅ createRows() só é executada uma vez
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React só vai executar essa função durante a primeira renderização. Veja a [API do `useState`](/docs/hooks-reference.html#usestate).

**Você também pode ocasionalmente querer evitar recriar o valor inicial de `useRef()`.** Por exemplo, talvez você quer garantir que algumas instâncias de classe imperativa só seja criada uma vez:

```js
function Image(props) {
  // ⚠️ IntersectionObserver é criado em todo render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **não** aceita uma função como `useState`. Ao invés disso, você pode criar sua própria função que cria e define-o posteriormente:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver é criado somente uma vez
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // Quando você precisar, execute getObserver()
  // ...
}
```

Isto evita criar um objeto custoso até que ele seja realmente necessário pela primeira vez. Se você usa Flow ou TypeScript, você pode também dar `getObserver()` um tipo não nulo por conveniência.


### Hooks são mais lentos por criar funções no render? {#are-hooks-slow-because-of-creating-functions-in-render}

Não. Nos browsers modernos, o desempenho bruto de closures comparados à classes não difere significantemente exceto em casos extremos.

Em adição, considere que o design de Hooks é mais eficiente por alguns motivos:

* Hooks evitam muito da sobrecarga que classes exigem, como o custo de criar instâncas de classes e fazer o bind the manipuladores de eventos no constructor.

* **Código idiomático usando Hooks evita aninhamento profundo de componentes** que prevalece nas codebases que usam HOC, render props e context. Com árvores de componentes menores, React tem menos trabalho a fazer.

Tradicionalmente, preocupações de desempenho sobre funções inline no React tem sido relacionadas a como passar novas callbacks em cada renderização quebra as otimizações de `shouldComponentUpdate` nos componentes filho. Hooks abordam esse problema de três maneiras.

* O Hook [`useCallback`](/docs/hooks-reference.html#usecallback) permite que você mantenha a mesma callback entre re-renderizações para que `shouldComponentUpdate` continue a funcionar:

    ```js{2}
    // Não vai mudar a menos que `a` ou `b` mude
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* O Hook [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) torna mais fácil controlar quando filhos específicos atualizam, reduzindo a necessidade de pure components.

* Finalmente, o Hook [`useReducer`](/docs/hooks-reference.html#usereducer) reduz a necessidade de passar callbacks profundamente, como explicado abaixo.

### Como evitar passar callbacks para baixo? {#how-to-avoid-passing-callbacks-down}

Nós descobrimos que a maioria das pessoas não gostam de passar callbacks manualmente através de cada nível de uma árvore de componente. Mesmo sendo mais explícito, pode parecer como um monte de "encanamento".

Em árvores grandes de componentes, uma alternativa que recomendamos é passar para baixo a função `dispatch` do [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Nota: `dispatch` não vai mudar entre re-renderizações
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Qualquer filho na árvore dentro de `TodosApp` pode usar a função `dispatch` para disparar ações para o `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // Se queremos executar uma ação, podemos pegar dispatch do context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

Isso é mais mais conveniente do ponto de vista de manutenção (não há a necessidade de passar callbacks) e evita o problema de passar callbacks como um todo. Passando `dispatch` desta maneira é o padrão recomendado para atualizações profundas.

Note que você ainda pode escolher entre passar o estado da aplicação para baixo como props (mais explícito) ou como context (mais conveniente para atualizações bem profundas). Se você também usar context para o estado, use dois tipos de context diferentes -- o `dispatch` nunca muda, então componentes que leem ele não precisam re-renderizar a menos que precisem também do estado da aplicação.

### Como ler um valor frequentemente variável de `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Nota
>
>Recomendamos [passar `dispatch` para baixo com context](#how-to-avoid-passing-callbacks-down) ao invés de callbacks individuais em props. A abordagem abaixo só é mencionada aqui para a integralidade e como válvula de escape.
>
>Note também que esse padrão pode causar problemas no [modo concorrente](/blog/2018/03/27/update-on-async-rendering.html). Planejamos prover mais alternativas ergonomicas no futuro, mas a solução mais segura no momento é sempre invalidar a callback se algum dos valores dos quais ela depende mudar.

Em alguns casos raros você pode precirar memorizar uma callback com [`useCallback`](/docs/hooks-reference.html#usecallback) mas a memorização não funciona muito bem porque a função interna tem que ser recriada muitas vezes. Se a função que você está memorizando é um manipulador de eventos e não é usado durante a renderização, você pode usar [ref como uma variável de instância](#is-there-something-like-instance-variables) e salvar o último valor nela manualmente:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // Guarda o valor na ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Le o valor da ref
    alert(currentText);
  }, [textRef]); // Não recria handleSubmit como [text] faria

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

Este é um padrão um tanto confuso mas mostra que você pode usar essa válvula de escape se precisar. É mais suportável se você extrair para um Hook customizado:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Será memorizado mesmo se `text` mudar:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

Em ambos os casos, **não recomendamos esse padrão** e só estamos mostrando aqui para integralidade. É melhor [evitar passar callbacks para baixo](#how-to-avoid-passing-callbacks-down).


## Por detrás das cortinas {#under-the-hood}

### Como o React associa chamadas de Hooks com componentes? {#how-does-react-associate-hook-calls-with-components}

React acompanha o componente que está renderizando. Graças as [Regras dos Hooks](/docs/hooks-rules.html), sabemos que Hooks são chamados somente dentro de componentes React (ou Hooks customizados -- que também só são chamados dentro de componentes React).

Existe uma lista interna de "células de memória" associadas a cada componente. Elas são somente objetos JavaScript aonde podemos colocar alguns dados. Quando você chama um Hook como `useState()`, é lido a célula atual (ou inicializada durante a primeira renderização), e então move o ponteiro para a próxima.é assim que múltiplas chamadas de `useState()` recebem seu estado local independente.

### Quais são as referências que influênciaram a criação dos Hooks? {#what-is-the-prior-art-for-hooks}

Hooks sintetizam ideias de diferentes fontes:

* Nossos velhos experimentos com APIs funcionais no repositório [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State).
* Experimentos feitos pela comunidade do React com as APIs de render props, incluindo [Reactions Component](https://github.com/reactions/component) feito por [Ryan Florence](https://github.com/ryanflorence).
* A proposta da [palavra chave `adopt`](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) como um auxiliar para render props, feito por [Dominic Gannaway](https://github.com/trueadm).
* Variáveis de estado e células de estado em [DisplayScript](http://displayscript.org/introduction.html).
* [Componentes Reducer](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) em ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) em Rx.
* [Efeitos algébricos](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) em Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) criou o design original de Hooks, refinado posteriormente por [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), e outros membros do time principal do React.
