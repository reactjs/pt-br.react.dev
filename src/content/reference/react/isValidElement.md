---
title: isValidElement
---

<Intro>

`isValidElement` verifica se um valor é um elemento React.

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Chame `isValidElement(value)` para verificar se `value` é um elemento React.

```js
import { isValidElement, createElement } from 'react';

// ✅ Elementos React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Não são elementos React
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `value`: O `value` que você deseja verificar. Pode ser qualquer valor de qualquer tipo.

#### Retornos {/*returns*/}

`isValidElement` retorna `true` se o `value` for um elemento React. Caso contrário, retorna `false`.

#### Ressalvas {/*caveats*/}

* **Apenas [tags JSX](/learn/writing-markup-with-jsx) e objetos retornados por [`createElement`](/reference/react/createElement) são considerados elementos React.** Por exemplo, embora um número como `42` seja um *nó* React válido (e possa ser retornado de um componente), não é um elemento React válido. Arrays e portais criados com [`createPortal`](/reference/react-dom/createPortal) também *não* são considerados elementos React.

---

## Uso {/*usage*/}

### Verificando se algo é um elemento React {/*checking-if-something-is-a-react-element*/}

Chame `isValidElement` para verificar se algum valor é um *elemento React.*

Elementos React são:

- Valores produzidos pela escrita de uma [tag JSX](/learn/writing-markup-with-jsx)
- Valores produzidos pela chamada de [`createElement`](/reference/react/createElement)

Para elementos React, `isValidElement` retorna `true`:

```js
import { isValidElement, createElement } from 'react';

// ✅ Tags JSX são elementos React
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Valores retornados por createElement são elementos React
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Qualquer outro valor, como strings, números ou objetos e arrays arbitrários, não são elementos React.

Para eles, `isValidElement` retorna `false`:

```js
// ❌ Estes *não* são elementos React
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

É muito incomum precisar de `isValidElement`. É mais útil se você estiver chamando outra API que *apenas* aceita elementos (como [`cloneElement`](/reference/react/cloneElement) faz) e deseja evitar um erro quando seu argumento não é um elemento React.

A menos que você tenha algum motivo muito específico para adicionar uma verificação `isValidElement`, provavelmente não precisará dela.

<DeepDive>

#### Elementos React vs Nós React {/*react-elements-vs-react-nodes*/}

Quando você escreve um componente, pode retornar qualquer tipo de *nó React* dele:

```js
function MyComponent() {
  // ... você pode retornar qualquer nó React ...
}
```

Um nó React pode ser:

- Um elemento React criado como `<div />` ou `createElement('div')`
- Um portal criado com [`createPortal`](/reference/react-dom/createPortal)
- Uma string
- Um número
- `true`, `false`, `null` ou `undefined` (que não são exibidos)
- Um array de outros nós React

**Nota que `isValidElement` verifica se o argumento é um *elemento React,* e não se é um nó React.** Por exemplo, `42` não é um elemento React válido. No entanto, é um nó React perfeitamente válido:

```js
function MyComponent() {
  return 42; // É aceitável retornar um número de um componente
}
```

É por isso que você não deve usar `isValidElement` como uma forma de verificar se algo pode ser renderizado.

</DeepDive>