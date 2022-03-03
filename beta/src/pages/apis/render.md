---
title: render
---

<Intro>

`render` renderiza um pedaço de [JSX](/learn/writing-markup-with-jsx) ("nó React") em um nó do DOM do navegador.

```js
render(reactNode, domNode, callback?)
```

</Intro>

- [Uso](#usage)
  - [Renderizando o componente raiz](#rendering-the-root-component)
  - [Renderizando várias raízes](#rendering-multiple-roots)
  - [Atualizando a árvore renderizada](#updating-the-rendered-tree)
- [Referência](#reference)
  - [`render(reactNode, domNode, callback?)`](#render)

---

## Uso {/*usage*/}

Chame `render` para exibir um <CodeStep step={1}>componente React</CodeStep> dentro de um <CodeStep step={2}>nó do DOM do navegador</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
````

### Renderizando o componente raiz {/*rendering-the-root-component*/}

Em aplicativos totalmente construídos com React, **você normalmente só fará isso uma vez na inicialização** -- para renderizar o componente "raiz".

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

Normalmente você não precisa chamar `render` novamente ou chamá-lo em mais lugares. A partir deste ponto, o React estará gerenciando o DOM de sua aplicação. Se você deseja atualizar a interface do usuário, seus componentes podem fazer isso [usando o estado](/apis/usestate).

---

### Renderizando várias raízes {/*rendering-multiple-roots*/}

Se sua página [não for totalmente construída com React](/learn/add-react-to-a-website), chame `render` para cada parte da interface de usuário de nível superior gerenciada pelo React.

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
      <NavLink href="/about">Sobre</NavLink>
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
      <h2>Comentários</h2>
      <Comment text="Olá!" author="Sophie" />
      <Comment text="Como vai você?" author="Sunil" />
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

Você pode destruir as árvores renderizadas com [`unmountComponentAtNode()`](TODO).

---

### Atualizando a árvore renderizada {/*updating-the-rendered-tree*/}

Você pode chamar `render` mais de uma vez no mesmo nó do DOM. Contanto que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React [preservará o estado](/learn/preserving-and-resetting-state). Observe como você pode digitar a entrada, o que significa que as atualizações de chamadas `render` repetidas a cada segundo neste exemplo não são destrutivas:

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
      <h1>Olá mundo! {counter}</h1>
      <input placeholder="Digite algo aqui" />
    </>
  );
}
```

</Sandpack>

É incomum chamar `render` várias vezes. Normalmente, você [atualiza o estado](/apis/usestate) dentro de um dos componentes.

---

## Referência {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Chame `render` para exibir um componente React dentro de um elemento DOM do navegador.

```js
const domNode = document.getElementById('root');
render(<App />, domNode);
```

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

---
