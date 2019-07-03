---
id: fragments
title: Fragmentos
permalink: docs/fragments.html
---

Um padrão comum no React é que um componente pode retornar múltiplos elementos. Os Fragmentos permitem agrupar uma lista de filhos sem adicionar nós extras ao DOM.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

<<<<<<< HEAD
Há também uma nova [sintaxe curta](#short-syntax) para declará-las. Porém, ainda não é suportada por todas as ferramentas populares.
=======
There is also a new [short syntax](#short-syntax) for declaring them.
>>>>>>> ed9d73105a93239f94d84c619e84ae8adec43483

## Motivação {#motivation}

Um padrão comum é para um componente retornar uma lista de filhos. Considerando o código React a seguir:

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

`<Columns />` precisaria retornar múltiplos elementos `<td>` para que o HTML renderizado fosse válido. Se um div pai for usado dentro do `render()` de `<Columns />`, então o HTML resultante será inválido.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

Resulta na seguinte `<Table />`:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Os Fragmentos resolvem este problema.

## Uso {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

que resulta em uma `<Table />` correta:

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### Sintaxe curta {#short-syntax}

Existe uma sintaxe nova e mais curta que você pode usar para declarar fragmentos. Parecem tags vazias:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

Você pode usar `<></>` da mesma forma que você usaria qualquer outro elemento, exceto que ele não suporta chaves ou atributos.

<<<<<<< HEAD
Observe que **[muitas ferramentas ainda não possuem suporte](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)** então é melhor escrever `<React.Fragment>` até que as ferramentas passem ter suporte.

### Fragmentos com chaves {#keyed-fragments}
=======
### Keyed Fragments {#keyed-fragments}
>>>>>>> ed9d73105a93239f94d84c619e84ae8adec43483

Fragmentos  declarados com `<React.Fragment>` podem ter chaves. Um caso de uso para isso é mapear uma coleção para um array de fragmentos - por exemplo, para criar uma lista de descrição:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Sem a `key`, React irá disparar um aviso
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` é o único atributo que pode ser passado para o `Fragment`. No futuro, podemos adicionar suporte para outros atributos, como manipuladores de eventos.

### Demonstração ao vivo {#live-demo}

Você pode experimentar a nova sintaxe de fragmento JSX com este [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
