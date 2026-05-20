---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, frequentemente usado por meio da sintaxe `<>...</>`, permite agrupar elementos sem um nó de encapsulamento.

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<Fragment>` {/*fragment*/}

Encapsule elementos em `<Fragment>` para agrupá-los juntos em situações em que você precisa de um único elemento. Agrupar elementos em `Fragment` não afeta o DOM resultante; é o mesmo que se os elementos não estivessem agrupados. A tag JSX vazia `<></>` é uma forma abreviada de `<Fragment></Fragment>` na maioria dos casos.

#### Props {/*props*/}

- **opcional** `key`: Fragments declarados com a sintaxe explícita `<Fragment>` podem ter [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge /> **opcional** `ref`: Um objeto ref (por exemplo, de [`useRef`](/reference/react/useRef)) ou uma [função de callback](/reference/react-dom/components/common#ref-callback). O React fornece um `FragmentInstance` como valor da ref que implementa métodos para interagir com os nós DOM encapsulados pelo Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

Quando você passa uma ref para um fragment, o React fornece um objeto `FragmentInstance` com métodos para interagir com os nós DOM encapsulados pelo fragment:

**Métodos de manipulação de eventos:**
- `addEventListener(type, listener, options?)`: Adiciona um listener de evento a todos os filhos DOM de primeiro nível do Fragment.
- `removeEventListener(type, listener, options?)`: Remove um listener de evento de todos os filhos DOM de primeiro nível do Fragment.
- `dispatchEvent(event)`: Despacha um evento para um filho virtual do Fragment para chamar quaisquer listeners adicionados e pode propagar para o pai DOM.

**Métodos de layout:**
- `compareDocumentPosition(otherNode)`: Compara a posição no documento do Fragment com outro nó.
  - Se o Fragment tiver filhos, o valor nativo de `compareDocumentPosition` é retornado.
  - Fragments vazios tentarão comparar o posicionamento dentro da árvore React e incluirão `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elementos que têm uma relação diferente na árvore React e na árvore DOM devido a portais ou outras inserções são `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Retorna um array plano de objetos `DOMRect` representando os retângulos delimitadores de todos os filhos.
- `getRootNode()`: Retorna o nó raiz contendo o nó DOM pai do Fragment.

**Métodos de gerenciamento de foco:**
- `focus(options?)`: Foca no primeiro nó DOM focável do Fragment. O foco é tentado nos filhos aninhados em profundidade primeiro.
- `focusLast(options?)`: Foca no último nó DOM focável do Fragment. O foco é tentado nos filhos aninhados em profundidade primeiro.
- `blur()`: Remove o foco se `document.activeElement` estiver dentro do Fragment.

**Métodos de observação:**
- `observeUsing(observer)`: Inicia a observação dos filhos DOM do Fragment com um IntersectionObserver ou ResizeObserver.
- `unobserveUsing(observer)`: Para a observação dos filhos DOM do Fragment com o observador especificado.

#### Cuidados {/*caveats*/}

- Se você quiser passar uma `key` para um Fragment, não pode usar a sintaxe `<>...</>`. Você precisa importar explicitamente o `Fragment` de `'react'` e renderizar `<Fragment key={suaChave}>...</Fragment>`.

- O React não [reseta o estado](/learn/preserving-and-resetting-state) quando você passa de `<><Child /></>` para `[<Child />]` ou vice-versa, ou quando você passa de `<><Child /></>` para `<Child />` e vice-versa. Isso funciona apenas para um único nível: por exemplo, passar de `<><><Child /></></>` para `<Child />` reseta o estado. Veja a semântica precisa [aqui.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b).

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

## Uso {/*usage*/}

### Retornando múltiplos elementos {/*returning-multiple-elements*/}

Use `Fragment` ou a sintaxe equivalente `<>...</>` para agrupar vários elementos juntos. Você pode usá-lo para colocar vários elementos em qualquer lugar onde um único elemento possa ir. Por exemplo, um componente só pode retornar um elemento, mas usando um Fragment você pode agrupar vários elementos juntos e então retorná-los como um grupo:

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments são úteis porque agrupar elementos com um Fragment não afeta o layout ou os estilos, ao contrário se você envolvesse os elementos em outro container como um elemento do DOM. Se você inspecionar este exemplo com as ferramentas do navegador, verá que todos os nós do DOM `<h1>` e `<article>` aparecem como irmãos sem encapsulamento ao redor deles:

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="Uma atualização" body="Faz um tempo desde que eu publiquei..." />
      <Post title="Meu novo blog" body="Eu estou começando um novo blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### Como escrever um Fragment sem a sintaxe especial? {/*how-to-write-a-fragment-without-the-special-syntax*/}

O exemplo acima é equivalente a importar `Fragment` do React:

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Normalmente, você não precisará disso, a menos que precise [passar uma `key` para o seu `Fragment`.](#rendering-a-list-of-fragments)

</DeepDive>

---

### Atribuindo vários elementos a uma variável {/*assigning-multiple-elements-to-a-variable*/}

Assim como qualquer outro elemento, você pode atribuir elementos de Fragment a variáveis, passá-los como props, e assim por diante:

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Você tem certeza que deseja sair desta página?
    </AlertDialog>
  );
}
```

---

### Agrupando elementos com texto {/*grouping-elements-with-text*/}

Você pode usar `Fragment` para agrupar textos juntamente com componentes:

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      De
      <DatePicker date={start} />
      para
      <DatePicker date={end} />
    </>
  );
}
```

---

### Renderizando uma lista de Fragments {/*rendering-a-list-of-fragments*/}

Aqui está uma situação em que você precisa escrever `Fragment` explicitamente em vez de usar a sintaxe `<></>`. Quando você [renderiza vários elementos em um loop](https://pt-br.react.dev/learn/rendering-lists), é necessário atribuir uma `key` a cada elemento. Se os elementos dentro do loop forem Fragments, você precisará usar a sintaxe normal de elementos JSX para fornecer o atributo `key`:

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

Você pode inspecionar o DOM para verificar que não há elementos de encapsulamento ao redor dos filhos do Fragment:

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'Uma atualização', body: "Faz um tempo desde que eu publiquei..." },
  { id: 2, title: 'Meu novo blog', body: 'Eu estou começando um novo blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );

    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
