---
title: render
---

<Deprecated>

Esta API será removida em uma futura versão principal do React.

No React 18, `render` foi substituído por [`createRoot`.](/reference/react-dom/client/createRoot) Usar `render` no React 18 irá avisar que seu aplicativo se comportará como se estivesse executando o React 17. Saiba mais [aqui.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`render` renderiza uma peça de [JSX](/learn/writing-markup-with-jsx) ("nó React") em um nó do DOM do navegador.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Chame `render` para exibir um componente React dentro de um elemento do DOM do navegador.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

O React exibirá `<App />` no `domNode` e assumirá o controle do gerenciamento do DOM dentro dele.

Um aplicativo totalmente construído com o React geralmente terá apenas uma chamada `render` com seu componente raiz. Uma página que usa "pintadas" de React para partes da página pode ter quantas chamadas `render` forem necessárias.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `reactNode`: Um *nó React* que você deseja exibir. Isso geralmente será uma peça de JSX como `<App />`, mas você também pode passar um elemento React construído com [`createElement()`](/reference/react/createElement), uma string, um número, `null` ou `undefined`. 

* `domNode`: Um [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) O React exibirá o `reactNode` que você passar dentro deste elemento DOM. A partir desse momento, o React gerenciará o DOM dentro do `domNode` e o atualizará quando sua árvore React mudar.

* **opcional** `callback`: Uma função. Se passado, o React a chamará após seu componente ser colocado no DOM.

#### Retornos {/*returns*/}

`render` geralmente retorna `null`. No entanto, se o `reactNode` que você passar for um *componente de classe*, então retornará uma instância desse componente.

#### Ressalvas {/*caveats*/}

* No React 18, `render` foi substituído por [`createRoot`.](/reference/react-dom/client/createRoot) Por favor, use `createRoot` para o React 18 e posteriores.

* A primeira vez que você chamar `render`, o React limpará todo o conteúdo HTML existente dentro do `domNode` antes de renderizar o componente React nele. Se seu `domNode` contém HTML gerado pelo React no servidor ou durante a construção, use [`hydrate()`](/reference/react-dom/hydrate) em vez disso, que anexa os manipuladores de eventos ao HTML existente.

* Se você chamar `render` no mesmo `domNode` mais de uma vez, o React atualizará o DOM conforme necessário para refletir o último JSX que você passou. O React decidirá quais partes do DOM podem ser reutilizadas e quais precisam ser recriadas por meio da ["correspondência"](/learn/preserving-and-resetting-state) com a árvore previamente renderizada. Chamar `render` novamente no mesmo `domNode` é semelhante a chamar a [`função set`](/reference/react/useState#setstate) no componente raiz: o React evita atualizações desnecessárias do DOM.

* Se seu aplicativo for totalmente construído com o React, você provavelmente terá apenas uma chamada `render` em seu aplicativo. (Se você usar um framework, ele pode fazer essa chamada por você.) Quando você quiser renderizar uma peça de JSX em uma parte diferente da árvore DOM que não é filha do seu componente (por exemplo, um modal ou uma dica), use [`createPortal`](/reference/react-dom/createPortal) em vez de `render`.

---

## Uso {/*usage*/}

Chame `render` para exibir um <CodeStep step={1}>componente React</CodeStep> dentro de um <CodeStep step={2}>nó do DOM do navegador</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Renderizando o componente raiz {/*rendering-the-root-component*/}

Em aplicativos totalmente construídos com o React, **você geralmente fará isso apenas uma vez na inicialização**--para renderizar o componente "raiz".

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Olá, mundo!</h1>;
}
```

</Sandpack>

Geralmente, você não deve precisar chamar `render` novamente ou chamá-lo em mais lugares. A partir desse ponto, o React estará gerenciando o DOM de sua aplicação. Para atualizar a interface do usuário, seus componentes irão [usar estado.](/reference/react/useState)

---

### Renderizando múltiplas raízes {/*rendering-multiple-roots*/}

Se sua página [não for totalmente construída com o React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), chame `render` para cada peça de UI de nível superior gerenciada pelo React.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Este parágrafo não é renderizado pelo React (abra index.html para verificar).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
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

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Início</NavLink>
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
      <Comment text="Como você está?" author="Sunil" />
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

Você pode destruir as árvores renderizadas com [`unmountComponentAtNode()`.](/reference/react-dom/unmountComponentAtNode)

---

### Atualizando a árvore renderizada {/*updating-the-rendered-tree*/}

Você pode chamar `render` mais de uma vez no mesmo nó DOM. Desde que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React irá [preservar o estado.](/learn/preserving-and-resetting-state) Observe como você pode digitar na entrada, o que significa que as atualizações das chamadas de `render` repetidas a cada segundo não são destrutivas:

<Sandpack>

```js src/index.js active
import { render } from 'react-dom';
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

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Olá, mundo! {counter}</h1>
      <input placeholder="Digite algo aqui" />
    </>
  );
}
```

</Sandpack>

É incomum chamar `render` várias vezes. Geralmente, você [atualizará o estado](/reference/react/useState) dentro de seus componentes em vez disso.