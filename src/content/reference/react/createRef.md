---
title: createRef
---

<Pitfall>

`createRef` é usado principalmente para [componentes de classe](/reference/react/Component). Componentes de função normalmente dependem de [`useRef`](/reference/react/useRef).

</Pitfall>

<Intro>

`createRef` cria um objeto [ref](/learn/referencing-values-with-refs) que pode conter um valor arbitrário.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `createRef()` {/*createref*/}

Chame `createRef` para declarar um [ref](/learn/referencing-values-with-refs) dentro de um [componente de classe](/reference/react/Component).

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parameters {/*parameters*/}

`createRef` não aceita parâmetros.

#### Returns {/*returns*/}

`createRef` retorna um objeto com uma única propriedade:

* `current`: Inicialmente, é definido como `null`. Você pode alterá-lo posteriormente. Se você passar o objeto ref para o React como um atributo `ref` para um nó JSX, o React definirá sua propriedade `current`.

#### Caveats {/*caveats*/}

* `createRef` sempre retorna um *objeto diferente*. É equivalente a escrever `{ current: null }` você mesmo.
* Em um componente de função, você provavelmente deseja [`useRef`](/reference/react/useRef) em vez, que sempre retorna o mesmo objeto.
* `const ref = useRef()` é equivalente a `const [ref, _] = useState(() => createRef(null))`.

---

## Usage {/*usage*/}

### Declaring a ref in a class component {/*declaring-a-ref-in-a-class-component*/}

Para declarar um ref dentro de um [componente de classe](/reference/react/Component), chame `createRef` e atribua seu resultado a um campo de classe:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Se você agora passar `ref={this.inputRef}` para um `<input>` em seu JSX, o React preencherá `this.inputRef.current` com o nó do DOM de entrada. Por exemplo, aqui está como você cria um botão que foca o input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focar o input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` é usado principalmente para [componentes de classe](/reference/react/Component). Componentes de função normalmente dependem de [`useRef`](/reference/react/useRef).

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Migrating from a class with `createRef` to a function with `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Recomendamos o uso de componentes de função em vez de [componentes de classe](/reference/react/Component) em códigos novos. Se você tiver alguns componentes de classe existentes usando `createRef`, aqui está como você pode convertê-los. Este é o código original:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focar o input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Quando você [converter este componente de uma classe para uma função](/reference/react/Component#alternatives), substitua as chamadas para `createRef` por chamadas para [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focar o input
      </button>
    </>
  );
}
```

</Sandpack>