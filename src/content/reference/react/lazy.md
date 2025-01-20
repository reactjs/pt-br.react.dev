---
title: lazy
---

<Intro>

`lazy` permite que você adie o carregamento do código do componente até que ele seja renderizado pela primeira vez.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `lazy(load)` {/*lazy*/}

Chame `lazy` fora dos seus componentes para declarar um componente React carregado de forma preguiçosa:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `load`: Uma função que retorna uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou outro *thenable* (um objeto semelhante a uma Promise com um método `then`). O React não chamará `load` até a primeira vez que você tentar renderizar o componente retornado. Depois que o React chama `load` pela primeira vez, ele aguardará a resolução e, em seguida, renderizará o valor resolvido como um componente React. Tanto a Promise retornada quanto o valor resolvido da Promise serão armazenados em cache, de modo que o React não chamará `load` mais de uma vez. Se a Promise for rejeitada, o React irá `throw` a razão da rejeição para o mais próximo Error Boundary manipular.

#### Retornos {/*returns*/}

`lazy` retorna um componente React que você pode renderizar em sua árvore. Enquanto o código do componente preguiçoso ainda estiver carregando, tentar renderizá-lo irá *suspender.* Use [`<Suspense>`](/reference/react/Suspense) para exibir um indicador de carregamento enquanto ele está carregando.

---

### Função `load` {/*load*/}

#### Parâmetros {/*load-parameters*/}

`load` não recebe parâmetros.

#### Retornos {/*load-returns*/}

Você precisa retornar uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ou algum outro *thenable* (um objeto semelhante a uma Promise com um método `then`). Ele precisa eventualmente resolver para um objeto cuja propriedade `.default` é um tipo de componente React válido, como uma função, [`memo`](/reference/react/memo), ou um componente [`forwardRef`](/reference/react/forwardRef).

---

## Uso {/*usage*/}

### Carregamento preguiçoso de componentes com Suspense {/*suspense-for-code-splitting*/}

Geralmente, você importa componentes com a declaração estática [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import):

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Para adiar o carregamento do código desse componente até que ele seja renderizado pela primeira vez, substitua essa importação por:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Este código depende do [import() dinâmico,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) que pode exigir suporte do seu bundler ou framework. Usar este padrão exige que o componente preguiçoso que você está importando tenha sido exportado como a exportação `default`.

Agora que o código do seu componente é carregado sob demanda, você também precisa especificar o que deve ser exibido enquanto ele está carregando. Você pode fazer isso encapsulando o componente preguiçoso ou qualquer um de seus pais em um limite [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

Neste exemplo, o código para `MarkdownPreview` não será carregado até que você tente renderizá-lo. Se `MarkdownPreview` ainda não tiver carregado, `Loading` será exibido em seu lugar. Tente marcar a caixa de seleção:

<Sandpack>

```js src/App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Mostrar prévia
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Prévia</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Adicione um atraso fixo para que você possa ver o estado de carregamento
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js src/Loading.js
export default function Loading() {
  return <p><i>Carregando...</i></p>;
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Esta demonstração carrega com um atraso artificial. Da próxima vez que você desmarcar e marcar a caixa de seleção, `Prévia` será armazenado em cache, então não haverá estado de carregamento. Para ver o estado de carregamento novamente, clique em "Redefinir" no sandbox.

[Saiba mais sobre como gerenciar estados de carregamento com Suspense.](/reference/react/Suspense)

---

## Solução de Problemas {/*troubleshooting*/}

### O estado do meu componente `lazy` é redefinido inesperadamente {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Não declare componentes `lazy` *dentro* de outros componentes:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Ruim: Isso fará com que todo o estado seja redefinido em novas renderizações
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Em vez disso, sempre declare-os no nível superior do seu módulo:

```js {3-4}
import { lazy } from 'react';

// ✅ Bom: Declare componentes preguiçosos fora dos seus componentes
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```