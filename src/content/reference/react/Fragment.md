---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, frequentemente usado por meio da sintaxe `<>...</>`, permite agrupar elementos sem um nó de encapsulamento.

<Canary>Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements.</Canary>

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

<<<<<<< HEAD
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
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge /> **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

#### Cuidados {/*caveats*/}

<<<<<<< HEAD
- Se você quiser passar uma `key` para um Fragment, não pode usar a sintaxe `<>...</>`. Você precisa importar explicitamente o `Fragment` de `'react'` e renderizar `<Fragment key={suaChave}>...</Fragment>`.

- O React não [reseta o estado](/learn/preserving-and-resetting-state) quando você passa de `<><Child /></>` para `[<Child />]` ou vice-versa, ou quando você passa de `<><Child /></>` para `<Child />` e vice-versa. Isso funciona apenas para um único nível: por exemplo, passar de `<><><Child /></></>` para `<Child />` reseta o estado. Veja a semântica precisa [aqui.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b).
=======
* If you want to pass `key` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment key={yourKey}>...</Fragment>`.

* React does not [reset state](/learn/preserving-and-resetting-state) when you go from rendering `<><Child /></>` to `[<Child />]` or back, or when you go from rendering `<><Child /></>` to `<Child />` and back. This only works a single level deep: for example, going from `<><><Child /></></>` to `<Child />` resets the state. See the precise semantics [here.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)
>>>>>>> 152a471aa9ac2f6f0f3e64c04f39da790d40cf61

* <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

### <CanaryBadge /> `FragmentInstance` {/*fragmentinstance*/}

When you pass a `ref` to a Fragment, React provides a `FragmentInstance` object. It implements methods for interacting with the first-level DOM children wrapped by the Fragment.

* [`addEventListener`](#addeventlistener) and [`removeEventListener`](#removeeventlistener) manage event listeners across all first-level DOM children.
* [`dispatchEvent`](#dispatchevent) dispatches an event on the Fragment, which can bubble to the DOM parent.
* [`focus`](#focus), [`focusLast`](#focuslast), and [`blur`](#blur) manage focus across all nested children depth-first.
* [`observeUsing`](#observeusing) and [`unobserveUsing`](#unobserveusing) attach and detach `IntersectionObserver` or `ResizeObserver` instances.
* [`getClientRects`](#getclientrects) returns bounding rectangles of all first-level DOM children.
* [`getRootNode`](#getrootnode) returns the root node of the Fragment's parent.
* [`compareDocumentPosition`](#comparedocumentposition) compares the Fragment's position with another node.
* [`scrollIntoView`](#scrollintoview) scrolls the Fragment's children into view.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Adds an event listener to all first-level DOM children of the Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parameters {/*addeventlistener-parameters*/}

* `type`: A string representing the event type to listen for (e.g. `'click'`, `'focus'`).
* `listener`: The event handler function.
* **optional** `options`: An options object or boolean for capture, matching the [DOM `addEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

##### Returns {/*addeventlistener-returns*/}

