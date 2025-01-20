---
title: createRoot
---

<Intro>

`createRoot` permite que você crie uma raiz para exibir componentes do React dentro de um nó do DOM do navegador.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Chame `createRoot` para criar uma raiz React para exibir conteúdo dentro de um elemento do DOM do navegador.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

O React criará uma raiz para o `domNode` e assumirá o gerenciamento do DOM dentro dele. Depois de criar uma raiz, você precisará chamar [`root.render`](#root-render) para exibir um componente React dentro dela:

```js
root.render(<App />);
```

Um aplicativo totalmente construído com o React geralmente terá apenas uma chamada `createRoot` para seu componente raiz. Uma página que usa "espólios" de React para partes da página pode ter tantas raízes separadas quanto necessário.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `domNode`: Um [elemento DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) O React criará uma raiz para este elemento DOM e permitirá que você chame funções na raiz, como `render` para exibir conteúdo React renderizado.

* **opcional** `options`: Um objeto com opções para esta raiz React.

  * <CanaryBadge title="Este recurso está disponível apenas no canal Canary" /> **opcional** `onCaughtError`: Callback chamado quando o React captura um erro em uma Boundary de Erro. Chamado com o `error` capturado pela Boundary de Erro e um objeto `errorInfo` contendo o `componentStack`.
  * <CanaryBadge title="Este recurso está disponível apenas no canal Canary" /> **opcional** `onUncaughtError`: Callback chamado quando um erro é lançado e não capturado por uma Boundary de Erro. Chamado com o `error` que foi lançado e um objeto `errorInfo` contendo o `componentStack`.
  * **opcional** `onRecoverableError`: Callback chamado quando o React se recupera automaticamente de erros. Chamado com um `error` que o React lança e um objeto `errorInfo` contendo o `componentStack`. Alguns erros recuperáveis podem incluir a causa original do erro como `error.cause`.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar várias raízes na mesma página.

#### Retorna {/*returns*/}

`createRoot` retorna um objeto com dois métodos: [`render`](#root-render) e [`unmount`.](#root-unmount)

#### Ressalvas {/*caveats*/}
* Se seu aplicativo é renderizado no servidor, o uso de `createRoot()` não é suportado. Use [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) em vez disso.
* Você provavelmente terá apenas uma chamada `createRoot` em seu aplicativo. Se você usar um framework, ele pode fazer essa chamada por você.
* Quando você deseja renderizar um pedaço de JSX em uma parte diferente da árvore DOM que não é um filho do seu componente (por exemplo, um modal ou uma tooltip), use [`createPortal`](/reference/react-dom/createPortal) em vez de `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Chame `root.render` para exibir um pedaço de [JSX](/learn/writing-markup-with-jsx) ("nó React") no nó DOM do navegador da raiz React.

```js
root.render(<App />);
```

O React exibirá `<App />` na `root` e assumirá o gerenciamento do DOM dentro dela.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*root-render-parameters*/}

* `reactNode`: Um *nó React* que você deseja exibir. Isso geralmente será um pedaço de JSX como `<App />`, mas você também pode passar um elemento React construído com [`createElement()`](/reference/react/createElement), uma string, um número, `null` ou `undefined`.

#### Retorna {/*root-render-returns*/}

`root.render` retorna `undefined`.

#### Ressalvas {/*root-render-caveats*/}

* Na primeira vez que você chama `root.render`, o React irá limpar todo o conteúdo HTML existente dentro da raiz React antes de renderizar o componente React dentro dela.

* Se o nó DOM da sua raiz contiver HTML gerado pelo React no servidor ou durante a construção, use [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) em vez disso, que anexa os manipuladores de eventos ao HTML existente.

* Se você chamar `render` na mesma raiz mais de uma vez, o React atualizará o DOM conforme necessário para refletir o JSX mais recente que você passou. O React decidirá quais partes do DOM podem ser reutilizadas e quais precisam ser recriadas por meio de ["correspondê-lo"](/learn/preserving-and-resetting-state) com a árvore renderizada anteriormente. Chamar `render` novamente na mesma raiz é similar a chamar a função [`set`](/reference/react/useState#setstate) no componente raiz: o React evita atualizações desnecessárias no DOM.

---

### `root.unmount()` {/*root-unmount*/}

Chame `root.unmount` para destruir uma árvore renderizada dentro de uma raiz React.

```js
root.unmount();
```

Um aplicativo totalmente construído com o React geralmente não terá chamadas para `root.unmount`.

Isso é útil principalmente se o nó DOM da sua raiz React (ou qualquer um de seus ancestrais) puder ser removido do DOM por algum outro código. Por exemplo, imagine um painel de guia jQuery que remove guias inativas do DOM. Se uma guia for removida, tudo dentro dela (incluindo as raízes React dentro) também será removido do DOM. Nesse caso, você precisa informar ao React para "parar" de gerenciar o conteúdo da raiz removida chamando `root.unmount`. Caso contrário, os componentes dentro da raiz removida não saberão como liberar e liberar recursos globais como assinaturas.

Chamar `root.unmount` desmontará todos os componentes na raiz e "desanexará" o React do nó DOM da raiz, incluindo a remoção de quaisquer manipuladores de eventos ou estado na árvore.

#### Parâmetros {/*root-unmount-parameters*/}

`root.unmount` não aceita parâmetros.

#### Retorna {/*root-unmount-returns*/}

`root.unmount` retorna `undefined`.

#### Ressalvas {/*root-unmount-caveats*/}

* Chamar `root.unmount` desmontará todos os componentes na árvore e "desanexará" o React do nó DOM da raiz.

* Depois de chamar `root.unmount`, você não pode chamar `root.render` novamente na mesma raiz. Tentar chamar `root.render` em uma raiz desmontada lançará um erro "Não é possível atualizar uma raiz desmontada". No entanto, você pode criar uma nova raiz para o mesmo nó DOM após a raiz anterior desse nó ter sido desmontada.

---

## Uso {/*usage*/}

### Renderizando um aplicativo totalmente construído com React {/*rendering-an-app-fully-built-with-react*/}

Se seu aplicativo é totalmente construído com React, crie uma única raiz para todo o seu aplicativo.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Normalmente, você só precisa executar este código uma vez na inicialização. Ele irá:

1. Encontrar o <CodeStep step={1}>nó DOM do navegador</CodeStep> definido em seu HTML.
2. Exibir o <CodeStep step={2}>componente React</CodeStep> para seu aplicativo dentro dele.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Meu aplicativo</title></head>
  <body>
    <!-- Este é o nó DOM -->
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
      <h1>Olá, mundo!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Você clicou em mim {count} vezes
    </button>
  );
}
```

</Sandpack>

**Se seu aplicativo é totalmente construído com React, você não deve precisar criar mais raízes ou chamar [`root.render`](#root-render) novamente.**

A partir deste ponto, o React gerenciará o DOM de todo o seu aplicativo. Para adicionar mais componentes, [aninhá-los dentro do componente `App`.](/learn/importing-and-exporting-components) Quando você precisar atualizar a interface do usuário, cada um de seus componentes pode fazer isso [usando estado.](/reference/react/useState) Quando você precisar exibir conteúdo extra, como um modal ou uma tooltip fora do nó DOM, [renderize-o com um portal.](/reference/react-dom/createPortal)

<Note>

Quando seu HTML está vazio, o usuário vê uma página em branco até que o código JavaScript do aplicativo carregue e execute:

```html
<div id="root"></div>
```

Isso pode parecer muito lento! Para resolver isso, você pode gerar o HTML inicial a partir de seus componentes [no servidor ou durante a construção.](/reference/react-dom/server) Então, seus visitantes podem ler texto, ver imagens e clicar em links antes que qualquer código JavaScript carregue. Recomendamos [usar um framework](/learn/start-a-new-react-project#production-grade-react-frameworks) que faça essa otimização automaticamente. Dependendo de quando ele é executado, isso é chamado de *renderização no lado do servidor (SSR)* ou *geração de site estático (SSG).*

</Note>

<Pitfall>

**Aplicativos que usam renderização no servidor ou geração estática devem chamar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) em vez de `createRoot`.** O React então *hidrata* (reutiliza) os nós DOM do seu HTML em vez de destruí-los e recriá-los.

</Pitfall>

---

### Renderizando uma página parcialmente construída com React {/*rendering-a-page-partially-built-with-react*/}

Se sua página [não estiver totalmente construída com React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), você pode chamar `createRoot` várias vezes para criar uma raiz para cada peça de UI de nível superior gerenciada pelo React. Você pode exibir conteúdos diferentes em cada raiz chamando [`root.render`.](#root-render)

Aqui, dois diferentes componentes React são renderizados em dois nós DOM definidos no arquivo `index.html`:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>Meu aplicativo</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Este parágrafo não é renderizado pelo React (abra o index.html para verificar).</p>
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

Você também pode criar um novo nó DOM com [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) e adicioná-lo ao documento manualmente.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Você pode adicioná-lo em qualquer lugar no documento
```

Para remover a árvore React do nó DOM e limpar todos os recursos usados por ela, chame [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Isso é útil principalmente se seus componentes React estiverem dentro de um aplicativo escrito em um framework diferente.

---

### Atualizando um componente raiz {/*updating-a-root-component*/}

Você pode chamar `render` mais de uma vez na mesma raiz. Desde que a estrutura da árvore de componentes corresponda ao que foi renderizado anteriormente, o React [preservará o estado.](/learn/preserving-and-resetting-state) Note como você pode digitar na entrada, o que significa que as atualizações a partir de chamadas repetidas de `render` a cada segundo neste exemplo não são destrutivas:

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
      <h1>Olá, mundo! {counter}</h1>
      <input placeholder="Digite algo aqui" />
    </>
  );
}
```

</Sandpack>

É incomum chamar `render` várias vezes. Normalmente, seus componentes irão [atualizar o estado](/reference/react/useState) em vez disso.

### Mostrar um diálogo para erros não capturados {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onUncaughtError` está disponível apenas na última versão Canary do React.

</Canary>

Por padrão, o React registrará todos os erros não capturados no console. Para implementar seu próprio relatório de erros, você pode fornecer a opção raiz opcional `onUncaughtError`:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Erro não capturado',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

A <CodeStep step={1}>onUncaughtError</CodeStep> opção é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que foi lançado.
2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Você pode usar a opção de raiz `onUncaughtError` para exibir diálogos de erro:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu aplicativo</title>
</head>
<body>
<!--
  Diálogo de erro em HTML bruto
  uma vez que um erro no aplicativo React pode travar.
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
  <h4 class="mb-0">Pilha de chamadas:</h4>
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
  <h3 id="error-not-dismissible">Este erro não é descartável.</h3>
</div>
<!-- Este é o nó DOM -->
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
  
  // Defina o título
  errorTitle.innerText = title;
  
  // Exiba a mensagem e o corpo do erro
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Exiba a pilha do componente
  errorComponentStack.innerText = componentStack;

  // Exiba a pilha de chamadas
  // Como já exibimos a mensagem, remova-a, e a primeira linha de Erro:.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Exiba a causa, se disponível
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Exiba o botão fechar, se descartável
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Mostre o diálogo
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Capturado", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Não Capturado", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erro Recuperável", error, componentStack,  dismissable: true });
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
      <span>Este erro mostra o diálogo de erro:</span>
      <button onClick={() => setThrowError(true)}>
        Lançar erro
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>


### Exibindo erros de Boundary de Erro {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError` está disponível apenas na última versão Canary do React.

</Canary>

Por padrão, o React registrará todos os erros capturados por uma Boundary de Erro em `console.error`. Para substituir esse comportamento, você pode fornecer a opção raiz opcional `onCaughtError` para lidar com erros capturados por uma [Boundary de Erro](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Erro Capturado',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

A <CodeStep step={1}>onCaughtError</CodeStep> opção é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que foi capturado pela boundary.
2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Você pode usar a opção de raiz `onCaughtError` para exibir diálogos de erro ou filtrar erros conhecidos do registro:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu aplicativo</title>
</head>
<body>
<!--
  Diálogo de erro em HTML bruto
  uma vez que um erro no aplicativo React pode travar.
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
  <h4 class="mb-0">Pilha de chamadas:</h4>
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
  <h3 id="error-not-dismissible">Este erro não é descartável.</h3>
</div>
<!-- Este é o nó DOM -->
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

  // Defina o título
  errorTitle.innerText = title;

  // Exiba a mensagem e o corpo do erro
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Exiba a pilha do componente
  errorComponentStack.innerText = componentStack;

  // Exiba a pilha de chamadas
  // Como já exibimos a mensagem, remova-a, e a primeira linha de Erro:.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Exiba a causa, se disponível
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Exiba o botão fechar, se descartável
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Mostre o diálogo
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Capturado", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Não Capturado", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erro Recuperável", error, componentStack,  dismissable: true });
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
        <span>Este erro não mostrará o diálogo de erro:</span>
        <button onClick={handleKnown}>
          Lançar erro conhecido
        </button>
        <span>Este erro mostrará o diálogo de erro:</span>
        <button onClick={handleUnknown}>
          Lançar erro desconhecido
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Boundary de Erro</h3>
      <p>Algo deu errado.</p>
      <button onClick={resetErrorBoundary}>Redefinir</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Erro conhecido')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Exibindo um diálogo para erros recuperáveis {/*displaying-a-dialog-for-recoverable-errors*/}

O React pode automaticamente renderizar um componente uma segunda vez para tentar se recuperar de um erro lançado na renderização. Se bem-sucedido, o React registrará um erro recuperável no console para notificar o desenvolvedor. Para substituir esse comportamento, você pode fornecer a opção raiz opcional `onRecoverableError`:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Erro Recuperável',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

A <CodeStep step={1}>onRecoverableError</CodeStep> opção é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que o React lança. Alguns erros podem incluir a causa original como <CodeStep step={3}>error.cause</CodeStep>. 
2. Um objeto <CodeStep step={4}>errorInfo</CodeStep> que contém o <CodeStep step={5}>componentStack</CodeStep> do erro.

Você pode usar a opção de raiz `onRecoverableError` para exibir diálogos de erro:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu aplicativo</title>
</head>
<body>
<!--
  Diálogo de erro em HTML bruto
  uma vez que um erro no aplicativo React pode travar.
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
  <h4 class="mb-0">Pilha de chamadas:</h4>
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
  <h3 id="error-not-dismissible">Este erro não é descartável.</h3>
</div>
<!-- Este é o nó DOM -->
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

  // Defina o título
  errorTitle.innerText = title;

  // Exiba a mensagem e o corpo do erro
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Exiba a pilha do componente
  errorComponentStack.innerText = componentStack;

  // Exiba a pilha de chamadas
  // Como já exibimos a mensagem, remova-a, e a primeira linha de Erro:.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Exiba a causa, se disponível
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Exiba o botão fechar, se descartável
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Mostre o diálogo
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Capturado", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Erro Não Capturado", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Erro Recuperável", error, componentStack,  dismissable: true });
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
        <p>Como se recuperou, nenhuma Boundary de Erro foi exibida, mas <code>onRecoverableError</code> foi usado para mostrar um diálogo de erro.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Boundary de Erro</h3>
      <p>Algo deu errado.</p>
    </div>
  );
}

function Throw({error}) {
  // Simula uma mudança de valor externo durante a renderização concorrente.
  errorThrown = true;
  foo.bar = 'baz';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>


---
## Solução de Problemas {/*troubleshooting*/}

### Eu criei uma raiz, mas nada é exibido {/*ive-created-a-root-but-nothing-is-displayed*/}

Certifique-se de que você não esqueceu de realmente *renderizar* seu aplicativo na raiz:

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

Para corrigir, passe as opções da raiz para `createRoot(...)`, não para `root.render(...)`:
```js {2,5}
// 🚩 Errado: root.render só aceita um argumento.
root.render(App, {onUncaughtError});

// ✅ Correto: passe opções para createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### Estou recebendo um erro: "O contêiner de destino não é um elemento DOM" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Esse erro significa que o que você está passando para `createRoot` não é um nó DOM.

Se você não tem certeza do que está acontecendo, tente registrá-lo:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Por exemplo, se `domNode` for `null`, isso significa que [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) retornou `null`. Isso acontecerá se não houver um nó no documento com o ID dado no momento da sua chamada. Pode haver algumas razões para isso:

1. O ID que você está procurando pode diferir do ID que você usou no arquivo HTML. Verifique se não há erros de digitação!
2. A tag `<script>` do seu pacote não pode "ver" nenhum nó DOM que aparece *depois* dela no HTML.

Outra maneira comum de obter esse erro é escrever `createRoot(<App />)` em vez de `createRoot(domNode)`.

---

### Estou recebendo um erro: "Funções não são válidas como um filho do React." {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Esse erro significa que o que você está passando para `root.render` não é um componente React.

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

Se seu aplicativo é renderizado no servidor e inclui o HTML inicial gerado pelo React, você pode notar que criar uma raiz e chamar `root.render` exclui todo esse HTML e depois recria todos os nós DOM do zero. Isso pode ser mais lento, redefine o foco e as posições de rolagem, e pode perder outras entradas do usuário.

Aplicativos renderizados no servidor devem usar [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) em vez de `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Observe que sua API é diferente. Em particular, geralmente não haverá mais chamadas `root.render`.