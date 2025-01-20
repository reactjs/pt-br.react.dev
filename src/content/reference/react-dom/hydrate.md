---
title: hydrate
---

<Deprecated>

Esta API será removida em uma futura versão principal do React.

No React 18, `hydrate` foi substituído por [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Usar `hydrate` no React 18 avisará que seu aplicativo se comportará como se estivesse rodando React 17. Saiba mais [aqui.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` permite que você exiba componentes React dentro de um nó DOM do navegador cujo conteúdo HTML foi gerado anteriormente por [`react-dom/server`](/reference/react-dom/server) no React 17 e versões anteriores.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

Chame `hydrate` no React 17 e versões anteriores para "anexar" o React ao HTML existente que já foi renderizado pelo React em um ambiente de servidor.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

O React se anexará ao HTML que existe dentro do `domNode` e assumirá o gerenciamento do DOM dentro dele. Um aplicativo completamente construído com React geralmente terá apenas uma chamada `hydrate` com seu componente raiz.

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: O "nó React" usado para renderizar o HTML existente. Isso geralmente será um trecho de JSX como `<App />`, que foi renderizado com um método do `ReactDOM Server`, como `renderToString(<App />)` no React 17.

* `domNode`: Um [elemento DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) que foi renderizado como o elemento raiz no servidor.

* **opcional**: `callback`: Uma função. Se passada, o React a chamará após seu componente ser hidratado.

#### Returns {/*returns*/}

`hydrate` retorna null.

#### Caveats {/*caveats*/}
* `hydrate` espera que o conteúdo renderizado seja idêntico ao conteúdo renderizado no servidor. O React pode corrigir diferenças no conteúdo de texto, mas você deve tratar discrepâncias como erros e corrigi-las.
* No modo de desenvolvimento, o React avisa sobre discrepâncias durante a hidratação. Não há garantias de que as diferenças de atributo serão corrigidas em caso de discrepâncias. Isso é importante por razões de desempenho, pois na maioria dos aplicativos, discrepâncias são raras, e assim validar toda a marcação seria proibitivamente caro.
* Você provavelmente terá apenas uma chamada `hydrate` em seu aplicativo. Se você usar um framework, ele pode fazer essa chamada por você.
* Se seu aplicativo for renderizado no cliente sem nenhum HTML já renderizado, usar `hydrate()` não é suportado. Use [render()](/reference/react-dom/render) (para React 17 e versões anteriores) ou [createRoot()](/reference/react-dom/client/createRoot) (para React 18+) em vez disso.

---

## Usage {/*usage*/}

Chame `hydrate` para anexar um <CodeStep step={1}>componente React</CodeStep> em um <CodeStep step={2}>nó DOM do navegador renderizado no servidor</CodeStep>.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

Usar `hydrate()` para renderizar um aplicativo apenas do lado do cliente (um aplicativo sem HTML renderizado no servidor) não é suportado. Use [`render()`](/reference/react-dom/render) (no React 17 e versões anteriores) ou [`createRoot()`](/reference/react-dom/client/createRoot) (no React 18+) em vez disso.

### Hydrating server-rendered HTML {/*hydrating-server-rendered-html*/}

No React, "hidratação" é como o React "anexa" ao HTML existente que já foi renderizado pelo React em um ambiente de servidor. Durante a hidratação, o React tentará anexar manipuladores de eventos à marcação existente e assumir a renderização do aplicativo no cliente.

Em aplicativos completamente construídos com React, **você geralmente hidratará apenas um "raiz", uma vez na inicialização de todo o seu aplicativo**.

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir de App por react-dom/server.
-->
<div id="root"><h1>Olá, mundo!</h1></div>
```

```js src/index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Olá, mundo!</h1>;
}
```

</Sandpack>

Normalmente você não deve precisar chamar `hydrate` novamente ou chamá-lo em mais lugares. A partir desse ponto, o React estará gerenciando o DOM da sua aplicação. Para atualizar a interface do usuário, seus componentes [usarão estado.](/reference/react/useState)

Para mais informações sobre hidratação, veja a documentação para [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot)

---

### Suppressing unavoidable hydration mismatch errors {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Se o atributo ou conteúdo de texto de um único elemento for inevitavelmente diferente entre o servidor e o cliente (por exemplo, um timestamp), você pode silenciar o aviso de discrepância de hidratação.

Para silenciar avisos de hidratação em um elemento, adicione `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir de App por react-dom/server.
-->
<div id="root"><h1>Data Atual: 01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Data Atual: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Isso funciona apenas um nível profundo e é destinado a ser uma válvula de escape. Não abuse disso. A menos que seja conteúdo de texto, o React ainda não tentará corrigi-lo, então pode permanecer inconsistente até futuras atualizações.

---

### Handling different client and server content {/*handling-different-client-and-server-content*/}

Se você precisa intencionalmente renderizar algo diferente no servidor e no cliente, pode fazer uma renderização em duas passagens. Componentes que renderizam algo diferente no cliente podem ler uma [variável de estado](/reference/react/useState) como `isClient`, que você pode definir como `true` em um [Effect](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  O conteúdo HTML dentro de <div id="root">...</div>
  foi gerado a partir de App por react-dom/server.
-->
<div id="root"><h1>É Servidor</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
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

Dessa forma, a passagem de renderização inicial renderizará o mesmo conteúdo que o servidor, evitando discrepâncias, mas uma passagem adicional ocorrerá de forma síncrona logo após a hidratação.

<Pitfall>

Essa abordagem torna a hidratação mais lenta porque seus componentes precisam renderizar duas vezes. Esteja ciente da experiência do usuário em conexões lentas. O código JavaScript pode carregar significativamente mais tarde do que a renderização HTML inicial, então renderizar uma interface diferente imediatamente após a hidratação pode parecer abrupto para o usuário.

</Pitfall>