`addEventListener` does not return anything (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Removes an event listener from all first-level DOM children of the Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parameters {/*removeeventlistener-parameters*/}

* `type`: The event type string.
* `listener`: The event handler function to remove.
* **optional** `options`: An options object or boolean, matching the [DOM `removeEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### Returns {/*removeeventlistener-returns*/}

`removeEventListener` does not return anything (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Dispatches an event on the Fragment. Added event listeners are called, and the event can bubble to the Fragment's DOM parent.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parameters {/*dispatchevent-parameters*/}

* `event`: An [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) object to dispatch. If `bubbles` is `true`, the event bubbles to the Fragment's parent DOM node.

##### Returns {/*dispatchevent-returns*/}

`true` if the event was not cancelled, `false` if `preventDefault()` was called.

---

#### `focus(options?)` {/*focus*/}

Focuses the first focusable DOM node in the Fragment. Unlike calling `element.focus()` on a DOM element, this method searches *all* nested children depth-first until it finds a focusable element—not just the element itself or its direct children.

```js
fragmentRef.current.focus();
```

##### Parameters {/*focus-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object (e.g. `{ preventScroll: true }`).

##### Returns {/*focus-returns*/}

`focus` does not return anything (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Focuses the last focusable DOM node in the Fragment. Searches nested children depth-first, then iterates in reverse.

```js
fragmentRef.current.focusLast();
```

##### Parameters {/*focuslast-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object.

##### Returns {/*focuslast-returns*/}

`focusLast` does not return anything (`undefined`).

---

#### `blur()` {/*blur*/}

Removes focus from the active element if it is within the Fragment. If `document.activeElement` is not within the Fragment, `blur` does nothing.

```js
fragmentRef.current.blur();
```

##### Returns {/*blur-returns*/}

`blur` does not return anything (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Starts observing all first-level DOM children of the Fragment with the provided observer.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parameters {/*observeusing-parameters*/}

* `observer`: An [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) or [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance.

##### Returns {/*observeusing-returns*/}

`observeUsing` does not return anything (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Stops observing the Fragment's DOM children with the specified observer.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parameters {/*unobserveusing-parameters*/}

* `observer`: The same `IntersectionObserver` or `ResizeObserver` instance previously passed to [`observeUsing`](#observeusing).

##### Returns {/*unobserveusing-returns*/}

`unobserveUsing` does not return anything (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Returns a flat array of [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) objects representing the bounding rectangles of all first-level DOM children.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns {/*getclientrects-returns*/}

An `Array<DOMRect>` containing the bounding rectangles of all children.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Returns the root node containing the Fragment's parent DOM node, matching the behavior of [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Parameters {/*getrootnode-parameters*/}

* **optional** `options`: An object with a `composed` boolean property, matching the [DOM `getRootNode` API.](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)

##### Returns {/*getrootnode-returns*/}

A `Document`, `ShadowRoot`, or the `FragmentInstance` itself if there is no parent DOM node.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Compares the document position of the Fragment with another node, returning a bitmask matching the behavior of [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters {/*comparedocumentposition-parameters*/}

* `otherNode`: The DOM node to compare against.

##### Returns {/*comparedocumentposition-returns*/}

A bitmask of [position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Empty Fragments and Fragments with children rendered through a [portal](/reference/react-dom/createPortal) include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` in the result.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Scrolls the Fragment's children into view. When `alignToTop` is `true` or omitted, scrolls to align the first child with the top of the scrollable ancestor. When `alignToTop` is `false`, scrolls to align the last child with the bottom.

```js
fragmentRef.current.scrollIntoView();
```

##### Parameters {/*scrollintoview-parameters*/}

* **optional** `alignToTop`: A boolean. If `true` (the default), scrolls the first child to the top of the scrollable area. If `false`, scrolls the last child to the bottom. Unlike [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), this method does not accept a `ScrollIntoViewOptions` object.

##### Returns {/*scrollintoview-returns*/}

`scrollIntoView` does not return anything (`undefined`).

##### Caveats {/*scrollintoview-caveats*/}

* `scrollIntoView` does not accept an options object. Passing one throws an error. Use the `alignToTop` boolean instead.
* When the Fragment has no children, `scrollIntoView` scrolls the nearest sibling or parent into view as a fallback.

---

#### `FragmentInstance` Caveats {/*fragmentinstance-caveats*/}

* Methods that target children (such as `addEventListener`, `observeUsing`, and `getClientRects`) operate on *first-level host (DOM) children* of the Fragment. They do not directly target children nested inside another DOM element.
* `focus` and `focusLast` search nested children depth-first for focusable elements, unlike event and observer methods which only target first-level host children.
* `observeUsing` does not work on text nodes. React logs a warning in development if the Fragment contains only text children.
* React does not apply event listeners added via `addEventListener` to hidden [`<Activity>`](/reference/react/Activity) trees. When an `Activity` boundary switches from hidden to visible, listeners are applied automatically.
* Each first-level DOM child of a Fragment with a `ref` gets a `reactFragments` property—a `Set<FragmentInstance>` containing all Fragment instances that own the element. This enables [caching a shared observer](#caching-global-intersection-observer) across multiple Fragments.

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

### <CanaryBadge /> Adding event listeners without a wrapper element {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

The `addEventListener` call applies the listener to every first-level DOM child of the Fragment. When children are dynamically added or removed, the `FragmentInstance` automatically adds or removes the listener.

<DeepDive>

#### Which children does a Fragment ref target? {/*which-children-does-a-fragment-ref-target*/}

A `FragmentInstance` targets the **first-level host (DOM) children** of the Fragment. Consider this tree:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` is a React component, so the `FragmentInstance` looks through it to find DOM nodes. The targeted children are `A`, `B`, and `D`. `C` is not targeted because it is nested inside the DOM element `B`.

Methods like `addEventListener`, `observeUsing`, and `getClientRects` operate on these first-level DOM children. `focus` and `focusLast` are different—they search *all* nested children depth-first to find focusable elements.

</DeepDive>

---

### <CanaryBadge /> Managing focus across a group of elements {/*managing-focus-across-elements*/}

Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Calling `focus()` focuses the `street` input—even though it is nested inside a `<fieldset>` and `<label>`. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.

---

### <CanaryBadge /> Scrolling a group of elements into view {/*scrolling-group-into-view*/}

Use `scrollIntoView` to scroll a Fragment's children into view without a wrapper element. Pass `true` (or omit the argument) to scroll the first child to the top. Pass `false` to scroll the last child to the bottom:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Observing visibility without a wrapper element {/*observing-visibility-without-wrapper*/}

Use `observeUsing` to attach an `IntersectionObserver` to all first-level DOM children of a Fragment. This lets you track visibility without requiring child components to expose `ref`s or adding a wrapper element:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Caching a global IntersectionObserver {/*caching-global-intersection-observer*/}

A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.

Each first-level DOM child of a Fragment with a `ref` has a `reactFragments` property: a `Set` of `FragmentInstance` objects that contain that element. When the shared observer fires, you can use this property to look up which `FragmentInstance` owns the intersecting element and run the right callbacks.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.
