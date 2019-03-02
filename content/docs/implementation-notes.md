---
id: implementation-notes
title: Implementation Notes
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

Essa seção faz parte de um conjunto de notas de implementação para o [stack reconciler](/docs/codebase-overview.html#stack-reconciler).

Ela é bastante técnica e assume um forte entendimento da API pública do React, assim como da sua divisão em núcleos, renderizadores e o reconciler. Se você não estiver muito familiarizado com o código do React, leia a [visão geral da base de código](/docs/codebase-overview.html) primeiro.

Também é assumido o entendimento da [diferença entre componentes React, suas instâncias e elementos](/blog/2015/12/18/react-components-elements-and-instances.html).

O stack reconciler foi usado no React 15 e até anteriormente. Esta localizado em[src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler).

### Video: Construindo React do zero {#video-building-react-from-scratch}

[Paul O'Shannessy](https://twitter.com/zpao) deu uma palestra sobre [construir React do zero](https://www.youtube.com/watch?v=_MAD4Oly9yg) que muito inspirou esse documento.

Tanto esse texto quanto a palestra são simplificações da verdadeira base de código, então se familiarizar com os dois pode resultar em um entendimento melhor.

### Visão geral {#overview}

O reconciler em si não possui uma API pública. [Renderizadores](/docs/codebase-overview.html#stack-renderers) como o React DOM e React Nativa o usam para atualizar a interface do usuário de acordo com os componentes React escritos pelo usuário.

### Montar como um Processo Recursivo {#mounting-as-a-recursive-process}

Vamos considerar a primeira vez que você monta um componente:

```js
ReactDOM.render(<App />, rootEl);
```

React DOM ira passar `<App />` para o reconciler. Lembre que `<App />` é um elemento React, isto é, uma descrição *do que* renderizar. Você pode pensar nele como um objeto simples: 

```js
console.log(<App />);
// { type: App, props: {} }
```

The reconciler will check if `App` is a class or a function.

Se `App` for uma funcao, o reconciler irá chamar `App(props)` para obter o elemento renderizado.

Se `App` for uma classe, o reconciler irá instanciar um  `App` com `new App(props)`, chamar o lifecycle method `componentWillMount()`, e então irá chamar o método render()` para obter o elemento renderizado.

Either way, the reconciler will learn the element `App` "rendered to".

Esse processo é recursivo. `App` talvez se renderize a um  `<Greeting />`, `Greeting` talvez se renderize a um `<Button />`, e assim em diante. O reconciler irá “perfurar” os componentes definidos pelo usuário recursivamente enquanto ele aprende ao que cada um se renderiza.

Você pode imaginar esse processo como um pseudo-código:

```js
function isClass(type) {
  // React.Component subclasses have this flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// This function takes a React element (e.g. <App />)
// and returns a DOM or Native node representing the mounted tree.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // We will determine the rendered element
  // by either running the type as function
  // or creating an instance and calling render().
  var renderedElement;
  if (isClass(type)) {
    // Component class
    var publicInstance = new type(props);
    // Set the props
    publicInstance.props = props;
    // Call the lifecycle if necessary
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Get the rendered element by calling render()
    renderedElement = publicInstance.render();
  } else {
    // Component function
    renderedElement = type(props);
  }

  // This process is recursive because a component may
  // return an element with a type of another component.
  return mount(renderedElement);

  // Note: this implementation is incomplete and recurses infinitely!
  // It only handles elements like <App /> or <Button />.
  // It doesn't handle elements like <div /> or <p /> yet.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**Note:**
>
>Isso realmente *é* um pseudocodigo. Nao eh semelhante a implementação real. Vai ser causado um stack overflow pois não discutimos quando parar a recursão.


Let's recap a few key ideas in the example above:

* Elementos do React são objetos planos que representam o tipo do componente (e.g. `App`) e o props.
* Componentes definidos pelo usuário (e.g. `App`) podem ser classes ou funções mas todos eles “se renderizam” a um elemento.
* "Montar" é um processo recursivo que cria uma árvore DOM ou Nativa dado um elemento React de alto nível (e.g. `<App />`).

### Montando Elementos Host {#mounting-host-elements}

Esse processo seria inutil se nao o resultado nao fosse renderizar algo na tela.

Em adicao aos componentes definidos pelo usuario ("compostos"), elementos React podem tambem representar componentes para plataformas especificas ("host"). Por exemplo, `Button` pode retornar um `<div />` do seu metodo render.

Se a propriedade `type` for uma string, estamos lidando com um elemento host:

```js
console.log(<div />);
// { type: 'div', props: {} }
```

Nao ha codigo definido pelo usuario associado com elementos host.

Quando o reconciler encontra um elemento host, ele permite que o renderizador cuide de o montar. Por exemplo, o React DOM criaria um no DOM.
When the reconciler encounters a host element, it lets the renderer take care of mounting it. For example, React DOM would create a DOM node.

Se o elemento host possuir filhos, o reconciler recursivamente os monta seguindo o mesmo algoritmo descrito acima. Nao importa se os filhos sao hosts (como `<div><hr /></div>`) ou se sao composite (como `<div><Button /></div>`), ou os dois.

Os nos DOM produzidos pelos componentes filhos serao anexados ao no DOM pai, e recursivamente, a completa estrutura DOM sera construida.

>**Note:**
>
>O reconciler em si nao esta ligado ao DOM. O exato resultado da montagem (por vezes chamada de "mount image" no codigo fonte) depende do renderizador, e pode ser um no DOM (React DOM), uma string (React DOM Server), ou um numero representando uma native view (React Nativa).

Se fossemos extender o codigo para lidar com elementos host, ficaria assim:

```js
function isClass(type) {
  // React.Component subclasses have this flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// This function only handles elements with a composite type.
// For example, it handles <App /> and <Button />, but not a <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Component class
    var publicInstance = new type(props);
    // Set the props
    publicInstance.props = props;
    // Call the lifecycle if necessary
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Component function
    renderedElement = type(props);
  }

  // This is recursive but we'll eventually reach the bottom of recursion when
  // the element is host (e.g. <div />) rather than composite (e.g. <App />):
  return mount(renderedElement);
}

// This function only handles elements with a host type.
// For example, it handles <div /> and <p /> but not an <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // This block of code shouldn't be in the reconciler.
  // Different renderers might initialize nodes differently.
  // For example, React Native would create iOS or Android views.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Mount the children
  children.forEach(childElement => {
    // Children may be host (e.g. <div />) or composite (e.g. <Button />).
    // We will also mount them recursively:
    var childNode = mount(childElement);

    // This line of code is also renderer-specific.
    // It would be different depending on the renderer:
    node.appendChild(childNode);
  });

  // Return the DOM node as mount result.
  // This is where the recursion ends.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

Isso esta funcionando mas ainda eh longe de como o reconciler esta realmente implementado. O ingrediente faltante eh o suporte para atualizacoes.


### Introduzindo Instancias Internas {#introducing-internal-instances}

A feature chave do React eh que voce pode rerenderizar tudo, e ele nao ira recriar o DOM ou resetar o estado.

```js
ReactDOM.render(<App />, rootEl);
// Should reuse the existing DOM:
ReactDOM.render(<App />, rootEl);
```

Contudo, nossa implementacao acima apenas sabe como montar a arvore inicial. Ela nao executa atualizacoes na arvore pois nao armazena todas as informacoes necessarias, como todas as `publicInstance`s, ou que nos DOM correspondem a qual componente.

O codigo do stack reconciler resolve isso fazendo a funcao `mount()` um metodo e o colocando em uma classe. Existem desvantagens para essa abordagem, e nos iremos na direcao oposta na [atual reescrita do reconciler.(/docs/codebase-overview.html#fiber-reconciler). No entanto, eh assim que funciona atualmente.

Ao inves de funcoes `mountHost` e `mountComposite` separadas, nos criaremos duas classes: `DOMComponent` e `CompositeComponent`.

Ambas classes possuem um construtor aceitando o `element`, assim como um metodo `mount()` retornando o codigo montado. Nos iremos trocar a funcao de alto nivel `mount()` com uma factory que instancia a classe correta.

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return new DOMComponent(element);
  }  
}
```

Primeiro, vamos considerar a implementacao de `CompositeComponent`:

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // For composite components, expose the class instance.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Component class
      publicInstance = new type(props);
      // Set the props
      publicInstance.props = props;
      // Call the lifecycle if necessary
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      publicInstance = null;
      renderedElement = type(props);
    }

    // Save the public instance
    this.publicInstance = publicInstance;

    // Instantiate the child internal instance according to the element.
    // It would be a DOMComponent for <div /> or <p />,
    // and a CompositeComponent for <App /> or <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Mount the rendered output
    return renderedComponent.mount();
  }
}
```

Isso nao eh muito diferente da nossa implementacao anterior de `mountComposite`, mas agora podemos salvar alguma informacao, como `this.currentElement`, `this.renderedComponent`, e `this.publicInstance` , para usar durante atualizacoes.

Note que uma instancia de `CompositeComponent` nao eh a mesma coisa que uma instance de um `element.type` fornecido pelo usuario. `CompositeComponent` eh um detalhe de implementacao do nosso reconciler, e nunca eh exposta para o usuario. A classe definida pelo usuario eh quem le de `element.type`, e `CompositeComponent` cria uma instancia dela.

Para evitar confusao, nos vamos chamar instancias de `CompositeComponent` e `DOMComponent` "instancias internas". Elas existem para que possamos as associar com alguns dados de longa vida. Apenas o renderizador e o reconciler sabem que elas existem.

Em contrate, nos chamamos uma instancia de uma classe definida pelo usuario uma "instancia publica". A instancia publica eh o que voce ve como `this` no `render()` e outros metodos de seus componentes customizados.

A funcao `mountHost()`, refatorada para ser um metodo `mount()` na classe `DOMComponent`, tambem eh familiar:

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

    // Create and save the node
    var node = document.createElement(type);
    this.node = node;

    // Set the attributes
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Create and save the contained children.
    // Each of them can be a DOMComponent or a CompositeComponent,
    // depending on whether the element type is a string or a function.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Collect DOM nodes they return on mount
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Return the DOM node as mount result
    return node;
  }
}
```

%%% A diferenca principal depois de refatorar de `mountHost()` eh que agora nos podemos deixar `this.node` e `this.renderedChildren` associados com a instancia interna do componente DOM. Nos tambem os usaremos para aplicar atualizacoes nao destrutivas no futuro.


Como resultado, cada instancia interna, composite ou host, agora aponta para sua instancia interna filha. Para auxiliar na visualizacao disso, se o componente de funcao `<App>` renderiza um componente de classe, e a classe `Button` renderiza a `<div>`, a arvore da instancia interna ficaria assim:

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

No DOM voce apenas veria a `<div>`. No entanto, a arvore da instancia interna possue ambas instancias internas: composite e host.

A instancia interna composite precisa armazenar:

* O elemento atual.
* A instancia publica se o tipo do elemento for uma classe.
* A unica instancia interna renderizada. Pode ser tanto um `DOMComponent` ou um `CompositeComponent`.

O instancia interna host precisa armazenar:

* O elemento atual.
* O no DOM.
* Todas as instancias internas filhas. Cada uma delas pode ser tanto um `DOMComponent` ou um `CompositeComponent`.

Se voce esta tendo dificuldades para imaginar como uma arvore de instancias internas  eh estruturada em aplicacoes mais complexas, [React DevTools](https://github.com/facebook/react-devtools) pode te dar uma boa aproximacao, pois instancias host sao marcadas com cinza, e instancias composite com roxo:

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

Para completar essa refatoracao, nos vamos introduzir a funcao que monta a arvore completa em um no container, assim como faz `ReactDOM.render()`. Ela retorna uma instancia publica, tambem como `ReactDOM.render()` faz.

```js
function mountTree(element, containerNode) {
  // Create the top-level internal instance
  var rootComponent = instantiateComponent(element);

  // Mount the top-level component into the container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Return the public instance it provides
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### Desmontando {#unmounting}

Agora que temos instancias internas que possuem seus filhos e nos DOM, podemos implementar o desmontar. Para um componente composite, desmontar chama um metodo do ciclo de vida e recursos.

```js
class CompositeComponent {

  // ...

  unmount() {
    // Call the lifecycle method if necessary
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Unmount the single rendered component
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

Para `DOMComponent`, desmontar pede para todo filho desmontar:

```js
class DOMComponent {

  // ...

  unmount() {
    // Unmount all the children
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

Na pratica, desmontar componentes DOM tambem remove os event listeners e limpa alguns caches, mas vamos pular essas detalhes.

Podemos agora adicionar uma nova funcao de alto nivel chamada `unmountTree(containerNode)` que eh similar a `ReactDOM.unmountComponentAtNode()`.

```js
function unmountTree(containerNode) {
  // Read the internal instance from a DOM node:
  // (This doesn't work yet, we will need to change mountTree() to store it.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Unmount the tree and clear the container
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

Para que isso funcione, nos precisamos ler uma instancia interna raiz de um no DOM. Nos vamos modificar `mountTree()` para adicionar a propriedade `_internalInstance` ao no DOM raiz. Nos tambem ensinaremos a `mountTree()` como destruir qualquer arvore existente para que ela possa ser chamada multiplas vezes:

```js
function mountTree(element, containerNode) {
  // Destroy any existing tree
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Create the top-level internal instance
  var rootComponent = instantiateComponent(element);

  // Mount the top-level component into the container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Save a reference to the internal instance
  node._internalInstance = rootComponent;

  // Return the public instance it provides
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

Agora, executar `unmountTree()` ou executar `mountTree()` repetidamente, remove a arvore antiga e executa o metodo de ciclo de vida `componentWillUnmount()` nos componentes.

### Atualizando {#updating}

Na secao anterior, nos implementamos o desmontar. Contudo, o React nao seria muito util se cada mudanca de prop desmontasse e montasse a arvore toda. O objetivo do reconciler eh reusar instancias existentes quando possivel para preserver o DOM e o estado:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Should reuse the existing DOM:
mountTree(<App />, rootEl);
```

Nos iremos extender nesso contrato da instancia interna com mais um metodo. Alem do `mount()` e `unmount()`, ambos `DOMComponent` e `CompositeComponent` vao implementar um novo metodo chamado `receive(nextElement)`:
We will extend our internal instance contract with one more method. In addition to `mount()` and `unmount()`, both `DOMComponent` and `CompositeComponent` will implement a new method called `receive(nextElement)`:

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

Sua responsabilidade eh fazer o que for necessario para atualizar o componente (e qualqer um de seus filhos) com a descricao dada pelo `nextElement`.

Essa eh a parte geralmente descrita como "diff do virtual DOM" embora o que realmente acontece eh que andamos pela arvore interna recursivamente e permitimos que cada instancia receba uma atualizacao.

### Atualizando elemento composite {#updating-composite-components}

Quando um componente composite recebe um novo elemento, nos rodamos o metodo de ciclo de vida `componentWillUpdate()`.

Entao rerenderizamos o componente com a nova props, e pegamos o proximo elemento renderizado:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Update *own* element
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Figure out what the next render() output is
    var nextRenderedElement;
    if (isClass(type)) {
      // Component class
      // Call the lifecycle if necessary
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Update the props
      publicInstance.props = nextProps;
      // Re-render
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Apos isso, nos podemos olhar para o `type` do elemento renderizado. Se o `type` nao mudou desde a ultima renderizacao, o componente abaixo tanto pode ser atualizado %%.

%% Por exemplo, se retornado `<Button color="red" />` na primeira vez, e `<Button color="blue" />` na segunda vez, nos podemos apenas dizer a instancia interna correspondente a `receive()` o proximo elemento:

For example, if it returned `<Button color="red" />` the first time, and `<Button color="blue" />` the second time, we can just tell the corresponding internal instance to `receive()` the next element:

```js
    // ...

    // If the rendered element type has not changed,
    // reuse the existing component instance and exit.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

Contudo, se o proximo elemento renderizado possuir um `type` diferente do anterior, nao podemos atualizar a instancia interna. Um `<button>` nao pode "se tornar" um `<input>`.

Nesse caso, temos que desmontar a instancia interna existente e monntar a nova correspondente ao tipo do elmento renderizado. Por exemplo, eh isso que acontece quando um componente que previamente renderizada um `<button />` renderiza um `<input />`:

```js
    // ...

    // If we reached this point, we need to unmount the previously
    // mounted component, mount the new one, and swap their nodes.

    // Find the old node because it will need to be replaced
    var prevNode = prevRenderedComponent.getHostNode();

    // Unmount the old child and mount a new child
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Replace the reference to the child
    this.renderedComponent = nextRenderedComponent;

    // Replace the old node with the new one
    // Note: this is renderer-specific code and
    // ideally should live outside of CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

Para resumir isso tudo, quando um componente composite recebe um novo elemento, ele pode ou nao delegar a atualizacao a sua instancia interna renderizada, ou a desmontar e montar uma nova em seu lugar.

Existe outra condicao na qual um componente vai remontar ao inves de receber um elemento, e isso eh quando a chave do elemento mudou. Nos nao discutimos sobre como lidar com chaves nesse documento pois adiciona mais complexidade a um tutorial ja complexo.

Note que nos precisamos adicionar um metodo chamado `getHostNode()` para a o contrato de uma instancia interna para que ela possa localizar o no platform-specific e o trocar durante a atualizacao. Sua implementacao eh bem direta para ambas as classes:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Ask the rendered component to provide it.
    // This will recursively drill down any composites.
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

### Atualizando Componentes Host {#updating-host-components}

Implementacoes de componentes host, como a de `DOMComponent`, atualizam de maneira diferente. Quando recebem um elemento, eh preciso atualizar a platform-specific view por de baixo. No caso de React DOM, isso significa atualizar os atributos DOM:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Entao, o componente host precisa atualizar seus filhos. Diferentemente de componentes composite, eles podem conter mais de um filho.

Nesse seguinte exemplo simplificado, nos usamos um array de instancias internas e iteramos sobre ele, atualizando ou trocando as instancias internas, dependendo se o `type` recebido eh igual ao `type` anterior. O verdadeiro reconciler tambem toma a chave do elemento em conta e rastreia movimentos, alem de insercoes e deletes, mas omitiremos essa logica.

Nos coletamos operacoes DOM nos filhos em uma lista para que possamos executa-las em lotes:

```js
    // ...

    // These are arrays of React elements:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // These are arrays of internal instances:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // As we iterate over children, we will add operations to the array.
    var operationQueue = [];

    // Note: the section below is extremely simplified!
    // It doesn't handle reorders, children with holes, or keys.
    // It only exists to illustrate the overall flow, not the specifics.

    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Record that we need to remove the node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

Como passo final, nos executamos as operacoes DOM. Novamente, o codigo do reconciler real eh mais complexo pois tambem envolve movimentos:

```js
    // ...

    // Process the operation queue.
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

E eh isso para atualizar componentes host.

### Atualizacoes de Alto Nivel {#top-level-updates}

Agora que ambos `CompositeComponent` e `DOMComponent` implementam o metodo `receive(nextElement)`, podemos mudar a funcao `mountTree()` de alto nivel para que seja usada quando o tipo do elemento for o mesmo da ultima vez:
Now that both `CompositeComponent` and `DOMComponent` implement the `receive(nextElement)` method, we can change the top-level `mountTree()` function to use it when the element `type` is the same as it was the last time:

```js
function mountTree(element, containerNode) {
  // Check for an existing tree
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // If we can, reuse the existing root component
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Otherwise, unmount the existing tree
    unmountTree(containerNode);
  }

  // ...

}
```

Agora chamar `mountTree()` duas vezes com o mesmo tipo nao eh destrutivo:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

Esse eh o basico de como o React funciona internamente.

### O Que Omitimos {#what-we-left-out}

Esse documento eh simples comparado com o codigo real. Existem alguns aspectos importantes que nao enderecamos:

* Componentes podem renderizar `null`, e o reconciler pode lidar "espacos vazios" em vetores e output renderizado.

* O reconciler tambem le a chave de seus elementos, e a usa para estabelecer qual instancia interna corresponde a qual elemento em um array. Muita da complexidade da implementacao real do React esta relacionado a isto.

* Alem da classe de instancia interna composite e host, existem tambem classes para componentes texto e componentes vazios. Eles representam nos textuais e os "espacos vazios" voce consegue por renderizar `null`.

* Renderizadores usam [injecao](/docs/codebase-overview.html#dynamic-injection) para passar a classe interna do host ao reconciler. Por exemplo, o React DOM pede para o reconciler usar `ReactDOMComponent` como a implementacao da instancia interna host.

* A logica para atualizar a lista de filhos eh extraido em um mixin chamado `ReactMultiChild` que eh usada pela implementacao da clase de instancia interna host tanto no React DOM quanto no React Native.

* O Reconciler tambem implementa suporte para `setState()` em elementos composite. Multiplas atualizacoes dentro de event handlers sao loteadas em uma so atualizacao.

* O reconciler tambem lida com anexar e desanexar refs a componentes composite e nos host.

* Metodos de ciclo de vida sao chamados apos o DOM estar pronto, como `componentDidMount()` e `componentDidUpdate()`, sao coletados em "filas de callback" e sao executadas em um so lote.

* O React coloca informacao sobre a atualizacao atual no objeto interno chamado de "transacao". Transacoes sao uteis para observar a fila de metodos de ciclo de vida pendentes, o aninhamento do DOM atual para os warnings, e qualquer outra coisa que seja "global" a uma atualizacao especifica. Transacoes tambem garantem que o React "limpe tudo" apos atualizacoes. Por exemplo, a classe de transacao provida pelo React DOM restaura a selecao de input apos qualquer atualizacao.
* React puts information about the current update into an internal object called "transaction". Transactions are useful for keeping track of the queue of pending lifecycle methods, the current DOM nesting for the warnings, and anything else that is "global" to a specific update. Transactions also ensure React "cleans everything up" after updates. For example, the transaction class provided by React DOM restores the input selection after any update.

### Jumping into the Code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) is where the code like `mountTree()` and `unmountTree()` from this tutorial lives. It takes care of mounting and unmounting top-level components. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) is its React Native analog.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) is the equivalent of `DOMComponent` in this tutorial. It implements the host component class for React DOM renderer. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) is its React Native analog.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) is the equivalent of `CompositeComponent` in this tutorial. It handles calling user-defined components and maintaining their state.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contains the switch that picks the right internal instance class to construct for an element. It is equivalent to `instantiateComponent()` in this tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) is a wrapper with `mountComponent()`, `receiveComponent()`, and `unmountComponent()` methods. It calls the underlying implementations on the internal instances, but also includes some code around them that is shared by all internal instance implementations.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implements the logic for mounting, updating, and unmounting children according to the `key` of their elements.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implements processing the operation queue for child insertions, deletions, and moves independently of the renderer.

* `mount()`, `receive()`, and `unmount()` are really called `mountComponent()`, `receiveComponent()`, and `unmountComponent()` in React codebase for legacy reasons, but they receive elements.

* Properties on the internal instances start with an underscore, e.g. `_currentElement`. They are considered to be read-only public fields throughout the codebase.

### Future Directions {#future-directions}

Stack reconciler has inherent limitations such as being synchronous and unable to interrupt the work or split it in chunks. There is a work in progress on the [new Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) with a [completely different architecture](https://github.com/acdlite/react-fiber-architecture). In the future, we intend to replace stack reconciler with it, but at the moment it is far from feature parity.

### Next Steps {#next-steps}

Read the [next section](/docs/design-principles.html) to learn about the guiding principles we use for React development.
