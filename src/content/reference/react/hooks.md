---
title: "Built-in React Hooks"
---

<Intro>

*Hooks* permitem que você use diferentes funcionalidades do React em seus componentes. Você pode usar os Hooks embutidos ou combiná-los para construir os seus próprios. Esta página lista todos os Hooks embutidos no React.

</Intro>

---

## State Hooks {/*state-hooks*/}

*State* permite que um componente ["lembre" informações como entrada do usuário.](/learn/state-a-components-memory) Por exemplo, um componente de formulário pode usar o *state* para armazenar o valor da entrada, enquanto um componente de galeria de imagens pode usar o *state* para armazenar o índice da imagem selecionada.

Para adicionar *state* a um componente, use um destes Hooks:

* [`useState`](/reference/react/useState) declara uma variável de *state* que você pode atualizar diretamente.
* [`useReducer`](/reference/react/useReducer) declara uma variável de *state* com a lógica de atualização dentro de uma [função reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hooks {/*context-hooks*/}

*Context* permite que um componente [receba informações de pais distantes sem passá-las como props.](/learn/passing-props-to-a-component) Por exemplo, o componente de nível superior do seu aplicativo pode passar o tema atual da UI para todos os componentes abaixo, não importa o quão profundo.

* [`useContext`](/reference/react/useContext) lê e se inscreve em um *context*.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* permitem que um componente [mantenha alguma informação que não é usada para renderização,](/learn/referencing-values-with-refs) como um nó do DOM ou uma ID de *timeout*. Diferente do *state*, atualizar uma *ref* não irá re-renderizar o seu componente. *Refs* são uma "saída de emergência" do paradigma React. Elas são úteis quando você precisa trabalhar com sistemas que não são React, como as APIs embutidas do navegador.

* [`useRef`](/reference/react/useRef) declara uma *ref*. Você pode manter qualquer valor nela, mas geralmente é usado para manter um nó do DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) permite que você personalize a *ref* exposta pelo seu componente. Isto raramente é usado.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* permitem que um componente [se conecte e se sincronize com sistemas externos.](/learn/synchronizing-with-effects) Isso inclui lidar com rede, DOM do navegador, animações, *widgets* escritos usando uma biblioteca de UI diferente e outro código que não é React.

* [`useEffect`](/reference/react/useEffect) conecta um componente a um sistema externo.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

*Effects* são uma "saída de emergência" do paradigma React. Não use *Effects* para orquestrar o fluxo de dados da sua aplicação. Se você não está interagindo com um sistema externo, [você pode não precisar de um Effect.](/learn/you-might-not-need-an-effect)

Existem duas variações raramente usadas de `useEffect` com diferenças no tempo:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) dispara antes do navegador redesenhar a tela. Você pode medir o *layout* aqui.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) dispara antes do React fazer alterações no DOM. Bibliotecas podem inserir CSS dinâmico aqui.

---

## Performance Hooks {/*performance-hooks*/}

Uma forma comum de otimizar o desempenho de re-renderização é ignorar o trabalho desnecessário. Por exemplo, você pode dizer ao React para reutilizar um cálculo em cache ou para ignorar um re-render se os dados não mudaram desde a renderização anterior.

Para ignorar cálculos e re-renderizações desnecessárias, use um destes Hooks:

- [`useMemo`](/reference/react/useMemo) permite que você faça cache do resultado de um cálculo caro.
- [`useCallback`](/reference/react/useCallback) permite que você faça cache de uma definição de função antes de passá-la para um componente otimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Às vezes, você não pode ignorar o re-render porque a tela realmente precisa ser atualizada. Nesse caso, você pode melhorar o desempenho separando as atualizações de bloqueio que devem ser síncronas (como digitar em uma entrada) das atualizações não bloqueantes que não precisam bloquear a interface do usuário (como atualizar um gráfico).

Para priorizar a renderização, use um destes Hooks:

- [`useTransition`](/reference/react/useTransition) permite que você marque uma transição de *state* como não bloqueante e permita que outras atualizações a interrompam.
- [`useDeferredValue`](/reference/react/useDeferredValue) permite que você adie a atualização de uma parte não crítica da UI e deixe outras partes atualizarem primeiro.

---

## Other Hooks {/*other-hooks*/}

Esses Hooks são principalmente úteis para autores de bibliotecas e não são comumente usados no código da aplicação.

- [`useDebugValue`](/reference/react/useDebugValue) permite que você personalize o rótulo que o React DevTools exibe para seu *Hook* personalizado.
- [`useId`](/reference/react/useId) permite que um componente associe um ID exclusivo a si mesmo. Tipicamente usado com APIs de acessibilidade.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite que um componente se inscreva em um *store* externo.
* [`useActionState`](/reference/react/useActionState) permite que você gerencie o *state* de *actions*.

---

## Your own Hooks {/*your-own-hooks*/}

Você também pode [definir seus próprios Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funções JavaScript.