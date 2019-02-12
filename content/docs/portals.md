---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

Portals fornece uma forma elegante de renderizar um elemento filho dentro de um nó DOM que existe fora da hierarquia do DOM do componente pai.

```js
ReactDOM.createPortal(child, container)
```

O primeiro argumento (`child`) é qualquer [elemento filho React renderizável](/docs/react-component.html#render), como um elemento, string ou fragmento. O segundo argumento (`container`) é um elemento DOM.

## Uso {#usage}

Normalmente, quando retornamos um elemento pelo método render de um componente, ele é montado dentro do DOM como um filho do nó pai mais próximo:

```js{4,6}
render() {
  // React monta uma nova div e renderiza o filho dentro dela
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Entretanto, em algumas situação é útil inserir um elemento filho em um local diferente no DOM:

```js{6}
render() {
  // React *não* cria uma nova div. Ele renderiza o filho dentro do `domNode`.
  // `domNode` é qualquer nó DOM válido, independente da sua localização no DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```
Um caso típico do uso de portals é quando um componente pai tem o estilo `overflow: hidden` ou `z-index`, mas você precisa que o filho visualmente "saia" desse contêiner. Por exemplo, caixas de diálogo, hovercards e tooltips.

> Nota:
>
> Quando estiver trabalhando com portals, lembra-se que [tratar os eventos de foco do teclado](/docs/accessibility.html#programmatically-managing-focus) se torna muito importante.
>
> No caso de modais, assegure-se que todos possam interagir com o modal seguindo as práticas descritas em [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Propagação de Eventos Através do Portals {#event-bubbling-through-portals}

Apesar de um portal poder estar em qualquer lugar na árvore DOM, seu comportamento é como o de qualquer outro elemento React filho. Funcionalidades como contexto funcionam da mesma forma independente se o filho é um portal, pois o portal ainda existe na *árvore React* independentemente da posição que esteja na *árvore DOM*.

Isso inclui a propagação de eventos. Um evento disparado dentro de um portal será propagado para os elementos antecessores da *árvore React*, mesmo que estes não sejam antecessores na *árvore DOM*.
This includes event bubbling. An event fired from inside a portal will propagate to ancestors in the containing *React tree*, even if those elements are not ancestors in the *DOM tree*. Considerando a seguinte estrutura HTML:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Um componente `Pai` em `#app-root` será capaz de capturar a propagação de um evento não tratado vindo do nó irmão `#moda-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Catching an event bubbling up from a portal in a parent component allows the development of more flexible abstractions that are not inherently reliant on portals. For example, if you render a `<Modal />` component, the parent can capture its events regardless of whether it's implemented using portals.
