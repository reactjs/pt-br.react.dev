---
<<<<<<< HEAD
title: "React Hooks Integrados"
=======
title: React Reference Overview
>>>>>>> 6570e6cd79a16ac3b1a2902632eddab7e6abb9ad
---

<Intro>

<<<<<<< HEAD
*Hooks* permitem que você use diferentes funcionalidades do React em seus componentes. Você pode usar os Hooks integrados ou combiná-los para criar os seus próprios. Esta página lista todos os Hooks integrados no React.
=======
This section provides detailed reference documentation for working with React. For an introduction to React, please visit the [Learn](/learn) section.
>>>>>>> 6570e6cd79a16ac3b1a2902632eddab7e6abb9ad

</Intro>

Our The React reference documentation is broken down into functional subsections:

## React {/*react*/}

<<<<<<< HEAD
*State* permite que um componente ["lembre-se" de informações como o input do usuário.](/learn/state-a-components-memory) Por exemplo, um componente de formulário pode usar o state para armazenar o valor do input, enquanto um componente de galeria de imagens pode usar o state para armazenar o índice da imagem selecionada.

Para adicionar state a um componente, use um destes Hooks:

* [`useState`](/reference/react/useState) declara uma variável de state que pode ser atualizada diretamente.
* [`useReducer`](/reference/react/useReducer) declara uma variável de state com a lógica de atualização dentro de uma [função reducer.](/learn/extracting-state-logic-into-a-reducer)
=======
Programmatic React features:

* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Documents built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/react/directives) - Provide instructions to bundlers compatible with React Server Components.

## React DOM {/*react-dom*/}
>>>>>>> 6570e6cd79a16ac3b1a2902632eddab7e6abb9ad

React-dom contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.

## Legacy APIs {/*legacy-apis*/}

<<<<<<< HEAD
*Context* permite que um componente [receba informações de pais distantes sem passá-las como props.](/learn/passing-props-to-a-component) Por exemplo, o componente na raiz do seu aplicativo pode passar o tema atual da UI do usuário para todos os componentes abaixo, independentemente da profundidade.

* [`useContext`](/reference/react/useContext) lê e se inscreve em um contexto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs* permitem que um componente [mantenha algumas informações que não são usadas para renderização,](/learn/referencing-values-with-refs) como um nó do DOM ou um ID de tempo limite. Ao contrário do state, a atualização de uma ref não renderiza novamente o componente. Refs são uma "saída de emergência" do paradigma React. Elas são úteis quando você precisa trabalhar com sistemas não React, como as APIs de navegador integradas.

* [`useRef`](/reference/react/useRef) declara uma ref. Você pode armazenar qualquer valor nele, mas na maioria das vezes ele é usado para armazenar um nó do DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) permite que você personalize a ref exposta pelo seu componente. Isso é raramente usado.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects* permitem que um componente [se conecte e sincronize com sistemas externos.](/learn/synchronizing-with-effects) Isso inclui lidar com rede, DOM do navegador, animações, widgets escritos usando uma biblioteca de UI diferente e outros códigos que não sejam do React.

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

Effects são uma "saída de emergência" do paradigma React. Não use Effects para orquestrar o fluxo de dados de seu aplicativo. Se você não estiver interagindo com um sistema externo, [talvez não precise de um Effect.](/learn/you-might-not-need-an-effect)

Há duas variações raramente usadas de `useEffect` com diferenças de tempo:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) é acionado antes que o navegador repinte a tela. Você pode medir o layout aqui.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) é acionado antes que o React faça alterações no DOM. As bibliotecas podem inserir CSS dinâmico aqui.

---

## Hooks de desempenho {/*performance-hooks*/}

Uma maneira comum de otimizar o desempenho de uma nova renderização é pular o trabalho desnecessário. Por exemplo, você pode dizer ao React para reutilizar um cálculo em cache ou para pular uma nova renderização se os dados não tiverem sido alterados desde a renderização anterior.

Para pular os cálculos e a renderização desnecessária, use um destes Hooks:

- [`useMemo`](/reference/react/useMemo) permite que você armazene em cache o resultado de um cálculo caro.
- [`useCallback`](/reference/react/useCallback) permite que você armazene em cache uma definição de função antes de passá-la para um componente otimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Às vezes, não é possível pular a nova renderização porque a tela realmente precisa ser atualizada. Nesse caso, é possível melhorar o desempenho separando as atualizações de bloqueio que devem ser síncronas (como digitar em um input) das atualizações sem bloqueio que não precisam bloquear a interface do usuário (como atualizar um gráfico).

Para priorizar a renderização, use um destes Hooks:

- [`useTransition`](/reference/react/useTransition) permite que você marque uma transição de state como não bloqueante e permita que outras atualizações a interrompam.
- [`useDeferredValue`](/reference/react/useDeferredValue) permite adiar a atualização de uma parte não crítica da UI e possibilita que outras partes sejam atualizadas primeiro.

---

## Outros Hooks {/*other-hooks*/}

Esses Hooks são úteis principalmente para autores de bibliotecas e não são comumente usados no código de aplicativos.

- [`useDebugValue`](/reference/react/useDebugValue) permite que você personalize o rótulo que o React DevTools exibe para seu Hook personalizados.
- [`useId`](/reference/react/useId) permite que um componente associe uma ID única a si mesmo. Normalmente usado com APIs de acessibilidade.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite que um componente se inscreva em um armazenamento externo.

---

## Seus próprios Hooks {/*your-own-hooks*/}

Você também pode [definir seus próprios Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funções JavaScript.
=======
* [Legacy APIs](/reference/react/legacy) - Exported from the `react` package, but not recommended for use in newly written code.
>>>>>>> 6570e6cd79a16ac3b1a2902632eddab7e6abb9ad
