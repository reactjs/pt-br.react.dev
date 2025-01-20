---
title: findDOMNode
---

<Deprecated>

Esta API será removida em uma versão futura principal do React. [Veja as alternativas.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` encontra o nó do DOM do navegador para uma instância de [componente de classe](/reference/react/Component) do React.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Chame `findDOMNode` para encontrar o nó do DOM do navegador para uma dada instância de [componente de classe](/reference/react/Component) do React.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `componentInstance`: Uma instância da subclasse [`Component`](/reference/react/Component). Por exemplo, `this` dentro de um componente de classe.

#### Retornos {/*returns*/}

`findDOMNode` retorna o primeiro nó do DOM do navegador mais próximo dentro da `componentInstance` dada. Quando um componente renderiza `null`, ou renderiza `false`, `findDOMNode` retorna `null`. Quando um componente renderiza uma string, `findDOMNode` retorna um nó do DOM de texto contendo esse valor.

#### Ressalvas {/*caveats*/}

* Um componente pode retornar um array ou um [Fragmento](/reference/react/Fragment) com múltiplos filhos. Nesse caso, `findDOMNode` retornará o nó do DOM correspondente ao primeiro filho não vazio.

* `findDOMNode` só funciona em componentes montados (isto é, componentes que foram colocados no DOM). Se você tentar chamar isso em um componente que ainda não foi montado (como chamar `findDOMNode()` em `render()` em um componente que ainda não foi criado), uma exceção será lançada.

* `findDOMNode` retorna apenas o resultado no momento da sua chamada. Se um componente filho renderiza um nó diferente mais tarde, não há como você ser notificado sobre essa mudança.

* `findDOMNode` aceita uma instância de componente de classe, portanto não pode ser usado com componentes de função.

---

## Uso {/*usage*/}

### Encontrando o nó do DOM raiz de um componente de classe {/*finding-the-root-dom-node-of-a-class-component*/}

Chame `findDOMNode` com uma instância de [componente de classe](/reference/react/Component) (geralmente, `this`) para encontrar o nó do DOM que ele renderizou.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

Aqui, a variável `input` será definida como o elemento DOM `<input>`. Isso permite que você faça algo com ele. Por exemplo, ao clicar em "Mostrar exemplo" abaixo monta o input, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) seleciona todo o texto no input:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternativas {/*alternatives*/}

### Lendo o próprio nó do DOM de um componente a partir de um ref {/*reading-components-own-dom-node-from-a-ref*/}

O código que usa `findDOMNode` é frágil porque a conexão entre o nó JSX e o código que manipula o nó do DOM correspondente não é explícita. Por exemplo, tente envolver esse `<input />` em um `<div>`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Isso quebrará o código porque agora, `findDOMNode(this)` encontra o nó do DOM `<div>`, mas o código espera um nó do DOM `<input>`. Para evitar esse tipo de problema, use [`createRef`](/reference/react/createRef) para gerenciar um nó do DOM específico.

Neste exemplo, `findDOMNode` não é mais usado. Em vez disso, `inputRef = createRef(null)` é definido como um campo de instância na classe. Para ler o nó do DOM a partir dele, você pode usar `this.inputRef.current`. Para anexá-lo ao JSX, você renderiza `<input ref={this.inputRef} />`. Isso conecta o código usando o nó do DOM ao seu JSX:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

Em React moderno sem componentes de classe, o código equivalente chamaria [`useRef`](/reference/react/useRef) em vez disso:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[Leia mais sobre como manipular o DOM com refs.](/learn/manipulating-the-dom-with-refs)

---

### Lendo o nó do DOM de um componente filho a partir de um ref encaminhado {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

Neste exemplo, `findDOMNode(this)` encontra um nó do DOM que pertence a outro componente. O `AutoselectingInput` renderiza `MyInput`, que é seu próprio componente que renderiza um `<input>` do navegador.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

Observe que chamar `findDOMNode(this)` dentro de `AutoselectingInput` ainda fornece o DOM `<input>`--mesmo que o JSX para esse `<input>` esteja oculto dentro do componente `MyInput`. Isso parece conveniente para o exemplo acima, mas leva a um código frágil. Imagine que você quisesse editar `MyInput` mais tarde e adicionar um `<div>` de encapsulamento ao redor dele. Isso quebraria o código de `AutoselectingInput` (que espera encontrar um `<input>`).

Para substituir `findDOMNode` neste exemplo, os dois componentes precisam se coordenar:

1. `AutoSelectingInput` deve declarar um ref, como [no exemplo anterior](#reading-components-own-dom-node-from-a-ref), e passá-lo para `<MyInput>`.
2. `MyInput` deve ser declarado com [`forwardRef`](/reference/react/forwardRef) para aceitar esse ref e encaminhá-lo para o nó `<input>`.

Esta versão faz isso, então não precisa mais de `findDOMNode`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

Aqui está como esse código pareceria com componentes de função em vez de classes:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Mostrar exemplo
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### Adicionando um elemento `<div>` de encapsulamento {/*adding-a-wrapper-div-element*/}

Às vezes, um componente precisa saber a posição e o tamanho de seus filhos. Isso torna tentador encontrar os filhos com `findDOMNode(this)`, e então usar métodos do DOM como [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) para medições.

Atualmente, não há equivalente direto para esse caso de uso, razão pela qual `findDOMNode` está obsoleto, mas ainda não foi removido completamente do React. Enquanto isso, você pode tentar renderizar um nó `<div>` de encapsulamento ao redor do conteúdo como uma solução alternativa e obter um ref para esse nó. No entanto, wrappers extras podem quebrar a estilização.

```js
<div ref={someRef}>
  {children}
</div>
```

Isso também se aplica ao foco e à rolagem para filhos arbitrários.