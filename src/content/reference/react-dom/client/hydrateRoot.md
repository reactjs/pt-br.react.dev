---
title: >-
  ```

  # hydrateRoot


  `hydrateRoot()` é uma API que permite renderizar um aplicativo React em um
  contêiner DOM que já contém o conteúdo renderizado pelo servidor. Ele anexa os
  manipuladores de eventos ao markup existente.


  ```js

  import { hydrateRoot } from 'react-dom/client';


  const root = document.getElementById('root');

  hydrateRoot(root, <App />);

  ```


  ## Referência


  ```js

  hydrateRoot(domNode, element, options?)

  ```


  Hidrata um aplicativo React em um contêiner DOM existente.


  ### Parâmetros


  *   `domNode`: Um nó DOM que foi renderizado pelo servidor.

  *   `element`: O elemento React que você deseja renderizar.

  *   `options`: Um objeto opcional com as seguintes propriedades:
      *   `onHydrated`: Uma função de callback que é chamada após a hidratação.
      *   `identifierPrefix`: Uma string prefixo que React usa para IDs gerados internamente. Útil se você tiver vários aplicativos React em uma mesma página. Deve ser único para cada aplicativo.

  ### Retorna


  `hydrateRoot()` retorna um objeto com dois métodos:


  *   `render()`: Renderiza o elemento React.

  *   `unmount()`: Desmonta a árvore renderizada e remove seus manipuladores de
  eventos.


  ### Observações


  *   `hydrateRoot()` é usado para hidratação do lado do cliente. Ele deve ser
  usado no lado do cliente, e não no lado do servidor.

  *   React tenta anexar manipuladores de eventos ao markup existente. Ele não
  gera novo markup. Se houver uma incompatibilidade entre o markup renderizado
  pelo servidor e o que React espera, React irá corrigi-lo e avisá-lo. Isso pode
  ser lento, então é importante garantir que o markup renderizado pelo servidor
  corresponda ao que é renderizado no cliente.

  *   Se o contêiner DOM contiver conteúdo que não foi renderizado pelo React,
  React irá deixá-lo intocado.

  *   Se você precisar atualizar a árvore renderizada, você pode chamar
  `root.render()`.

  *   Se você precisar desmontar a árvore renderizada, você pode chamar
  `root.unmount()`.

  ```
