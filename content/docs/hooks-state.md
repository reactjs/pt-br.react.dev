---
id: hooks-state
title: Usando o State do Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

_Hooks_ são uma nova adição ao React 16.8. Eles permitem que você use o state e outros recursos do React sem escrever uma classe.

A [página de introdução](/docs/hooks-intro.html) usou este exemplo para familiarizar com Hooks:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // Declarar uma nova variável de state, na qual chamaremos de "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Vamos começar a aprender sobre Hooks comparando este código com um exemplo equivalente utilizando classe.

## Exemplo Equivalente com Classe {#equivalent-class-example}

Se você já usou classes no React, este código deve parecer familiar:

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

O state começa como `{ count: 0 }`, e aumentamos o `state.count` chamando `this.setState()` quando o usuário clica no botão. Vamos utilizar trechos dessa classe ao longo da página.

>Nota
>
>Você pode estar se perguntando porque estamos usando um counter aqui ao invés de um exemplo mais realista. Isto é pra nos ajudar a focar na API enquanto ainda damos os primeiros passos com Hooks.

## Hooks e Componentes de Função {#hooks-and-function-components}

Para lembrar, componentes de função, no React, se parecem com isto:

```js
const Example = (props) => {
  // Você pode usar Hooks aqui!
  return <div />;
}
```

ou isto:

```js
function Example(props) {
  // Você pode usar Hooks aqui!
  return <div />;
}
```

Você pode ter conhecido estes exemplos como "componentes sem estado". Nós estamos introduzindo a habilidade de utilizar o state do React neles, portanto preferimos o nome "componentes de função".

Hooks **não** funcionam dentro de classes. Mas você pode usá-los em vez de escrever classes.

## O que é um Hook? {#whats-a-hook}

Nosso novo exemplo começa importando o `useState` Hook do React:

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**O que é um Hook?** Um Hook é uma função especial que te permite utilizar recursos do React. Por exemplo, `useState` é um Hook que te permite adicionar o state do React a um componente de função. Vamos aprender outros Hooks mais tarde.

**Quando eu deveria usar um Hook?** Se você escreve um componente de função e percebe que precisa adicionar algum state para ele, anteriormente você tinha que convertê-lo para uma classe. Agora você pode usar um Hook dentro de um componente de função existente. Vamos fazer isso agora mesmo!

>Nota:
>
>Existem algumas regras especiais sobre onde você pode ou não utilizar Hooks dentro de um componente. Vamos aprender elas nas [Regras dos Hooks](/docs/hooks-rules.html).

## Declarando uma Variável State {#declaring-a-state-variable}

Em uma classe, inicializamos o state `count` para `0` definindo `this.state` para `{ count: 0 }` no construtor:

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Em um componente de função, não temos `this`, portanto não podemos definir ou ler `this.state`. Em vez disso, chamamos o Hook `useState` dentro do nosso component:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declarar uma nova variável de state, na qual chamaremos de "count"
  const [count, setCount] = useState(0);
```

**O que o `useState` faz?** Ele declara um variável state. Nossa variável é chamada de `count` mas poderíamos chamar de qualquer coisa, como `banana`. Esta é uma maneira de "preservar" alguns valores entre as chamadas de funções — `useState` é uma nova maneira de usar as mesmas capacidades que o `this.state` tem em uma classe. Normalmente, variáveis "desaparecem" quando a função sai mas variáveis de state são preservadas pelo React.

**O que passamos para o `useState` como argumento?** O único argumento para o Hook `useState()` é o state inicial. Diferente de classes, o state não tem que ser um objeto. Podemos manter um número ou uma string se for tudo que precisamos. No nosso exemplo, apenas queremos um número para quantas vezes o usuário clicou, então passamos 0 como state inicial para nossa variável. (Se quiséssemos guardar dois valores diferentes no state, chamaríamos `useState()` duas vezes.)

**O que `useState` retorna?** Ele retorna um par de valores: o state atual e uma função que atualiza o state. É por isso que escrevemos `const [count, setCount] = useState()`. Isto é similar ao `this.state.count` e `this.setState` em uma classe, exceto o fato de pegá-los em par. Se você não está familiarizado com a sintaxe que usamos, vamos voltar nisso [no final dessa página](/docs/hooks-state.html#tip-what-do-square-brackets-mean).

Agora que sabemos o que o Hook `useState` faz, nosso exemplo deve fazer mais sentido:

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // Declarar uma nova variável de state, na qual chamaremos de "count"
  const [count, setCount] = useState(0);
```

Nós declaramos uma variável state chamada `count` e definimos ela para 0. O React vai lembrar o valor atual entre cada re-renderização e fornecer o valor mais recente para nossa função. Se quisermos atualizar o `count` atual, podemos chamar `setCount`.

