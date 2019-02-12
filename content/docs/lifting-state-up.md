---
id: lifting-state-up
title: Lifting State Up
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Com frequência, a modificação de um dado tem que ser refletida em vários componentes. Recomendamos elevar o state compartilhado ao elemento pai comum mais próximo. Vamos ver como isso funciona na prática.

Nessa seção, criaremos uma calculadora de temperatura que calcula se a água ferveria em determinada temperatura.

Vamos iniciar com um componente chamado `BoilingVerdict`. Ele recebe a temperatura por meio da prop `celcius` e retorna uma mensagem indicando se a temperatura é suficiente para a água ferver.

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>A água ferveria.</p>;
  }
  return <p>A água não ferveria.</p>;
}
```

A seguir, criaremos um componente chamado `Calculator`. Ele renderiza um `<input>` que recebe a temperatura e a mantém em `this.state.temperature`.

Além disso, ele renderiza o `BoilingVerdict` de acordo com o valor atual do input.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Informe a temperatura em Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Adicionando um Segundo Input {#adding-a-second-input}

Nosso novo requisito é que, além de um input para grau Celsius, também tenhamos um input para grau Fahrenheit, e que ambos estejam sincronizados.

Podemos iniciar extraindo um componente `TemperatureInput` do componente `Calculator`. Vamos adicionar uma nova prop `scale` que pode ser tanto `"c"` como `"f"`:

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Informe a temperatura em {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Agora podemos modificar o `Calculator` para renderizar dois inputs de temperatura separados:

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Agora nós temos dois inputs, mas quando a temperatura é inserida em um deles, o outro não atualiza. Isso contraria nosso requisito: queremos que eles estejam sincronizados.

Também não podemos renderizar o `BoilingVerdict` a partir do `Calculator`, porque esse não conhece a temperatura atual já que ela está escondida dentro do `TemperatureInput`.

## Codificando Funções de Conversão {#writing-conversion-functions}

Primeiro, vamos criar duas funções para converter de Celsius para Fahrenheit e vice-versa:

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

Essas duas funções convertem números. Vamos criar outra função que recebe uma string `temperature` e uma função de conversão como argumentos e retorna uma string. Vamos usá-la para calcular o valor de um input com base no outro input.

Retorna uma string vazia quando `temperature` for inválido e mantém o retorno arredondado até a terceira casa decimal.

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

Por exemplo, `tryConvert('abc', toCelsius)` retona uma string vazia e `tryConvert('10.22', toFahrenheit)` retorna `'50.396'`.

## Elevando o State {#lifting-state-up}

Atualmente, ambos os componentes `TemperatureInput` mantém, de modo independente, o valor em seu state local.

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

Porém, queremos que esses dois inputs estejam sincronizados um com o outro. Quando o input de Celsius for atualizado, o input de Fahrenheit deve mostrar a temperatura convertida e vice-versa.

No React, o compartilhamento do state é alcançado ao movê-lo para o elemento pai comum aos componentes que precisam dele. Isso se chama "elevando o state". Vamos remover o state local do `TemperatureInput` e colocá-lo `Calculator`.

Se o `Calculator` é dono do state compartilhado, ele se torna a "fonte da verdade" para a temperatura atual em ambos os inputs. Ele pode instruir ambos a terem valores que são consistentes um com o outro. Já que as props de ambos os `TemperatureInput` vem do mesmo componente pai, `Calculator`, os dois inputs sempre estarão sincronizados.

Vamos ver o passo a passo de como isso funciona.

Primeiro, vamos substituir `this.state.temperature` por `this.props.temperature` no componente `TemperatureInput`. Por hora, vamos fingir que `this.props.temperature` já existe, apesar de que, no futuro, teremos que passá-la do `Calculator`:

```js{3}
  render() {
    // Antes: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Sabemos que [props são somente leitura](/docs/components-and-props.html#props-are-read-only). Quando a `temperature` estava no state local, o `TemperatureInput` podia simplesmente chamar `this.setState()` para modificá-lo. Porém, agora que a `temperature` vem do elemento pai como uma prop, o `TemperatureInput` não tem controle sobre ela.

In React, this is usually solved by making a component "controlled". Just like the DOM `<input>` accepts both a `value` and an `onChange` prop, so can the custom `TemperatureInput` accept both `temperature` and `onTemperatureChange` props from its parent `Calculator`.

Now, when the `TemperatureInput` wants to update its temperature, it calls `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Note:
>
>There is no special meaning to either `temperature` or `onTemperatureChange` prop names in custom components. We could have called them anything else, like name them `value` and `onChange` which is a common convention.

The `onTemperatureChange` prop will be provided together with the `temperature` prop by the parent `Calculator` component. It will handle the change by modifying its own local state, thus re-rendering both inputs with the new values. We will look at the new `Calculator` implementation very soon.

Before diving into the changes in the `Calculator`, let's recap our changes to the `TemperatureInput` component. We have removed the local state from it, and instead of reading `this.state.temperature`, we now read `this.props.temperature`. Instead of calling `this.setState()` when we want to make a change, we now call `this.props.onTemperatureChange()`, which will be provided by the `Calculator`:

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Now let's turn to the `Calculator` component.

We will store the current input's `temperature` and `scale` in its local state. This is the state we "lifted up" from the inputs, and it will serve as the "source of truth" for both of them. It is the minimal representation of all the data we need to know in order to render both inputs.

For example, if we enter 37 into the Celsius input, the state of the `Calculator` component will be:

```js
{
  temperature: '37',
  scale: 'c'
}
```

If we later edit the Fahrenheit field to be 212, the state of the `Calculator` will be:

```js
{
  temperature: '212',
  scale: 'f'
}
```

We could have stored the value of both inputs but it turns out to be unnecessary. It is enough to store the value of the most recently changed input, and the scale that it represents. We can then infer the value of the other input based on the current `temperature` and `scale` alone.

The inputs stay in sync because their values are computed from the same state:

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Now, no matter which input you edit, `this.state.temperature` and `this.state.scale` in the `Calculator` get updated. One of the inputs gets the value as is, so any user input is preserved, and the other input value is always recalculated based on it.

Let's recap what happens when you edit an input:

* React calls the function specified as `onChange` on the DOM `<input>`. In our case, this is the `handleChange` method in the `TemperatureInput` component.
* The `handleChange` method in the `TemperatureInput` component calls `this.props.onTemperatureChange()` with the new desired value. Its props, including `onTemperatureChange`, were provided by its parent component, the `Calculator`.
* When it previously rendered, the `Calculator` has specified that `onTemperatureChange` of the Celsius `TemperatureInput` is the `Calculator`'s `handleCelsiusChange` method, and `onTemperatureChange` of the Fahrenheit `TemperatureInput` is the `Calculator`'s `handleFahrenheitChange` method. So either of these two `Calculator` methods gets called depending on which input we edited.
* Inside these methods, the `Calculator` component asks React to re-render itself by calling `this.setState()` with the new input value and the current scale of the input we just edited.
* React calls the `Calculator` component's `render` method to learn what the UI should look like. The values of both inputs are recomputed based on the current temperature and the active scale. The temperature conversion is performed here.
* React calls the `render` methods of the individual `TemperatureInput` components with their new props specified by the `Calculator`. It learns what their UI should look like.
* React calls the `render` method of the `BoilingVerdict` component, passing the temperature in Celsius as its props.
* React DOM updates the DOM with the boiling verdict and to match the desired input values. The input we just edited receives its current value, and the other input is updated to the temperature after conversion.

Every update goes through the same steps so the inputs stay in sync.

## Lessons Learned {#lessons-learned}

There should be a single "source of truth" for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](/docs/state-and-lifecycle.html#the-data-flows-down).

Lifting state involves writing more "boilerplate" code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state "lives" in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.

If something can be derived from either props or state, it probably shouldn't be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `temperature` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.

When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

