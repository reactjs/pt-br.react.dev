---
id: faq-functions
title: Passando Funções para Componentes
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Como eu passo um manipulador de eventos (como onClick) para um componente? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Passando manipuladores de evento e outras funções como props para componentes filhos:

```jsx
<button onClick={this.handleClick}>
```

Se você precisa ter acesso ao componente pai no manipulador, você também precisa dar bind em uma função na instância do componente (veja abaixo)

### Como eu dou bind em uma função na instância de um componente? {#how-do-i-bind-a-function-to-a-component-instance}

Dependendo da sintaxe e etapas de build que você está usando, existem diversas maneiras de ter certeza que as funções tem acesso aos atributos dos componentes como `this.props` e `this.state`.

#### Bind no Constructor (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Clicado');
  }
  render() {
    return <button onClick={this.handleClick}>Clique em mim!</button>;
  }
}
```

#### Propriedades de Classe (Stage 3 Proposal)  {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Nota: esta sintaxe é experimental e ainda não padronizada.
  handleClick = () => {
    console.log('Clicado');
  }
  render() {
    return <button onClick={this.handleClick}>Clique em mim!</button>;
  }
}
```

#### Bind no Render {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Clicado');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Clique em mim!</button>;
  }
}
```

>**Nota:**
>
>Ao usar `Function.prototype.bind` no render, uma nova função é criada cada vez que o componente é renderizado, o que pode afetar a performance (veja abaixo).

#### Arrow Function no Render {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Clicado');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Clique em mim!</button>;
  }
}
```

>**Nota:**
>
>Ao usar uma arrow function no render, uma nova função é criada cada vez que o componente é renderizado, que pode quebrar otimizações com base em comparação de identidade `on strict`.

### Devemos usar arrow functions em métodos de render? {#is-it-ok-to-use-arrow-functions-in-render-methods}

De um modo geral, sim, é certo. E muitas das vezes é a maneira mais fácil de enviar parâmetros para funções de callback.

Se você tiver problemas de performance, de qualquer jeito, otimize!

### Porquê binding é necessário afinal? {#why-is-binding-necessary-at-all}

Em JavaScript, estes dois code snippets **não** são equivalentes:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Métodos de binding ajudam a garantir que o segundo snippet funcione da mesma maneira que o primeiro.

Com React, tipicamente você precisa dar bind apenas nos métodos que você *passa* para outros componentes. Por exemplo, `<button onClick={this.handleClick}>` passa `this.handleCLick` logo você deve dar bind nele. Entretanto, é desnecessário usar bind no método `render` ou nos métodos do ciclo de vida: nós não passamos ele à outros componentes.
  
[Este post por Yehuda Katz](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/) explica o que binding é e como funcionam as funções do JavaScript, em detalhes.

### Porquê minha função é chamada toda vez que o componente renderiza? {#why-is-my-function-being-called-every-time-the-component-renders}

Certifique-se que você não está _chamando a função_ quando for passar para o componente:

```jsx
render() {
  // Errado: handleClick é chamado ao invés de ser passado como referência!
  return <button onClick={this.handleClick()}>Clique em mim!</button>
}
```

Em vez disso, *passe a própria função* (sem parentêses):

```jsx
render() {
  // Correto: handleClick é passado como referência!
  return <button onClick={this.handleClick}>Click em mim!</button>
}
```

### Como eu passo um parâmetro para um manipulador de evento ou um callback? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Você pode usar uma arrow function para envolver um manipulador de eventos e passar parâmetros:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Isto é equivalente que chamar o `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Exemplo: Passando parâmetros usando arrow functions {#exemplo-passando-parâmetros-usando-arrow-functions}