>Nota
>
>Você pode estar se perguntando: Por que é chamado `useState` ao invés de `createState`?
>
>"Create" não seria muito preciso porque o state é criado apenas na primeira vez que nosso componente renderiza. Durante as próximas renderizações, `useState` nos da o state atual. Caso contrário, não seria "state" de qualquer maneira! Também tem outro motivo pelo qual nomes de Hook sempre começam com `use`. Vamos aprender o porque depois, nas [Regras dos Hooks](/docs/hooks-rules.html).

## Lendo o State {#reading-state}

Quando queremos mostrar o count atual em classe, lemos `this.state.count`:

```js
  <p>You clicked {this.state.count} times</p>
```

Em uma função, podemos usar `count` diretamente:

```js
  <p>You clicked {count} times</p>
```

## Atualizando o State {#updating-state}

Em uma classe, podemos chamar `this.setState()` para atualizar o state `count`:

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

Na função, já temos `setCount` e `count` como variáveis então não precisamos do `this`:

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## Recapitulação {#recap}

Vamos **recapitular o que aprendemos linha por linha** e checar nosso entendimento.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Linha 1:** Importamos o Hook `useState` do React. Ele nos permite manter o state local em um componente de função.
* **Linha 4:** Dentro do componente `Example`, declaramos uma nova variável de state chamando o Hook `useState`. Ele retorna um par de valores, no qual damos nomes. Estamos chamando nossa variável `count` porque ela mantém o número de cliques no botão. Inicializamos como zero passando `0` como o único argumento do `useState`. O segundo item retornado é a própria função. Ela nos permite atualizar o `count` então nomeamos para `setCount`.
* **Linha 9:** Quando o usuário clica, chamamos `setCount` com um novo valor. O React então vai re-renderizar o componente `Example`, passando o novo valor de `count` para ele.

À primeira vista pode parecer muita coisa. Não se apresse! Se você está perdido na explicação, olhe o código acima novamente e tente lê-lo de uma ponta a outra. Prometemos que a partir do momento que você "esquecer" como state funciona em classes e olhar este código com novos olhos irá fazer sentido.

### Dica: O que os Colchetes Significam? {#tip-what-do-square-brackets-mean}

Você pode ter percebido os colchetes quando declaramos a variável state:

```js
  const [count, setCount] = useState(0);
```

Os nomes na esquerda não são parte da API do React. Você pode nomear suas próprias variáveis `state`:

```js
  const [fruit, setFruit] = useState('banana');
```

Esta sintaxe do JavaScript é chamada de ["atribuição via desestruturação"](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Atribuicao_via_desestruturacao). Significa que estamos fazendo duas novas variáveis `fruit` e `setFruit`, onde `fruit` é definido para o primeiro valor retornado por `useState`, e `setFruit` é o segundo. É equivalente a este código:

```js
  var fruitStateVariable = useState('banana'); // Retorna um par
  var fruit = fruitStateVariable[0]; // Primeiro item do par
  var setFruit = fruitStateVariable[1]; // Segundo item do par
```

Quando declaramos uma variável com `useState`, ela retorna um par -- um array com dois itens. O primeiro item é o valor atual e o segundo é uma função que nos permite atualizá-la. Usar `[0]` e `[1]` para acessá-las é um pouco confuso porque elas tem um significado específico. É por isto que utilizamos atribuição via desestruturação no lugar.

>Nota
>
>Você pode estar curioso como o React sabe qual componente o `useState` corresponde já que não passamos nada como `this` para o React. Vamos responder [esta pergunta](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) e muitas outras na seção FAQ.

### Dica: Usando Múltiplas Variáveis State {#tip-using-multiple-state-variables}

Declarar variáveis de state como par de `[something, setSomething]` também é útil porque nos permite dar *diferentes* nomes para diferentes váriaveis de state se quiséssemos usar mais de uma:

```js
function ExampleWithManyStates() {
// Declarar múltiplas variáveis de state!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

No componente acima, temos `age`, `fruit` e `todos` como variáveis locais e podemos atualizá-las individualmente:

```js
  function handleOrangeClick() {
    // Similar ao this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

Você **não tem que** usar muitas variáveis de state. Elas podem conter objetos e arrays muito bem. Portanto você ainda pode juntar dados relacionados. De qualquer maneira, diferente de `this.setState` em classe, ao atualizar uma variável de state, ela sempre é *substituida* ao invés de incorporada.

Damos mais recomendações em separação de variáveis de state independentes [no FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## Próximos Passos {#next-steps}

Nesta página aprendemos sobre um dos Hooks fornecido pelo React, chamado `useState`. Também, em algumas vezes, vamos nos referir como o "State do Hook". Ele nos permite adicionar um state local a um componente de função -- o que fizemos pela primeira vez!

Também aprendemos um pouco mais sobre o que são Hooks. Hooks são funções que permitem que você utilize recursos do React em componentes de função. Seus nomes sempre começam com `use`, e existem mais Hooks que não vimos ainda.

**Agora vamos continuar [aprendendo o próximo Hook: `useEffect`.](/docs/hooks-effect.html)** Ele permite que você execute efeitos colaterais em um componente e é similar ao método de ciclo de vida em classes.
