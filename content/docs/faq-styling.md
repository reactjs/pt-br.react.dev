---
id: faq-styling
title: Estilização e CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Como eu adiciono classes de CSS nos componentes? {#how-do-i-add-css-classes-to-components}

Passe a string para a prop `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

É comum para classes do CSS dependerem de props ou o state do componente.

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Dica
>
>Se você frequentemente se vê escrevendo código assim, o pacote [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) pode simplicar isso.

### Posso utilizar estilo inline? {#can-i-use-inline-styles}

Sim, veja os docs sobre estilização [aqui](/docs/dom-elements.html#style).

### É ruim utilizar estilos inline? {#are-inline-styles-bad}

Classes CSS geralmente possuem melhor performance que estilos inline.

### O que é CSS-in-JS? {#what-is-css-in-js}

"CSS-in-JS" se refere a um padrão onde o CSS é definido utilizando JavaScript no lugar de arquivos externos. Leia a comparação das bibliotecas de CSS-in-JS [aqui](https://github.com/MicheleBertoli/css-in-js).

_Note que esta funcionalidade não faz parte do React, mas é fornecida por bibliotecas de terceiros._ React não possui uma opinião sobre como os estilos são definidos; se estiver em dúvida, um bom ponto de partida é definir seus estilos em um arquivo `.css` separado e referenciá-los usando [`className`](/docs/dom-elements.html#classname).

### Posso fazer animações em React? {#can-i-do-animations-in-react} 

O React pode ser usado para animações. Veja [React Transition Group](https://reactcommunity.org/react-transition-group/) e [React Motion](https://github.com/chenglou/react-motion) ou [React Spring](https://github.com/react-spring/react-spring), por exemplo.
