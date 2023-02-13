---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

O pacote `react-dom` fornece métodos específicos do DOM que podem ser usados ​​no nível superior do seu aplicativo e como uma saída de escape para sair do modelo React, se necessário.

```js
import * as ReactDOM from 'react-dom';
```

Se você usar ES5 com npm, poderá escrever:

```js
var ReactDOM = require('react-dom');
```

O pacote `react-dom` também fornece módulos específicos para aplicativos cliente e servidor:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)

## Visão Geral {#overview}

O pacote `react-dom` exporta estes métodos:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)

Esses métodos `react-dom` também são exportados, mas são considerados legados:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Nota:
>
> Ambos `render` e `hydrate` foram substituídos por novos [métodos de cliente](/docs/react-dom-client.html) no React 18. Esses métodos avisarão que seu aplicativo se comportará como se estivesse executando o React 17 ( saiba mais [aqui](https://reactjs.org/link/switch-to-createroot)).

### Suporte dos Navegadores {#browser-support}

O React suporta todos os navegadores modernos, embora [alguns polyfills sejam necessários](/docs/javascript-environment-requirements.html) para versões mais antigas.

> Nota
>
> Não oferecemos suporte a navegadores mais antigos que não suportem métodos ES5 ou microtarefas, como o Internet Explorer. Você pode achar que seus aplicativos funcionam em navegadores mais antigos se polyfills como [es5-shim e es5-sham](https://github.com/es-shims/es5-shim) forem incluídos na página, mas você Você está sozinho se decidir seguir esse caminho.

## Referência {#reference}

### `createPortal()` {#createportal}

> Try the new React documentation for [`createPortal`](https://beta.reactjs.org/reference/react-dom/createPortal).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
createPortal(child, container)
```

Cria um portal. Os portais fornecem uma maneira de [processar filhos em um nó DOM que existe fora da hierarquia do componente DOM](/docs/portals.html).

### `flushSync()` {#flushsync}

> Try the new React documentation for [`flushSync`](https://beta.reactjs.org/reference/react-dom/flushSync).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
flushSync(callback)
```

Force o React a liberar todas as atualizações dentro do retorno de chamada fornecido de forma síncrona. Isso garante que o DOM seja atualizado imediatamente.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Nota:
>
> `flushSync` pode prejudicar significativamente o desempenho. Use moderadamente.
>
> `flushSync` pode forçar os limites suspensos pendentes a mostrar seu estado `fallback`.
>
> `flushSync` também pode executar efeitos pendentes e aplicar de forma síncrona quaisquer atualizações que eles contenham antes de retornar.
>
> `flushSync` também pode liberar atualizações fora do retorno de chamada quando necessário para liberar as atualizações dentro do retorno de chamada. Por exemplo, se houver atualizações pendentes de um clique, o React pode liberá-las antes de liberar as atualizações dentro do retorno de chamada.

## Referência herdada {#legacy-reference}
### `render()` {#render}

> Try the new React documentation for [`render`](https://beta.reactjs.org/reference/react-dom/render).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
render(element, container[, callback])
```

> Nota:
>
> `render` foi substituído por `createRoot` no React 18. Veja [createRoot](/docs/react-dom-client.html#createroot) para mais informações.

Renderiza um elemento React no DOM no `container` fornecido e retorna uma [referência](/docs/more-about-refs.html) para o componente (ou retorna `nulo` para [componentes sem estado](/docs/components -and-props.html#função-e-classe-componentes)).

Se o elemento do React foi previamente renderizado no `container`, isso vai realizar uma atualização nele e só alterar o DOM conforme necessário para refletir o elemento do React mais recente.

Se a _callback_ opcional for fornecida, ela será executada depois do componente ser renderizado ou atualizado.

> Nota:
>
>`render()` controla o conteúdo do nó do contêiner que você passa. Qualquer elemento DOM existente dentro dele é substituído quando chamado pela primeira vez. Chamadas posteriores usam o algoritmo de diferenciação DOM do React para atualizações eficientes.
>
> `render()` não modifica o nó do container (somente modifica os filhos do container). Pode ser possível inserir um componente em um nó DOM existente sem sobrescrever os filhos existentes.
>
> `render()` atualmente retorna uma referência à instância raiz `ReactComponent`. No entanto, usar esse valor de retorno é herdado
> e deve ser evitado porque versões futuras do React podem renderizar componentes de forma assíncrona em alguns casos. Se você precisar de uma referência à instância `ReactComponent` raiz, a solução preferida é anexar um
> [ref de retorno de chamada](/docs/refs-and-the-dom.html#callback-refs) para o elemento raiz.
>
> O uso de `render()` para hidratar um contêiner renderizado pelo servidor está obsoleto. Use [`hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) em vez disso.

* * *

### `hydrate()` {#hydrate}

> Try the new React documentation for [`hydrate`](https://beta.reactjs.org/reference/react-dom/hydrate).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
hydrate(element, container[, callback])
```

> Nota:
>
> `hydrate` foi substituído por `hydrateRoot` no React 18. Veja [hydrateRoot](/docs/react-dom-client.html#hydrateroot) para mais informações.

O mesmo que [`render()`](#render), mas é usado para hidratar um contêiner cujo conteúdo HTML foi renderizado por [`ReactDOMServer`](/docs/react-dom-server.html). O React tentará anexar ouvintes de evento à marcação existente.

O React espera que o conteúdo renderizado seja idêntico entre o servidor e o cliente. Ele pode consertar diferenças no conteúdo de texto, mas você deve tratar incompatibilidades como erros e ajustá-las. Em modo de desenvolvimento, o React avisa sobre incompatibilidades durante a hidratação. Não existem garantias de que diferenças entre atributos serão consertadas em caso de incompatibilidade. Isso é importante por questões de performance porque na maioria dos aplicativos, incompatibilidades são raras e, portanto, validar todo o _markup_ seria proibitivamente caro.

Se um único atributo de elemento ou conteúdo de texto é inevitavelmente diferente entre o servidor e o cliente (como por exemplo, um _timestamp_), você pode silenciar o aviso adicionando `suppressHydrationWarning={true}` ao elemento. Só funciona à um nível de profundidade, e destina-se a ser uma válvula de escape. Não use em excesso. A não ser que o conteúdo seja um texto, o React ainda não vai tentar consertar, então ele pode permanecer inconsistente até futuras atualizações.

Se você precisa propositalmente renderizar algo diferente no servidor e no cliente, você pode fazer uma renderização de dois passos. Componentes que renderizam algo diferente no cliente podem ler uma variável de state como `this.state.isClient`, que você pode atribuir o valor `true` no `componentDidMount()`. Dessa forma o passo de renderização inicial irá renderizar o mesmo conteúdo que o servidor, evitando incompatibilidades, mas um passo adicional acontecerá sincronamente logo após a hidratação. Note que essa abordagem fará seus componentes mais lentos porque eles tem de renderizar duas vezes, então use com cautela.

Lembre-se de estar atento à experiência de usuário em conexões lentas. O código JavaScript pode carregar significativamente depois da renderização inicial do HTML, então se você renderizar algo diferente no passo do cliente, a transição pode ser áspera. No entanto, se executado bem, pode ser benéfico renderizar uma "casca" da aplicação no servidor, e só mostrar ferramentas extras no lado do cliente. Para aprender como fazer isso sem encontrar problemas de incompatibilidade do markup, consulte a explicação do parágrafo anterior.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

> Try the new React documentation for [`unmountComponentAtNode`](https://beta.reactjs.org/reference/react-dom/unmountComponentAtNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
unmountComponentAtNode(container)
```

> Nota:
>
> `unmountComponentAtNode` foi substituído por `root.unmount()` no React 18. Veja [createRoot](/docs/react-dom-client.html#createroot) para mais informações.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

* * *

### `findDOMNode()` {#finddomnode}

<<<<<<< HEAD
> Nota:
=======
> Try the new React documentation for [`findDOMNode`](https://beta.reactjs.org/reference/react-dom/findDOMNode).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

> Note:
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e
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
