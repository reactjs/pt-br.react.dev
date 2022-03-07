---
title: render
---

<Intro>

<<<<<<< HEAD
`render` renderiza um pedaço de [JSX](/learn/writing-markup-with-jsx) ("nó React") em um nó do DOM do navegador.
=======
`render` renders a piece of [JSX](/learn/writing-markup-with-jsx) ("React node") into a browser DOM node.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

```js
render(reactNode, domNode, callback?)
```

</Intro>

<<<<<<< HEAD
- [Uso](#usage)
  - [Renderizando o componente raiz](#rendering-the-root-component)
  - [Renderizando várias raízes](#rendering-multiple-roots)
  - [Atualizando a árvore renderizada](#updating-the-rendered-tree)
- [Referência](#reference)
=======
- [Usage](#usage)
  - [Rendering the root component](#rendering-the-root-component)
  - [Rendering multiple roots](#rendering-multiple-roots)
  - [Updating the rendered tree](#updating-the-rendered-tree)
- [Reference](#reference)
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
  - [`render(reactNode, domNode, callback?)`](#render)

---

<<<<<<< HEAD
## Uso {/*usage*/}

Chame `render` para exibir um <CodeStep step={1}>componente React</CodeStep> dentro de um <CodeStep step={2}>nó do DOM do navegador</CodeStep>.
=======
## Usage {/*usage*/}

Call `render` to display a <CodeStep step={1}>React component</CodeStep> inside a <CodeStep step={2}>browser DOM node</CodeStep>.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
````

<<<<<<< HEAD
### Renderizando o componente raiz {/*rendering-the-root-component*/}

Em aplicativos totalmente construídos com React, **você normalmente só fará isso uma vez na inicialização** -- para renderizar o componente "raiz".
=======
### Rendering the root component {/*rendering-the-root-component*/}

In apps fully built with React, **you will usually only do this once at startup**--to render the "root" component.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
<<<<<<< HEAD
  return <h1>Olá, mundo!</h1>;
=======
  return <h1>Hello, world!</h1>;
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
}
```

</Sandpack>

<<<<<<< HEAD
Normalmente você não precisa chamar `render` novamente ou chamá-lo em mais lugares. A partir deste ponto, o React estará gerenciando o DOM de sua aplicação. Se você deseja atualizar a interface do usuário, seus componentes podem fazer isso [usando o estado](/apis/usestate).

---

### Renderizando várias raízes {/*rendering-multiple-roots*/}

Se sua página [não for totalmente construída com React](/learn/add-react-to-a-website), chame `render` para cada parte da interface de usuário de nível superior gerenciada pelo React.
=======
Usually you shouldn't need to call `render` again or to call it in more places. From this point on, React will be managing the DOM of your application. If you want to update the UI, your components can do this by [using state](/apis/usestate).

---

### Rendering multiple roots {/*rendering-multiple-roots*/}

If your page [isn't fully built with React](/learn/add-react-to-a-website), call `render` for each top-level piece of UI managed by React.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
<<<<<<< HEAD
  <p>Este parágrafo não é renderizado pelo React (abra index.html para verificar).</p>
=======
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
<<<<<<< HEAD
      <NavLink href="/about">Sobre</NavLink>
=======
      <NavLink href="/about">About</NavLink>
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
<<<<<<< HEAD
      <h2>Comentários</h2>
      <Comment text="Olá!" author="Sophie" />
      <Comment text="Como vai você?" author="Sunil" />
=======
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

<<<<<<< HEAD
Você pode destruir as árvores renderizadas com [`unmountComponentAtNode()`](TODO).

---

### Atualizando a árvore renderizada {/*updating-the-rendered-tree*/}

Você pode chamar `render` mais de uma vez no mesmo nó do DOM. Contanto que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React [preservará o estado](/learn/preserving-and-resetting-state). Observe como você pode digitar a entrada, o que significa que as atualizações de chamadas `render` repetidas a cada segundo neste exemplo não são destrutivas:
=======
You can destroy the rendered trees with [`unmountComponentAtNode()`](TODO).

---

### Updating the rendered tree {/*updating-the-rendered-tree*/}

You can call `render` more than once on the same DOM node. As long as the component tree structure matches up with what was previously rendered, React will [preserve the state](/learn/preserving-and-resetting-state). Notice how you can type in the input, which means that the updates from repeated `render` calls every second in this example are not destructive:
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

<Sandpack>

```js index.js active
import {render} from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
<<<<<<< HEAD
      <h1>Olá mundo! {counter}</h1>
      <input placeholder="Digite algo aqui" />
=======
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
É incomum chamar `render` várias vezes. Normalmente, você [atualiza o estado](/apis/usestate) dentro de um dos componentes.

---

## Referência {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Chame `render` para exibir um componente React dentro de um elemento DOM do navegador.
=======
It is uncommon to call `render` multiple times. Usually, you'll [update state](/apis/usestate) inside one of the components instead.

---

## Reference {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Call `render` to display a React component inside a browser DOM element.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

```js
const domNode = document.getElementById('root');
render(<App />, domNode);
```

<<<<<<< HEAD
O React exibirá `<App />` no `domNode` e assumirá o gerenciamento do DOM dentro dele.

Um aplicativo totalmente construído com React geralmente terá apenas uma chamada `render` com seu componente raiz. Uma página que usa "pedaços" de React para partes da página pode ter quantas chamadas `render` quantas forem necessárias.

[Veja exemplos acima.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um *nó React* que você deseja exibir. Isso geralmente será um pedaço de JSX como `<App />`, mas você também pode passar um elemento React construído com [`createElement()`](/TODO), uma string, um número, `null` ou `undefined`.

* `domNode`: Um [elemento DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element). O React exibirá o `reactNode` que você passar dentro deste elemento DOM. A partir deste momento, o React irá gerenciar o DOM dentro do `domNode` e atualizá-lo quando sua árvore do React mudar.

* **opcional** `callback`: Uma função. Se aprovado, o React irá chamá-lo depois que seu componente for colocado no DOM.


#### Retornos {/*returns*/}

`render` geralmente retorna `null`. No entanto, se o `reactNode` que você passar for um *componente de classe*, ele retornará uma instância desse componente.

#### Ressalvas {/*caveats*/}

* A primeira vez que você chamar `render`, o React irá limpar todo o conteúdo HTML existente dentro do `domNode` antes de renderizar o componente React nele. Se o seu `domNode` contém HTML gerado pelo React no servidor ou durante a compilação, use [`hydrate()`](/TODO), que anexa os manipuladores de eventos ao HTML existente.

* Se você chamar `render` no mesmo `domNode` mais de uma vez, o React irá atualizar o DOM conforme necessário para refletir o último JSX que você passou. O React decidirá quais partes do DOM podem ser reutilizadas e quais precisam ser recriadas ["combinando"](/learn/preserving-and-resetting-state) com a árvore renderizada anteriormente. Chamar `render` no mesmo `domNode` novamente é semelhante a chamar a função [`set`](/apis/usestate#setstate) no componente raiz: React evita atualizações desnecessárias do DOM.

* Se seu aplicativo for totalmente construído com React, você provavelmente terá apenas uma chamada `render` em seu aplicativo. (Se você usa um framework, ele pode fazer essa chamada para você.) Quando você deseja renderizar uma parte do JSX em uma parte diferente da árvore DOM que não é filho do seu componente (por exemplo, um modal ou um dica de ferramenta), use [`createPortal`](TODO) em vez de `render`.
=======
React will display `<App />` in the `domNode`, and take over managing the DOM inside it.

An app fully built with React will usually only have one `render` call with its root component.  A page that uses "sprinkles" of React for parts of the page may have as many `render` calls as needed.

[See examples above.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: A *React node* that you want to display. This will usually be a piece of JSX like `<App />`, but you can also pass a React element constructed with [`createElement()`](/TODO), a string, a number, `null`, or `undefined`. 

* `domNode`: A [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element). React will display the `reactNode` you pass inside this DOM element. From this moment, React will manage the DOM inside the `domNode` and update it when your React tree changes.

* **optional** `callback`: A function. If passed, React will call it after your component is placed into the DOM.


#### Returns {/*returns*/}

`render` usually returns `null`. However, if the `reactNode` you pass is a *class component*, then it will return an instance of that component.

#### Caveats {/*caveats*/}

* The first time you call `render`, React will clear all the existing HTML content inside the `domNode` before rendering the React component into it. If your `domNode` contains HTML generated by React on the server or during the build, use [`hydrate()`](/TODO) instead, which attaches the event handlers to the existing HTML.

* If you call `render` on the same `domNode` more than once, React will update the DOM as necessary to reflect the latest JSX you passed. React will decide which parts of the DOM can be reused and which need to be recreated by ["matching it up"](/learn/preserving-and-resetting-state) with the previously rendered tree. Calling `render` on the same `domNode` again is similar to calling the [`set` function](/apis/usestate#setstate) on the root component: React avoids unnecessary DOM updates.

* If your app is fully built with React, you'll likely have only one `render` call in your app. (If you use a framework, it might do this call for you.) When you want to render a piece of JSX in a different part of the DOM tree that isn't a child of your component (for example, a modal or a tooltip), use [`createPortal`](TODO) instead of `render`.
>>>>>>> a08e1fd4b574a4d2d55e292af9eb01d55a526303

---
