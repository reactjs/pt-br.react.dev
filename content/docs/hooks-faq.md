---
id: hooks-faq
title: Hooks FAQ
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* é um novo recurso adicionado no React 16.8. Eles permitem que você use estado (`state`) e outras features do React, sem precisar usar classes.

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
  * [Preciso reescrever todos os meus componentes usando classe?](#do-i-need-to-rewrite-all-my-class-components)
  * [O que eu posso fazer com Hooks que eu não podia fazer com classes?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Quanto do meu conhecimento de React continua relevante?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Devo usar Hooks, classes ou um misto dos dois?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hooks cobrem todos os casos de uso para classes?](#do-hooks-cover-all-use-cases-for-classes)
  * [Hooks substituem render props e higher-order components?](#do-hooks-replace-render-props-and-higher-order-components)
  * [O que Hooks significam para APIs populares como o connect() do Redux e o React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hooks funcionam com tipagem estática?](#do-hooks-work-with-static-typing)
  * [Comom testar componentes que usam Hooks?](#how-to-test-components-that-use-hooks)
  * [O que exatamente as regras de lint impõem?](#what-exactly-do-the-lint-rules-enforce)
* **[From Classes to Hooks](#from-classes-to-hooks)**
  * [How do lifecycle methods correspond to Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Is there something like instance variables?](#is-there-something-like-instance-variables)
  * [Should I use one or many state variables?](#should-i-use-one-or-many-state-variables)
  * [Can I run an effect only on updates?](#can-i-run-an-effect-only-on-updates)
  * [How to get the previous props or state?](#how-to-get-the-previous-props-or-state)
  * [How do I implement getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Is there something like forceUpdate?](#is-there-something-like-forceupdate)
  * [Can I make a ref to a function component?](#can-i-make-a-ref-to-a-function-component)
  * [What does const [thing, setThing] = useState() mean?](#what-does-const-thing-setthing--usestate-mean)
* **[Performance Optimizations](#performance-optimizations)**
  * [Can I skip an effect on updates?](#can-i-skip-an-effect-on-updates)
  * [How do I implement shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [How to memoize calculations?](#how-to-memoize-calculations)
  * [How to create expensive objects lazily?](#how-to-create-expensive-objects-lazily)
  * [Are Hooks slow because of creating functions in render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [How to avoid passing callbacks down?](#how-to-avoid-passing-callbacks-down)
  * [How to read an often-changing value from useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Under the Hood](#under-the-hood)**
  * [How does React associate Hook calls with components?](#how-does-react-associate-hook-calls-with-components)
  * [What is the prior art for Hooks?](#what-is-the-prior-art-for-hooks)

## Estratégia de Adoção {#adoption-strategy}

### Quais versões do React incluem Hooks? {#which-versions-of-react-include-hooks}

Começando com 16.8.0, React inclui uma implementação estável dos Hooks para:

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

Note que **para habilitar Hooks, todos os pacotes precisam estar na versão 16.8.0 ou maior**. Hooks não vão funcionar se você esquecer de atualizar, por exemplo, o React DOM.

React Native vai suportar Hooks completamente na sua próxima release estável.

### Preciso reescrever todos os meus componentes usando classe? {#do-i-need-to-rewrite-all-my-class-components}

Não. Não existe [nenhum plano](/docs/hooks-intro.html#gradual-adoption-strategy) para remover classes do React -- todos nós precisamos continuar entregando produtos e não podemos reescrever tudo. Recomendamos tentar usar Hooks em código novo.

### O que eu posso fazer com Hooks que eu não podia fazer com classes? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hooks oferecem uma nova maneira, poderosa e expressiva, de reutilizar funcionalidade entre componentes. ["Construing Seu Próprio Hook"](/docs/hooks-custom.html) fornece um vislumbre do que é possível. [Este artigo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) feito por um membro da equipe principal do React mergulha fundo nas novas possibilidades desbloqueadas por Hooks.

### Quanto do meu conhecimento de React continua relevante? {#how-much-of-my-react-knowledge-stays-relevant}

Hooks são uma maneira mais direta de usar as funcionalidades do React que você já conhece -- como estado, ciclo de vida, context e refs. Eles não mudam fundamentalmente como o React funciona e seu conhecimento de componentes, props e fluxo de dados de cima para baixo continua relevante.

Hooks tem sua curva de aprendizado. Se tiver algo faltando nessa documentação, [abra um issue](https://github.com/reactjs/reactjs.org/issues/new) e nós vamos tentar ajudar.

### Devo usar Hooks, classes ou um misto dos dois? {#should-i-use-hooks-classes-or-a-mix-of-both}

Quando você estiver pronto, nós encorajamos você a começar usando Hooks em novos componentes que você escrever. Tenha certeza que todos no seu time estão de acordo em usa-los e estão familiarizados com a documentação. Nós não recomendamos reescrever suas classes existentes para Hooks a menos que você tenha planejado reescrever-las previamente (por exemplo, para arrumar bugs).

Você não pode usar Hooks *dentro* de um componente classe, mas você definitivamente pode misturar classes e funções com Hooks em uma única árvore. Se um componente é uma classe ou uma função que usa Hooks é um detalhe de implementação daquele componente. A longo prazo, nós esperamos que Hooks sejam a principal maneira que as pessoas escrevam componentes React.

### Hooks cobrem todos os casos de uso para classes? {#do-hooks-cover-all-use-cases-for-classes}

Nosso objetivo é que Hooks cubra todos os casos de uso o mais rápido possível. Ainda não há Hook equivalente para os ciclos de vida `getSnapshotBeforeUpdate` e `componentDidCatch`, que são mais incomuns, mas planejamos adiciona-los em breve.

É o início dos Hooks e algumas bibliotecas de terceiros podem não ser compatíveis com Hooks neste momento.

### Hooks substituem render props e higher-order components? {#do-hooks-replace-render-props-and-higher-order-components}

Frequentemente, render props e hoc (higher-order components) renderizam somente um filho. Nós achamos que Hooks são uma maneira mais simples de atender esse caso de uso. Ainda existe lugar para ambos os padrões (por exemplo, um componente de scroll virtual talvez tenha uma prop `renderItem`, ou um container visual talvez tenha sua própria estrutura DOM). Mas na maioria dos casos, Hooks serão suficiente e podem ajudar a reduzir o aninhamento na sua árvore.

### O que Hooks significam para APIs populares como o `connect()` do Redux e o React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Você pode continuar a usar exatamente as mesmas APIs que sempre usou; elas vão continuar funcionando.

No futuro, novas versões dessas bibliotecas também pode exportar Hooks custom como `useRedux()` ou `useRouter()` que permitem que você use as mesmas features sempre precisar de componentes em volta.

### Hooks funcionam com tipagem estática? {#do-hooks-work-with-static-typing}

Hooks foram planejados com tipagem estática em mente. Como eles são funções, eles são mais fáceis de tipar corretamente do que padrões como high-order components. As últimas definições do React para Flow e Typescript incluem suporte para React Hooks.

Importante observer que Hooks custom te dão o poder de restring a API do React se você quiser usa-la de alguma maneira mais rigorosa. React te dá as primitivas mas você pode combina-las de diferentes maneiras além das que fornecemos.

### Como testar componentes que usam Hooks? {#how-to-test-components-that-use-hooks}

Do ponto de vista do React, um componente usando Hooks é somente um componente regular. Se sua solução para testes não depende do funcionamento interno do React, testar componentes com Hooks não deveria ser diferente de como você normalmente testa componentes.

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
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

As chamadas para `act()` também vão descarregar os efeitos dentro dele.

Se você precisa testar um Hook custom, você pode faze-lo criando um componente no seu teste e usando o seu Hook nele. Então você pode testar o componente que escreveu.

Para reduzir o boilerplate, nós recomendamos usar [`react-testing-library`](https://git.io/react-testing-library) que é projetada para incentivar a escrever testes que usam seus componentes como usuários finais usam.

### O que exatamente as [regras de lint](https://www.npmjs.com/package/eslint-plugin-react-hooks) impõem? {#what-exactly-do-the-lint-rules-enforce}

Nós fornecems um [plugin ESLint](https://www.npmjs.com/package/eslint-plugin-react-hooks) que impõem [regras de Hooks](/docs/hooks-rules.html) para evitar bugs. Elas assumem que qualquer função começando com "`use`" e uma letra maiúscula em segunda é um Hook. Nós reconhecemos que esta heurística não é perfeita e que talvez aconteçam alguns falso positivos mas sem uma convenção simplesmente não há como fazer Hooks funcionarem bem -- e nomes mais longos iriam desencorajam pessoas tanto de adotar Hooks ou de seguir a convenção.

Em particular, a regra impõe que:

* Chamadas para Hooks ocorrem ou dentro de uma função usando `PascalCase` (tratada como componente) ou dentro de outra função `useSomething` (tratada como um Hook custom).
* Hooks são chamados na mesma ordem em toda renderização.

Existem mais algumas heurísticas e talvez elas mudem ao longo do tempo conforme nós regulamos as regras para balancear entre encontrar bugs e evitar falsos positivos.

## De Classes para Hooks {#from-classes-to-hooks}

### Como os métodos de ciclo de vida correspondem aos Hooks? {#how-do-lifecycle-methods-correspond-to-hooks}
### How do lifecycle methods correspond to Hooks? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: Funções não precisam de um constructor. Você pode inicializar o estado com o [`useState`](/docs/hooks-reference.html#usestate). Se calcular o estado for custoso, você pode passar uma função para o `useState`.

* `getDerivedStateFromProps`: Não é necessário, agende um update [enquanto estiver rendizando](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Veja `React.memo` [abaixo](#how-do-i-implement-shouldcomponentupdate).

* `render`: Este é o próprio corpo da função.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: O [Hook `useEffect`](/docs/hooks-reference.html#useeffect) pode expressar todas as combinações desses, (incluind casos [menos](#can-i-skip-an-effect-on-updates) [comuns](#can-i-run-an-effect-only-on-updates)).

* `componentDidCatch` e `getDerivedStateFromError`: Não há Hooks equivalentes para esses métodos ainda, mas eles serão adicionados em breve.

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

Se nós só quiséssemos criar um intervalo, não precisaríamos de ref (`id` poderia ser local do efeito), mas é útil se nós queremos limpar o intervalo usando um manipulador de eventos:

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

Conceitualmente, você pode pensar em refs como similares a variávels de instância em uma classe. A menos que você esteja fazendo [inicialização lazy](#how-to-create-expensive-objects-lazily), evite definir refs durante a renderização -- isso pode levar a comportamentos inesperados. Ao invés disso, tipicamente você quer modificar refs em um manipulador de events e efeitos.

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

Se você sente falta da mesclagem automática, você pode escrever um Hook custom, `useLegacyState`, que mescla o update no objeto. No entando, **nós recomendamos dividir o estado em múltiplas variáveis de estado baseado nos valores que tendem a mudar juntos.**

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

Separar o estado em variáveis independentes também tem outro benefício. Torna mais fácil para extrair uma lógica relacionada para um Hook custom posteriormente, como por exemplo:

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

Note como nós conseguimos mover a chamada `useState` da variável de estado `position` e o efeito relacionado para um Hook custom sem alterar o seu código. Se todo o estado estivesse em um único objeto, extrair seria mais difícil.

Tanto colocar todo estado em um único `useState` e usar múltiplos `useState` para cada campo pode funcionar. Componentes tendem a ser mais legíveis quando você encontra um balanço entre esses dois extremos e agrupa estados relacionados em algunas variáveis de estado independentes. Se a lógica do estado se torna muito complexa, nós recomendamos [gerenciá-la com um reducer](/docs/hooks-reference.html#usereducer) ou com um Hook custom.

### Possso usar um efeito somente em updates? {#can-i-run-an-effect-only-on-updates}

Esse é um caso de uso raro. Se você precisar, você pode [usar uma ref mutável](#is-there-something-like-instance-variables) para manualmente armazenar um valor boleano correspondente a se você está no primeiro render ou num subsequente, usando então essa flag no seu efeito. (Se você se encontrar fazendo isso regularmente, pode criar um Hook custom pra isso.)

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

Isso pode ser um pouco confuso mas você pode extrair para um Hook custom:

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

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

É possível que no futuro o React forneça um Hook `usePrevious` pois esse é um caso de uso relativamente comum.

Veja também [o padrão recomendado para estado derivado](#how-do-i-implement-getderivedstatefromprops).

### Como implementar `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}

Enquanto você provavelmente [não precisa dele](/blog/2018/06/07/you-probably-dont-need-derived-state.html), nos raros casos que você precisar (como ao implementar um componente de `<Transition>`), você pode atualizar o estado enquanto estiver renderizando. React vai re-renderizar o componente com o estado atualizado imediatamente após sair do primeiro render, então não seria custoso.

Aqui, nós guardamos o valor anterior da prop `row` em uma variável de estado para que possamos comparar:

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row mudou desde o ultimo render. Atualize isScrollingDown.
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

### O que `const [thing, setThing] = useState()` significa? {#what-does-const-thing-setthing--usestate-mean}

Se essa sintaxe não é familiar para você, confira a [explicação](/docs/hooks-state.html#tip-what-do-square-brackets-mean) na documentação do Hook State.


## Performance Optimizations {#performance-optimizations}

### Can I skip an effect on updates? {#can-i-skip-an-effect-on-updates}

Yes. See [conditionally firing an effect](/docs/hooks-reference.html#conditionally-firing-an-effect). Note that forgetting to handle updates often [introduces bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), which is why this isn't the default behavior.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

You can wrap a function component with `React.memo` to shallowly compare its props:

```js
const Button = React.memo((props) => {
  // your component
});
```

It's not a Hook because it doesn't compose like Hooks do. `React.memo` is equivalent to `PureComponent`, but it only compares props. (You can also add a second argument to specify a custom comparison function that takes the old and new props. If it returns true, the update is skipped.)

`React.memo` doesn't compare state because there is no single state object to compare. But you can make children pure too, or even [optimize individual children with `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### How to memoize calculations? {#how-to-memoize-calculations}

The [`useMemo`](/docs/hooks-reference.html#usememo) Hook lets you cache calculations between multiple renders by "remembering" the previous computation:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

This code calls `computeExpensiveValue(a, b)`. But if the inputs `[a, b]` haven't changed since the last value, `useMemo` skips calling it a second time and simply reuses the last value it returned.

Remember that the function passed to `useMemo` runs during rendering. Don't do anything there that you wouldn't normally do while rendering. For example, side effects belong in `useEffect`, not `useMemo`.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee.** In the future, React may choose to "forget" some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without `useMemo` — and then add it to optimize performance. (For rare cases when a value must *never* be recomputed, you can [lazily initialize](#how-to-create-expensive-objects-lazily) a ref.)

Conveniently, `useMemo` also lets you skip an expensive re-render of a child:

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Note that this approach won't work in a loop because Hook calls [can't](/docs/hooks-rules.html) be placed inside loops. But you can extract a separate component for the list item, and call `useMemo` there.

### How to create expensive objects lazily? {#how-to-create-expensive-objects-lazily}

`useMemo` lets you [memoize an expensive calculation](#how-to-memoize-calculations) if the inputs are the same. However, it only serves as a hint, and doesn't *guarantee* the computation won't re-run. But sometimes need to be sure an object is only created once.

**The first common use case is when creating the initial state is expensive:**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

To avoid re-creating the ignored initial state, we can pass a **function** to `useState`:

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React will only call this function during the first render. See the [`useState` API reference](/docs/hooks-reference.html#usestate).

**You might also occasionally want to avoid re-creating the `useRef()` initial value.** For example, maybe you want to ensure some imperative class instance only gets created once:

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **does not** accept a special function overload like `useState`. Instead, you can write your own function that creates and sets it lazily:

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

This avoids creating an expensive object until it's truly needed for the first time. If you use Flow or TypeScript, you can also give `getObserver()` a non-nullable type for convenience.


### Are Hooks slow because of creating functions in render? {#are-hooks-slow-because-of-creating-functions-in-render}

No. In modern browsers, the raw performance of closures compared to classes doesn't differ significantly except in extreme scenarios.

In addition, consider that the design of Hooks is more efficient in a couple ways:

* Hooks avoid a lot of the overhead that classes require, like the cost of creating class instances and binding event handlers in the constructor.

* **Idiomatic code using Hooks doesn't need the deep component tree nesting** that is prevalent in codebases that use higher-order components, render props, and context. With smaller component trees, React has less work to do.

Traditionally, performance concerns around inline functions in React have been related to how passing new callbacks on each render breaks `shouldComponentUpdate` optimizations in child components. Hooks approach this problem from three sides.

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook lets you keep the same callback reference between re-renders so that `shouldComponentUpdate` continues to work:

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* The [`useMemo` Hook](/docs/hooks-faq.html#how-to-memoize-calculations) makes it easier to control when individual children update, reducing the need for pure components.

* Finally, the `useReducer` Hook reduces the need to pass callbacks deeply, as explained below.

### How to avoid passing callbacks down? {#how-to-avoid-passing-callbacks-down}

We've found that most people don't enjoy manually passing callbacks through every level of a component tree. Even though it is more explicit, it can feel like a lot of "plumbing".

In large component trees, an alternative we recommend is to pass down a `dispatch` function from [`useReducer`](/docs/hooks-reference.html#usereducer) via context:

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Tip: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

Any child in the tree inside `TodosApp` can use the `dispatch` function to pass actions up to `TodosApp`:

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

This is both more convenient from the maintenance perspective (no need to keep forwarding callbacks), and avoids the callback problem altogether. Passing `dispatch` down like this is the recommended pattern for deep updates.

Note that you can still choose whether to pass the application *state* down as props (more explicit) or as context (more convenient for very deep updates). If you use context to pass down the state too, use two different context types -- the `dispatch` context never changes, so components that read it don't need to rerender unless they also need the application state.

### How to read an often-changing value from `useCallback`? {#how-to-read-an-often-changing-value-from-usecallback}

>Note
>
>We recommend to [pass `dispatch` down in context](#how-to-avoid-passing-callbacks-down) rather than individual callbacks in props. The approach below is only mentioned here for completeness and as an escape hatch.
>
>Also note that this pattern might cause problems in the [concurrent mode](/blog/2018/03/27/update-on-async-rendering.html). We plan to provide more ergonomic alternatives in the future, but the safest solution right now is to always invalidate the callback if some value it depends on changes.

In some rare cases you might need to memoize a callback with [`useCallback`](/docs/hooks-reference.html#usecallback) but the memoization doesn't work very well because the inner function has to be re-created too often. If the function you're memoizing is an event handler and isn't used during rendering, you can use [ref as an instance variable](#is-there-something-like-instance-variables), and save the last committed value into it manually:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

This is a rather convoluted pattern but it shows that you can do this escape hatch optimization if you need it. It's more bearable if you extract it to a custom Hook:

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
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

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

In either case, we **don't recommend this pattern** and only show it here for completeness. Instead, it is preferable to [avoid passing callbacks deep down](#how-to-avoid-passing-callbacks-down).


## Under the Hood {#under-the-hood}

### How does React associate Hook calls with components? {#how-does-react-associate-hook-calls-with-components}

React keeps track of the currently rendering component. Thanks to the [Rules of Hooks](/docs/hooks-rules.html), we know that Hooks are only called from React components (or custom Hooks -- which are also only called from React components).

There is an internal list of "memory cells" associated with each component. They're just JavaScript objects where we can put some data. When you call a Hook like `useState()`, it reads the current cell (or initializes it during the first render), and then moves the pointer to the next one. This is how multiple `useState()` calls each get independent local state.

### What is the prior art for Hooks? {#what-is-the-prior-art-for-hooks}

Hooks synthesize ideas from several different sources:

* Our old experiments with functional APIs in the [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository.
* React community's experiments with render prop APIs, including [Ryan Florence](https://github.com/ryanflorence)'s [Reactions Component](https://github.com/reactions/component).
* [Dominic Gannaway](https://github.com/trueadm)'s [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) proposal as a sugar syntax for render props.
* State variables and state cells in [DisplayScript](http://displayscript.org/introduction.html).
* [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html) in ReasonReact.
* [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html) in Rx.
* [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting) in Multicore OCaml.

[Sebastian Markbåge](https://github.com/sebmarkbage) came up with the original design for Hooks, later refined by [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm), and other members of the React team.
