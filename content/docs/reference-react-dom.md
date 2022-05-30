---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Se você carregar o React através de uma tag `<script>`, essas APIs de nível superior estão disponíveis globalmente em `ReactDOM`. Se você usa ES6 com npm, você pode escrever `import ReactDOM from 'react-dom'`. Se você usa ES5 com npm, você pode escrever `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

## Visão Geral {#overview}

<<<<<<< HEAD
O pacote `react-dom` provê métodos específicos para o DOM que podem ser usados no nível superior de sua aplicação como uma válvula de escape para sair do modelo do React se você precisar. A maioria de seus componentes não devem precisar deste módulo.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Suporte dos Navegadores {#browser-support}

<<<<<<< HEAD
O React suporta todos os navegadores populares, incluindo Internet Explorer 9 e acima, apesar de [precisar de alguns _polyfills_](/docs/javascript-environment-requirements.html) para navegadores antigos como IE 9 e IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

> Nota
>
<<<<<<< HEAD
> Nós não temos suporte para navegadores antigos que não possuem suporte para métodos ES5. Mas, você pode descobrir que suas aplicações funcionam em navegadores antigos se _polyfills_ como [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) forem incluídos na página. Você estará por conta e risco se optar por seguir esse caminho.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

## Referência {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Renderiza o um elemento do React no DOM no `container` fornecido e retorna uma [referência](/docs/more-about-refs.html) ao componente (ou retorna `null` para [componentes sem state](/docs/components-and-props.html#function-and-class-components))
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

Se o elemento do React foi previamente renderizado no `container`, isso vai realizar uma atualização nele e só alterar o DOM conforme necessário para refletir o elemento do React mais recente.

Se a _callback_ opcional for fornecida, ela será executada depois do componente ser renderizado ou atualizado.

> Nota:
>
<<<<<<< HEAD
> `ReactDOM.render()` controla o conteúdo do nó contêiner que você passa. Qualquer elemento do DOM que existe dentro será substituído na primeira chamada. As próximas chamadas usam o algoritmo de diferenciação do React para atualizações eficientes.
>
> `ReactDOM.render()` não modifica o nó contêiner (só modifica os filhos do contêiner). Pode ser possível inserir um componente em um nó já existente no DOM sem sobrescrever os filhos existentes.
>
> `ReactDOM.render()` atualmente retorna uma referência à instância raiz de `ReactComponent`. Porém, usar esse valor de retorno é legado
> e deve ser evitado porque versões futuras do React podem renderizar componentes assincronamente em alguns casos. Se você precisa de uma referência da instância raiz de `ReactComponent`, a solução preferida é de anexar uma
> [callback de ref](/docs/refs-and-the-dom.html#callback-refs) para o elemento raiz.
>
> Usar `ReactDOM.render()` para hidratar um contêiner renderizado no servidor está deprecado e será removido no React 17. Ao invés disso, use [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
O mesmo que [`render()`](#render), mas é usado para hidratar um contêiner cujo o conteúdo HTML foi renderizado pelo [`ReactDOMServer`](/docs/react-dom-server.html). O React tentará anexar _event listeners_ ao _markup_ existente.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

O React espera que o conteúdo renderizado seja idêntico entre o servidor e o cliente. Ele pode consertar diferenças no conteúdo de texto, mas você deve tratar incompatibilidades como erros e ajustá-las. Em modo de desenvolvimento, o React avisa sobre incompatibilidades durante a hidratação. Não existem garantias de que diferenças entre atributos serão consertadas em caso de incompatibilidade. Isso é importante por questões de performance porque na maioria dos aplicativos, incompatibilidades são raras e, portanto, validar todo o _markup_ seria proibitivamente caro.

Se um único atributo de elemento ou conteúdo de texto é inevitavelmente diferente entre o servidor e o cliente (como por exemplo, um _timestamp_), você pode silenciar o aviso adicionando `suppressHydrationWarning={true}` ao elemento. Só funciona à um nível de profundidade, e destina-se a ser uma válvula de escape. Não use em excesso. A não ser que o conteúdo seja um texto, o React ainda não vai tentar consertar, então ele pode permanecer inconsistente até futuras atualizações.

Se você precisa propositalmente renderizar algo diferente no servidor e no cliente, você pode fazer uma renderização de dois passos. Componentes que renderizam algo diferente no cliente podem ler uma variável de state como `this.state.isClient`, que você pode atribuir o valor `true` no `componentDidMount()`. Dessa forma o passo de renderização inicial irá renderizar o mesmo conteúdo que o servidor, evitando incompatibilidades, mas um passo adicional acontecerá sincronamente logo após a hidratação. Note que essa abordagem fará seus componentes mais lentos porque eles tem de renderizar duas vezes, então use com cautela.

Lembre-se de estar atento à experiência de usuário em conexões lentas. O código JavaScript pode carregar significativamente depois da renderização inicial do HTML, então se você renderizar algo diferente no passo do cliente, a transição pode ser áspera. No entanto, se executado bem, pode ser benéfico renderizar uma "casca" da aplicação no servidor, e só mostrar ferramentas extras no lado do cliente. Para aprender como fazer isso sem encontrar problemas de incompatibilidade do markup, consulte a explicação do parágrafo anterior.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Remove do DOM um componente React já montado e limpa seus manipuladores de evento (_event handlers_) e estado (_state_). Se nenhum componente foi montado no contêiner, chamar essa função não faz nada. Retorna `true` se um componente foi desmontado e `false` se não tinha nenhum componente para desmontar.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f

* * *

### `findDOMNode()` {#finddomnode}

> Nota:
>
> `findDOMNode` é uma válvula de escape usada para acessar o nó subjacente do DOM. Na maioria dos casos, o uso dessa válvula de escape é desencorajado porque perfura a abstração do componente. [Foi deprecado em `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Se esse componente foi montado no DOM, isso retorna o elemento do DOM nativo do navegador. Esse método é útil para ler valores fora do DOM, como valores de campos de formulário e realizar medições do DOM. **Na maioria dos casos, você pode anexar uma ref ao nó do DOM e evitar completamente o uso de `findDOMNode`.**

Quando um componente renderiza `null` ou `false`, `findDOMNode` retorna `null`. Quando um componente renderiza uma string, `findDOMNode` retorna um nó de texto do DOM contendo esse valor. A partir do React 16, um componente pode retornar um fragmento com múltiplos filhos, nesse caso `findDOMNode` irá retornar o nó do DOM correspondente ao primeiro filho não vazio.

> Nota:
>
> `findDOMNode` só funciona em componentes montados (ou seja, componentes que foram postos no DOM). Se você tentar chamar isso em um componente que não foi montado ainda (como chamar `findDOMNode()` no `render()` em um componente que ainda tem que ser criado) uma exceção será lançada.
>
> `findDOMNode` não pode ser usado em componentes funcionais.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Cria um portal. Portais provêm uma forma de [renderizar filhos em um nó do DOM que existe fora da hierarquia do componente do DOM](/docs/portals.html).
=======
>>>>>>> d522a5f4a9faaf6fd314f4d15f1be65ca997760f
