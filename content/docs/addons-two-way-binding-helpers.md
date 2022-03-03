---
id: two-way-binding-helpers
title: Auxiliares de ligação bidirecional
permalink: docs/two-way-binding-helpers.html
layout: docs
category: Add-Ons
---

> Nota:
>
> `LinkedStateMixin` está obsoleto a partir do React v15. A recomendação é definir explicitamente o valor e alterar o manipulador, em vez de usar `LinkedStateMixin`.

**Importando**

```javascript
import LinkedStateMixin from 'react-addons-linked-state-mixin'; // ES6
var LinkedStateMixin = require('react-addons-linked-state-mixin'); // ES5 com npm
```

## Visão geral {#overview}

`LinkedStateMixin` é uma maneira fácil de expressar ligação bidirecional com React.

No React, os dados fluem de uma maneira: do owner para o child. Acreditamos que isso torna o código do seu aplicativo mais fácil de entender. Você pode pensar nisso como "vinculação de dados unidirecional".

No entanto, existem muitos aplicativos que exigem que você leia alguns dados e os envie de volta ao seu programa. Por exemplo, ao desenvolver formulários, muitas vezes você desejará atualizar algum `state` do React quando receber a entrada do usuário. Ou talvez você queira executar o layout em JavaScript e reagir a alterações no tamanho de algum elemento DOM.

No React, você implementaria isso ouvindo um evento "change", lendo sua fonte de dados (geralmente o DOM) e chamando `setState()` em um de seus componentes. "Fechar o ciclo de fluxo de dados" explicitamente leva a programas mais compreensíveis e fáceis de manter. Veja [nossa documentação de formulários](/docs/forms.html) para maiores informações.

A vinculação bidirecional -- implícita que algum valor no DOM é sempre consistente com algum `state` do React -- é conciso e suporta uma ampla variedade de aplicações. Fornecemos `LinkedStateMixin`: "syntactic sugar" para configurar o padrão de loop de fluxo de dados comum descrito acima, ou "vincular" alguma fonte de dados ao React `state`.

> Nota:
>
> `LinkedStateMixin` é apenas um wrapper fino e convenção em torno do padrão `onChange`/`setState()`. Ele não altera fundamentalmente como os dados fluem em seu aplicativo React.

## LinkedStateMixin: Antes e Depois {#linkedstatemixin-before-and-after}

Aqui está um exemplo de formulário simples sem usar `LinkedStateMixin`:

```javascript
var createReactClass = require('create-react-class');

var NoLink = createReactClass({
  getInitialState: function() {
    return {message: 'Olá!'};
  },
  handleChange: function(event) {
    this.setState({message: event.target.value});
  },
  render: function() {
    var message = this.state.message;
    return <input type="text" value={message} onChange={this.handleChange} />;
  }
});
```

Isso funciona muito bem e é muito claro como os dados estão fluindo, no entanto, com muitos campos de formulário, pode ficar um pouco detalhado. Vamos usar `LinkedStateMixin` para nos poupar algumas digitações:

```javascript{4,9}
var createReactClass = require('create-react-class');

var WithLink = createReactClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {message: 'Olá!'};
  },
  render: function() {
    return <input type="text" valueLink={this.linkState('message')} />;
  }
});
```

`LinkedStateMixin` adiciona um método ao seu componente React chamado `linkState()`. `linkState()` retorna um objeto `valueLink` que contém o valor atual do estado React e um callback para alterá-lo.

Objetos `valueLink` podem ser passados ​​para cima e para baixo na árvore como props, então é fácil (e explícito) configurar uma ligação bidirecional entre um componente profundo na hierarquia e um estado que vive mais alto na hierarquia.

Observe que as caixas de seleção têm um comportamento especial em relação ao atributo `value`, que é o valor que será enviado no envio do formulário se a caixa de seleção estiver marcada (o padrão é `on`). O atributo `value` não é atualizado quando a caixa de seleção é marcada ou desmarcada. Para caixas de seleção, você deve usar `checkedLink` em vez de `valueLink`:
```
<input type="checkbox" checkedLink={this.linkState('booleanValue')} />
```

## Sob o capô {#under-the-hood}

Existem dois lados do `LinkedStateMixin`: o local onde você cria a instância `valueLink` e o local onde você a usa. Para provar o quão simples é o `LinkedStateMixin`, vamos reescrever cada lado separadamente para ser mais explícito.

### valueLink sem LinkedStateMixin {#valuelink-without-linkedstatemixin}

```javascript{7-9,11-14}
var createReactClass = require('create-react-class');

var WithoutMixin = createReactClass({
  getInitialState: function() {
    return {message: 'Olá!'};
  },
  handleChange: function(newValue) {
    this.setState({message: newValue});
  },
  render: function() {
    var valueLink = {
      value: this.state.message,
      requestChange: this.handleChange
    };
    return <input type="text" valueLink={valueLink} />;
  }
});
```

Como você pode ver, objetos `valueLink` são objetos muito simples que possuem apenas uma prop `value` e `requestChange`. E `LinkedStateMixin` é igualmente simples: ele apenas preenche esses campos com um valor de `this.state` e um callback que chama `this.setState()`.

### LinkedStateMixin sem valueLink {#linkedstatemixin-without-valuelink}

```javascript
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var createReactClass = require('create-react-class');

var WithoutLink = createReactClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {message: 'Olá!'};
  },
  render: function() {
    var valueLink = this.linkState('message');
    var handleChange = function(e) {
      valueLink.requestChange(e.target.value);
    };
    return <input type="text" value={valueLink.value} onChange={handleChange} />;
  }
});
```

A prop `valueLink` também é bastante simples. Ele simplesmente manipula o evento `onChange` e chama `this.props.valueLink.requestChange()` e também usa `this.props.valueLink.value` em vez de `this.props.value`. É isso!