---
```markdown
<Intro>

`hydrateRoot` permite que você exiba componentes React dentro de um nó DOM do navegador cujo conteúdo HTML foi previamente gerado por [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Chame `hydrateRoot` para "anexar" o React ao HTML existente que já foi renderizado pelo React em um ambiente de servidor.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

O React se anexará ao HTML que existe dentro do `domNode` e assumirá o controle do gerenciamento do DOM dentro dele. Um aplicativo totalmente construído com React geralmente terá apenas uma chamada `hydrateRoot` com seu componente raiz.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `domNode`: Um [elemento DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Element) que foi renderizado como o elemento raiz no servidor.

* `reactNode`: O "nó React" usado para renderizar o HTML existente. Isso geralmente será um trecho de JSX como `<App />` que foi renderizado com um método `ReactDOM Server` como `renderToPipeableStream(<App />)`.

* **opcional** `options`: Um objeto com opções para esta raiz React.

  * **opcional** `onCaughtError`: Callback chamado quando o React captura um erro em um Error Boundary. Chamado com o `error` capturado pelo Error Boundary e um objeto `errorInfo` contendo o `componentStack`.
  * **opcional** `onUncaughtError`: Callback chamado quando um erro é lançado e não é capturado por um Error Boundary. Chamado com o `error` que foi lançado e um objeto `errorInfo` contendo o `componentStack`.
  * **opcional** `onRecoverableError`: Callback chamado quando o React se recupera automaticamente de erros. Chamado com o `error` que o React lança e um objeto `errorInfo` contendo o `componentStack`. Alguns erros recuperáveis podem incluir a causa original do erro como `error.cause`.
  * **opcional** `identifierPrefix`: Um prefixo de string que o React usa para IDs gerados por [`useId`.](/reference/react/useId) Útil para evitar conflitos ao usar várias raízes na mesma página. Deve ser o mesmo prefixo usado no servidor.

#### Retorna {/*returns*/}

`hydrateRoot` retorna um objeto com dois métodos: [`render`](#root-render) e [`unmount`.](#root-unmount)

#### Ressalvas {/*caveats*/}

* `hydrateRoot()` espera que o conteúdo renderizado seja idêntico ao conteúdo renderizado no servidor. Você deve tratar as incompatibilidades como erros e corrigi-los.
* No modo de desenvolvimento, o React avisa sobre incompatibilidades durante a hidratação. Não há garantias de que as diferenças de atributo serão corrigidas em caso de incompatibilidades. Isso é importante por motivos de desempenho, porque na maioria dos aplicativos, as incompatibilidades são raras e, portanto, validar toda a marcação seria proibitivamente caro.
* Você provavelmente terá apenas uma chamada `hydrateRoot` em seu aplicativo. Se você usar um framework, ele poderá fazer essa chamada por você.
* Se seu aplicativo for renderizado no cliente sem nenhum HTML já renderizado, o uso de `hydrateRoot()` não é compatível. Use [`createRoot()`](/reference/react-dom/client/createRoot) em vez disso.

---

### `root.render(reactNode)` {/*root-render*/}

Chame `root.render` para atualizar um componente React dentro de uma raiz React hidratada para um elemento DOM do navegador.

```js
root.render(<App />);
```

O React atualizará `<App />` na `root` hidratada.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*root-render-parameters*/}

* `reactNode`: Um "nó React" que você deseja atualizar. Isso geralmente será um trecho de JSX como `<App />`, mas você também pode passar um elemento React construído com [`createElement()`](/reference/react/createElement), uma string, um número, `null` ou `undefined`.

#### Retorna {/*root-render-returns*/}

`root.render` retorna `undefined`.

#### Ressalvas {/*root-render-caveats*/}

* Se você chamar `root.render` antes que a raiz termine a hidratação, o React limpará o conteúdo HTML existente renderizado no servidor e mudará toda a raiz para a renderização do cliente.

---

### `root.unmount()` {/*root-unmount*/}

Chame `root.unmount` para destruir uma árvore renderizada dentro de uma raiz React.

```js
root.unmount();
```

Um aplicativo totalmente construído com React geralmente não terá nenhuma chamada para `root.unmount`.

Isso é útil principalmente se o nó DOM da sua raiz React (ou qualquer um de seus ancestrais) puder ser removido do DOM por algum outro código. Por exemplo, imagine um painel de guias jQuery que remove guias inativas do DOM. Se uma guia for removida, tudo dentro dela (incluindo as raízes React dentro) também seria removido do DOM. Você precisa dizer ao React para "parar" de gerenciar o conteúdo da raiz removida chamando `root.unmount`. Caso contrário, os componentes dentro da raiz removida não serão limpos e liberarão recursos como assinaturas.

Chamar `root.unmount` desmontará todos os componentes na raiz e "desanexará" o React do nó DOM raiz, incluindo a remoção de quaisquer manipuladores de eventos ou estado na árvore.

#### Parâmetros {/*root-unmount-parameters*/}

`root.unmount` não aceita nenhum parâmetro.

#### Retorna {/*root-unmount-returns*/}

`root.unmount` retorna `undefined`.

#### Ressalvas {/*root-unmount-caveats*/}

* Chamar `root.unmount` desmontará todos os componentes na árvore e "desanexará" o React do nó DOM raiz.

* Depois de chamar `root.unmount`, você não pode chamar `root.render` novamente na raiz. Tentar chamar `root.render` em uma raiz desmontada lançará um erro "Não é possível atualizar uma raiz desmontada".

---
```

## Uso {/*usage*/}

### Hidratando HTML renderizado no servidor {/*hydrating-server-rendered-html*/}

