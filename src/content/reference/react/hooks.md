---
title: "Hooks Integrados do React"
---

<Intro>

*Hooks* permitem que você use diferentes recursos do React em seus componentes. Você pode usar os Hooks integrados ou combiná-los para criar os seus próprios. Esta página lista todos os Hooks integrados no React.

</Intro>

---

## Hooks de Estado {/*state-hooks*/}

*Estado* permite que um componente ["lembre" informações como entrada do usuário.](/learn/state-a-components-memory) Por exemplo, um componente de formulário pode usar o estado para armazenar o valor de entrada, enquanto um componente de galeria de imagens pode usar o estado para armazenar o índice da imagem selecionada.

Para adicionar estado a um componente, use um destes Hooks:

* [`useState`](/reference/react/useState) declara uma variável de estado que você pode atualizar diretamente.
* [`useReducer`](/reference/react/useReducer) declara uma variável de estado com a lógica de atualização dentro de uma [função redutora.](/learn/extracting-state-logic-into-a-reducer)

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Hooks de Contexto {/*context-hooks*/}

*Contexto* permite que um componente [receba informações de pais distantes sem passar como props.](/learn/passing-props-to-a-component) Por exemplo, o componente de nível superior da sua aplicação pode passar o tema de UI atual para todos os componentes abaixo, não importa quão profundo.

* [`useContext`](/reference/react/useContext) lê e se inscreve em um contexto.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Hooks de Ref {/*ref-hooks*/}

*Refs* permitem que um componente [mantenha algumas informações que não são usadas para renderização,](/learn/referencing-values-with-refs) como um nó do DOM ou um ID de timeout. Ao contrário do estado, atualizar uma ref não re-renderiza seu componente. Refs são uma "saída" da filosofia do React. Elas são úteis quando você precisa trabalhar com sistemas não-React, como as APIs nativas do navegador.

* [`useRef`](/reference/react/useRef) declara uma ref. Você pode armazenar qualquer valor nela, mas na maioria das vezes é usada para armazenar um nó do DOM.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) permite que você personalize a ref exposta pelo seu componente. Isso é raramente usado.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Hooks de Efeito {/*effect-hooks*/}

*Efeitos* permitem que um componente [se conecte e sincronize com sistemas externos.](/learn/synchronizing-with-effects) Isso inclui lidar com rede, DOM do navegador, animações, widgets escritos usando uma biblioteca de UI diferente e outro código que não é do React.

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

Efeitos são uma "saída" da filosofia do React. Não use Efeitos para orquestrar o fluxo de dados da sua aplicação. Se você não estiver interagindo com um sistema externo, [você pode não precisar de um Efeito.](/learn/you-might-not-need-an-effect)

Existem duas variações raramente usadas de `useEffect` com diferenças de tempo:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) dispara antes que o navegador repinte a tela. Você pode medir o layout aqui.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) dispara antes que o React faça alterações no DOM. Bibliotecas podem inserir CSS dinâmico aqui.

---

## Hooks de Desempenho {/*performance-hooks*/}

Uma maneira comum de otimizar o desempenho de re-renderização é pular trabalhos desnecessários. Por exemplo, você pode dizer ao React para reutilizar um cálculo em cache ou para pular uma re-renderização se os dados não mudaram desde a última renderização.

Para pular cálculos e re-renderizações desnecessárias, use um destes Hooks:

- [`useMemo`](/reference/react/useMemo) permite que você cache o resultado de um cálculo custoso.
- [`useCallback`](/reference/react/useCallback) permite que você cache uma definição de função antes de passá-la a um componente otimizado.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Às vezes, você não pode pular a re-renderização porque a tela realmente precisa ser atualizada. Nesse caso, você pode melhorar o desempenho separando atualizações bloqueantes que devem ser síncronas (como digitar em um campo de entrada) de atualizações não-bloqueantes que não precisam bloquear a interface do usuário (como atualizar um gráfico).

Para priorizar a renderização, use um destes Hooks:

- [`useTransition`](/reference/react/useTransition) permite que você marque uma transição de estado como não-bloqueante e permita que outras atualizações a interrompam.
- [`useDeferredValue`](/reference/react/useDeferredValue) permite que você adie a atualização de uma parte não crítica da UI e permita que outras partes sejam atualizadas primeiro.

---

## Outros Hooks {/*other-hooks*/}

Esses Hooks são principalmente úteis para autores de bibliotecas e não são comumente usados no código da aplicação.

- [`useDebugValue`](/reference/react/useDebugValue) permite que você personalize o rótulo que o React DevTools exibe para seu Hook personalizado.
- [`useId`](/reference/react/useId) permite que um componente associe um ID único a si mesmo. Tipicamente usado com APIs de acessibilidade.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) permite que um componente se inscreva em uma loja externa.
* [`useActionState`](/reference/react/useActionState) permite que você gerencie o estado de ações.

---

## Seus próprios Hooks {/*your-own-hooks*/}

Você também pode [definir seus próprios Hooks personalizados](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) como funções JavaScript.