```jsx
const A = 65 // cógido de caractere ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Você clicou: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Exemplo: Passando parâmetros usando data-attributes {#example-passing-params-using-data-attributes}

Em vez disso, você pode usar APIs do DOM para armazenar dados necessários para manipuladores de evento. Considere este approach caso você precise otimizar um grande número de elementos ou possua uma render tree que depende de verificações de igualdade do React.PureComponent.

```jsx
const A = 65 // código de caractere ASCII

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Você clicou: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Como eu posso evitar que uma função seja chamada muito rapidamente ou chamada muitas vezes em seguida? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Se você tem um manipulador de eventos como `onClick` ou `onScroll` e quer evitar que o callback seja ativado muito rapidamente, então você pode limitar a taxa em que o callback é executado.
Isso pode ser feito usando:

- **throttling**: amostra de mudanças com base em uma frequência baseada no tempo (eg [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: publica alterações após um período de inatividade (eg [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: amostra de mudanças baseadas em [`requestAnimationFrame`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/requestAnimationFrame) (eg [`raf-schd`](https://github.com/alexreardon/raf-schd))

Veja [esta visualização](http://demo.nimius.net/debounce_throttle/) para uma comparação entre as funções `throttle` e `debounce`.

> Nota:
>
> `_.debounce`, `_.throttle` e `raf-schd` fornecem um método `cancel` para cancelar callbacks atrasados. Você deve chamar este método a partir de `componentWillUnmount` _ou_ verificar se o componente ainda está montado dentro da função atrasada.

#### Throttle {#throttle}

O _throttling_ impede a função de ser chamada mais de uma vez em uma certa janela de tempo. O exemplo abaixo _throttles_  o manipulador do evento "Click" para impedi-lo de ser chamado mais de uma vez por segundo.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

O _Debouncing_ garante que a função não vai ser executada até que uma certa quantidade de tempo tenha passado desde sua última chamada. Isso pode ser útil quando você tem que executar algum cálculo pesado em resposta a um evento que pode despachar rapidamente (eg rolagem ou evento de teclas). O exemplo abaixo _debounces_ o texto com um atraso de 250ms.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // o React faz pools no eventos. Então lemos o valor antes do debounce.
    // Alternativamente podemos chamar `event.persist()` e passar todo o evento.
    // Para mais informações veja: reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/requestAnimationFrame) é uma maneira de enfileirar uma função para ser executada no browser no tempo ideal para a performance de renderização. A função que é enfileirada com `requestAnimationFrame` vai disparar no próximo frame. O browser trabalhará duro para garantir que haja 60 frames por segundo(60 fps). Entretanto, se o browser for incapaz disso, ele vai naturalmente *limitar* a quantidade de frames por segundo. Por exemplo, um dispostivo pode ser capaz de aguentar apenas 30fps e então você só tera 30 frames por segundo. Usar `requestAnimationFrame` para _throttling_ é uma técnica útil para prevenir você de fazer mais de 60 atualizações em um segundo. Se você está fazendo 100 atualizações em um segundo, isso cria trabalho adicional para o browser que de qualquer maneira o usuário não será capaz de ver.

>**Nota:**
>
>Usar esta técnica capturará apenas o último valor publicado em um frame. Você pode ver um exemplo de como esta otimização funciona em [`MDN`](https://developer.mozilla.org/pt-BR/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Cria uma nova função para agendar atualizações.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Quando recebemos um evento de scroll, agenda-se uma atualização.
    // Se recebermos muitos updates em um frames, publicaremos apenas o último valor.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Cancela qualquer atualização pendente já que estamos desmontando o componente.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Testando sua taxa limitante {#testing-your-rate-limiting}

Ao testar que o seu código de limitação de taxa funciona corretamente é útil ter a capacidade de avançar o tempo. Se você esta usando [`jest`](https://facebook.github.io/jest/) então você pdoe usar [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html) para avançar o tempo. Se você está usando `requestAnimationFrame` _throttling_ você pode achar [`raf-stub`](https://github.com/alexreardon/raf-stub) uma ferramenta útil para controlar o instate dos quadros das animações.
