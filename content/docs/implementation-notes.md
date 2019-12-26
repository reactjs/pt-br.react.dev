---
id: implementation-notes
title: Notas de Implementação
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

Esta seção é um conjunto de notas de implementação para o [reconciliador de pilha](/docs/codebase-overview.html#stack-reconciler).

Ela é bastante técnica e assume um forte entendimento da API pública do React, assim como da sua divisão em núcleos, renderizadores e o próprio reconciliador. Se você não estiver muito familiarizado com o código do React, leia a [visão geral da base de código](/docs/codebase-overview.html) primeiro.

Também é pressuposto o entendimento da [diferença entre componentes React, suas instâncias e elementos](/blog/2015/12/18/react-components-elements-and-instances.html).

O reconciliador de pilha foi usado no React 15 e em versões anteriores. Está localizado em [src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Vídeo: Construindo React do zero {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) deu uma palestra sobre [construir React do zero](https://www.youtube.com/watch?v=_MAD4Oly9yg) que muito inspirou esse documento.

Tanto este texto quanto a palestra são simplificações da real base de código, então se familiarizar com os dois pode resultar em um entendimento melhor.

### Visão geral {#overview}

O reconciliador em si não possui uma API pública. [Renderizadores](/docs/codebase-overview.html#renderers) como o React DOM e React Native usam-no para atualizar a interface do usuário de acordo com os componentes React escritos pelo usuário.

### Montagem como um Processo Recursivo {#mounting-as-a-recursive-process}

Vamos considerar a primeira vez que você monta um componente:

```js
ReactDOM.render(<App />, rootEl);
```

O React DOM passará `<App />` para o reconciliador. Lembre-se que `<App />` é um elemento React, isto é, uma descrição *do quê* renderizar. Você pode pensar nele como um simples objeto:

```js
console.log(<App />);
// { type: App, props: {} }
```

O reconciliador irá verificar se `App` é uma classe ou uma função.

Se `App` for uma função, o reconciliador chamará `App(props)` para obter o elemento renderizado.

Se `App` for uma classe, o reconciliador instanciará `App` com `new App(props)`, chamará o método de ciclo de vida `componentWillMount()`, e por fim chamando o método render()` para obter o elemento renderizado.

De qualquer forma, o reconciliador saberá em que elemento o `App` foi "renderizado".

Esse processo é recursivo. `App` talvez seja renderizado para um `<Greeting />`, `Greeting` talvez seja renderizado para um `<Button />`, e assim por diante. O reconciliador irá “investigar” os componentes definidos pelo usuário recursivamente enquanto ele aprende para o quê cada um será renderizado.

Você pode imaginar esse processo como um pseudo-código:

```js
function isClass(type) {
  // Subclasses React.Component possuem essa flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Essa função recebe um elemento React (e.g. <App />)
// e retorna um DOM ou nó Nativo representando a árvore montada.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // Nós vamos determinar o elemento renderizado
  // executando o tipo como função
  // ou criando uma instância e chamando render().
  var renderedElement;
  if (isClass(type)) {
    // Componente de classe
    var publicInstance = new type(props);
    // Define as props
    publicInstance.props = props;
    // Chama o ciclo de vida se necessário
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Obtêm o elemento renderizado ao chamar render()
    renderedElement = publicInstance.render();
  } else {
    // Componente de função
    renderedElement = type(props);
  }

  // Esse processo é recursivo pois um componente pode
  // retornar um elemento com o tipo de outro componente.
  return mount(renderedElement);

  // Nota: essa implementação é incompleta e recorre infinitamente!
  // Ela só lida com elementos <App /> ou <Button />.
  // Ela não lida com elementos como <div /> ou <p /> ainda.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Nota:**
>
>Isso realmente *é* um pseudocódigo. Não é semelhante a implementação real. Causará um estouro de pilha porque não discutimos quando parar a recursão.

Recapitulando alguns conceitos chaves do exemplo acima:

* Os elementos do React são objetos simples que representam o tipo do componente (e.g. `App`) e as props.
* Componentes definidos pelo usuário (e.g. `App`) podem ser classes ou funções mas todos eles “se renderizam” a um elemento.
* "Montagem" é um processo recursivo que cria uma árvore DOM ou Nativa dado um elemento React de nível superior (e.g. `<App />`).

### Montando Elementos Hospedeiros {#mounting-host-elements}

Esse processo seria inútil se o resultado não fosse renderizar algo na tela.

Além dos componentes definidos pelo usuário ("compostos"), elementos React podem também representar componentes ("hospedeiros") para plataformas específicas. Por exemplo, `Button` pode retornar uma `<div />` no seu método render.

Se a propriedade `type` for uma string, estamos lidando com um elemento hospedeiro:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Não há código definido pelo usuário associado com elementos do tipo hospedeiro.

Quando o reconciliador encontra um elemento hospedeiro, ele permite que o renderizador cuide da montagem. Por exemplo, o React DOM criaria um nó do DOM.

Se o elemento hospedeiro possuir filhos, o reconciliador recursivamente os monta seguindo o mesmo algoritmo descrito acima. Não importa se os filhos são hospedeiros (como `<div><hr /></div>`) ou se são compostos (como `<div><Button /></div>`), ou os dois.

Os nós DOM produzidos pelos componentes filhos serão anexados ao nó DOM pai, e, recursivamente, a completa estrutura DOM será construída.

>**Nota:**
>
>O reconciliador em si não está ligado ao DOM. O exato resultado da montagem (por vezes chamada de "mount image" no código fonte) depende do renderizador, e pode ser um nó do DOM (React DOM), uma string (React DOM Server), ou um número representando uma view nativa (React Native).

Se fôssemos estender o código para lidar com elementos hospedeiros, ficaria assim:

```js
function isClass(type) {
  // Subclasses React.Component possuem essa flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// Essa função apenas lida com elementos do tipo composto.
// Por exemplo, ela lida com <App /> e <Button />, mas não com uma <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Componente de classe
    var publicInstance = new type(props);
    // Define as props
    publicInstance.props = props;
    // Chama o ciclo de vida se necessário
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Componente de função
    renderedElement = type(props);
  }

  // Isso é recursivo mas eventualmente chegaremos no fim da recursão quando
  // o elemento for o hospedeiro (e.g. <div />) ao invés de composto (e.g. <App />):
  return mount(renderedElement);
}

// Essa função apenas lida com elementos do tipo hospedeiro.
// Por exemplo, ela lida com <div /> e <p /> mas não com um <App />
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // Esse bloco de código não deveria estar no reconciliador.
  // Renderizadores diferentes podem inicializar nós diferentemente.
  // Por exemplo, React Native iria criar views de iOS ou Android.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Monta os filhos
  children.forEach(childElement => {
    // Filhos podem ser hospedeiros (e.g. <div />) ou compostos (e.g <Button />).
    // Também os montaremos recursivamente:
    var childNode = mount(childElement);

    // Essa linha de código também é específica do renderizador.
    // Ela seria diferente dependendo do renderizador:
    node.appendChild(childNode);
  });

  // Retorna o nó do DOM como resultado da montagem.
  // Aqui é onde a recursão acaba.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // Componentes definidos pelo usuário
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Componentes de plataformas específicas
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Isto funciona mas ainda está longe de como o reconciliador é realmente implementado. O ingrediente que falta é o suporte para atualizações.


### Introduzindo instâncias Internas {#introducing-internal-instances}
A característica principal do React é que você pode re-renderizar tudo, e ele não irá recriar o DOM ou resetar o estado.

```js
ReactDOM.render(<App />, rootEl);
// Deve reutilizar o DOM existente:
ReactDOM.render(<App />, rootEl);
```

Contudo, a nossa implementação acima apenas sabe como montar a árvore inicial. Ela não executa atualizações na árvore pois não armazena todas as informações necessárias, como todas as `publicInstance`s, ou quais nós do DOM correspondem a qual componente.

O código do reconciliador de pilha resolve isso fazendo a função `mount()` um método e a colocando em uma classe. Existem desvantagens para essa abordagem, e nos iremos na direção oposta na [atual reescrita do reconciliador](/docs/codebase-overview.html#fiber-reconciler). No entanto, é assim que funciona atualmente.

Ao invés de funções `mountHost` e `mountComposite` separadas, nós criaremos duas classes: `DOMComponent` e `CompositeComponent`.

Ambas as classes possuem um construtor aceitando o `element`, assim como um método `mount()` retornando o nó montado. Nós iremos trocar a função de nível superior `mount()` com uma _factory_ que instancia a classe correta.

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    return new CompositeComponent(element);
    // Componentes definidos pelo usuário
  } else if (typeof type === 'string') {
    // Componentes de plataformas específicas
    return new DOMComponent(element);
  }  
}
```

Primeiro, vamos considerar a implementação de `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // Para componentes compostos, exponha a instância da classe.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Componente de classe
      publicInstance = new type(props);
      // Define as props
      publicInstance.props = props;
      // Chama o ciclo de vida se necessário
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Componente de função
      publicInstance = null;
      renderedElement = type(props);
    }

    // Salva a instância pública
    this.publicInstance = publicInstance;

    // Instancia a instância interna filha de acordo com o elemento.
    // Seria algo como um DOMComponent para <div /> ou <p />,
    // e um CompositeComponent para <App /> ou <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Monta o output renderizado
    return renderedComponent.mount();
  }
}
```

Isso não é muito diferente da nossa implementação anterior de `mountComposite`, mas agora podemos salvar algumas informações, como `this.currentElement`, `this.renderedComponent`, e `this.publicInstance` , para usar durante atualizações.

Note que uma instância de `CompositeComponent` não é a mesma coisa que uma instância de um `element.type` fornecida pelo usuário. `CompositeComponent` é um detalhe de implementação do nosso reconciliador e nunca é exposto para o usuário. A classe definida pelo usuário é quem lê de `element.type` e `CompositeComponent` cria uma instância dela.

Para evitar confusão, nós vamos chamar instâncias de `CompositeComponent` e `DOMComponent` de "instâncias internas". Elas existem para que possamos associá-las a alguns dados de longa vida. Apenas o renderizador e o reconciliador sabem que elas existem.

Em contraste, nós chamamos uma instância de uma classe definida pelo usuário uma "instância pública". A instância pública é o que você vê como `this` no `render()` e outros métodos de seus componentes customizados.

A função `mountHost()`, refatorada para ser um método `mount()` na classe `DOMComponent`, também é familiar:

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // For DOM components, only expose the DOM node.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Cria e salva o nó
    var node = document.createElement(type);
    this.node = node;

    // Define os atributos
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Cria e salva os filhos contidos.
    // Cada um deles pode ser um DOMComponent ou um CompositeComponent
    // dependendo se o tipo do elemento é uma string ou uma função.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Coleta nos DOM retornados na montagem
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Retorna o nó do DOM como resultado da montagem
    return node;
  }
}
```

A diferença principal depois de refatorar `mountHost()` é que agora nós podemos deixar `this.node` e `this.renderedChildren` associados com a instância interna do componente DOM. Nós também os usaremos para aplicar atualizações não destrutivas no futuro.

Como resultado, cada instância interna, composta ou hospedeira, agora aponta para sua instância interna filha. Para auxiliar na visualização disso, se o componente de função `<App>` renderiza um componente de classe, e a classe `Button` renderiza a `<div>`, a árvore da instância interna ficaria assim:

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

No DOM você apenas veria a `<div>`. No entanto, a árvore da instância interna possui ambas instâncias internas: composta e hospedeira.

A instância interna composta precisa armazenar:

* O elemento atual.
* A instância pública se o tipo do elemento for uma classe.
* A instância interna única renderizada. Pode ser tanto um `DOMComponent` ou um `CompositeComponent`.

A instância interna hospedeira precisa armazenar:

* O elemento atual.
* O nó do DOM.
* Todas as instâncias internas filhas. Cada uma delas pode ser tanto um `DOMComponent` ou um `CompositeComponent`.

Se você está tendo dificuldades para imaginar como uma árvore de instâncias internas é estruturada em aplicações mais complexas, [React DevTools](https://github.com/facebook/react-devtools) pode te dar uma boa aproximação, pois instâncias hospedeiras são marcadas com cinza, e instâncias compostas com roxo:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Para completar essa refatoração, nós vamos introduzir a função que monta a árvore completa em um nó contêiner, assim como faz `ReactDOM.render()`. Ela retorna uma instância pública, também como `ReactDOM.render()` faz.

```js
function mountTree(element, containerNode) {
  // Create a instância interna de nível superior
  var rootComponent = instantiateComponent(element);

  // Monta o componente de nível superior no contêiner
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Retorna a instância pública que é provida
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Desmontando {#unmounting}

Agora que temos instâncias internas que possuem seus filhos e nós do DOM, podemos implementar a desmontagem. Para um componente composto, desmontar executa um método do ciclo de vida em recursão.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Chama o método de ciclo de vida se necessário
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Desmonta o componente renderizado
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

Para o `DOMComponent`, desmontar pede para que todo filho se desmonte:

```js
class DOMComponent {

  // ...

  unmount() {
    // Desmonta todos os filhos
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

Na prática, desmontar componentes DOM também remove os event listeners e limpa alguns caches, mas vamos pular esses detalhes.

Podemos agora adicionar uma nova função de alto nível chamada `unmountTree(containerNode)` que é semelhante a `ReactDOM.unmountComponentAtNode()`.

```js
function unmountTree(containerNode) {
  // Lê a instância interna de um nó do DOM:
  // (Isso ainda não funciona, nós vamos precisar mudar mountTree() para guarda-la)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Desmonta a árvore e limpa o contêiner
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Para que isso funcione, nós precisamos ler uma instância interna raiz de um nó do DOM. Nós vamos modificar `mountTree()` para adicionar a propriedade `_internalInstance` ao nó do DOM raiz. Nós também ensinaremos a `mountTree()` como destruir qualquer árvore existente para que ela possa ser chamada múltiplas vezes:

```js
function mountTree(element, containerNode) {
  // Destrói qualquer árvore existente
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Cria a instância interna de nível superior
  var rootComponent = instantiateComponent(element);

  // Monta o componente de nivel superior no contêiner
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Salva uma referência para a instância interna
  node._internalInstance = rootComponent;

  // Retorna a instância pública que é provida
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Agora, executando `unmountTree()` ou executando `mountTree()` repetidamente, removerá a árvore antiga e em seguida executa o método de ciclo de vida `componentWillUnmount()` nos componentes.

### Atualizando {#updating}

Na seção anterior, nós implementamos a desmontagem. Contudo, o React não seria muito útil se cada mudança de prop desmontasse e montasse a árvore toda. O objetivo do reconciliador é reutilizar instâncias existentes quando possível para preservar o DOM e o estado:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Deve reutilizar o DOM existente:
mountTree(<App />, rootEl);
```

Nós iremos estender esse contrato da instância interna com mais um método. Alem do `mount()` e `unmount()`, ambos `DOMComponent` e `CompositeComponent` vão implementar um novo método chamado `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Sua responsabilidade é fazer o que for necessário para atualizar o componente (e qualquer um de seus filhos) com a descrição dada pelo `nextElement`.

Essa é a parte geralmente descrita como "diff do DOM virtual" embora o que realmente acontece é que andamos pela árvore interna recursivamente e permitimos que cada instância receba uma atualização.

### Atualizando Componentes Compostos {#updating-composite-components}

Quando um componente composto recebe um novo elemento, nós executamos o método de ciclo de vida `componentWillUpdate()`.

Então re-renderizamos o componente com as novas props, e capturamos o próximo elemento renderizado:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Atualiza *o próprio* elemento
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Descobre qual é o próximo resultado do render()
    var nextRenderedElement;
    if (isClass(type)) {
      // Componente de classe
      // Chama o ciclo de vida se necessário
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Atualiza as props
      publicInstance.props = nextProps;
      // Re-renderiza
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Componente de função
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Após isso, nós podemos olhar para o `type` do elemento renderizado. Se o `type` não mudou desde a última renderização, o componente abaixo também pode ser atualizado.

Por exemplo, se retorna `<Button color="red" />` na primeira vez, e `<Button color="blue" />` na segunda vez, nós podemos apenas dizer a instância interna correspondente para receber (`receive()`) o segundo elemento:


```js
    // ...

    // Se o tipo do elemento renderizado não mudou
    // reutilize a instância existente do componente e retorne.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Contudo, se o próximo elemento renderizado possuir um `type` diferente do anterior, não podemos atualizar a instância interna. Um `<button>` não pode "se tornar" um `<input>`.

Nesse caso, temos que desmontar a instância interna existente e montar a nova correspondente ao tipo do elemento renderizado. Por exemplo, é isso que acontece quando um componente que previamente renderizava um `<button />` renderiza um `<input />`:

```js
    // ...

    // Se chegamos nesse ponto, nós precisamos desmontar o componente
    // montado anteriormente, montar o novo, e trocar seus nós.

    // Encontra o nó antigo pois será necessário trocá-lo
    var prevNode = prevRenderedComponent.getHostNode();

    // Desmonta o filho antigo e monta o novo
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Substitui a referência ao filho
    this.renderedComponent = nextRenderedComponent;

    // Substitui o nó antigo com o novo
    // Nota: isso é código específico do renderizador e
    // idealmente deveria viver fora do CompositeComponent
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Para resumir isso tudo, quando um componente composto recebe um novo elemento, ele pode ou não delegar a atualização a sua instância interna renderizada, ou a desmontar e montar uma nova em seu lugar.

Existe outra condição na qual um componente vai remontar ao invés de receber um elemento, e isso é quando a chave do elemento mudou. Nós não discutimos sobre como lidar com chaves nesse documento pois adicionaria mais complexidade a um tutorial já complexo.

Note que nós precisamos adicionar um método chamado `getHostNode()` ao contrato de uma instância interna para que ela possa localizar o nó específico da plataforma e o trocar durante a atualização. Sua implementação é bem direta para ambas as classes:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Peça ao componente renderizado para fornecê-lo.
    // Isso irá acessar recursivamente quaisquer elementos compostos.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Atualizando Componentes Hospedeiros {#updating-host-components}

Implementações de componentes hospedeiros, como a de `DOMComponent`, atualizam de maneira diferente. Quando recebem um elemento, é preciso atualizar a view específica da plataforma subjacente. No caso de React DOM, isso significa atualizar os atributos DOM:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove atributos antigos
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Define os próximos atributos.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Então, o componente hospedeiro precisa atualizar seus filhos. Diferentemente de componentes compostos, eles podem conter mais de um filho.

Neste simples exemplo, nós usamos um array de instâncias internas e iteramos sobre ele, atualizando ou trocando as instâncias internas, dependendo se o `type` recebido é igual ao `type` anterior. O verdadeiro reconciliador também leva a chave do elemento em conta e rastreia movimentos, além de inserções e deletes, mas omitiremos essa lógica.

Nós coletamos operações DOM feitas em nós filhos em uma lista para que possamos executá-las em lotes:

```js
    // ...

    // Esses são vetores de elementos React:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // Esses são vetores de instâncias internas:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // À medida que iteramos os filhos, adicionaremos operações ao vetor.
    var operationQueue = [];
 
    // Nota: a seção abaixo está extremamente simplificada!
    // Ela não lida com re-ordenações, filhos com furos, ou chaves.
    // Ela só existe para ilustrar o fluxo geral, não os detalhes.

    for (var i = 0; i < nextChildren.length; i++) {
      // Tenta obter uma instância interna existente para esse filho
      var prevChild = prevRenderedChildren[i];

      // Se não houver instâncias internas nesse índice,
      // um filho foi anexado até o fim. Cria uma nova instância
      // interna, a monta, e usa seu nó.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Grava que precisamos anexar um nó
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Nós podemos atualizar a instância apenas se o tipo do elemento for compatível.
      // Por exemplo, <Button size="small" /> pode ser atualizado para
      // <Button size="large" /> mas não para um <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // Se não podemos atualizar uma instância existente, temos que desmontá-la
      // e montar uma nova no seu lugar.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Lembre que precisamos trocar os nós.
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // Se pudermos atualizar uma instância interna existente,
      // deixe-a receber o próximo elemento e lidar com sua própria atualização.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finalmente, desmonte qualquer filho que não exista:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Grave que precisamos remover o nó
      operationQueue.push({type: 'REMOVE', node});
    }

    // Aponta a lista de elementos renderizados para a versão atualizada.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Como passo final, nós executamos as operações DOM. Novamente, o código do reconciliador real é mais complexo pois também envolve movimentos:

```js
    // ...

    // Processa a fila de operações.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

E isto é a atualização de componentes hospedeiros.

### Atualizações de Nível Superior {#top-level-updates}

Agora que ambos `CompositeComponent` e `DOMComponent` implementam o método `receive(nextElement)`, podemos mudar a função `mountTree()` de nível superior para que seja usada quando o tipo do elemento for o mesmo da última vez:

```js
function mountTree(element, containerNode) {
  // Verifica se há uma árvore existente
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // Se pudermos, reutilizamos o componente raiz existente
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Do contrário, desmonte a árvore existente.
    unmountTree(containerNode);
  }

  // ...

}
```

Agora executar mountTree() duas vezes com o mesmo tipo não é destrutivo:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reutiliza o DOM existente:
mountTree(<App />, rootEl);
```

Esse é o básico de como o React funciona internamente.

### O Que Omitimos {#what-we-left-out}

Esse documento é simples comparado com o código real. Existem alguns aspectos importantes que não abordamos:

* Componentes podem renderizar `null`, e o reconciliador pode lidar com "espaços vazios" em arrays e em resultados renderizados.

* O reconciliador também lê a chave de seus elementos, e a usa para estabelecer qual instância interna corresponde a qual elemento em um array. Muita da complexidade da implementação real do React está relacionado a isto.

* Além de classes de instância interna composta e hospedeira, existem também classes para componentes texto e componentes vazios. Eles representam nós textuais e os "espaços vazios" você obtém renderizando `null`.

* Renderizadores usam [injeção](/docs/codebase-overview.html#dynamic-injection) para passar a classe interna do host ao reconciliador. Por exemplo, o React DOM pede para o reconciliador usar `ReactDOMComponent` como a implementação da instância interna hospedeira.

* A lógica para atualizar a lista de filhos é extraído em um mixin chamado `ReactMultiChild` que é usada pela implementação da classe de instância interna hospedeira tanto no React DOM quanto no React Native.

* O Reconciliador também implementa suporte para `setState()` em elementos compostos. Múltiplas atualizações dentro de manipuladores de eventos são realizadas em uma só atualização.

* O reconciliador também lida com anexar e desanexar refs a componentes compostos e nós hospedeiros.

* Métodos de ciclo de vida são chamados após o DOM estar pronto, como `componentDidMount()` e `componentDidUpdate()`, são coletados em "filas de callback" e são executadas em um só lote.

* O React coloca informações sobre a atualização atual em um objeto interno chamado de "transação". Transações são úteis para observar a fila de métodos de ciclo de vida pendentes, o aninhamento do DOM atual para alertas e qualquer outra coisa que seja "global" a uma atualização específica. Transações também garantem que o React "limpe tudo" após atualizações. Por exemplo, a classe de transação provida pelo React DOM restaura a seleção de input após qualquer atualização.

### Mergulhando no Código {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) é onde o código como `mountTree()` e `unmountTree()` deste tutorial vive.  Ele cuida da montagem e desmontagem de componentes de nível superior. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) é o análogo para React Native.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) é o equivalente de `DOMComponent` neste tutorial. Ele implementa o componente de classe hospedeira para o renderizador React DOM.[`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) é o análogo para React Native.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) é o equivalente de `CompositeComponent` neste tutorial. Ele lida com a chamada de componentes definidos pelo usuário e manter seu estado.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contém o comutador que seleciona a correta classe de instância interna para construir um elemento. É equivalente a `instantiateComponent()` neste tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) é um wrapper com os métodos `mountComponent()`, `receiveComponent()` e `unmountComponent()`. Ele chama as implementações subjacentes nas instâncias internas, mas também inclui código que é compartilhado por todas as implementações de instâncias internas.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implementa a lógica para montar, atualizar e desmontar filhos de acordo com a chave de seus elementos.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implementa o processamento da fila de operações para inserções, exclusões e movimentações independentemente do renderizador.

* `mount()`, `receive()` e `unmount()` são chamados de `mountComponent()`, `receiveComponent()` e `unmountComponent()` na base de código React por razões legadas, mas eles recebem elementos.

* As propriedades nas instâncias internas começam com um sublinhado, e.g. `_currentElement`. Elas são consideradas como campos públicos de apenas leitura em toda a base de código.

### Direções Futuras {#future-directions}

O reconciliador de pilha tem limitações inerentes, como ser síncrono e incapaz de interromper trabalhos ou dividi-los em partes. Há um projeto em andamento no [novo Reconciliador Fiber](/docs/codebase-overview.html#fiber-reconciler) com uma [arquitetura completamente diferente](https://github.com/acdlite/react-fiber-architecture). No futuro, pretendemos substituir o reconciliador de pilha por ele, mas no momento está longe de estar completo.

### Próximos Passos {#next-steps}

Leia a [próxima seção](/docs/design-principles.html) para aprender sobre os princípios orientadores que usamos para o desenvolvimento do React.