Se o HTML do seu aplicativo foi gerado por [`react-dom/server`](/reference/react-dom/client/createRoot), você precisa *hidratá-lo* no cliente.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

Isso hidratará o HTML do servidor dentro do <CodeStep step={1}>nó DOM do navegador</CodeStep> com o <CodeStep step={2}>componente React</CodeStep> para seu aplicativo. Normalmente, você fará isso uma vez na inicialização. Se você usar um framework, ele poderá fazer isso nos bastidores para você.

Para hidratar seu aplicativo, o React "anexará" a lógica dos seus componentes ao HTML gerado inicialmente pelo servidor. A hidratação transforma o snapshot HTML inicial do servidor em um aplicativo totalmente interativo que é executado no navegador.

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir do App por react-dom/server.
-->
<div id="root"><h1>Olá, mundo!</h1><button>Você clicou em mim <!-- -->0<!-- --> vezes</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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

Você não deve precisar chamar `hydrateRoot` novamente ou chamá-lo em mais lugares. A partir deste ponto, o React estará gerenciando o DOM do seu aplicativo. Para atualizar a UI, seus componentes [usarão o estado](/reference/react/useState) em vez disso.

<Pitfall>

A árvore React que você passa para `hydrateRoot` precisa produzir **a mesma saída** que produziu no servidor.

Isso é importante para a experiência do usuário. O usuário passará algum tempo olhando para o HTML gerado pelo servidor antes que seu código JavaScript seja carregado. A renderização no servidor cria a ilusão de que o aplicativo carrega mais rápido, mostrando o snapshot HTML de sua saída. Mostrar repentinamente um conteúdo diferente quebra essa ilusão. É por isso que a saída da renderização do servidor deve corresponder à saída da renderização inicial no cliente.

As causas mais comuns que levam a erros de hidratação incluem:

* Espaços em branco extras (como quebras de linha) em torno do HTML gerado pelo React dentro do nó raiz.
* Usar verificações como `typeof window !== 'undefined'` em sua lógica de renderização.
* Usar APIs somente do navegador, como [`window.matchMedia`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/matchMedia) em sua lógica de renderização.
* Renderizar dados diferentes no servidor e no cliente.

O React se recupera de alguns erros de hidratação, mas **você deve corrigi-los como outros erros.** Na melhor das hipóteses, eles levarão a uma lentidão; na pior das hipóteses, os manipuladores de eventos podem ser anexados aos elementos errados.

</Pitfall>

---

### Hidratando um documento inteiro {/*hydrating-an-entire-document*/}

