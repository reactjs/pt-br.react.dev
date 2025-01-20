---
title: createFactory
---

<Deprecated>

Esta API será removida em uma futura versão principal do React. [Veja as alternativas.](#alternatives)

</Deprecated>

<Intro>

`createFactory` permite que você crie uma função que produz elementos React de um determinado tipo.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

Chame `createFactory(type)` para criar uma função de fábrica que produz elementos React de um dado `type`.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Então você pode usá-la para criar elementos React sem JSX:

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `type`: O argumento `type` deve ser um tipo de componente React válido. Por exemplo, pode ser uma string de nome de tag (como `'div'` ou `'span'`), ou um componente React (uma função, uma classe ou um componente especial como [`Fragment`](/reference/react/Fragment)).

#### Retorna {/*returns*/}

Retorna uma função de fábrica. Essa função de fábrica recebe um objeto `props` como o primeiro argumento, seguido por uma lista de argumentos `...children`, e retorna um elemento React com o dado `type`, `props` e `children`.

---

## Uso {/*usage*/}

### Criando elementos React com uma fábrica {/*creating-react-elements-with-a-factory*/}

Embora a maioria dos projetos React use [JSX](/learn/writing-markup-with-jsx) para descrever a interface do usuário, JSX não é obrigatório. No passado, `createFactory` era uma das maneiras de descrever a interface do usuário sem JSX.

Chame `createFactory` para criar uma *função de fábrica* para um tipo de elemento específico como `'button'`:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Chamar essa função de fábrica produzirá elementos React com os props e children que você forneceu:

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

</Sandpack>

Esta é a forma como `createFactory` era usado como uma alternativa ao JSX. No entanto, `createFactory` está obsoleto, e você não deve chamar `createFactory` em nenhum novo código. Veja como migrar para fora de `createFactory` abaixo.

---

## Alternativas {/*alternatives*/}

### Copiando `createFactory` para o seu projeto {/*copying-createfactory-into-your-project*/}

Se o seu projeto tem muitas chamadas de `createFactory`, copie esta implementação de `createFactory.js` para o seu projeto:

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Isso permite que você mantenha todo o seu código inalterado, exceto pelas importações.

---

### Substituindo `createFactory` por `createElement` {/*replacing-createfactory-with-createelement*/}

Se você tiver algumas chamadas de `createFactory` que não se importa em portar manualmente, e você não quiser usar JSX, pode substituir cada chamada de uma função de fábrica por uma chamada de [`createElement`](/reference/react/createElement). Por exemplo, você pode substituir este código:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

por este código:

```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

Aqui está um exemplo completo de uso do React sem JSX:

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicado!')
    }
  }, 'Clique em mim');
}
```

</Sandpack>

---

### Substituindo `createFactory` por JSX {/*replacing-createfactory-with-jsx*/}

Finalmente, você pode usar JSX em vez de `createFactory`. Esta é a forma mais comum de usar o React:

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicado!');
    }}>
      Clique em mim
    </button>
  );
};
```

</Sandpack>

<Pitfall>

Às vezes, seu código existente pode passar alguma variável como um `type` em vez de uma constante como `'button'`:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

Para fazer o mesmo em JSX, você precisa renomear sua variável para começar com uma letra maiúscula como `Type`:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Caso contrário, o React interpretará `<type>` como uma tag HTML embutida porque está em minúsculas.

</Pitfall>