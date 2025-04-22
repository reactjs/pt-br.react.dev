---
title: useActionState
---

<Intro>

`useActionState` é um Hook que permite que você atualize o estado com base no resultado de uma ação de formulário.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

Em versões anteriores do React Canary, esta API fazia parte do React DOM e era chamada de `useFormState`.

</Note>

<InlineToc />

---

## Referência {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

Chame `useActionState` no nível superior do seu componente para criar um estado do componente que é atualizado [quando uma ação de formulário é invocada](/reference/react-dom/components/form). Você passa para o `useActionState` uma função de ação de formulário existente, bem como um estado inicial, e ele retorna uma nova ação que você usa no seu formulário, juntamente com o estado atual do formulário e se a ação ainda está pendente. O estado atual do formulário também é passado para a função que você forneceu.

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
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

O estado do formulário é o valor retornado pela ação quando o formulário foi enviado pela última vez. Se o formulário ainda não foi enviado, é o estado inicial que você passa.

Quando usado com uma Função de Servidor, `useActionState` permite que a resposta do servidor ao enviar o formulário seja exibida mesmo antes da hidratação ser concluída.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `fn`: A função a ser chamada quando o formulário é enviado ou o botão pressionado. Quando a função é chamada, ela receberá o estado anterior do formulário (inicialmente o `initialState` que você passa, subsequentemente seu valor de retorno anterior) como seu primeiro argumento, seguido pelos argumentos que uma ação de formulário normalmente recebe.
* `initialState`: O valor que você deseja que o estado seja inicialmente. Pode ser qualquer valor serializável. Este argumento é ignorado depois que a ação é invocada pela primeira vez.
* **opcional** `permalink`: Uma string contendo a URL exclusiva da página que este formulário modifica. Para uso em páginas com conteúdo dinâmico (por exemplo: feeds) em conjunto com aprimoramento progressivo: se `fn` é uma [função de servidor](/reference/rsc/server-functions) e o formulário é enviado antes do carregamento do bundle JavaScript, o navegador navegará para a URL de permalink especificada, em vez da URL da página atual. Garanta que o mesmo componente de formulário seja renderizado na página de destino (incluindo a mesma `fn` de ação e `permalink`) para que o React saiba como passar o estado. Uma vez que o formulário tenha sido hidratado, este parâmetro não tem efeito.

{/* TODO T164397693: link to serializable values docs once it exists */}

#### Retornos {/*returns*/}

`useActionState` retorna um array com os seguintes valores:

1. O estado atual. Durante a primeira renderização, ele corresponderá ao `initialState` que você passou. Depois que a action for invocada, ele corresponderá ao valor retornado pela action.
2. Uma nova ação que você pode passar como a prop `action` para seu componente `form` ou a prop `formAction` para qualquer componente `button` dentro do formulário. A ação também pode ser chamada manualmente dentro de [`startTransition`](/reference/react/startTransition).
3. A flag `isPending` que informa se existe uma Transition pendente.

#### Ressalvas {/*caveats*/}

* Quando usado com um framework que oferece suporte a React Server Components, `useActionState` permite que você torne os formulários interativos antes que o JavaScript tenha sido executado no cliente. Quando usado sem Server Components, é equivalente ao estado local do componente.
* A função passada para `useActionState` recebe um argumento extra, o estado anterior ou inicial, como seu primeiro argumento. Isso torna sua assinatura diferente do que se fosse usado diretamente como uma ação de formulário sem usar `useActionState`.

---

## Uso {/*usage*/}

### Usando informações retornadas por uma action de formulário {/*using-information-returned-by-a-form-action*/}

Chame `useActionState` no nível raiz do seu componente para acessar o valor de retorno de uma action da última vez que um formulário foi enviado.

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

`useActionState` retorna um array com os seguintes itens:

1. O <CodeStep step={1}>estado atual</CodeStep> do formulário, que é inicialmente definido como o <CodeStep step={4}>estado inicial</CodeStep> que você forneceu e, após o formulário ser enviado, é definido como o valor de retorno da <CodeStep step={3}>action</CodeStep> que você forneceu.
2. Uma <CodeStep step={2}>nova action</CodeStep> que você passa para o `<form>` como sua prop `action` ou chama manualmente dentro de `startTransition`.
3. Um <CodeStep step={1}>estado pendente</CodeStep> que você pode utilizar enquanto sua action está processando.

Quando o formulário é enviado, a função <CodeStep step={3}>action</CodeStep> que você forneceu será chamada. Seu valor de retorno se tornará o novo <CodeStep step={1}>estado atual</CodeStep> do formulário.

A <CodeStep step={3}>action</CodeStep> que você fornece também receberá um novo primeiro argumento, ou seja, o <CodeStep step={1}>estado atual</CodeStep> do formulário. Na primeira vez que o formulário for enviado, este será o <CodeStep step={4}>estado inicial</CodeStep> que você forneceu, enquanto com envios subsequentes, será o valor de retorno da última vez que a action foi chamada. O restante dos argumentos são os mesmos de se `useActionState` não tivesse sido usado.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="Exibir informações após o envio de um formulário" titleId="display-information-after-submitting-a-form">

#### Exibir erros de formulário {/*display-form-errors*/}

Para exibir mensagens como uma mensagem de erro ou toast que é retornado por uma Server Function, envolva a action em uma chamada para `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
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
</Sandpack>

<Solution />

#### Exibir informações estruturadas após o envio de um formulário {/*display-structured-information-after-submitting-a-form*/}

O valor de retorno de uma Server Function pode ser qualquer valor serializável. Por exemplo, pode ser um objeto que inclui um booleano indicando se a action foi bem-sucedida, uma mensagem de erro ou informações atualizadas.

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
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
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
      message: "The item is sold out.",
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
</Sandpack>

<Solution />

</Recipes>

## Solução de problemas {/*troubleshooting*/}

### Minha action não consegue mais ler os dados do formulário enviado {/*my-action-can-no-longer-read-the-submitted-form-data*/}

Quando você envolve uma action com `useActionState`, ela recebe um argumento extra *como seu primeiro argumento*. Os dados do formulário enviado são, portanto, seu *segundo* argumento em vez de seu primeiro, como seria normalmente. O novo primeiro argumento que é adicionado é o estado atual do formulário.

```js
function action(currentState, formData) {
  // ...
}
```