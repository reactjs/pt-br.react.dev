---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, frequentemente usado por meio da sintaxe `<>...</>`, permite agrupar elementos sem um nó de encapsulamento.

Fragments também podem receber refs, que permitem interagir com os nós DOM subjacentes sem adicionar elementos de encapsulamento.

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
- **opcional** `ref`: Um objeto ref (por exemplo, de [`useRef`](/reference/react/useRef)) ou uma [função de callback](/reference/react-dom/components/common#ref-callback). O React fornece um `FragmentInstance` como valor da ref que implementa métodos para interagir com os nós DOM encapsulados pelo Fragment.

#### Ressalvas {/*caveats*/}

* Se você quiser passar uma `key` para um Fragment, não pode usar a sintaxe `<>...</>`. Você precisa importar explicitamente o `Fragment` de `'react'` e renderizar `<Fragment key={yourKey}>...</Fragment>`.

* O React não [reseta o estado](/learn/preserving-and-resetting-state) quando você passa de `<><Child /></>` para `[<Child />]` ou vice-versa, ou quando você passa de `<><Child /></>` para `<Child />` e vice-versa. Isso funciona apenas para um único nível: por exemplo, passar de `<><><Child /></></>` para `<Child />` reseta o estado. Veja a semântica precisa [aqui.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

* Se você quiser passar uma `ref` para um Fragment, não pode usar a sintaxe `<>...</>`. Você precisa importar explicitamente o `Fragment` de `'react'` e renderizar `<Fragment ref={yourRef}>...</Fragment>`.

---

### `FragmentInstance` {/*fragmentinstance*/}

Quando você passa uma `ref` para um Fragment, o React fornece um objeto `FragmentInstance`. Ele implementa métodos para interagir com os filhos DOM de primeiro nível encapsulados pelo Fragment.

* [`addEventListener`](#addeventlistener) e [`removeEventListener`](#removeeventlistener) gerenciam event listeners em todos os filhos DOM de primeiro nível.
* [`dispatchEvent`](#dispatchevent) dispara um evento no Fragment, que pode se propagar para o pai no DOM.
* [`focus`](#focus), [`focusLast`](#focuslast) e [`blur`](#blur) gerenciam o foco em todos os filhos aninhados, com busca em profundidade (depth-first).
* [`observeUsing`](#observeusing) e [`unobserveUsing`](#unobserveusing) anexam e desanexam instâncias de `IntersectionObserver` ou `ResizeObserver`.
* [`getClientRects`](#getclientrects) retorna os retângulos delimitadores de todos os filhos DOM de primeiro nível.
* [`getRootNode`](#getrootnode) retorna o nó raiz do pai do Fragment.
* [`compareDocumentPosition`](#comparedocumentposition) compara a posição do Fragment com outro nó.
* [`scrollIntoView`](#scrollintoview) rola a página para exibir os filhos do Fragment.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Adiciona um event listener a todos os filhos DOM de primeiro nível do Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parâmetros {/*addeventlistener-parameters*/}

* `type`: Uma string que representa o tipo de evento a ser escutado (por exemplo, `'click'`, `'focus'`).
* `listener`: A função manipuladora de eventos (event handler).
* **opcional** `options`: Um objeto de opções ou um booleano para captura, seguindo a [API `addEventListener` do DOM.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

##### Retorna {/*addeventlistener-returns*/}

`addEventListener` não retorna nada (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Remove um event listener de todos os filhos DOM de primeiro nível do Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parâmetros {/*removeeventlistener-parameters*/}

* `type`: A string do tipo de evento.
* `listener`: A função manipuladora de eventos (event handler) a ser removida.
* **opcional** `options`: Um objeto de opções ou um booleano, seguindo a [API `removeEventListener` do DOM.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### Retorna {/*removeeventlistener-returns*/}

`removeEventListener` não retorna nada (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Dispara um evento no Fragment. Os event listeners adicionados são chamados, e o evento pode se propagar para o pai do Fragment no DOM.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parâmetros {/*dispatchevent-parameters*/}

* `event`: Um objeto [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) a ser disparado. Se `bubbles` for `true`, o evento se propaga para o nó DOM pai do Fragment.

##### Retorna {/*dispatchevent-returns*/}

`true` se o evento não foi cancelado, `false` se `preventDefault()` foi chamado.

---

#### `focus(options?)` {/*focus*/}

Coloca o foco no primeiro nó DOM focável do Fragment. Diferente de chamar `element.focus()` em um elemento DOM, este método percorre *todos* os filhos aninhados em profundidade (depth-first) até encontrar um elemento focável, e não apenas o próprio elemento ou seus filhos diretos.

```js
fragmentRef.current.focus();
```

##### Parâmetros {/*focus-parameters*/}

* **opcional** `options`: Um objeto [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) (por exemplo, `{ preventScroll: true }`).

##### Retorna {/*focus-returns*/}

`focus` não retorna nada (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Coloca o foco no último nó DOM focável do Fragment. Percorre os filhos aninhados em profundidade (depth-first) e então itera em ordem reversa.

```js
fragmentRef.current.focusLast();
```

##### Parâmetros {/*focuslast-parameters*/}

* **opcional** `options`: Um objeto [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options).

##### Retorna {/*focuslast-returns*/}

`focusLast` não retorna nada (`undefined`).

---

#### `blur()` {/*blur*/}

Remove o foco do elemento ativo se ele estiver dentro do Fragment. Se `document.activeElement` não estiver dentro do Fragment, `blur` não faz nada.

```js
fragmentRef.current.blur();
```

##### Retorna {/*blur-returns*/}

`blur` não retorna nada (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Começa a observar todos os filhos DOM de primeiro nível do Fragment com o observer fornecido.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parâmetros {/*observeusing-parameters*/}

* `observer`: Uma instância de [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) ou [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

##### Retorna {/*observeusing-returns*/}

`observeUsing` não retorna nada (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Para de observar os filhos DOM do Fragment com o observer especificado.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parâmetros {/*unobserveusing-parameters*/}

* `observer`: A mesma instância de `IntersectionObserver` ou `ResizeObserver` passada anteriormente para [`observeUsing`](#observeusing).

##### Retorna {/*unobserveusing-returns*/}

`unobserveUsing` não retorna nada (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Retorna um array plano de objetos [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) que representam os retângulos delimitadores de todos os filhos DOM de primeiro nível.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Retorna {/*getclientrects-returns*/}

Um `Array<DOMRect>` contendo os retângulos delimitadores de todos os filhos.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Retorna o nó raiz que contém o nó DOM pai do Fragment, seguindo o comportamento de [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Parâmetros {/*getrootnode-parameters*/}

* **opcional** `options`: Um objeto com uma propriedade booleana `composed`, seguindo a [API `getRootNode` do DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)

##### Retorna {/*getrootnode-returns*/}

Um `Document`, um `ShadowRoot` ou o próprio `FragmentInstance` se não houver um nó DOM pai.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Compara a posição no documento do Fragment com outro nó, retornando uma máscara de bits (bitmask) que segue o comportamento de [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parâmetros {/*comparedocumentposition-parameters*/}

* `otherNode`: O nó DOM com o qual comparar.

##### Retorna {/*comparedocumentposition-returns*/}

Uma máscara de bits com [flags de posição](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Fragments vazios e Fragments com filhos renderizados por meio de um [portal](/reference/react-dom/createPortal) incluem `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` no resultado.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Rola a página para exibir os filhos do Fragment. Quando `alignToTop` é `true` ou omitido, rola para alinhar o primeiro filho ao topo do ancestral rolável. Quando `alignToTop` é `false`, rola para alinhar o último filho à parte inferior.

```js
fragmentRef.current.scrollIntoView();
```

##### Parâmetros {/*scrollintoview-parameters*/}

* **opcional** `alignToTop`: Um booleano. Se `true` (o padrão), rola o primeiro filho até o topo da área rolável. Se `false`, rola o último filho até a parte inferior. Diferente de [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), este método não aceita um objeto `ScrollIntoViewOptions`.

##### Retorna {/*scrollintoview-returns*/}

`scrollIntoView` não retorna nada (`undefined`).

##### Ressalvas {/*scrollintoview-caveats*/}

* `scrollIntoView` não aceita um objeto de opções. Passar um lança um erro. Use o booleano `alignToTop` no lugar.
* Quando o Fragment não tem filhos, `scrollIntoView` rola até o irmão ou pai mais próximo como alternativa.

---

#### Ressalvas do `FragmentInstance` {/*fragmentinstance-caveats*/}

* Métodos que atuam sobre os filhos (como `addEventListener`, `observeUsing` e `getClientRects`) operam nos *filhos host (DOM) de primeiro nível* do Fragment. Eles não atuam diretamente sobre filhos aninhados dentro de outro elemento DOM.
* `focus` e `focusLast` percorrem os filhos aninhados em profundidade (depth-first) em busca de elementos focáveis, diferente dos métodos de eventos e de observers, que atuam apenas sobre os filhos host de primeiro nível.
* `observeUsing` não funciona em nós de texto. O React exibe um aviso em desenvolvimento se o Fragment contiver apenas filhos de texto.
* O React não aplica event listeners adicionados via `addEventListener` a árvores [`<Activity>`](/reference/react/Activity) ocultas. Quando um limite de `Activity` passa de oculto para visível, os listeners são aplicados automaticamente.
* Cada filho DOM de primeiro nível de um Fragment com uma `ref` recebe uma propriedade `reactFragments`: um `Set<FragmentInstance>` contendo todas as instâncias de Fragment que possuem o elemento. Isso permite [fazer cache de um observer compartilhado](#caching-global-intersection-observer) entre vários Fragments.

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

Aqui está uma situação em que você precisa escrever `Fragment` explicitamente em vez de usar a sintaxe `<></>`. Quando você [renderiza vários elementos em um loop](/learn/rendering-lists), é necessário atribuir uma `key` a cada elemento. Se os elementos dentro do loop forem Fragments, você precisará usar a sintaxe normal de elementos JSX para fornecer o atributo `key`:

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

### Adicionando event listeners sem um elemento de encapsulamento {/*adding-event-listeners-without-wrapper*/}

As `ref`s de Fragment permitem adicionar event listeners a um grupo de elementos sem adicionar um nó DOM de encapsulamento. Use uma [função de callback de ref](/reference/react-dom/components/common#ref-callback) para anexar e limpar os listeners:

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

A chamada de `addEventListener` aplica o listener a cada filho DOM de primeiro nível do Fragment. Quando filhos são adicionados ou removidos dinamicamente, o `FragmentInstance` adiciona ou remove o listener automaticamente.

<DeepDive>

#### Quais filhos uma ref de Fragment atinge? {/*which-children-does-a-fragment-ref-target*/}

Um `FragmentInstance` atua sobre os **filhos host (DOM) de primeiro nível** do Fragment. Considere esta árvore:

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

`Wrapper` é um componente React, então o `FragmentInstance` olha através dele para encontrar os nós DOM. Os filhos atingidos são `A`, `B` e `D`. `C` não é atingido porque está aninhado dentro do elemento DOM `B`.

Métodos como `addEventListener`, `observeUsing` e `getClientRects` operam sobre esses filhos DOM de primeiro nível. `focus` e `focusLast` são diferentes: eles percorrem *todos* os filhos aninhados em profundidade (depth-first) para encontrar elementos focáveis.

</DeepDive>

---

### Gerenciando o foco em um grupo de elementos {/*managing-focus-across-elements*/}

As `ref`s de Fragment fornecem os métodos `focus`, `focusLast` e `blur`, que operam sobre todos os nós DOM dentro do Fragment:

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Chamar `focus()` coloca o foco no input `street`, mesmo que ele esteja aninhado dentro de um `<fieldset>` e de um `<label>`. `focus()` percorre em profundidade (depth-first) todos os filhos aninhados, e não apenas os filhos diretos do Fragment. `focusLast()` faz o mesmo em ordem reversa, e `blur()` remove o foco se o elemento focado no momento estiver dentro do Fragment.

---

### Rolando um grupo de elementos até ficar visível {/*scrolling-group-into-view*/}

Use `scrollIntoView` para rolar a página até exibir os filhos de um Fragment sem um elemento de encapsulamento. Passe `true` (ou omita o argumento) para rolar o primeiro filho até o topo. Passe `false` para rolar o último filho até a parte inferior:

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Observando a visibilidade sem um elemento de encapsulamento {/*observing-visibility-without-wrapper*/}

Use `observeUsing` para anexar um `IntersectionObserver` a todos os filhos DOM de primeiro nível de um Fragment. Isso permite acompanhar a visibilidade sem exigir que os componentes filhos exponham `ref`s nem adicionar um elemento de encapsulamento:

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Fazendo cache de um IntersectionObserver global {/*caching-global-intersection-observer*/}

Uma otimização de desempenho comum em sites com muitos observers é compartilhar um único IntersectionObserver por configuração e encaminhar suas entradas para os callbacks corretos com base em qual elemento entrou na interseção. As `ref`s de Fragment oferecem suporte a esse mesmo padrão por meio da propriedade `reactFragments`.

Cada filho DOM de primeiro nível de um Fragment com uma `ref` tem uma propriedade `reactFragments`: um `Set` de objetos `FragmentInstance` que contêm esse elemento. Quando o observer compartilhado dispara, você pode usar essa propriedade para descobrir qual `FragmentInstance` possui o elemento que entrou na interseção e executar os callbacks certos.

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Vários componentes `ObservedGroup` com as mesmas opções reutilizam um único `IntersectionObserver`. Quando qualquer uma das seções fica visível pela rolagem, o observer compartilhado dispara e usa `reactFragments` para encaminhar a entrada ao callback correto.
