---
id: lifting-state-up
title: Elevando o State
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

Com frequência, a modificação de um dado tem que ser refletida em vários componentes. Recomendamos elevar o state compartilhado ao elemento pai comum mais próximo. Vamos ver como isso funciona na prática.

Nessa seção, criaremos uma calculadora de temperatura que calcula se a água ferveria em determinada temperatura.

Vamos iniciar com um componente chamado `BoilingVerdict`. Ele recebe a temperatura por meio da prop `celsius` e retorna uma mensagem indicando se a temperatura é suficiente para a água ferver.

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

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Adicionando um Segundo Input {#adding-a-second-input}

Nosso novo requisito é que, além de um input para grau Celsius, também tenhamos um input para grau Fahrenheit e que ambos estejam sincronizados.

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

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

Agora nós temos dois inputs. Porém, quando a temperatura é inserida em um deles, o outro não atualiza. Isso contraria nosso requisito: queremos que eles estejam sincronizados.

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

No React, o compartilhamento do state é alcançado ao movê-lo para o elemento pai comum aos componentes que precisam dele. Isso se chama "elevar o state" (state lift). Vamos remover o state local do `TemperatureInput` e colocá-lo no `Calculator`.

Se o `Calculator` é dono do state compartilhado, ele se torna a "fonte da verdade" para a temperatura atual em ambos os inputs. Ele pode instruir ambos a terem valores que são consistentes um com o outro. Já que as props de ambos os `TemperatureInput` vem do mesmo componente pai, `Calculator`, os dois inputs sempre estarão sincronizados.

Vamos ver o passo a passo de como isso funciona.

Primeiro, vamos substituir `this.state.temperature` por `this.props.temperature` no componente `TemperatureInput`. Por hora, vamos fingir que `this.props.temperature` já existe. Apesar de que, no futuro, teremos que passá-la do `Calculator`:

```js{3}
  render() {
    // Antes: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

Sabemos que [props são somente leitura](/docs/components-and-props.html#props-are-read-only). Quando a `temperature` estava no state local, o `TemperatureInput` podia simplesmente chamar `this.setState()` para modificá-lo. Porém, agora que a `temperature` vem do elemento pai como uma prop, o `TemperatureInput` não tem controle sobre ela.

No React, isso é comumente solucionado ao tornar um componente comum em um "componente controlado". Assim como o `<input>` do DOM aceita ambas as props `value` e `onChange`, o componente personalizado `TemperatureInput` também pode aceitar ambas as props `temperature` e `onTemperatureChange` do `Calculator`, seu componente pai.

Agora, quando o `TemperatureInput` quiser atualizar sua temperatura, ele executa `this.props.onTemperatureChange`:

```js{3}
  handleChange(e) {
    // Antes: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Observação:
>
>O nome das props `temperature` ou `onTemperatureChange` não possui nenhum significado especial. Elas poderiam ter quaisquer outros nomes, tais como `value` e `onChange`, o que é uma convenção comum.

A prop `onTemperatureChange` será fornecida juntamente com a prop `temperature` pelo componente pai `Calculator`. Esse irá cuidar das alterações ao modificar seu próprio state local, fazendo com que ambos os inputs sejam renderizados com novos valores. Vamos conferir a nova implementação do componente `Calculator` em breve.

Antes de mergulhar nas alterações do `Calculator`, vamos recapitular as alterações no componente `TemperatureInput`. Nós removemos o state local dele, então ao invés de ler `this.state.temperature`, agora lemos `this.props.temperature`. Ao invés de chamar `this.setState()` quando quisermos fazer uma alteração chamamos `this.props.onTemperatureChange()` que será fornecido pelo `Calculator`:

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
        <legend>Informe a temperatura em {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Agora é a vez do componente `Calculator`.

Vamos armazenar no state local os valores `temperature` e `scale` referentes ao input atual. Eles representam o state que "foi elevado" dos inputs e servirá como "fonte da verdade" para ambos. É a representação mínima de todos os dados necessários para conseguir renderizar ambos os inputs.

Por exemplo, se informarmos 37 no input de Celsius, o state do componente `Calculator` será:

```js
{
  temperature: '37',
  scale: 'c'
}
```

Posteriormente, se editarmos o input Fahrenheit para ser 212, o state do componente `Calculator` será:

```js
{
  temperature: '212',
  scale: 'f'
}
```

Poderíamos ter armazenado o valor de ambos os inputs mas isso não é necessário. É suficiente armazenar o valor do input recentemente alterado e da escala que ele representa. Podemos assim inferir o valor do outro input com base nos valores atuais de `temperature` e `scale`.

Os inputs ficam sincronizados porque seus valores são calculados tendo como base o mesmo state:

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

[**Experimente no CodePen**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

Agora, tanto faz qual input for editado, `this.state.temperature` e `this.state.scale` no componente `Calculator` serão atualizados. Um dos inputs recebe o valor como está, preservando o que foi informado pelo usuário e o valor do outro input é sempre recalculado com base no primeiro.

Vamos recapitular o que acontece quando um input é editado:

* O React executa a função especificada como `onChange` no `<input>` do DOM. Nesse caso, esse é o método `handleChange` do componente `TemperatureInput`.
* O método `handleChange` do componente `TemperatureInput` executa `this.props.onTemperatureChange()` com o novo valor desejado. Suas props, incluindo `onTemperatureChange`, foram fornecidas pelo seu componente pai, o `Calculator`.
* Quando renderizado previamente, o componente `Calculator` especificou que `onTemperatureChange` do `TemperatureInput` de Celsius é o método `handleCelsiusChange` do `Calculator`, e que `onTemperatureChange` do `TemperatureInput` de Fahrenheit é o método `handleFahrenheitChange` do `Calculator`. Então um desses dois métodos do `Calculator` será executado dependendo de qual input for editado.
* Dentro desses métodos, o componente `Calculator` pede ao React para ser renderizado novamente ao chamar `this.setState()` com o novo valor da temperatura e da escala do input recém editado.
* O React executa o método `render` do componente `Calculator` para aprender como a interface deveria ficar. Os valores de ambos os inputs são recalculados com base na temperatura e escala atuais. A conversão de temperatura é realizada aqui.
* O React executa o método `render` dos dois componentes `TemperatureInput` com suas novas props especificadas pelo `Calculator`. O React aprende como a interface do usuário deve ficar.
* O React executa o método `render` do componente `BoilingVerdict`, passando a temperatura em Celsius como prop.
* O React DOM atualiza o DOM com o veredito e com os valores de input desejáveis. O input que acabamos de editar recebe seu valor atual e o outro input é atualizado com a temperatura após a conversão.

Toda edição segue os mesmos passos então os inputs ficam sincronizados.

## Lições Aprendidas {#lessons-learned}

Deve haver uma única "fonte da verdade" para quaisquer dados que sejam alterados em uma aplicação React. Geralmente, o state é adicionado ao componente que necessita dele para renderizar. Depois, se outro componente também precisar desse state, você pode elevá-lo ao elemento pai comum mais próximo de ambos os componentes. Ao invés de tentar sincronizar o state entre diferentes componentes, você deve contar com o [fluxo de dados de cima para baixo](/docs/state-and-lifecycle.html#the-data-flows-down).

Elevar o state envolve escrever mais código de estrutura do que as abordagens de two-way data bind, mas como benefício, demanda menos trabalho para encontrar e isolar erros. Já que o state "vive" em um componente e somente esse componente pode alterá-lo, a área de superfície para encontrar os erros é drasticamente reduzida. Além disso, é possível implementar qualquer lógica personalizada para rejeitar ou transformar o input do usuário.

Se alguma coisa pode ser derivada tanto das props como do state, ela provavelmente não deveria estar no state. Por exemplo, ao invés de armazenar ambos `celsiusValue` e `fahrenheitValue`, armazenamos somente o valor da última `temperature` editada e o valor de `scale`. O valor do outro input pode sempre ser calculado com base nessas informações no método `render()`. Isso permite limpar ou arredondar o valor no outro input sem perder precisão no valor informado pelo usuário.

Quando você vê algo de errado na interface do usuário, você pode utilizar o [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) para inspecionar as props e subir a árvore de elementos até encontrar o componente responsável por atualizar o state. Isso permite que você encontre a fonte dos erros:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

