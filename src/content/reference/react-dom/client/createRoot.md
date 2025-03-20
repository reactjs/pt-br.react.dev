---
title: createRoot
---

<Intro>

`createRoot` permite que você crie uma root para exibir componentes React dentro de um nó DOM do navegador.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Chame `createRoot` para criar uma root React para exibir conteúdo dentro de um elemento DOM do navegador.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

O React criará uma root para o `domNode` e assumirá o gerenciamento do DOM dentro dele. Depois que você tiver criado uma root, você precisa chamar [`root.render`](#root-render) para exibir um componente React dentro dele:

```js
root.render(<App />);
```

Um app totalmente construído com React geralmente terá apenas uma chamada `createRoot` para seu componente root. Uma página que usa "borrifos" de React para partes da página pode ter quantas roots separadas forem necessárias.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `domNode`: Um [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) O React criará uma root para este elemento DOM e permitirá que você chame funções na root, como `render` para exibir conteúdo React renderizado.

* **opcional** `options`: Um objeto com opções para esta root React.

  * **opcional** `onCaughtError`: Callback chamado quando o React detecta um erro em um Error Boundary. Chamado com o `error` detectado pelo Error Boundary e um objeto `errorInfo` contendo o `componentStack`.
  * **opcional** `onUncaughtError`: Callback chamado quando um erro é lançado e não é detectado por um Error Boundary. Chamado com o `error` que foi lançado e um objeto `errorInfo` contendo o `componentStack`.
  * **opcional** `onRecoverableError`: Callback chamado quando o React se recupera automaticamente de erros. Chamado com um `error` que o React lança e um objeto `errorInfo` contendo o `componentStack`. Alguns erros recuperáveis podem incluir a causa original do erro como `error.cause`.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar várias roots na mesma página.

#### Retorna {/*returns*/}

`createRoot` retorna um objeto com dois métodos: [`render`](#root-render) e [`unmount`.](#root-unmount)

#### Ressalvas {/*caveats*/}
* Se seu app for renderizado no servidor, o uso de `createRoot()` não será compatível. Use [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) em vez disso.
* Você provavelmente terá apenas uma chamada `createRoot` em seu app. Se você usar um framework, ele pode fazer essa chamada para você.
* Quando você quiser renderizar um trecho de JSX em uma parte diferente da árvore do DOM que não seja filho do seu componente (por exemplo, um modal ou uma dica de ferramenta (tooltip)), use [`createPortal`](/reference/react-dom/createPortal) em vez de `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Chame `root.render` para exibir um trecho de [JSX](/learn/writing-markup-with-jsx) ("React node") no nó DOM do navegador da root React.

```js
root.render(<App />);
```

O React exibirá `<App />` na `root` e assumirá o gerenciamento do DOM dentro dele.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*root-render-parameters*/}

* `reactNode`: Um *React node* que você deseja exibir. Isso geralmente será um trecho de JSX como `<App />`, mas você também pode passar um elemento React construído com [`createElement()`](/reference/react/createElement), uma string, um número, `null` ou `undefined`.


#### Retorna {/*root-render-returns*/}

`root.render` retorna `undefined`.

#### Ressalvas {/*root-render-caveats*/}

* Na primeira vez que você chama `root.render`, o React irá limpar todo o conteúdo HTML existente dentro da root React antes de renderizar o componente React nele.

* Se o nó DOM da sua root contiver HTML gerado pelo React no servidor ou durante a build, use [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) em vez disso, que anexa os manipuladores de eventos ao HTML existente.

* Se você chamar `render` na mesma root mais de uma vez, o React atualizará o DOM conforme necessário para refletir o último JSX que você passou. O React decidirá quais partes do DOM podem ser reutilizadas e quais precisam ser recriadas por meio de ["combinação"](/learn/preserving-and-resetting-state) com a árvore renderizada anteriormente. Chamar `render` na mesma root novamente é semelhante a chamar a função [`set` (/reference/react/useState#setstate) no componente root: o React evita atualizações desnecessárias do DOM.

---

### `root.unmount()` {/*root-unmount*/}

Chame `root.unmount` para destruir uma árvore renderizada dentro de uma root React.

```js
root.unmount();
```

Um app totalmente construído com React geralmente não terá nenhuma chamada para `root.unmount`.

Isso é útil principalmente se o nó DOM da sua root React (ou qualquer um de seus ancestrais) puder ser removido do DOM por algum outro código. Por exemplo, imagine um painel de abas jQuery que remove abas inativas do DOM. Se uma aba for removida, tudo dentro dela (incluindo as roots React dentro) também seria removido do DOM. Nesse caso, você precisa dizer ao React para "parar" de gerenciar o conteúdo da root removida chamando `root.unmount`. Caso contrário, os componentes dentro da root removida não saberão como limpar e liberar recursos globais, como assinaturas.

Chamar `root.unmount` desmontará todos os componentes na root e "desanexará" o React do nó DOM root, incluindo a remoção de quaisquer manipuladores de eventos ou estado na árvore.


#### Parâmetros {/*root-unmount-parameters*/}

`root.unmount` não aceita nenhum parâmetro.


#### Retorna {/*root-unmount-returns*/}

`root.unmount` retorna `undefined`.

#### Ressalvas {/*root-unmount-caveats*/}

* Chamar `root.unmount` desmontará todos os componentes na árvore e "desanexará" o React do nó DOM root.

* Depois que você chamar `root.unmount`, você não poderá chamar `root.render` novamente na mesma root. Tentar chamar `root.render` em uma root desmontada lançará um erro "Não é possível atualizar uma root desmontada". No entanto, você pode criar uma nova root para o mesmo nó DOM depois que a root anterior para esse nó tiver sido desmontada.

---

## Uso {/*usage*/}

### Renderizando um app totalmente construído com React {/*rendering-an-app-fully-built-with-react*/}

Se seu app for totalmente construído com React, crie uma única root para todo o seu app.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Normalmente, você só precisa executar este código uma vez na inicialização. Ele irá:

1. Encontrar o <CodeStep step={1}>nó DOM do navegador</CodeStep> definido no seu HTML.
2. Exibir o <CodeStep step={2}>componente React</CodeStep> para o seu app dentro.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

**Se seu app for totalmente construído com React, você não deverá precisar criar mais nenhuma root ou chamar [`root.render`](#root-render) novamente.**

A partir deste ponto, o React irá gerenciar o DOM de todo o seu app. Para adicionar mais componentes, [aninhá-los dentro do componente `App`.](/learn/importing-and-exporting-components) Quando você precisar atualizar a UI, cada um de seus componentes pode fazer isso [usando o state.](/reference/react/useState) Quando você precisar exibir conteúdo extra, como um modal ou uma dica de ferramenta (tooltip) fora do nó DOM, [renderize-o com um portal.](/reference/react-dom/createPortal)

<Note>

Quando seu HTML estiver vazio, o usuário verá uma página em branco até que o código JavaScript do app carregue e seja executado:

```html
<div id="root"></div>
```

Isso pode parecer muito lento! Para resolver isso, você pode gerar o HTML inicial a partir de seus componentes [no servidor ou durante a build.](/reference/react-dom/server) Então seus visitantes podem ler texto, ver imagens e clicar em links antes que qualquer código JavaScript seja carregado. Recomendamos [usar um framework](/learn/start-a-new-react-project#production-grade-react-frameworks) que faça essa otimização imediatamente. Dependendo de quando ele é executado, isso é chamado de *server-side rendering (SSR)* ou *static site generation (SSG).*

</Note>

<Pitfall>

**Apps que usam server rendering ou static generation devem chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) em vez de `createRoot`.** O React então *hidratará* (reutilizará) os nós DOM do seu HTML em vez de destruí-los e recriá-los.

</Pitfall>

---

### Renderizando uma página parcialmente construída com React {/*rendering-a-page-partially-built-with-react*/}

Se sua página [não for totalmente construída com React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), você pode chamar `createRoot` várias vezes para criar uma root para cada parte de UI de nível superior gerenciada pelo React. Você pode exibir conteúdo diferente em cada root chamando [`root.render`.](#root-render)

Aqui, dois componentes React diferentes são renderizados em dois nós DOM definidos no arquivo `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
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
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
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

Você também pode criar um novo nó DOM com [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and adicioná-lo ao documento manualmente.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Você pode adicioná-lo em qualquer lugar do documento
```

Para remover a árvore React do nó DOM e limpar todos os recursos usados por ela, chame [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Isso é útil principalmente se seus componentes React estiverem dentro de um app escrito em um framework diferente.

---

### Atualizando um componente root {/*updating-a-root-component*/}

Você pode chamar `render` mais de uma vez na mesma root. Contanto que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React irá [preservar o estado.](/learn/preserving-and-resetting-state) Observe como você pode digitar no input, o que significa que as atualizações de chamadas repetidas de `render` a cada segundo neste exemplo não são destrutivas:

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Não é comum chamar `render` várias vezes. Normalmente, seus componentes [atualizarão o state](/reference/react/useState) em vez disso.

### Mostrar uma caixa de diálogo para erros não detectados {/*show-a-dialog-for-uncaught-errors*/}

Por padrão, o React registrará todos os erros não detectados no console. Para implementar seu próprio relatório de erros, você pode fornecer a opção `onUncaughtError` opcional da root:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

A opção <CodeStep step={1}>onUncaughtError</CodeStep> é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>erro</CodeStep> que foi lançado.
2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Você pode usar a opção `onUncaughtError` da root para exibir caixas de diálogo de erro:

<Sandpack>

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
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
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

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>Este erro mostra a caixa de diálogo de erro:</span>
      <button onClick={() => setThrowError(true)}>
        Lançar erro
      </button>
    </div>
  );
}
```

</Sandpack>


### Exibindo erros de Error Boundary {/*displaying-error-boundary-errors*/}

Por padrão, o React irá registrar todos os erros capturados por um Error Boundary em `console.error`. Para substituir este comportamento, você pode fornecer a opção opcional `onCaughtError` na raiz para lidar com erros capturados por um [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

A opção <CodeStep step={1}>onCaughtError</CodeStep> é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que foi capturado pelo boundary.
2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Você pode usar a opção de raiz `onCaughtError` para exibir caixas de diálogo de erro ou filtrar erros conhecidos do registro:

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu app</title>
</head>
<body>
<!--
  Caixa de diálogo de erro em HTML bruto
  já que um erro no app React pode travar.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Este erro ocorreu em:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Causado por:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Fechar
  </button>
  <h3 id="error-not-dismissible">Este erro não pode ser dispensado.</h3>
</div>
<!-- Este é o nó do DOM -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
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

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Definir o título
  errorTitle.innerText = title;

  // Exibir mensagem de erro e corpo
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Exibir pilha de componentes
  errorComponentStack.innerText = componentStack;

  // Exibir a pilha de chamadas
  // Como já exibimos a mensagem, remova-a e a primeira linha Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Exibir a causa, se disponível
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Exibir o botão fechar, se dispensável
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Mostrar a caixa de diálogo
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>Este erro não mostrará a caixa de diálogo de erro:</span>
        <button onClick={handleKnown}>
          Lançar erro conhecido
        </button>
        <span>Este erro mostrará a caixa de diálogo de erro:</span>
        <button onClick={handleUnknown}>
          Lançar erro desconhecido
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Algo deu errado.</p>
      <button onClick={resetErrorBoundary}>Reiniciar</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Exibindo uma caixa de diálogo para erros recuperáveis {/*displaying-a-dialog-for-recoverable-errors*/}

O React pode renderizar automaticamente um componente pela segunda vez para tentar se recuperar de um erro lançado em render. Se for bem-sucedido, o React registrará um erro recuperável no console para notificar o desenvolvedor. Para substituir este comportamento, você pode fornecer a opção opcional `onRecoverableError` na raiz:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

A opção <CodeStep step={1}>onRecoverableError</CodeStep> é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que o React lança. Alguns erros podem incluir a causa original como <CodeStep step={3}>error.cause</CodeStep>. 
2. Um objeto <CodeStep step={4}>errorInfo</CodeStep> que contém o <CodeStep step={5}>componentStack</CodeStep> do erro.

Você pode usar a opção de raiz `onRecoverableError` para exibir caixas de diálogo de erro:

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu app</title>
</head>
<body>
<!--
  Caixa de diálogo de erro em HTML bruto
  já que um erro no app React pode travar.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">Este erro ocorreu em:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Causado por:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Fechar
  </button>
  <h3 id="error-not-dismissible">Este erro não pode ser dispensado.</h3>
</div>
<!-- Este é o nó do DOM -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
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

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Definir o título
  errorTitle.innerText = title;

  // Exibir mensagem de erro e corpo
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Exibir pilha de componentes
  errorComponentStack.innerText = componentStack;

  // Exibir a pilha de chamadas
  // Como já exibimos a mensagem, remova-a e a primeira linha Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Exibir a causa, se disponível
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Exibir o botão fechar, se dispensável
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Mostrar a caixa de diálogo
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug: Nunca faça isso. Isso forçará um erro.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>Este componente lançou um erro, mas se recuperou durante uma segunda renderização.</p>
        <p>Como se recuperou, nenhum Error Boundary foi exibido, mas <code>onRecoverableError</code> foi usado para mostrar uma caixa de diálogo de erro.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Algo deu errado.</p>
    </div>
  );
}

function Throw({error}) {
  // Simular uma alteração de valor externo durante a renderização concorrente.
  errorThrown = true;
  foo.bar = 'baz';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>


---
## Solução de problemas {/*troubleshooting*/}

### Eu criei uma raiz, mas nada é exibido {/*ive-created-a-root-but-nothing-is-displayed*/}

Certifique-se de não ter esquecido de *renderizar* seu app na raiz:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Até que você faça isso, nada é exibido.

---

### Estou recebendo um erro: "Você passou um segundo argumento para root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Um erro comum é passar as opções para `createRoot` para `root.render(...)`:

<ConsoleBlock level="error">

Aviso: Você passou um segundo argumento para root.render(...) mas ele só aceita um argumento.

</ConsoleBlock>

Para corrigir, passe as opções de raiz para `createRoot(...)`, não `root.render(...)`:
```js {2,5}
// 🚩 Errado: root.render aceita apenas um argumento.
root.render(App, {onUncaughtError});

// ✅ Correto: passe opções para createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Estou recebendo um erro: "O contêiner de destino não é um elemento DOM" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Este erro significa que o que você está passando para `createRoot` não é um nó DOM.

Se não tiver certeza do que está acontecendo, tente registrar:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Por exemplo, se `domNode` for `null`, isso significa que [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) retornou `null`. Isso acontecerá se não houver nenhum nó no documento com o ID fornecido no momento da sua chamada. Pode haver alguns motivos para isso:

1. O ID que você está procurando pode ser diferente do ID que você usou no arquivo HTML. Verifique se há erros de digitação!
2. A tag `<script>` do seu bundle não pode "ver" nenhum nó DOM que aparece *depois* dele no HTML.

Outra forma comum de obter este erro é escrever `createRoot(<App />)` em vez de `createRoot(domNode)`.

---

### Estou recebendo um erro: "Funções não são válidas como uma criança do React." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Este erro significa que o que você está passando para `root.render` não é um componente React.

Isso pode acontecer se você chamar `root.render` com `Component` em vez de `<Component />`:

```js {2,5}
// 🚩 Errado: App é uma função, não um Componente.
root.render(App);

// ✅ Correto: <App /> é um componente.
root.render(<App />);
```

Ou se você passar uma função para `root.render`, em vez do resultado de chamá-la:

```js {2,5}
// 🚩 Errado: createApp é uma função, não um componente.
root.render(createApp);

// ✅ Correto: chame createApp para retornar um componente.
root.render(createApp());
```

---

### Meu HTML renderizado no servidor é recriado do zero {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Se seu app for renderizado no servidor e incluir o HTML inicial gerado pelo React, você poderá notar que criar uma raiz e chamar `root.render` exclui todo esse HTML e, em seguida, recria todos os nós DOM do zero. Isso pode ser mais lento, redefine o foco e as posições de rolagem e pode perder outras entradas do usuário.

Apps renderizados no servidor devem usar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) em vez de `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Observe que sua API é diferente. Em particular, geralmente não haverá mais uma chamada `root.render`.
