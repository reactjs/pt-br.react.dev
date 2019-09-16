---
id: web-components
title: Componentes Web
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React e [Componentes Web](https://developer.mozilla.org/pt-BR/docs/Web/Web_Components) são construídos para resolver problemas diferentes. Componentes Web fornecem forte encapsulamento para componentes reutilizáveis. Enquanto que o React fornece uma biblioteca declarativa que mantém o DOM em sincronia com os seus dados. Os dois objetivos são complementares. Como um desenvolvedor, você é livre para usar o React nos seus Componentes Web ou usar Componentes Web no React ou ambos.

A maioria das pessoas que usam o React não usam Componentes Web. Mas, talvez você queira, especialmente se você estiver utilizando componentes de UI de terceiros que foram escritos utilizando Componentes Web.

## Usando Componentes Web no React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Olá <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Nota:
>
> Componentes Web geralmente expõem uma API imperativa. Por exemplo, um Componente Web `video` pode expor as funções `play()` e `pause()`. Para acessar as APIs imperativas de um Componente Web, você precisará usar um ref para interagir diretamente com o nó do DOM. Se você está utilizando Componentes Web de terceiros, a melhor solução é escrever um componente React que se comporte como um wrapper para o seu Componente Web.
>
> Os eventos emitidos por um Componente Web podem não se propagar apropriadamente através da árvore de renderização do React.
> Você precisará anexar manualmente os manipuladores de eventos para lidar com esses eventos em seus componentes React.

Uma confusão comum é que os Componentes Web utilizam "class" ao invés de "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>frente</div>
      <div>verso</div>
    </brick-flipbox>
  );
}
```

## Usando React nos seus Componentes Web {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Nota:
>
>Este código **não funcionará** se você transformar as classes com o Babel. Veja a discussão [nesta issue](https://github.com/w3c/webcomponents/issues/587).
>Inclua o [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) antes de carregar seus componentes web para resolver este problema.
