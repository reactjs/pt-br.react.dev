---
title: isValidElement
---

<Intro>

`isValidElement` verifica se um valor é um Elemento React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Chame `isValidElement(value)` para verificar se `value` é um Elemento React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Elementos React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Não Elementos React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `value`: O `value` que você quer verificar. Pode ser qualquer valor de qualquer tipo.

#### Retorna {/*returns*/}

`isValidElement` retorna `true` se o `value` é um Elemento React. Caso contrário, retorna `false`.

#### Ressalvas {/*caveats*/}

*   **Apenas [tags JSX](/learn/writing-markup-with-jsx) e objetos retornados por [`createElement`](/reference/react/createElement) são considerados Elementos React.** Por exemplo, embora um número como `42` seja um *nó* React válido (e pode ser retornado de um componente), ele não é um Elemento React válido. Arrays e portais criados com [`createPortal`](/reference/react-dom/createPortal) também *não* são considerados Elementos React.

---

## Uso {/*usage*/}

### Verificando se algo é um Elemento React {/*checking-if-something-is-a-react-element*/}

Chame `isValidElement` para verificar se algum valor é um *Elemento React.*

Elementos React são:

*   Valores produzidos ao escrever uma [tag JSX](/learn/writing-markup-with-jsx)
*   Valores produzidos ao chamar [`createElement`](/reference/react/createElement)

Para Elementos React, `isValidElement` retorna `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Tags JSX são Elementos React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Valores retornados por createElement são Elementos React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Quaisquer outros valores, como strings, números, ou objetos e arrays arbitrários, não são Elementos React.

Para eles, `isValidElement` retorna `false`:

```js
// ❌ Esses *não* são Elementos React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

É muito incomum precisar de `isValidElement`. É principalmente útil se você estiver chamando outra API que *apenas* aceita elementos (como [`cloneElement`](/reference/react/cloneElement) faz) e você quer evitar um erro quando seu argumento não é um Elemento React.

A menos que você tenha alguma razão muito específica para adicionar uma verificação `isValidElement`, você provavelmente não precisa disso.

<DeepDive>

#### Elementos React vs Nós React {/*react-elements-vs-react-nodes*/}

Quando você escreve um componente, você pode retornar qualquer tipo de *Nó React* dele:

```js
function MyComponent() {
  // ... você pode retornar qualquer Nó React ...
}
```

Um Nó React pode ser:

*   Um Elemento React criado como `<div />` ou `createElement('div')`
*   Um portal criado com [`createPortal`](/reference/react-dom/createPortal)
*   Uma string
*   Um número
*   `true`, `false`, `null`, ou `undefined` (que não são exibidos)
*   Um array de outros Nós React

**Nota que `isValidElement` verifica se o argumento é um *Elemento React,* não se é um Nó React.** Por exemplo, `42` não é um Elemento React válido. No entanto, é um Nó React perfeitamente válido:

```js
function MyComponent() {
  return 42; // Tudo bem retornar um número do componente
}
```

É por isso que você não deve usar `isValidElement` como uma forma de verificar se algo pode ser renderizado.

</DeepDive>