---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals fornece uma forma elegante de renderizar um elemento filho dentro de um nó DOM que existe fora da hierarquia do componente pai.

```js
ReactDOM.createPortal(child, container)
```

O primeiro argumento (`child`) é qualquer [elemento filho React renderizável](/docs/react-component.html#render), como um elemento, string ou fragmento. O segundo argumento (`container`) é um elemento DOM.

## Utilização {#usage}

Normalmente, quando retornamos um elemento pelo método render de um componente ele é montado dentro do DOM como um filho do nó pai mais próximo:

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

Entretanto, em algumas situações é útil inserir um elemento filho em um local diferente no DOM:

```js{6}
render() {
  // React *não* cria uma nova div. Ele renderiza os filhos dentro do `domNode`.
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
> Quando estiver trabalhando com portals, lembre-se que [tratar o evento focus](/docs/accessibility.html#programmatically-managing-focus) se torna muito importante.
>
> No caso dos modals, assegure-se que todos possam interagir com eles seguindo as práticas descritas em [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## Propagação de Eventos Através do Portals {#event-bubbling-through-portals}

Apesar de um portal poder estar em qualquer lugar na árvore DOM, seu comportamento é como o de qualquer outro elemento React filho. Funcionalidades como contexto funcionam da mesma forma independente se o filho é um portal, pois o portal ainda existe na *árvore React* independentemente da posição que esteja na *árvore DOM*.

Isso inclui a propagação de eventos. Um evento disparado dentro de um portal será propagado para os elementos antecessores da *árvore React*, mesmo que estes não sejam antecessores na *árvore DOM*.
Considere a seguinte estrutura HTML:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Um componente `Pai` em `#app-root` será capaz de capturar a propagação de um evento não tratado vindo do nó irmão `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Estes dois contêineres são irmãos no DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // O elemento portal é inserido na árvore DOM depois que
    // os componentes filhos de `Modal` são montados, o que significa que os filhos
    // serão montados em um nó DOM separado. Se um componente
    // filho precisa ser colocado na árvore DOM
    // imediatamente quando é montado, por exemplo para medir um
    // nó DOM ou usar 'autoFocus' em um descendente, adicione
    // state ao Modal e renderize o filho apenas quando o Modal
    // estiver inserido na árvore DOM.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
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
    // Isso é disparado quando o botão no filho é clicado,
    // atualizando o state do componente Pai, mesmo que o filho
    // não seja um descendente direto no DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Número de cliques: {this.state.clicks}</p>
        <p>
          Abra o DevTools do navegador
          para observar que o botão
          não é um filho da div
          com o onClick.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // O evento de clique nesse botão irá propagar para o ascendente,
  // porque o atributo 'onClick' não está definido
  return (
    <div className="modal">
      <button>Clicar</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Capturar um evento propagado a partir de um portal em um componente pai permite o desenvolvimento de abstrações mais flexíveis que não dependem diretamente de portals. Por exemplo, se você renderizar um componente `<Modal />`, o componente pai pode capturar seus eventos independentemente se são implementados usando portals.
