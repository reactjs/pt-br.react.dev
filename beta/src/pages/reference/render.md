---
title: render()
---

<Intro>

`render` renderiza um [JSX](/learn/writing-markup-with-jsx) ("elemento React") em um nó de contêiner DOM do navegador. Ele instrui o React a alterar o DOM dentro do `container` para que ele corresponda ao JSX que foi passado.

```js
render(<App />, container);
render(<App />, container, callback);
```

</Intro>

## Renderizando o componente *root* {/*rendering-the-root-component*/}

Para chamar `render`, você precisa de um JSX e um contêiner DOM:

<APIAnatomy>

<AnatomyStep title="React element">

A UI que você deseja renderizar.

</AnatomyStep>

<AnatomyStep title="DOM container">

O nó do DOM no qual você deseja renderizar sua UI. O contêiner em si não é modificado, apenas seus filhos são.

</AnatomyStep>

```js [[1, 2, "<App />"], [2, 2, "container"]]
const container = document.getElementById('root');
render(<App />, container);
```

</APIAnatomy>

Em aplicativos totalmente construídos com React, você fará isso uma vez no nível superior do seu aplicativo - para renderizar o componente "root".

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Olá, mundo!</h1>;
}
```

</Sandpack>

<br />

## Renderizando vários *root* {/*rendering-multiple-roots*/}

Se você usar ["pedaços"](/learn/add-react-to-a-website) do React aqui e ali, chame `render` para cada parte de nível superior da UI gerenciada pelo React.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Este parágrafo não é renderizado pelo React (abra index.html para verificar).</p>
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
      <NavLink href="/sobre">Sobre</NavLink>
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
      <h2>Comentarios</h2>
      <Comment text="Olá!" author="Sophie" />
      <Comment text="Como vai você?" author="Sunil" />
    </>
  );
}

function Comentario({ text, author }) {
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

<br />

## Atualizando a árvore renderizada {/*updating-the-rendered-tree*/}

Você pode chamar `render` mais de uma vez no mesmo nó do DOM. Contanto que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React [preservará o estado](/learn/preserving-and-resetting-state). Observe como você pode digitar a entrada:

<Sandpack>

```js index.js active
import {render} from 'react-dom';
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
      <h1>Olá, mundo! {counter}</h1>
      <input placeholder="Digite algo aqui!" />
    </>
  );
}
```

</Sandpack>

Você pode destruir a árvore renderizada com [`unmountComponentAtNode()`](TODO).

<br />

## Quando não usar {/*when-not-to-use-it*/}

* Se seu aplicativo usa renderização de servidor (SSR) e gera HTML no servidor, use [`hydrate`](TODO) em vez de `render`.
* Se seu aplicativo for totalmente construído com React, você não precisará usar `render` mais de uma vez. Se você quiser renderizar algo em uma parte diferente da árvore DOM (por exemplo, um modal ou uma dica de ferramenta), use [`createPortal`](TODO).

<br />


## Comportamento em detalhes {/*behavior-in-detail*/}

Na primeira vez que você chama `render`, todos os elementos DOM existentes dentro de `container` são substituídos. Se você chamar `render` novamente, o React atualizará o DOM conforme necessário para refletir o JSX mais recente. O React decidirá quais partes do DOM podem ser reutilizadas e quais precisam ser recriadas ["combinando"](/learn/preserving-and-resetting-state) com a árvore renderizada anteriormente. Chamar `render` repetidamente é semelhante a chamar `setState` -- em ambos os casos, o React evita atualizações desnecessárias do DOM.

Você pode passar um *callback* como o terceiro argumento. O React irá chamá-lo depois que seu componente estiver no DOM.

Se você renderizar `<MyComponent />`, e `MyComponent` for um componente de classe, `render` retornará a instância dessa classe. Em todos os outros casos, retornará `null`.
