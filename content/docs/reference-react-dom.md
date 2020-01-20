---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Se você carregar o React através de uma tag `<script>`, essas APIs de nível superior estão disponíveis globalmente em `ReactDOM`. Se você usa ES6 com npm, você pode escrever `import ReactDOM from 'react-dom'`. Se você usa ES5 com npm, você pode escrever `var ReactDOM = require('react-dom')`.

## Visão Geral {#overview}

O pacote `react-dom` provê métodos específicos para o DOM que podem ser usados no nível superior de sua aplicação como uma válvula de escape para sair do modelo do React se você precisar. A maioria de seus componentes não devem precisar deste módulo.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Suporte dos Navegadores {#browser-support}

O React suporta todos os navegadores populares, incluindo Internet Explorer 9 e acima, apesar de [precisar de alguns _polyfills_](/docs/javascript-environment-requirements.html) para navegadores antigos como IE 9 e IE 10.

> Nota
>
> Nós não temos suporte para navegadores antigos que não possuem suporte para métodos ES5. Mas, você pode descobrir que suas aplicações funcionam em navegadores antigos se _polyfills_ como [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) forem incluídos na página. Você estará por conta e risco se optar por seguir esse caminho.

* * *

## Referência {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Renderiza o um elemento do React no DOM no `container` fornecido e retorna uma [referência](/docs/more-about-refs.html) ao componente (ou retorna `null` para [componentes sem state](/docs/components-and-props.html#function-and-class-components))

Se o elemento do React foi previamente renderizado no `container`, isso vai realizar uma atualização nele e só alterar o DOM conforme necessário para refletir o elemento do React mais recente.

Se a _callback_ opcional for fornecida, ela será executada depois do componente ser renderizado ou atualizado.

> Nota:
>
> `ReactDOM.render()` controla o conteúdo do nó contêiner que você passa. Qualquer elemento do DOM que existe dentro será substituído na primeira chamada. As próximas chamadas usam o algoritmo de diferenciação do React para atualizações eficientes.
>
> `ReactDOM.render()` não modifica o nó contêiner (só modifica os filhos do contêiner). Pode ser possível inserir um componente em um nó já existente no DOM sem sobrescrever os filhos existentes.
>
> `ReactDOM.render()` atualmente retorna uma referência à instância raiz de `ReactComponent`. Porém, usar esse valor de retorno é legado
> e deve ser evitado porque versões futuras do React podem renderizar componentes assincronamente em alguns casos. Se você precisa de uma referência da instância raiz de `ReactComponent`, a solução preferida é de anexar uma
> [callback de ref](/docs/more-about-refs.html#the-ref-callback-attribute) para o elemento raiz.
>
> Usar `ReactDOM.render()` para hidratar um contêiner renderizado no servidor está deprecado e será removido no React 17. Ao invés disso, use [`hydrate()`](#hydrate).

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

O mesmo que [`render()`](#render), mas é usado para hidratar um contêiner cujo o conteúdo HTML foi renderizado pelo [`ReactDOMServer`](/docs/react-dom-server.html). O React tentará anexar _event listeners_ ao _markup_ existente.

O React espera que o conteúdo renderizado seja idêntico entre o servidor e o cliente. Ele pode consertar diferenças no conteúdo de texto, mas você deve tratar incompatibilidades como erros e ajustá-las. Em modo de desenvolvimento, o React avisa sobre incompatibilidades durante a hidratação. Não existem garantias de que diferenças entre atributos serão consertadas em caso de incompatibilidade. Isso é importante por questões de performance porque na maioria dos aplicativos, incompatibilidades são raras e, portanto, validar todo o _markup_ seria proibitivamente caro.

Se um único atributo de elemento ou conteúdo de texto é inevitavelmente diferente entre o servidor e o cliente (como por exemplo, um _timestamp_), você pode silenciar o aviso adicionando `suppressHydrationWarning={true}` ao elemento. Só funciona à um nível de profundidade, e destina-se a ser uma válvula de escape. Não use em excesso. A não ser que o conteúdo seja um texto, o React ainda não vai tentar consertar, então ele pode permanecer inconsistente até futuras atualizações.

Se você precisa propositalmente renderizar algo diferente no servidor e no cliente, você pode fazer uma renderização de dois passos. Componentes que renderizam algo diferente no cliente podem ler uma variável de state como `this.state.isClient`, que você pode atribuir o valor `true` no `componentDidMount()`. Dessa forma o passo de renderização inicial irá renderizar o mesmo conteúdo que o servidor, evitando incompatibilidades, mas um passo adicional acontecerá sincronamente logo após a hidratação. Note que essa abordagem fará seus componentes mais lentos porque eles tem de renderizar duas vezes, então use com cautela.

Lembre-se de estar atento à experiência de usuário em conexões lentas. O código JavaScript pode carregar significativamente depois da renderização inicial do HTML, então se você renderizar algo diferente no passo do cliente, a transição pode ser áspera. No entanto, se executado bem, pode ser benéfico renderizar uma "casca" da aplicação no servidor, e só mostrar ferramentas extras no lado do cliente. Para aprender como fazer isso sem encontrar problemas de incompatibilidade do markup, consulte a explicação do parágrafo anterior.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Remove do DOM um componente React já montado e limpa seus manipuladores de evento (_event handlers_) e estado (_state_). Se nenhum componente foi montado no contêiner, chamar essa função não faz nada. Retorna `true` se um componente foi desmontado e `false` se não tinha nenhum componente para desmontar.

* * *

### `findDOMNode()` {#finddomnode}

> Nota:
>
> `findDOMNode` é uma válvula de escape usada para acessar o nó subjacente do DOM. Na maioria dos casos, o uso dessa válvula de escape é desencorajado porque perfura a abstração do componente. [Foi deprecado em `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
Se esse componente foi montado no DOM, isso retorna o elemento do DOM nativo do navegador. Esse método é útil para ler valores fora do DOM, como valores de campos de formulário e realizar medições do DOM. **Na maioria dos casos, você pode anexar uma ref ao nó do DOM e evitar completamente o uso de `findDOMNode`.**

Quando um componente renderiza `null` ou `false`, `findDOMNode` retorna `null`. Quando um componente renderiza uma string, `findDOMNode` retorna um nó de texto do DOM contendo esse valor. A partir do React 16, um componente pode retornar um fragmento com múltiplos filhos, nesse caso `findDOMNode` irá retornar o nó do DOM correspondente ao primeiro filho não vazio.

> Nota:
>
> `findDOMNode` só funciona em componentes montados (ou seja, componentes que foram postos no DOM). Se você tentar chamar isso em um componente que não foi montado ainda (como chamar `findDOMNode()` no `render()` em um componente que ainda tem que ser criado) uma exceção será lançada.
>
> `findDOMNode` não pode ser usado em componentes funcionais.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Cria um portal. Portais provêm uma forma de [renderizar filhos em um nó do DOM que existe fora da hierarquia do componente do DOM](/docs/portals.html).
