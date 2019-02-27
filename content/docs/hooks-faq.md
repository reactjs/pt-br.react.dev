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

* **[Estratégia de Adoção ](#adoption-strategy)**
  * [Quais versões do React incluem Hooks? ](#which-versions-of-react-include-hooks)
  * [Preciso reescrever todos os meus componentes usando classe? ](#do-i-need-to-rewrite-all-my-class-components)
  * [O que eu posso fazer com Hooks que eu não podia fazer com classes? ](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Quanto do meu conhecimento de React continua relevante? ](#how-much-of-my-react-knowledge-stays-relevant)
  * [Devo usar Hooks, classes ou um misto dos dois? ](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hooks cobrem todos os casos de uso para classes? ](#do-hooks-cover-all-use-cases-for-classes)
  * [Hooks substituem render props e higher-order components? ](#do-hooks-replace-render-props-and-higher-order-components)
  * [O que Hooks significam para APIs populares como o connect() do Redux e o React Router? ](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hooks funcionam com tipagem estática? ](#do-hooks-work-with-static-typing)
  * [Como testar componentes que usam Hooks? ](#how-to-test-components-that-use-hooks)
  * [O que exatamente as regras de lint impõem? ](#what-exactly-do-the-lint-rules-enforce)
* **[De Classes para Hooks ](#from-classes-to-hooks)**
  * [Como os métodos de ciclo de vida correspondem aos Hooks? ](#how-do-lifecycle-methods-correspond-to-hooks)
  * [How do lifecycle methods correspond to Hooks? ](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Existe algo como variáveis de instância? ](#is-there-something-like-instance-variables)
  * [Devo usar uma ou muitas variáveis de estado? ](#should-i-use-one-or-many-state-variables)
  * [Possso usar um efeito somente em updates? ](#can-i-run-an-effect-only-on-updates)
  * [Como acessar as props ou o estado anterior? ](#how-to-get-the-previous-props-or-state)
  * [Como implementar getDerivedStateFromProps? ](#how-do-i-implement-getderivedstatefromprops)
  * [Existe algo como forceUpdate? ](#is-there-something-like-forceupdate)
  * [Posso fazer uma ref para um componente de função? ](#can-i-make-a-ref-to-a-function-component)
  * [O que const [thing, setThing] = useState() significa? ](#what-does-const-thing-setthing--usestate-mean)
* **[Otimizações de Performance ](#performance-optimizations)**
  * [Posso pular um efeito nos updates? ](#can-i-skip-an-effect-on-updates)
  * [Como implementar shouldComponentUpdate? ](#how-do-i-implement-shouldcomponentupdate)
  * [Como memorizar cálculos? ](#how-to-memoize-calculations)
  * [Como criar objetos custosos a demanda? ](#how-to-create-expensive-objects-lazily)
  * [Hooks são mais lentos por criar funções no render? ](#are-hooks-slow-because-of-creating-functions-in-render)
  * [Como evitar passar callbacks para baixo? ](#how-to-avoid-passing-callbacks-down)
  * [Como ler um valor frequentemente variável de useCallback? ](#how-to-read-an-often-changing-value-from-usecallback)
* **[Por detrás das cortinas ](#under-the-hood)**
  * [Como o React associa chamadas de Hooks com componentes? ](#how-does-react-associate-hook-calls-with-components)
  * [Quais são as referências que influênciaram a criação dos Hooks? ](#what-is-the-prior-art-for-hooks)

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

Hooks oferecem uma nova maneira, poderosa e expressiva, de reutilizar funcionalidade entre componentes. ["Construindo Seu Próprio Hook"](/docs/hooks-custom.html) fornece um vislumbre do que é possível. [Este artigo](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889) feito por um membro da equipe principal do React mergulha fundo nas novas possibilidades desbloqueadas por Hooks.

### Quanto do meu conhecimento de React continua relevante? {#how-much-of-my-react-knowledge-stays-relevant}

Hooks são uma maneira mais direta de usar as funcionalidades do React que você já conhece -- como estado, ciclo de vida, context e refs. Eles não mudam fundamentalmente como o React funciona e seu conhecimento de componentes, props e fluxo de dados de cima para baixo continua relevante.

Hooks tem sua curva de aprendizado. Se tiver algo faltando nessa documentação, [abra um issue](https://github.com/reactjs/reactjs.org/issues/new) e nós vamos tentar ajudar.

### Devo usar Hooks, classes ou um misto dos dois? {#should-i-use-hooks-classes-or-a-mix-of-both}

Quando você estiver pronto, encorajamos você a começar usando Hooks em novos componentes que você escrever. Tenha certeza que todos no seu time estão de acordo em usá-los e estão familiarizados com a documentação. Nós não recomendamos reescrever suas classes existentes para Hooks a menos que você tenha planejado reescrevê-las previamente (por exemplo, para arrumar bugs).

Você não pode usar Hooks *dentro* de um componente classe, mas você definitivamente pode misturar classes e funções com Hooks em uma única árvore. Se um componente é uma classe ou uma função que usa Hooks é um detalhe de implementação daquele componente. A longo prazo, nós esperamos que Hooks sejam a principal maneira que as pessoas escrevam componentes React.

### Hooks cobrem todos os casos de uso para classes? {#do-hooks-cover-all-use-cases-for-classes}

Nosso objetivo é que Hooks cubra todos os casos de uso o mais rápido possível. Ainda não há Hook equivalente para os ciclos de vida `getSnapshotBeforeUpdate` e `componentDidCatch`, que são mais incomuns, mas planejamos adiciona-los em breve.

É o início dos Hooks e algumas bibliotecas de terceiros podem não ser compatíveis com Hooks neste momento.

### Hooks substituem render props e higher-order components? {#do-hooks-replace-render-props-and-higher-order-components}

Frequentemente, render props e hoc (higher-order components) renderizam somente um filho. Nós achamos que Hooks são uma maneira mais simples de atender esse caso de uso. Ainda existe lugar para ambos os padrões (por exemplo, um componente de scroll virtual talvez tenha uma prop `renderItem`, ou um container visual talvez tenha sua própria estrutura DOM). Mas na maioria dos casos, Hooks serão suficiente e podem ajudar a reduzir o aninhamento na sua árvore.

### O que Hooks significam para APIs populares como o `connect()` do Redux e o React Router? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

Você pode continuar a usar exatamente as mesmas APIs que sempre usou; elas vão continuar funcionando.

No futuro, novas versões dessas bibliotecas também pode exportar Hooks customizados como `useRedux()` ou `useRouter()` que permitem que você use as mesmas features sem precisar de componentes em volta.

### Hooks funcionam com tipagem estática? {#do-hooks-work-with-static-typing}

Hooks foram planejados com tipagem estática em mente. Como eles são funções, eles são mais fáceis de tipar corretamente do que padrões como high-order components. As últimas definições do React para Flow e Typescript incluem suporte para React Hooks.

Importante observar, que Hooks customizados te dão o poder de restringir a API do React se você quiser usa-la de alguma maneira mais rigorosa. React te dá as primitivas mas você pode combina-las de diferentes maneiras além das que fornecemos.

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

* `constructor`: Funções não precisam de um constructor. Você pode inicializar o estado com o [`useState`](/docs/hooks-reference.html#usestate). Se calcular o estado for custoso, você pode passar uma função para o `useState`.

* `getDerivedStateFromProps`: Não é necessário, agende um update [enquanto estiver rendizando](#how-do-i-implement-getderivedstatefromprops).

* `shouldComponentUpdate`: Veja `React.memo` [abaixo](#how-do-i-implement-shouldcomponentupdate).

* `render`: Este é o próprio corpo da função.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: O [Hook `useEffect`](/docs/hooks-reference.html#useeffect) pode expressar todas as combinações desses, (incluindo casos [menos](#can-i-skip-an-effect-on-updates) [comuns](#can-i-run-an-effect-only-on-updates)).

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

Se nós só quiséssemos criar um intervalo, não precisaríamos de ref (`id` poderia ser local do efeito), mas é útil se quisermos limpar o intervalo usando um manipulador de eventos:

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

### O que `const [thing, setThing] = useState()` significa? {#what-does-const-thing-setthing--usestate-mean}

Se essa sintaxe não é familiar para você, confira a [explicação](/docs/hooks-state.html#tip-what-do-square-brackets-mean) na documentação do Hook State.


## Otimizações de Performance {#performance-optimizations}

### Posso pular um efeito nos updates? {#can-i-skip-an-effect-on-updates}

Sim. Veja [disparando um efeito condicionalmente](/docs/hooks-reference.html#conditionally-firing-an-effect). Note que esquecer de lidar com updates geralmente [introduz bugs](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update), por isso que este não é o comportamento padrão.

### Como implementar `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}

Você pode envolver o componente de função com `React.memo` para comparar superficialmente suas props:

```js
const Button = React.memo((props) => {
  // seu componente
});
```

Este não é um Hook porque não compõe como um Hook normalmente faz. `React.memo` é o equivalente de `PureComponent`, mas compara somente props. (Você pode também adicionar um segundo argumento para especificar uma função de comparação que recebe as props velhas e novas. Se esta retorna true, o update é evitado.)

`React.memo` não compara estado porque não há nenhum único objeto de estado para comparar. Mas você pode pode tornar filhos puros também, ou até [otimizar filhos específicos com `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations).


### Como memorizar cálculos? {#how-to-memoize-calculations}

O Hook [`useMemo`](/docs/hooks-reference.html#usememo) permite que você evite cáculos entre múltiplas renderizações se "lembrando" dos cálculos feitos anteriormente:

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Esse código chama `computeExpensiveValue(a, b)`. Mas se as entradas `[a, b]` não mudaram desde o último valor, `useMemo` não chama a função novamente e simplesmente retorna o valor retornado anteriormente.

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

`useMemo` permite [memorizar um cálculo custoso](#how-to-memoize-calculations) se as inputs são as mesmas. No entanto, ele não *garante* que a computação não será re-executada. Algumas vezes você precisa ter certeza que um objeto só é criado uma vez.

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
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
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

* **Código idiomático usando Hooks evita aninhamento profundo de componentes** que prevalesce nas codebases que usam componentes de alta-ordem, render props e context. Com arvores de componentes menores, React tem menos trabalho a fazer.

Tradicionalmente, preocupações de desempenho sobre funções inline no React tem sido relacionadas a como passar novas callbacks em cada renderização quebra as otimizações de `shouldComponentUpdate` nos componentes filho. Hooks abordam esse problema de três maneiras.

* O Hook [`useCallback`](/docs/hooks-reference.html#usecallback) permite que você mantenha a mesma callback entre re-renderizações para que `shouldComponentUpdate` continue a funcionar:

    ```js{2}
    // Não vai mudar a menos que `a` ou `b` mude
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* O [Hook `useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) torna mais fácil controlar quando filhos específicos atualizam, reduzindo a necessidade de pure components.

* Finalmente, o Hook `useReducer` reduz a necessidade de passar callbacks profundamente, como explicado abaixo.

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
>Recomendamos [passar `dispatch` para baixo com context](#how-to-avoid-passing-callbacks-down) ao invés de callbacks individuais em props. A abordagem abaixo só é mencionada aqui para a integralidade e como vávula de escape.
>
>Note também que esse padrão pode causar problemas no [modo concorrente](/blog/2018/03/27/update-on-async-rendering.html). Planejamos prover mais alternativas ergonomicas no futuro, mas a solução mais segura no momento é sempre invalidar a callback se algum dos valores dos quais ela depende mudar.

Em alguns casos raros você pode precirar memorizar uma callback com [`useCallback`](/docs/hooks-reference.html#usecallback) mas a memorização não funciona muito bem porque a função interna tem que ser recriada muitas vezes. Se a função que você está memorizando é um manipulador de eventos e não é usado durante a renderização, você pode usar [ref como uma variável de instância](#is-there-something-like-instance-variables) e salvar o último valor nela manualmente:

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
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

Este é um padrão um tanto confuso mas mostra que você pode usar essa válvula de escape se precisar. É mais suportável se você extrair para um Hook custom:

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

  useLayoutEffect(() => {
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

React acompanha o componente que está renderizando. Graças as [Regras dos Hooks](/docs/hooks-rules.html), sabemos que Hooks são chamados somentes dentro de componentes React (ou Hooks custom -- que também só são chamados dentro de componentes React).

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
