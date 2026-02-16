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

* Although rendering is synchronous once it starts, `root.render(...)` is not. This means code after `root.render()` may run before any effects (`useLayoutEffect`, `useEffect`) of that specific render are fired. This is usually fine and rarely needs adjustment. In rare cases where effect timing matters, you can wrap `root.render(...)` in [`flushSync`](https://react.dev/reference/react-dom/flushSync) to ensure the initial render runs fully synchronously.
  
  ```js
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  // 🚩 The HTML will not include the rendered <App /> yet:
  console.log(document.body.innerHTML);
  ```

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

<<<<<<< HEAD
Isso pode parecer muito lento! Para resolver isso, você pode gerar o HTML inicial a partir de seus componentes [no servidor ou durante a build.](/reference/react-dom/server) Então seus visitantes podem ler texto, ver imagens e clicar em links antes que qualquer código JavaScript seja carregado. Recomendamos [usar um framework](/learn/start-a-new-react-project#full-stack-frameworks) que faça essa otimização imediatamente. Dependendo de quando ele é executado, isso é chamado de *server-side rendering (SSR)* ou *static site generation (SSG).*
=======
This can feel very slow! To solve this, you can generate the initial HTML from your components [on the server or during the build.](/reference/react-dom/server) Then your visitors can read text, see images, and click links before any of the JavaScript code loads. We recommend [using a framework](/learn/creating-a-react-app#full-stack-frameworks) that does this optimization out of the box. Depending on when it runs, this is called *server-side rendering (SSR)* or *static site generation (SSG).*
>>>>>>> 55a317d40781a0054a05a9f6c443ae0bd71f7d7e

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

### Error no logging em production {/*error-logging-in-production*/}

Por padrão, o React registra todos os erros no console. Para implementar seu próprio relatório de erros, você pode fornecer as opções opcionais de raiz do manipulador de erros `onUncaughtError`, `onCaughtError` e `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
import { createRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

A opção <CodeStep step={1}>onCaughtError</CodeStep> é uma função chamada com dois argumentos:

1. O <CodeStep step={2}>error</CodeStep> que foi gerado.
2. 2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Junto com `onUncaughtError` e `onRecoverableError`, você pode implementar seu próprio sistema de relatórios de erros:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // The specific implementation is up to you.
  // `console.error()` is only used for demonstration purposes.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
const root = createRoot(container, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
root.render(<App />);
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Trigger uncaught error
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Trigger caught error
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

</Sandpack>

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
