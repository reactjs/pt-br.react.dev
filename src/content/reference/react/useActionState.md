---
title: useActionState
canary: true
---

<Canary>

O Hook `useActionState` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [canais de lançamento aqui](/community/versioning-policy#all-release-channels). Além disso, você precisa usar um framework que suporte [React Server Components](/reference/rsc/use-client) para obter o máximo benefício do `useActionState`.

</Canary>

<Note>

Nas versões anteriores do React Canary, esta API fazia parte do React DOM e era chamada de `useFormState`.

</Note>

<Intro>

`useActionState` é um Hook que permite atualizar o estado com base no resultado de uma ação de formulário.

```js
const [state, formAction] = useActionState(fn, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link para a documentação de ações assim que ela existir */}

Chame `useActionState` no nível superior do seu componente para criar um estado de componente que é atualizado [quando uma ação de formulário é invocada](/reference/react-dom/components/form). Você passa para `useActionState` uma função de ação de formulário existente, bem como um estado inicial, e ele retorna uma nova ação que você usa em seu formulário, juntamente com o estado mais recente do formulário. O estado mais recente do formulário também é passado para a função que você forneceu.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Incrementar</button>
    </form>
  )
}
```

O estado do formulário é o valor retornado pela ação quando o formulário foi submetido pela última vez. Se o formulário ainda não foi submetido, é o estado inicial que você passa.

Se usado com uma Ação do Servidor, `useActionState` permite que a resposta do servidor da submissão do formulário seja exibida mesmo antes que a hidratação tenha sido concluída.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `fn`: A função a ser chamada quando o formulário é submetido ou o botão pressionado. Quando a função é chamada, ela receberá o estado anterior do formulário (inicialmente o `initialState` que você passa, posteriormente seu último valor de retorno) como seu argumento inicial, seguido pelos argumentos que uma ação de formulário normalmente recebe.
* `initialState`: O valor que você deseja que o estado tenha inicialmente. Ele pode ser qualquer valor serializável. Este argumento é ignorado após a ação ser invocada pela primeira vez.
* **opcional** `permalink`: Uma string contendo a URL única da página que este formulário modifica. Para uso em páginas com conteúdo dinâmico (por exemplo: feeds) em conjunto com aprimoramento progressivo: se `fn` for uma [ação do servidor](/reference/rsc/use-server) e o formulário for submetido antes que o pacote JavaScript carregue, o navegador navegará para a URL permalink especificada, em vez da URL da página atual. Certifique-se de que o mesmo componente de formulário seja renderizado na página de destino (incluindo a mesma ação `fn` e `permalink`) para que o React saiba como passar o estado. Uma vez que o formulário tenha sido hidratado, este parâmetro não tem efeito.

{/* TODO T164397693: link para a documentação de valores serializáveis assim que existir */}

#### Retorna {/*returns*/}

`useActionState` retorna um array com exatamente dois valores:

1. O estado atual. Durante a primeira renderização, ele corresponderá ao `initialState` que você passou. Após a invocação da ação, ele corresponderá ao valor retornado pela ação.
2. Uma nova ação que você pode passar como a prop `action` para seu componente `form` ou prop `formAction` para qualquer componente `button` dentro do formulário.

#### Ressalvas {/*caveats*/}

* Quando usado com um framework que suporta React Server Components, `useActionState` permite que você torne os formulários interativos antes que o JavaScript tenha sido executado no cliente. Quando usado sem Server Components, é equivalente ao estado local do componente.
* A função passada para `useActionState` recebe um argumento extra, o estado anterior ou inicial, como seu primeiro argumento. Isso torna sua assinatura diferente do que se ela fosse usada diretamente como uma ação de formulário sem usar `useActionState`.

---

## Uso {/*usage*/}

### Usando informações retornadas por uma ação de formulário {/*using-information-returned-by-a-form-action*/}

Chame `useActionState` no nível superior do seu componente para acessar o valor retornado de uma ação da última vez que um formulário foi submetido.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` retorna um array com exatamente dois itens:

1. O <CodeStep step={1}>estado atual</CodeStep> do formulário, que é inicialmente definido para o <CodeStep step={4}>estado inicial</CodeStep> que você forneceu, e após a submissão do formulário é definido para o valor de retorno da <CodeStep step={3}>ação</CodeStep> que você forneceu.
2. Uma <CodeStep step={2}>nova ação</CodeStep> que você passa para `<form>` como sua prop `action`.

Quando o formulário é submetido, a função <CodeStep step={3}>ação</CodeStep> que você forneceu será chamada. Seu valor de retorno se tornará o novo <CodeStep step={1}>estado atual</CodeStep> do formulário.

A <CodeStep step={3}>ação</CodeStep> que você fornece também receberá um novo primeiro argumento, que é o <CodeStep step={1}>estado atual</CodeStep> do formulário. A primeira vez que o formulário é submetido, isso será o <CodeStep step={4}>estado inicial</CodeStep> que você forneceu, enquanto em submissões subsequentes, será o valor de retorno da última vez em que a ação foi chamada. O restante dos argumentos é o mesmo do que se `useActionState` não tivesse sido usado.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'próximo estado';
}
```

<Recipes titleText="Exibir informações após submeter um formulário" titleId="display-information-after-submitting-a-form">

#### Exibir erros de formulário {/*display-form-errors*/}

Para exibir mensagens como uma mensagem de erro ou um toast que é retornado por uma Ação do Servidor, envolva a ação em uma chamada para `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Adicionar ao Carrinho</button>
      {message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: O Guia Definitivo" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: Os Bons Partes" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Adicionado ao carrinho";
  } else {
    return "Não foi possível adicionar ao carrinho: o item está esgotado.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### Exibir informações estruturadas após submeter um formulário {/*display-structured-information-after-submitting-a-form*/}

O valor de retorno de uma Ação do Servidor pode ser qualquer valor serializável. Por exemplo, pode ser um objeto que inclui um booleano indicando se a ação foi bem-sucedida, uma mensagem de erro ou informações atualizadas.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Adicionar ao Carrinho</button>
      {formState?.success &&
        <div className="toast">
          Adicionado ao carrinho! Seu carrinho agora tem {formState.cartSize} itens.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Falha ao adicionar ao carrinho: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: O Guia Definitivo" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: Os Bons Partes" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "O item está esgotado.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

</Recipes>

## Solução de Problemas {/*troubleshooting*/}

### Minha ação não consegue mais ler os dados do formulário submetido {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Quando você envolve uma ação com `useActionState`, ela recebe um argumento extra *como seu primeiro argumento*. Os dados do formulário submetido são, portanto, seu *segundo* argumento em vez de seu primeiro, como geralmente seria. O novo primeiro argumento que é adicionado é o estado atual do formulário.

```js
function action(currentState, formData) {
  // ...
}
```