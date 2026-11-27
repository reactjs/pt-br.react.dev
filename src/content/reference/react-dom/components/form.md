---
title: "<form>"
---

<Intro>

O [componente `<form>` do navegador embutido](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form) permite que você crie controles interativos para enviar informações.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `<form>` {/*form*/}

Para criar controles interativos para enviar informações, renderize o [componente `<form>` do navegador embutido](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form).

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[Veja mais exemplos abaixo.](#usage)

#### Props {/*props*/}

`<form>` suporta todas as [props de elementos comuns.](/reference/react-dom/components/common#common-props)

* [`action`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form#action): Uma string contendo uma URL, ou uma função. Se você passar uma URL, o formulário se comporta como um formulário HTML padrão. Se você passar uma função, ela manipula o envio. Veja [Manipulando o envio de formulário com uma prop action](#handle-form-submission-with-an-action-prop).
  * Se você passar uma função para `action`, o React a executa em uma [Transition](/reference/react/useTransition) seguindo [o padrão de props de Action](/reference/react/useTransition#exposing-action-props-from-components).
  * A função pode ser async. O React a chama com um único argumento contendo os [dados do formulário](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) do formulário enviado.
  * Uma prop `formAction` em um `<button>`, `<input type="submit">` ou `<input type="image">` substitui esta `action`.
* [`method`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/form#method): Uma string que especifica o método HTTP a ser usado quando `action` é uma URL. O padrão é `get`.
* `onSubmit`: Uma função [manipuladora de `Event`](/reference/react-dom/components/common#react-event-object). Disparada quando o formulário é enviado. Veja [Manipulando o envio de formulário com um manipulador de eventos](#handle-form-submission-with-an-event-handler).

#### Ressalvas {/*caveats*/}

* Se você passar uma função para `action` ou `formAction`, o método HTTP será `POST`, independentemente do valor da prop `method`.
* Se você passar uma função para `action` ou `formAction`, o React redefine todos os elementos de campo [não controlados](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) após a Action ser concluída com sucesso. Veja [Preservando os valores do formulário após uma Action](#preserve-form-values-after-an-action).

---

## Uso {/*usage*/}

### Manipulando o envio de formulário com um manipulador de eventos {/*handle-form-submission-with-an-event-handler*/}

Passe uma função para o manipulador de eventos `onSubmit` para executar código quando o formulário for enviado. Por padrão, o navegador envia os dados do formulário para a URL atual e recarrega a página. Chamar [`e.preventDefault()`](https://developer.mozilla.org/pt-BR/docs/Web/API/Event/preventDefault) no manipulador de eventos substitui esse comportamento.

Se você também passar uma função para `action`, o React a executa depois de `onSubmit`, a menos que `onSubmit` chame `e.preventDefault()`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

`onSubmit` funciona em todas as versões do React e dá acesso direto ao [evento de envio](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLFormElement/submit_event). A partir do React 19, a [prop `action`](#handle-form-submission-with-an-action-prop) é a API preferida para envios de formulário. Com `action`, o React executa o envio em uma [Transition](/reference/react/useTransition) e gerencia o estado pendente e a concorrência entre vários envios. Você também pode usar atualizações otimistas, Error Boundaries e [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Manipulando o envio de formulário com uma prop action {/*handle-form-submission-with-an-action-prop*/}

Passe uma função para a prop `action` para executá-la quando o formulário for enviado. O React chama a função com um objeto [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) contendo os valores de cada input com um atributo `name`. Seus inputs podem ser [não controlados](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). Você não precisa de pares `value`/`onChange`, de um manipulador `onSubmit` nem de `e.preventDefault()`.

Quando você passa uma função para `action`, o React:

* Executa a função em uma [Transition](/reference/react/useTransition).
* Disponibiliza o estado pendente para os componentes filhos por meio de [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propaga quaisquer erros para o Error Boundary mais próximo.
* Redefine os campos não controlados do formulário quando a função é concluída com sucesso. Para manter os valores deles, veja [Preservando os valores do formulário após uma Action](#preserve-form-values-after-an-action).

Se você manipular o envio manualmente, pode [solicitar o mesmo comportamento de redefinição com `requestFormReset`](/reference/react-dom/requestFormReset#requesting-a-reset-in-a-custom-form-action).

Como a Action é executada em uma Transition, você também pode usar [`useActionState`](/reference/react/useActionState) para gerenciar o estado do formulário e [`useOptimistic`](/reference/react/useOptimistic) para UI otimista. Para [Server Functions](/reference/rsc/server-functions) e aprimoramento progressivo, veja [Manipulando o envio de formulário com uma Server Function](#handle-form-submission-with-a-server-function).

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

---

### Manipulando o envio de formulário com uma Server Function {/*handle-form-submission-with-a-server-function*/}

A prop `action` de um `<form>` pode executar uma Server Function (uma função marcada com [`'use server'`](/reference/rsc/use-server)) quando o usuário envia o formulário. Os usuários podem enviar esse formulário antes que o JavaScript seja carregado ou quando o JavaScript estiver desativado. Isso corresponde à maneira como os formulários se comportam quando você passa uma URL para `action`.

O React chama a Server Function com o [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) do formulário, que inclui cada input com um atributo `name`. Para passar dados adicionais, como um ID vindo das props, veja [Passando dados extras para uma Action](#passing-extra-data-to-an-action).

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Passing extra data to an Action {/*passing-extra-data-to-an-action*/}

An Action receives the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). To include data the user did not enter, such as an ID from props, use one of these approaches:

* **Hidden fields** add the value to `FormData`. The value appears in the HTML, and `formData.get` returns a string. Users can submit the form before JavaScript loads.
* **Binding with `bind`** passes the value as an argument to a Server Function, before `formData`. The argument keeps its type, so a number stays a number. It must be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values). Users can submit the form before JavaScript loads.
* **A function in the component** reads props and state directly. It runs after JavaScript loads, then calls a Server Function with those values.

The client sends hidden field values and bound arguments. Check on the server that the logged-in user is allowed to perform the Action. See [Security considerations](/reference/rsc/use-server#security).

#### Hidden fields {/*passing-extra-data-hidden-fields*/}

In a Server Component, render an `<input type="hidden">` with a `name` and `value`. React includes that value in the `FormData` passed to the Action.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    await updateCart(formData.get('productId'));
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

React includes a submit button's `name` and `value` in `FormData` when that button submits the form.

#### Binding with `bind` {/*passing-extra-data-bind*/}

In a Server Component, call [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) on the Server Function and pass the bound function to `action`. Pass `null` as the first argument to `bind`. Each argument after `null` comes before the `formData` argument React passes when the form is submitted.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

Quando o formulário é enviado, o React chama `addProductToCart(formData)`, que chama `addToCart(productId, formData)`.

Se você também usar [`useActionState`](/reference/react/useActionState), a Server Function recebe `productId`, `previousState` e `formData`, nessa ordem. Defina essa função em um arquivo separado e faça o bind dela a partir do Client Component.

#### Uma função no componente {/*passing-extra-data-function*/}

Defina a função passada para `action` no Client Component para que ela possa ler as props ou o state do componente. Essa função passa esses valores para uma Server Function.

```jsx
// AddToCart.js
'use client';

import { updateCart } from './actions.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    await updateCart(productId, formData);
  }
  return (
    <form action={addToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function updateCart(productId, formData) {
  // ...
}
```

Como `addToCart` é executada no navegador, o JavaScript do componente precisa ser carregado antes que o formulário possa ser enviado.

</DeepDive>

---

### Exibindo um estado pendente durante o envio do formulário {/*display-a-pending-state-during-form-submission*/}

Para exibir um estado pendente quando um formulário está sendo enviado, você pode chamar o Hook [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) em um componente renderizado em um `<form>` e ler a propriedade `pending` retornada.

Aqui, usamos a propriedade `pending` para indicar que o formulário está sendo enviado.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Para saber mais sobre o Hook `useFormStatus`, consulte a [documentação de referência](/reference/react-dom/hooks/useFormStatus).

---

### Atualizando otimistamente dados do formulário {/*optimistically-updating-form-data*/}

O Hook [`useOptimistic`](/reference/react/useOptimistic) fornece uma maneira de atualizar otimistamente a interface do usuário antes que uma operação em segundo plano, como uma solicitação de rede, seja concluída. No contexto de formulários, essa técnica ajuda a tornar os aplicativos mais responsivos. Quando um usuário envia um formulário, em vez de esperar pela resposta do servidor para refletir as alterações, a interface é imediatamente atualizada com o resultado esperado.

Por exemplo, quando um usuário digita uma mensagem no formulário e pressiona o botão "Enviar", o Hook `useOptimistic` permite que a mensagem apareça imediatamente na lista com um rótulo "Enviando...", mesmo antes que a mensagem seja realmente enviada para um servidor. Essa abordagem "otimista" dá a impressão de velocidade e responsividade. O formulário então tenta enviar a mensagem de verdade em segundo plano. Depois que o servidor confirma que a mensagem foi recebida, o rótulo "Enviando..." é removido.

<Sandpack>

```js src/App.js
import { startTransition, useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef(null);
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: 'Hello there!', sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    startTransition(() => {
      setMessages((messages) => [...messages, { text: sentMessage }]);
    });
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  // Simulate a message delivery delay
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

Para saber mais sobre o Hook `useOptimistic`, consulte a [documentação de referência](/reference/react/useOptimistic).

---

### Lidando com erros de envio de formulário {/*handling-form-submission-errors*/}

Para tratar erros lançados por uma função passada para a prop `action` de um `<form>`, envolva o formulário em um [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). O React exibe o fallback do boundary quando a função lança um erro.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

#### Lidando com erros de envio de formulário antes do carregamento do JavaScript {/*display-a-form-submission-error-without-javascript*/}

Exibir uma mensagem de erro de envio de formulário antes que o bundle JavaScript seja carregado para aprimoramento progressivo exige que:

1. `<form>` seja renderizado por um [Client Component](/reference/rsc/use-client)
1. a função passada para a prop `action` do `<form>` seja uma [Server Function](/reference/rsc/server-functions)
1. o Hook [`useActionState`](/reference/react/useActionState) seja usado para exibir a mensagem de erro

Defina a Server Function em um arquivo separado com a diretiva [`'use server'`](/reference/rsc/use-server). Ela recebe o estado anterior seguido do `FormData` enviado:

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When a function passed to `action` or `formAction` completes without throwing, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You may want to keep the submitted values after saving edits, or when the Action returns a [validation error](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).

To preserve those values, you can store them with [`useState`](/reference/react/useState) and pass them to each field's [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input). Update the state when the Action finishes. React applies the updated defaults before resetting the form, so the fields keep those values.

Try changing the title and clicking **Save**. In this example, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) shows "Saving..." during a simulated one-second request. Then `setTitle` updates the saved title and preserves it in the input.

<Sandpack>

```js src/App.js
import { startTransition, useState } from 'react';
import SaveButton from './SaveButton.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    startTransition(() => {
      setTitle(formData.get('title'));
    });
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <SaveButton />
      <p>Saved title: {title}</p>
    </form>
  );
}
```

```js src/SaveButton.js hidden
import { useFormStatus } from 'react-dom';

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

</Sandpack>

A chamada a `setTitle` [após o `await`](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) precisa de outro [`startTransition`](/reference/react/startTransition) para marcá-la como uma atualização de Transition.

`saveAction` também pode chamar uma [Server Function](/reference/rsc/server-functions) e armazenar o valor retornado por ela:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

Adicione [`'use client'`](/reference/rsc/use-client) no topo do arquivo do componente, importe `submitTitle` e substitua `saveAction`. O restante do formulário permanece igual:

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### Preservando os valores do formulário antes do carregamento do JavaScript {/*preserving-form-values-before-javascript-loads*/}

Com [`useActionState`](/reference/react/useActionState), o React pode exibir o valor retornado por uma [Server Function](/reference/rsc/server-functions) antes que a hidratação seja concluída. O formulário pode usar esses valores como seus novos valores padrão. Em um [Client Component](/reference/rsc/use-client), `useActionState` recebe a Server Function e retorna uma Action para a prop `action` do formulário.

Veja [Lidando com erros de envio de formulário antes do carregamento do JavaScript](#display-a-form-submission-error-without-javascript) para o mesmo comportamento com erros.

A Server Function recebe o estado anterior seguido do `FormData` enviado. Neste exemplo, `updateTitle` salva o título e retorna `{ title }`, que se torna o novo estado. Passar `state.title` para `defaultValue` preserva o título salvo após a redefinição:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

<DeepDive>

#### Outras maneiras de controlar a redefinição do formulário {/*other-ways-to-control-form-resets*/}

Os exemplos acima mantêm cada valor enviado armazenando-o antes da redefinição. Você também pode escolher quais valores sobrevivem, ou quando a redefinição acontece:

* **Manter os valores apenas quando a validação falhar.** Retorne o mesmo formato de estado em todos os envios. Quando a validação falhar, inclua o `FormData` enviado e leia cada campo com `state.submitted?.get('title') ?? ''`. Quando a validação for bem-sucedida, defina esse `FormData` como `null` para que a redefinição limpe esses campos. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) mostra esse padrão.

* **Pular a redefinição com `onSubmit`.** Manipule o envio em `onSubmit`, chame `e.preventDefault()` e execute a Action dentro de [`startTransition`](/reference/react/useTransition). Como a `action` do formulário não é executada, o React não redefine o formulário.

* **Redefinir em um momento específico.** Chame o método [`reset()`](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLFormElement/reset) do elemento do formulário para redefinir imediatamente os campos não controlados para seus valores padrão. Para agendar uma redefinição como parte de uma Action ou Transition, chame [`requestFormReset`](/reference/react-dom/requestFormReset) de `react-dom`.

* **Redefinir o formulário e o estado do componente juntos.** Altere a [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) do componente que renderiza o formulário. O React recria o componente e seu DOM, o que redefine os campos e qualquer estado local.

</DeepDive>

---

### Lidar com vários tipos de envio {/*handling-multiple-submission-types*/}

Um formulário pode ter mais de um botão de envio, cada um executando uma Action diferente. Um botão sem `formAction` executa a `action` do formulário; um botão com `formAction` executa sua própria Action. Por exemplo, o formulário abaixo publica um artigo por padrão, mas seu botão **Save draft** armazena o conteúdo atual sem publicá-lo. Ele usa [`useActionState`](/reference/react/useActionState) para preservar o rascunho salvo:

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Preserve the saved draft after submission
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### My form fields are cleared after submission {/*my-form-fields-are-cleared-after-submission*/}

When a function passed to `action` or `formAction` succeeds, React resets the form's uncontrolled fields to their default values. Text fields without a `defaultValue` become empty. Returning a validation error instead of throwing also triggers this reset.

To keep a submitted value, store it in state and pass it to the field's `defaultValue`. See [Preserving form values after an Action](#preserve-form-values-after-an-action) for examples, or [preserving values when validation fails](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).
