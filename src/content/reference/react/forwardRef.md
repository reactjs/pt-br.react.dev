---
title: forwardRef
---

<Deprecated>

Em React 19, `forwardRef` não é mais necessário. Passe `ref` como uma prop em vez disso.

`forwardRef` será descontinuado em uma versão futura. Saiba mais [aqui](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

<<<<<<< HEAD
`forwardRef` permite que seu componente exponha um nó do DOM ao componente pai com um [ref.](/learn/manipulating-the-dom-with-refs)
=======
`forwardRef` lets your component expose a DOM node to the parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
>>>>>>> d34c6a2c6fa49fc6f64b07aa4fa979d86d41c4e8

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Chame `forwardRef()` para permitir que seu componente receba um ref e o encaminhe para um componente filho:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `render`: A função de renderização para o seu componente. React chama esta função com as props e `ref` que seu componente recebeu de seu pai. O JSX que você retornar será a saída do seu componente.

#### Retorna {/*returns*/}

`forwardRef` retorna um componente React que você pode renderizar em JSX. Diferente dos componentes React definidos como funções simples, um componente retornado por `forwardRef` também é capaz de receber uma prop `ref`.

#### Ressalvas {/*caveats*/}

* No Modo Estrito, React **chama sua função de renderização duas vezes** para [ajudá-lo a encontrar impurezas acidentais.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Este é um comportamento apenas para desenvolvimento e não afeta a produção. Se sua função de renderização for pura (como deveria ser), isso não deve afetar a lógica do seu componente. O resultado de uma das chamadas será ignorado.


---

### Função `render` {/*render-function*/}

`forwardRef` aceita uma função de renderização como um argumento. React chama essa função com `props` e `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Parâmetros {/*render-parameters*/}

* `props`: As props passadas pelo componente pai.

* `ref`: O atributo `ref` passado pelo componente pai. O `ref` pode ser um objeto ou uma função. Se o componente pai não tiver passado um ref, ele será `null`. Você deve passar o `ref` que você recebe para outro componente, ou passá-lo para [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Retorna {/*render-returns*/}

`forwardRef` retorna um componente React que você pode renderizar em JSX. Diferente dos componentes React definidos como funções simples, o componente retornado por `forwardRef` é capaz de receber uma prop `ref`.

---

## Uso {/*usage*/}

### Expondo um nó do DOM para o componente pai {/*exposing-a-dom-node-to-the-parent-component*/}

Por padrão, os nós do DOM de cada componente são privados. No entanto, às vezes é útil expor um nó do DOM para o pai - por exemplo, para permitir focar nele. Para participar, envolva a definição do seu componente em `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Você receberá um <CodeStep step={1}>ref</CodeStep> como o segundo argumento após as props. Passe-o para o nó do DOM que você deseja expor:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Isso permite que o componente `Form` pai acesse o <CodeStep step={2}>nó do DOM `</input>`</CodeStep> exposto por `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

Este componente `Form` [passa um ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) para `MyInput`. O componente `MyInput` *encaminha* aquele ref para a tag do navegador `<input>`. Como resultado, o componente `Form` pode acessar aquele nó do DOM `<input>` e chamar [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) nele.

Tenha em mente que expor um ref para o nó do DOM dentro do seu componente torna mais difícil alterar o funcionamento interno do seu componente mais tarde. Você tipicamente expõe nós do DOM de componentes reutilizáveis de baixo nível como botões ou entradas de texto, mas você não fará isso para componentes em nível de aplicação como um avatar ou um comentário.

<Recipes titleText="Exemplos de encaminhamento de um ref">

#### Focando uma entrada de texto {/*focusing-a-text-input*/}

Clicar no botão irá focar a entrada. O componente `Form` define um ref e o passa para o componente `MyInput`. O componente `MyInput` encaminha aquele ref para o `<input>` do navegador. Isso permite que o componente `Form` foque o `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Reproduzindo e pausando um vídeo {/*playing-and-pausing-a-video*/}

Clicar no botão irá chamar [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) em um nó do DOM `<video>`. O componente `App` define um ref e o passa para o componente `MyVideoPlayer`. O componente `MyVideoPlayer` encaminha aquele ref para o nó `<video>` do navegador. Isso permite que o componente `App` reproduza e pause o `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Encaminhando um ref através de múltiplos componentes {/*forwarding-a-ref-through-multiple-components*/}

Em vez de encaminhar um `ref` para um nó do DOM, você pode encaminhá-lo para seu próprio componente como `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Se aquele componente `MyInput` encaminhar um ref para seu `<input>`, um ref para `FormField` lhe dará aquele `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

O componente `Form` define um ref e o passa para `FormField`. O componente `FormField` encaminha aquele ref para `MyInput`, que o encaminha para um nó do DOM `<input>` do navegador. É assim que `Form` acessa aquele nó do DOM.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Expondo um manipulador imperativo em vez de um nó do DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Em vez de expor um nó do DOM inteiro, você pode expor um objeto customizado, chamado *manipulador imperativo,* com um conjunto mais restrito de métodos. Para fazer isso, você precisaria definir um ref separado para manter o nó do DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Passe o `ref` que você recebeu para [`useImperativeHandle`](/reference/react/useImperativeHandle) e especifique o valor que você deseja expor para o `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Se algum componente receber um ref para `MyInput`, ele só receberá seu objeto `{ focus, scrollIntoView }` em vez do nó do DOM. Isso permite que você limite a informação que você expõe sobre o seu nó do DOM ao mínimo.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Isso não vai funcionar porque o nó do DOM não está exposto:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Leia mais sobre o uso de manipuladores imperativos.](/reference/react/useImperativeHandle)

<Pitfall>

**Não use demais refs.** Você deve usar refs apenas para comportamentos *imperativos* que você não pode expressar como props: por exemplo, rolar para um nó, focar em um nó, acionar uma animação, selecionar texto, e assim por diante.

**Se você pode expressar algo como uma prop, você não deve usar um ref.** Por exemplo, em vez de expor um manipulador imperativo como `{ open, close }` de um componente `Modal`, é melhor usar `isOpen` como uma prop como `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) pode ajudá-lo a expor comportamentos imperativos via props.

</Pitfall>

---

## Solução de problemas {/*troubleshooting*/}

### Meu componente está encapsulado em `forwardRef`, mas o `ref` para ele é sempre `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Isso geralmente significa que você esqueceu de realmente usar o `ref` que você recebeu.

Por exemplo, este componente não faz nada com o seu `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Para corrigi-lo, passe o `ref` para um nó do DOM ou outro componente que pode aceitar um ref:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

O `ref` para `MyInput` também pode ser `null` se alguma lógica for condicional:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Se `showInput` for `false`, então o ref não será encaminhado para nenhum nó, e um ref para `MyInput` permanecerá vazio. Isso é particularmente fácil de perder se a condição estiver escondida dentro de outro componente, como `Panel` neste exemplo:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
