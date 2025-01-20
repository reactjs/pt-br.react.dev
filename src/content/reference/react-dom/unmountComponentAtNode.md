---
title: unmountComponentAtNode
---

<Deprecated>

Esta API será removida em uma futura versão principal do React.

No React 18, `unmountComponentAtNode` foi substituído por [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` remove um componente React montado do DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Chame `unmountComponentAtNode` para remover um componente React montado do DOM e limpar seus manipuladores de eventos e estado.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: Um [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) O React removerá um componente React montado deste elemento.

#### Returns {/*returns*/}

`unmountComponentAtNode` retorna `true` se um componente foi desmontado e `false` caso contrário.

---

## Usage {/*usage*/}

Chame `unmountComponentAtNode` para remover um <CodeStep step={1}>componente React montado</CodeStep> de um <CodeStep step={2}>nó DOM do navegador</CodeStep> e limpar seus manipuladores de eventos e estado.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### Removing a React app from a DOM element {/*removing-a-react-app-from-a-dom-element*/}

Ocasionalmente, você pode querer "polvilhar" o React em uma página existente, ou uma página que não está totalmente escrita em React. Nesses casos, você pode precisar "parar" o aplicativo React, removendo toda a UI, estado e ouvintes do nó DOM em que foi renderizado.

Neste exemplo, clicar em "Render React App" irá renderizar um aplicativo React. Clique em "Unmount React App" para destruí-lo:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Meu aplicativo</title></head>
  <body>
    <button id='render'>Renderizar Aplicativo React</button>
    <button id='unmount'>Desmontar Aplicativo React</button>
    <!-- Este é o nó do Aplicativo React -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Olá, mundo!</h1>;
}
```

</Sandpack>