Aplicativos totalmente construídos com React podem renderizar o documento inteiro como JSX, incluindo a tag [`<html>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Meu aplicativo</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Para hidratar o documento inteiro, passe o global [`document`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/document) como o primeiro argumento para `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Suprimindo erros de incompatibilidade de hidratação inevitáveis {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Se o atributo ou conteúdo de texto de um único elemento for inevitavelmente diferente entre o servidor e o cliente (por exemplo, um timestamp), você poderá silenciar o aviso de incompatibilidade de hidratação.

Para silenciar os avisos de hidratação em um elemento, adicione `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir do App por react-dom/server.
-->
<div id="root"><h1>Data atual: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Data atual: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Isso só funciona em um nível de profundidade e tem a intenção de ser uma saída de emergência. Não use em excesso. O React **não** tentará corrigir o conteúdo de texto incompatível.

---

### Lidando com conteúdo diferente do cliente e do servidor {/*handling-different-client-and-server-content*/}

Se você intencionalmente precisar renderizar algo diferente no servidor e no cliente, poderá fazer uma renderização em duas passagens. Os componentes que renderizam algo diferente no cliente podem ler uma [variável de estado](/reference/react/useState) como `isClient`, que você pode definir como `true` em um [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir do App por react-dom/server.
-->
<div id="root"><h1>É Servidor</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'É Cliente' : 'É Servidor'}
    </h1>
  );
}
```

</Sandpack>

Dessa forma, a passagem de renderização inicial renderizará o mesmo conteúdo do servidor, evitando incompatibilidades, mas uma passagem adicional acontecerá de forma síncrona logo após a hidratação.

<Pitfall>

Essa abordagem torna a hidratação mais lenta porque seus componentes precisam renderizar duas vezes. Esteja atento à experiência do usuário em conexões lentas. O código JavaScript pode carregar significativamente mais tarde do que a renderização HTML inicial, portanto, renderizar uma UI diferente imediatamente após a hidratação também pode parecer chocante para o usuário.

</Pitfall>

---

### Atualizando um componente raiz hidratado {/*updating-a-hydrated-root-component*/}

Depois que a raiz terminar a hidratação, você pode chamar [`root.render`](#root-render) para atualizar o componente raiz do React. **Ao contrário de [`createRoot`](/reference/react-dom/client/createRoot), você normalmente não precisa fazer isso porque o conteúdo inicial já foi renderizado como HTML.**

Se você chamar `root.render` em algum momento após a hidratação e a estrutura da árvore de componentes corresponder ao que foi renderizado anteriormente, o React [preservará o estado.](/learn/preserving-and-resetting-state) Observe como você pode digitar na entrada, o que significa que as atualizações de chamadas `render` repetidas a cada segundo neste exemplo não são destrutivas:

<Sandpack>

```html public/index.html
<!--
  Todo o conteúdo HTML dentro de <div id="root">...</div> foi
  gerado renderizando <App /> com react-dom/server.
-->
<div id="root"><h1>Olá, mundo! <!-- -->0</h1><input placeholder="Digite algo aqui"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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

É incomum chamar [`root.render`](#root-render) em uma raiz hidratada. Normalmente, você [atualizará o estado](/reference/react/useState) dentro de um dos componentes.

### Registro de erros em produção {/*error-logging-in-production*/}

Por padrão, o React registrará todos os erros no console. Para implementar seu próprio relatório de erros, você pode fornecer as opções de raiz do manipulador de erros opcionais `onUncaughtError`, `onCaughtError` e `onRecoverableError`:

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
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

1. O <CodeStep step={2}>erro</CodeStep> que foi lançado.
2. Um objeto <CodeStep step={3}>errorInfo</CodeStep> que contém o <CodeStep step={4}>componentStack</CodeStep> do erro.

Junto com `onUncaughtError` e `onRecoverableError`, você pode implementar seu próprio sistema de relatório de erros:

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // A implementação específica depende de você.
  // `console.error()` é usado apenas para fins de demonstração.
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
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Lembre-se de remover essas opções no desenvolvimento para aproveitar
  // os manipuladores padrão do React ou implementar sua própria sobreposição para desenvolvimento.
  // Os manipuladores são especificados incondicionalmente aqui apenas para fins de demonstração.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
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
      return <h1>Algo deu errado.</h1>;
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
        Acionar erro não detectado
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Acionar erro detectado
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

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>Meu aplicativo</title>
</head>
<body>
<!--
  Usando propositalmente conteúdo HTML que difere do conteúdo renderizado no servidor para acionar erros recuperáveis.
-->
<div id="root">Conteúdo do servidor antes da hidratação.</div>
</body>
</html>
```
</Sandpack>

## Solução de problemas {/*troubleshooting*/}

### Estou recebendo um erro: "Você passou um segundo argumento para root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Um erro comum é passar as opções para `hydrateRoot` para `root.render(...)`:

<ConsoleBlock level="error">

Aviso: Você passou um segundo argumento para root.render(...) mas ele aceita apenas um argumento.

</ConsoleBlock>

Para corrigir, passe as opções de raiz para `hydrateRoot(...)`, não `root.render(...)`:
```js {2,5}
// 🚩 Errado: root.render aceita apenas um argumento.
root.render(App, {onUncaughtError});

// ✅ Correto: passe as opções para createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```