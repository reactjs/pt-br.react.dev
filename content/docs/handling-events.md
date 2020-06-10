---
id: handling-events
title: Manipulando eventos
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

Manipular eventos em elementos React é muito semelhante a manipular eventos em elementos do DOM. Existem algumas diferenças de sintaxe:

* Eventos em React são nomeados usando camelCase ao invés de letras minúsculas.
* Com o JSX você passa uma função como manipulador de eventos ao invés de um texto.

Por exemplo, com HTML:

```html
<button onclick="activateLasers()">
  Ativar lasers
</button>
```

É ligeiramente diferente com React:

```js{1}
<button onClick={activateLasers}>
  Ativar lasers
</button>
```

Outra diferença é que você não pode retornar `false` para evitar o comportamento padrão no React. Você deve chamar `preventDefault` explícitamente. Por exemplo, com HTML simples, para evitar que um link abra uma nova página, você pode escrever:

```html
<a href="#" onclick="console.log('O link foi clicado.'); return false">
  Clique Aqui
</a>
```

No React, isso poderia ser:

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('O link foi clicado.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Clique Aqui
    </a>
  );
}
```

Aqui, "`e`" é um synthetic event. O React define esses eventos sintéticos de acordo com a [especificação W3C](https://www.w3.org/TR/DOM-Level-3-Events/). Então, não precisamos nos preocupar com a compatibilidade entre navegadores. Veja a página [`SyntheticEvent`](/docs/events.html) para saber mais.

Ao usar o React, geralmente você não precisa chamar `addEventListener` para adicionar ouvintes a um elemento no DOM depois que ele é criado. Ao invés disso você pode apenas definir um ouvinte quando o elemento é inicialmente renderizado.

Quando você define um componente usando uma [classe do ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes), um padrão comum é que um manipulador de eventos seja um método na classe. Por exemplo, este componente `Toggle` renderiza um botão que permite ao usuário alternar entre os estados "ON" e "OFF":

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // Aqui utilizamos o `bind` para que o `this` funcione dentro da nossa callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

Você precisa ter cuidado com o significado do `this` nos callbacks do JSX. Em JavaScript, os métodos de classe não são [vinculados](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_objects/Function/bind) por padrão. Se você esquecer de fazer o bind de `this.handleClick` e passá-lo para um `onClick`, o `this` será `undefined` quando a função for realmente chamada.

Este não é um comportamento específico do React. É uma parte de [como funcionam as funções em JavaScript](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/). Geralmente, se você referir a um método sem `()` depois dele, como `onClick={this.handleClick}`, você deve fazer o bind manual deste método.

Se ficar chamando "bind" incomoda você, há duas maneiras de contornar isso. Se você estiver usando a [sintaxe experimental de campos de classe pública](https://babeljs.io/docs/plugins/transform-class-properties/), você pode usar campos de classe para vincular callbacks corretamente:

```js{2-6}
class LoggingButton extends React.Component {
  // Essa sintaxe garante que o `this` seja vinculado ao handleClick.
  // Atenção: essa é uma sintaxe *experimental*.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Clique Aqui
      </button>
    );
  }
}
```

Essa sintaxe é habilitada por padrão no [Create React App](https://github.com/facebookincubator/create-react-app).

Se você não estiver usando a sintaxe de campos de classe, poderá usar uma [arrow function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) como callback:

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // Essa sintaxe garante que o `this` seja vinculado ao handleClick.
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

O problema com esta sintaxe é que um callback diferente é criado toda vez que o `LoggingButton` é renderizado. Na maioria dos casos, tudo bem. No entanto, se esse callback for passado para componentes inferiores através de props, esses componentes poderão fazer uma renderização extra. Geralmente recomendamos a vinculação no construtor ou a sintaxe dos campos de classe para evitar esse tipo de problema de desempenho.

## Passando Argumentos para Manipuladores de Eventos {#passing-arguments-to-event-handlers}

Dentro de uma estrutura de repetição, é comum querer passar um parâmetro extra para um manipulador de evento. Por exemplo, se `id` é o ID de identificação da linha, qualquer um dos dois a seguir funcionará:

```js
<button onClick={(e) => this.deleteRow(id, e)}>Deletar linha</button>
<button onClick={this.deleteRow.bind(this, id)}>Deletar linha</button>
```

As duas linhas acima são equivalentes e usam [arrow functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions) e [`Function.prototype.bind`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_objects/Function/bind) respectivamente.

Em ambos os casos, o argumento `e` representando o evento do React será passado como segundo argumento após o ID. Com uma arrow function, nós temos que passá-lo explicitamente. Mas com o `bind` outros argumentos adicionais serão automaticamente encaminhados.
