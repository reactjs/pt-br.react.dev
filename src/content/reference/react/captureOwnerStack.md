---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` lê a Pilha de Proprietários (Owner Stack) atual em desenvolvimento e a retorna como uma string, se disponível.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Chame `captureOwnerStack` para obter a Pilha de Proprietários atual.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Parâmetros {/*parameters*/}

`captureOwnerStack` não aceita parâmetros.

#### Retorna {/*returns*/}

`captureOwnerStack` retorna `string | null`.

As Pilhas de Proprietários estão disponíveis em:
- Renderização de componentes
- Efeitos (ex: `useEffect`)
- Manipuladores de eventos do React (ex: `<button onClick={...} />`)
- Manipuladores de erros do React ([Opções do Root do React](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError` e `onUncaughtError`)

Se nenhuma Pilha de Proprietários estiver disponível, `null` será retornado (veja [Solução de Problemas: A Pilha de Proprietários é `null`](#the-owner-stack-is-null)).

#### Ressalvas {/*caveats*/}

- As Pilhas de Proprietários estão disponíveis apenas em desenvolvimento. `captureOwnerStack` sempre retornará `null` fora do ambiente de desenvolvimento.

<DeepDive>

#### Pilha de Proprietários vs. Pilha de Componentes {/*owner-stack-vs-component-stack*/}

A Pilha de Proprietários é diferente da Pilha de Componentes disponível em manipuladores de erros do React, como [`errorInfo.componentStack` em `onUncaughtError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production).

Por exemplo, considere o seguinte código:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // As pilhas são registradas em log em vez de serem exibidas diretamente na UI para
    // destacar que os navegadores aplicarão sourcemaps às pilhas registradas em log.
    // Observe que o sourcemapping é aplicado apenas no console real do navegador, não
    // no console falso exibido nesta página.
    // Pressione "fork" para poder visualizar a pilha com sourcemap em um console real.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` lançaria um erro.
A Pilha de Componentes desse erro seria:

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

No entanto, a Pilha de Proprietários leria apenas:

```
at Component
```

Nem `App` nem os componentes DOM (ex: `fieldset`) são considerados Proprietários nesta Pilha, pois não contribuíram para "criar" o nó que contém `SubComponent`. `App` e os componentes DOM apenas encaminharam o nó. `App` apenas renderizou o nó `children`, em contraste com `Component`, que criou um nó contendo `SubComponent` através de `<SubComponent />`.

Nem `Navigation` nem `legend` estão na pilha, pois são apenas irmãos de um nó que contém `<SubComponent />`.

`SubComponent` é omitido porque já faz parte da pilha de chamadas.

</DeepDive>

## Uso {/*usage*/}

### Aprimorar um overlay de erro personalizado {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Lembre-se que em uma aplicação real, console.error pode ser
    // chamado com múltiplos argumentos que você deve considerar.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Se você interceptar chamadas de <CodeStep step={1}>`console.error`</CodeStep> para destacá-las em um overlay de erro, você pode chamar <CodeStep step={2}>`captureOwnerStack`</CodeStep> para incluir a Pilha de Proprietários.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Display console.error() message
  errorBody.innerText = consoleMessage;

  // Display owner stack
  errorOwnerStack.innerText = ownerStack;

  // Show the dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## Solução de Problemas {/*troubleshooting*/}

### A Pilha de Proprietários é `null` {/*the-owner-stack-is-null*/}

A chamada de `captureOwnerStack` ocorreu fora de uma função controlada pelo React, por exemplo, em um callback de `setTimeout`, após uma chamada `fetch` ou em um manipulador de eventos DOM personalizado. Durante a renderização, Efeitos, manipuladores de eventos do React e manipuladores de erros do React (ex: `hydrateRoot#options.onCaughtError`), as Pilhas de Proprietários devem estar disponíveis.

No exemplo abaixo, clicar no botão registrará uma Pilha de Proprietários vazia porque `captureOwnerStack` foi chamado durante um manipulador de eventos DOM personalizado. A Pilha de Proprietários deve ser capturada anteriormente, por exemplo, movendo a chamada de `captureOwnerStack` para o corpo do Efeito.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Deveria chamar `captureOwnerStack` aqui.
    function handleEvent() {
      // Chamá-la em um manipulador de eventos DOM personalizado é tarde demais.
      // A Pilha de Proprietários será `null` neste ponto.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` não está disponível {/*captureownerstack-is-not-available*/}

`captureOwnerStack` é exportado apenas em builds de desenvolvimento. Será `undefined` em builds de produção. Se `captureOwnerStack` for usado em arquivos que são empacotados para produção e desenvolvimento, você deve acessá-lo condicionalmente a partir de uma importação de namespace.

```js
// Não use importações nomeadas de `captureOwnerStack` em arquivos que são empacotados para desenvolvimento e produção.
import {captureOwnerStack} from 'react';
// Use uma importação de namespace em vez disso e acesse `captureOwnerStack` condicionalmente.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
