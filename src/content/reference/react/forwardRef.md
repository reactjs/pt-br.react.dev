---
title: forwardRef
---

<Deprecated>

In React 19, `forwardRef` is no longer necessary. Pass `ref` as a prop instead.

`forwardRef` will deprecated in a future release. Learn more [here](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

`forwardRef` Permitira que seu componente exponha um nó DOM para o componente pai com um [ref.](/learn/manipulating-the-dom-with-refs)

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Invoque `forwardRef()` para criar um componente que pode receber um `ref` e repassá-lo para um componente filho:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `render`: A função de renderização do seu componente. O React usa essa função com as props e o `ref` que seu componente recebeu do pai. O JSX que irá retornar será o resultado do seu componente.

#### Retornos {/*returns*/}

`forwardRef` retorna um componente React que você pode renderizar em JSX. Diferente dos componentes React definidos como funções simples, um componente retornado por `forwardRef` também pode receber uma prop `ref`.

#### Advertências {/*caveats*/}

* No Modo Estrito, o React **chamará sua função de renderização duas vezes** para [ajudar a encontrar impurezas acidentais.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Esse comportamento ocorre apenas no ambiente de desenvolvimento e não afeta a produção. Se sua função de renderização for pura (como deve ser), isso não afetará a lógica do seu componente. O resultado de uma das chamadas será ignorado.


---

### Função de `renderização` {/*render-function*/}

`forwardRef` aceita uma função de renderização como argumento. O React chama essa função com as props e o ref:
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

#### Parameters {/*render-parameters*/}

* `props`: As props passadas pelo componente pai.

* `ref`: O atributo `ref` transmitido pelo componente pai. O `ref` pode ser um objeto ou uma função. Se o componente pai não passar um `ref`, ele será `null`. Você deve passar o `ref` recebido para outro componente ou usá-lo com [useImperativeHandle.le`.](/reference/react/useImperativeHandle)

#### Retornos {/*render-returns*/}

`forwardRef` retorna um componente React que você pode renderizar em JSX. Diferente dos componentes React definidos como funções simples, um componente retornado por `forwardRef` também pode receber uma prop `ref`.

---

## Uso {/*usage*/}

### Expondo um nó DOM ao componente pai {/*exposing-a-dom-node-to-the-parent-component*/}

Por padrão, os nós DOM de cada componente são privados. No entanto, às vees é útil expor um nó DOM ao componente pai — por exemplo, para permitir que ele seja focado. Para optar
por participar, envolva sua definição de componente em `forwardRef()`:

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
Você receberá um <CodeStep step={1}>ref</CodeStep> como segundo argumento após as props. Passe-o para o nó DOM que você deseja expor:

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
Isso vai permitir que o componente pai `Form` acesse o <CodeStep step={2}>`<input>` DOM node</CodeStep> exposto por `MyInput`:

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

Este componente `Form` [passa uma ref](/reference/react/useRef#manipulating-the-dom-with-a-ref) para `MyInput`. O componente `MyInput` encaminha essa `ref` para a tag `<input>` do navegador. Como resultado, o componente Form pode acessar esse nó DOM `<input>` e chamar [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) nele.

Tenha em mente que expor uma referência ao nó DOM dentro do seu componente torna mais difícil alterar os internos do seu componente mais tarde. Você normalmente exporá nós DOM de componentes reutilizáveis de baixo nível, como botões ou entradas de texto, mas não fará isso para componentes de nível de aplicativo, como um avatar ou um comentário.

<Recipes  titleText="Exemplos de encaminhamento de um ref">


#### Focando uma entrada de texto {/*focusing-a-text-input*/}

Clicar no botão focará o `input`. O componente `Form` define uma ref e o passa para o componente `MyInput`. O componente `MyInput` encaminha esse ref para o navegador `<input>`. Isso permite que o componente `Form` foque no `<input>`.

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

#### Reproduzir e pausar um vídeo {/*playing-and-pausing-a-video*/}

Clicar no botão chamará [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) e [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) em um nó DOM `<video>`. O componente `App` define uma referência e a passa para o componente `MyVideoPlayer`. O componente `MyVideoPlayer` encaminha essa referência para o nó `<video>` do navegador. Isso permite que o componente `App` reproduza e pause o `<video>`.

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

### Encaminhando uma ref através de vários componentes {/*forwarding-a-ref-through-multiple-components*/}

Em vez de encaminhar um `ref` para um nó DOM, você pode encaminhá-lo para seu próprio componente, como `MyInput`:

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

Se o componente `MyInput` encaminhar uma referência para seu `<input>`, uma referência para `FormField` fornecerá esse `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Insira o seu nome:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

O componente `Form` define uma ref e a passa para `FormField`. O componente `FormField` encaminha essa ref para `MyInput`, que a encaminha para um nó DOM `<input>` do navegador. É assim que `Form` acessa esse nó DOM.


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
      <FormField label="Insira o seu nome:" ref={ref} isRequired={true} />
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

### Expondo um identificador imperativo em vez de um nó DOM {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Em vez de expor um nó DOM inteiro, você pode expor um objeto personalizado, chamado de *imperative handle*, com um conjunto mais restrito de métodos. Para fazer isso, você precisaria definir uma referência separada para manter o nó DOM:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Passe o `ref` que você recebeu para [`useImperativeHandle`](/reference/react/useImperativeHandle) e especifique o valor que você deseja expor ao `ref`:

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

Se algum componente obtiver uma referência para `MyInput`, ele receberá apenas seu objeto `{ focus, scrollIntoView }` em vez do nó DOM. Isso permite que você limite as informações que expõe sobre seu nó DOM ao mínimo.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Isso não funcionará porque o nó DOM não está exposto:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Insira seu nome" ref={ref} />
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

[Leia mais sobre o uso de identificadores imperativos.](/reference/react/useImperativeHandle)

<Pitfall>

**Não use referências em excesso.** Você só deve usar referências para comportamentos *imperativos* que não podem ser expressos como adereços: por exemplo, rolar até um nó, focar um nó, acionar uma animação, selecionar texto e assim por diante.

**Se você pode expressar algo como uma propriedade, não deve usar uma referência.** Por exemplo, em vez de expor um identificador imperativo como `{ open, close }` de um componente `Modal`, é melhor usar `isOpen` como uma propriedade como `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) pode ajudar você a expor comportamentos imperativos por meio de propriedades.

</Pitfall>

---

## Solução de problemas {/*troubleshooting*/}

### Meu componente está encapsulado em `forwardRef`, mas a `ref` para ele é sempre `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Isso geralmente significa que você se esqueceu de usar o `ref` que recebeu.

Por exemplo, este componente não faz nada com seu `ref`:

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

Para corrigir isso, passe o `ref` para um nó DOM ou outro componente que possa aceitar uma ref:

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

O `ref` para `MyInput` também pode ser `null` se parte da lógica for condicional:

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

Se `showInput` for `false`, então a ref não será encaminhada para nenhum nó, e uma ref para `MyInput` permanecerá vazia. Isso é particularmente fácil de perder se a condição estiver oculta dentro de outro componente, como `Panel` neste exemplo:

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
