---
id: animation
title: Add-Ons de animação
permalink: docs/animation.html
layout: docs
category: Add-Ons
redirect_from:
  - "docs/animation-ja-JP.html"
  - "docs/animation-ko-KR.html"
  - "docs/animation-zh-CN.html"
---

> Nota:
>
> `ReactTransitionGroup` e `ReactCSSTransitionGroup` foram movidos para o pacote [`react-transition-group`](https://github.com/reactjs/react-transition-group/tree/v1-stable) que é mantido pela comunidade. Sua ramificação 1.x é totalmente compatível com a API com os complementos existentes. Por favor, arquive bugs e solicitações de recursos no [novo repositório](https://github.com/reactjs/react-transition-group/tree/v1-stable).

O componente complementar [`ReactTransitionGroup`](#low-level-api-reacttransitiongroup) é uma API low-level para animação, e o [`ReactCSSTransitionGroup`](#high-level-api-reactcsstransitiongroup) é um componente complementar para implementar facilmente animações e transições CSS básicas.

## High-level API: ReactCSSTransitionGroup {#high-level-api-reactcsstransitiongroup}

`ReactCSSTransitionGroup` é uma API high-level baseada em [`ReactTransitionGroup`](#low-level-api-reacttransitiongroup) e é uma maneira fácil de realizar transições e animações CSS quando um componente React entra ou sai do DOM. É inspirado na excelente biblioteca [ng-animate](https://docs.angularjs.org/api/ngAnimate).

**Importando**

```javascript
import ReactCSSTransitionGroup from 'react-transition-group'; // ES6
var ReactCSSTransitionGroup = require('react-transition-group'); // ES5 com npm
```

```javascript{31-36}
class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: ['hello', 'world', 'clique', 'aqui']};
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleAdd() {
    const newItems = this.state.items.concat([
      prompt('Digite algum texto')
    ]);
    this.setState({items: newItems});
  }

  handleRemove(i) {
    let newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({items: newItems});
  }

  render() {
    const items = this.state.items.map((item, i) => (
      <div key={i} onClick={() => this.handleRemove(i)}>
        {item}
      </div>
    ));

    return (
      <div>
        <button onClick={this.handleAdd}>Adicionar Item</button>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {items}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
```

> Nota:
>
> Você deve fornecer [o atributo `key`](/docs/lists-and-keys.html#keys) para todos os childrens de `ReactCSSTransitionGroup`, mesmo ao renderizar apenas um único item. É assim que o React determinará quais childrens entraram, saíram ou ficaram.

Neste componente, quando um novo item é adicionado ao `ReactCSSTransitionGroup` ele obterá a classe CSS `example-enter` e a classe CSS `example-enter-active`, adicionadas no próximo tick. Esta é uma convenção baseada na prop `transitionName`.

Você pode usar essas classes para acionar uma animação ou transição CSS. Por exemplo, tente adicionar este CSS e adicionar um novo item de lista:

```css
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity 500ms ease-in;
}

.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity 300ms ease-in;
}
```

Você notará que as durações da animação precisam ser especificadas tanto no CSS quanto no método de renderização; isso diz ao React quando remover as classes de animação do elemento e — se estiver saindo — quando remover o elemento do DOM.

### Animar a montagem inicial {#animate-initial-mounting}

`ReactCSSTransitionGroup` fornece a prop opcional `transitionAppear`, para adicionar uma fase de transição extra na montagem inicial do componente. Geralmente, não há fase de transição na montagem inicial, pois o valor padrão de `transitionAppear` é `false`. Abaixo está um exemplo em que passamos a prop  `transitionAppear` com o valor `true`.

```javascript{5-6}
render() {
  return (
    <ReactCSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>
      <h1>Fading na montagem inicial</h1>
    </ReactCSSTransitionGroup>
  );
}
```

Durante a montagem inicial, `ReactCSSTransitionGroup` obterá a classe CSS `example-appear` e a classe CSS `example-appear-active`, adicionadas no próximo tick.

```css
.example-appear {
  opacity: 0.01;
}

.example-appear.example-appear-active {
  opacity: 1;
  transition: opacity .5s ease-in;
}
```

Na montagem inicial, todos os childrens do `ReactCSSTransitionGroup` irão conter `appear` mas não `enter`. No entanto, todos os childrens adicionados posteriormente a um `ReactCSSTransitionGroup` irão conter `enter` mas não `appear`.

> Nota:
>
> A prop `transitionAppear` foi adicionado ao `ReactCSSTransitionGroup` na versão `0.13`. Para manter a compatibilidade com versões anteriores, o valor padrão é definido como `false`.
>
> No entanto, os valores padrão de `transitionEnter` e `transitionLeave` são `true`, portanto, você deve especificar o `transitionEnterTimeout` e o `transitionLeaveTimeout` por padrão. Se você não precisar entrar ou sair de animações, passe `transitionEnter={false}` ou `transitionLeave={false}`.

### Classes Personalizadas {#custom-classes}

Também é possível usar nomes de classes personalizadas para cada uma das etapas em suas transições. Em vez de passar uma string para transitionName, você pode passar um objeto contendo os nomes das classes `enter` e `leave`, ou um objeto contendo os nomes das classes `enter`, `enter-active`, `leave-active`, e `leave`. Se apenas as classes enter e leave forem fornecidas, as classes enter-active e leave-active serão determinadas anexando '-active' ao final do nome da classe. Aqui estão dois exemplos usando classes personalizadas:

```javascript
// ...
<ReactCSSTransitionGroup
  transitionName={ {
    enter: 'enter',
    enterActive: 'enterActive',
    leave: 'leave',
    leaveActive: 'leaveActive',
    appear: 'appear',
    appearActive: 'appearActive'
  } }>
  {item}
</ReactCSSTransitionGroup>

<ReactCSSTransitionGroup
  transitionName={ {
    enter: 'enter',
    leave: 'leave',
    appear: 'appear'
  } }>
  {item2}
</ReactCSSTransitionGroup>
// ...
```

### O grupo de animação deve ser montado para funcionar {#animation-group-must-be-mounted-to-work}

Para que ele aplique transições a seus childrens, o `ReactCSSTransitionGroup` já deve estar montado no DOM ou a prop `transitionAppear` deve ser definido como `true`.

O exemplo abaixo **não** funcionaria, porque o `ReactCSSTransitionGroup` está sendo montado junto com o novo item, em vez de o novo item ser montado dentro dele. Compare isso com a seção [Primeiros passos](#getting-started) acima para ver a diferença.

```javascript{4,6,13}
render() {
  const items = this.state.items.map((item, i) => (
    <div key={item} onClick={() => this.handleRemove(i)}>
      <ReactCSSTransitionGroup transitionName="example">
        {item}
      </ReactCSSTransitionGroup>
    </div>
  ));

  return (
    <div>
      <button onClick={this.handleAdd}>Adicionar Item</button>
      {items}
    </div>
  );
}
```

### Animando Um ou Zero itens {#animating-one-or-zero-items}

No exemplo acima, renderizamos uma lista de itens em `ReactCSSTransitionGroup`. No entanto, os childrens de `ReactCSSTransitionGroup` também podem ser um ou zero itens. Isso torna possível animar um único elemento entrando ou saindo. Da mesma forma, você pode animar um novo elemento substituindo o elemento atual. Por exemplo, podemos implementar um carrossel de imagens simples como este:

```javascript{10}
import ReactCSSTransitionGroup from 'react-transition-group';

function ImageCarousel(props) {
  return (
    <div>
      <ReactCSSTransitionGroup
        transitionName="carousel"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <img src={props.imageSrc} key={props.imageSrc} />
      </ReactCSSTransitionGroup>
    </div>
  );
}
```

### Desativando animações {#disabling-animations}

Você pode desativar a animação de animações `enter` ou `leave`, se desejar. Por exemplo, às vezes você pode querer uma animação `enter` e nenhuma animação `leave`, mas `ReactCSSTransitionGroup` espera que uma animação seja concluída antes de remover seu nó DOM. Você pode adicionar a prop `transitionEnter={false}` ou `transitionLeave={false}` ao `ReactCSSTransitionGroup` para desativar essas animações.

> Nota:
>
> Ao usar o `ReactCSSTransitionGroup`, não há como seus componentes serem notificados quando uma transição terminar ou executar qualquer lógica mais complexa em torno da animação. Se você deseja um controle mais refinado, pode usar a API `ReactTransitionGroup` de nível inferior, que fornece os ganchos necessários para fazer transições personalizadas.

* * *

## Low-level API: ReactTransitionGroup {#low-level-api-reacttransitiongroup}

**Importando**

```javascript
import ReactTransitionGroup from 'react-addons-transition-group' // ES6
var ReactTransitionGroup = require('react-addons-transition-group') // ES5 com npm
```

`ReactTransitionGroup` é a base para animações. Quando os childrens são adicionados ou removidos declarativamente (como no [exemplo acima](#getting-started)), métodos especiais de ciclo de vida são chamados neles.

 - [`componentWillAppear()`](#componentwillappear)
 - [`componentDidAppear()`](#componentdidappear)
 - [`componentWillEnter()`](#componentwillenter)
 - [`componentDidEnter()`](#componentdidenter)
 - [`componentWillLeave()`](#componentwillleave)
 - [`componentDidLeave()`](#componentdidleave)

#### Renderizando um componente diferente {#rendering-a-different-component}

`ReactTransitionGroup` é renderizado como um `span` por padrão. Você pode alterar esse comportamento fornecendo uma prop chamada `component`. Por exemplo, veja como você renderizaria um `<ul>`:

```javascript{1}
<ReactTransitionGroup component="ul">
  {/* ... */}
</ReactTransitionGroup>
```

Quaisquer propriedades adicionais definidas pelo usuário se tornarão propriedades do componente renderizado. Por exemplo, veja como você renderizaria um `<ul>` com classe CSS:

```javascript{1}
<ReactTransitionGroup component="ul" className="animated-list">
  {/* ... */}
</ReactTransitionGroup>
```

Cada componente DOM que o React pode renderizar está disponível para uso. No entanto, `component` não precisa ser um componente DOM. Pode ser qualquer componente React que você queira; mesmo aqueles que você mesmo escreveu! Apenas escreva `component={List}` e seu componente receberá `this.props.children`.

#### Renderizando um Single Child {#rendering-a-single-child}

As pessoas costumam usar o `ReactTransitionGroup` para animar a montagem e desmontagem de um single child, como um painel dobrável. Normalmente, o `ReactTransitionGroup` envolve todos os seus childrens em um `span` (ou um `component` personalizado, conforme descrito acima). Isso ocorre porque qualquer componente React precisa retornar um único elemento raiz, e `ReactTransitionGroup` não é exceção a essa regra.

No entanto, se você precisar renderizar apenas um single child dentro do `ReactTransitionGroup`, poderá evitar completamente envolvê-lo em um `<span>` ou qualquer outro componente DOM. Para fazer isso, crie um componente personalizado que renderize o primeiro child passado a ele diretamente:

```javascript
function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}
```

Agora você pode especificar `FirstChild` como a prop `component` nas props do `<ReactTransitionGroup>` e evitar quaisquer wrappers no DOM resultante:

```javascript
<ReactTransitionGroup component={FirstChild}>
  {someCondition ? <MyComponent /> : null}
</ReactTransitionGroup>
```

Isso só funciona quando você está animando um single child dentro e fora, como um painel recolhível. Essa abordagem não funcionaria ao animar vários childrens ou substituir o single child por outro child, como um carrossel de imagens. Para um carrossel de imagens, enquanto a imagem atual está sendo animada, outra imagem será animada, então `<ReactTransitionGroup>` precisa fornecer a eles um parent DOM comum. Você não pode evitar o wrapper para vários childrens, mas pode personalizar o wrapper com a prop `component` conforme descrito acima.

* * *

## Referência {#reference}

### `componentWillAppear()` {#componentwillappear}

```javascript
componentWillAppear(callback)
```

Isso é chamado ao mesmo tempo que `componentDidMount()` para componentes que são montados inicialmente em um `TransitionGroup`. Ele bloqueará a ocorrência de outras animações até que a função `callback` seja chamada. Ele é chamado apenas na renderização inicial de um `TransitionGroup`.

* * *

### `componentDidAppear()` {#componentdidappear}

```javascript
componentDidAppear()
```

Isso é chamado depois que a função `callback` que foi passada para `componentWillAppear` é chamada.

* * *

### `componentWillEnter()` {#componentwillenter}

```javascript
componentWillEnter(callback)
```

Isso é chamado ao mesmo tempo que `componentDidMount()` para componentes adicionados a um `TransitionGroup` existente. Ele bloqueará a ocorrência de outras animações até que a função `callback` seja chamada. Ele não será chamado na renderização inicial de um `TransitionGroup`.

* * *

### `componentDidEnter()` {#componentdidenter}

```javascript
componentDidEnter()
```

Isso é chamado depois que a função `callback` que foi passada para [`componentWillEnter()`](#componentwillenter) é chamada.

* * *

### `componentWillLeave()` {#componentwillleave}

```javascript
componentWillLeave(callback)
```

Isso é chamado quando o child foi removido do `ReactTransitionGroup`. Embora o child tenha sido removido, o `ReactTransitionGroup` o manterá no DOM até que a função `callback` seja chamada.

* * *

### `componentDidLeave()` {#componentdidleave}

```javascript
componentDidLeave()
```

Isso é chamado quando a função `callback` de `willLeave` for chamada (ao mesmo tempo que `componentWillUnmount()`).
