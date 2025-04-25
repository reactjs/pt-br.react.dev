---
title: useFormStatus
---

<Intro>

`useFormStatus` é um Hook que te dá informações de status da última submissão do formulário.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

O Hook `useFormStatus` fornece informações de status da última submissão do formulário.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Para obter informações de status, o componente `Submit` deve ser renderizado dentro de um `<form>`. O Hook retorna informações como a propriedade <CodeStep step={1}>`pending`</CodeStep>, que te diz se o formulário está enviando ativamente.

No exemplo acima, `Submit` usa essa informação para desabilitar os cliques no `<button>` enquanto o formulário está enviando.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

`useFormStatus` não aceita nenhum parâmetro.

#### Retorna {/*returns*/}

Um objeto `status` com as seguintes propriedades:

* `pending`: Um booleano. Se `true`, isso significa que o `<form>` pai está pendente de envio. Caso contrário, `false`.

* `data`: Um objeto implementando a [`FormData interface`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) que contém os dados que o `<form>` pai está enviando. Se não houver envio ativo ou nenhum `<form>` pai, ele será `null`.

* `method`: Um valor de string de `'get'` ou `'post'`. Isso representa se o `<form>` pai está enviando com um [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) `GET` ou `POST`. Por padrão, um `<form>` usará o método `GET` e pode ser especificado pela propriedade [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: Uma referência para a função passada para a prop `action` no `<form>` pai. Se não houver um `<form>` pai, a propriedade é `null`. Se houver um valor URI fornecido para a prop `action`, ou nenhuma prop `action` especificada, `status.action` será `null`.

#### Ressalvas {/*caveats*/}

* O Hook `useFormStatus` deve ser chamado de um componente que é renderizado dentro de um `<form>`.
* `useFormStatus` só retornará informações de status para um `<form>` pai. Ele não retornará informações de status para nenhum `<form>` renderizado no mesmo componente ou em componentes filhos.

---

## Uso {/*usage*/}

### Exibir um estado pendente durante o envio do formulário {/*display-a-pending-state-during-form-submission*/}

Para exibir um estado pendente enquanto um formulário está enviando, você pode chamar o Hook `useFormStatus` em um componente renderizado em um `<form>` e ler a propriedade `pending` retornada.

Aqui, usamos a propriedade `pending` para indicar que o formulário está sendo enviado.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```
</Sandpack>

<Pitfall>

##### `useFormStatus` não retornará informações de status para um `<form>` renderizado no mesmo componente. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

O Hook `useFormStatus` só retorna informações de status para um `<form>` pai e não para nenhum `<form>` renderizado no mesmo componente que chama o Hook, ou componentes filhos.

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Em vez disso, chame `useFormStatus` de dentro de um componente que está localizado dentro do `<form>`.

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Ler os dados do formulário que estão sendo enviados {/*read-form-data-being-submitted*/}

Você pode usar a propriedade `data` das informações de status retornadas de `useFormStatus` para exibir quais dados estão sendo enviados pelo usuário.

Aqui, temos um formulário onde os usuários podem solicitar um nome de usuário. Podemos usar `useFormStatus` para exibir uma mensagem de status temporária confirmando qual nome de usuário eles solicitaram.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## Solução de problemas {/*troubleshooting*/}

### `status.pending` nunca é `true` {/*pending-is-never-true*/}

`useFormStatus` só retornará informações de status para um `<form>` pai.

Se o componente que chama `useFormStatus` não estiver aninhado em um `<form>`, `status.pending` sempre retornará `false`. Verifique se `useFormStatus` é chamado em um componente que é filho de um elemento `<form>`.

`useFormStatus` não rastreará o status de um `<form>` renderizado no mesmo componente. Veja [Ressalva](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) para mais detalhes.