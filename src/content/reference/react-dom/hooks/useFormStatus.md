---
title: useFormStatus
canary: true
---

<Canary>

O Hook `useFormStatus` está atualmente disponível apenas nos canais Canary e experimentais do React. Saiba mais sobre [os canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

O `useFormStatus` é um Hook que fornece informações de status da última submissão de formulário.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

O Hook `useFormStatus` fornece informações de status da última submissão de formulário.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submeter</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

Para obter informações de status, o componente `Submit` deve ser renderizado dentro de um `<form>`. O Hook retorna informações como a propriedade <CodeStep step={1}>`pending`</CodeStep>, que indica se o formulário está em processo de submissão.

No exemplo acima, o `Submit` usa essas informações para desabilitar os cliques no `<button>` enquanto o formulário está sendo submetido.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

O `useFormStatus` não aceita nenhum parâmetro.

#### Retornos {/*returns*/}

Um objeto `status` com as seguintes propriedades:

* `pending`: Um booleano. Se `true`, isso significa que o `<form>` pai está pendente de submissão. Caso contrário, `false`.

* `data`: Um objeto que implementa a [`interface FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) que contém os dados que o `<form>` pai está submetendo. Se não houver uma submissão ativa ou nenhum `<form>` pai, será `null`.

* `method`: Um valor string que pode ser `'get'` ou `'post'`. Isso representa se o `<form>` pai está submetendo com o método [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) que pode ser `GET` ou `POST`. Por padrão, um `<form>` usará o método `GET` e isso pode ser especificado pela propriedade [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method).

[//]: # (Link para a documentação do `<form>`. "Leia mais sobre a propriedade `action` no `<form>`.")
* `action`: Uma referência à função passada pela propriedade `action` no `<form>` pai. Se não houver um `<form>` pai, a propriedade será `null`. Se houver um valor de URI fornecido para a propriedade `action`, ou nenhuma propriedade `action` especificada, `status.action` será `null`.

#### Ressalvas {/*caveats*/}

* O Hook `useFormStatus` deve ser chamado de um componente que é renderizado dentro de um `<form>`. 
* O `useFormStatus` só retornará informações de status para um `<form>` pai. Ele não retornará informações de status para qualquer `<form>` renderizado no mesmo componente ou nos componentes filhos.

---

## Uso {/*usage*/}

### Exibir um estado pendente durante a submissão do formulário {/*display-a-pending-state-during-form-submission*/}
Para exibir um estado pendente enquanto um formulário está sendo submetido, você pode chamar o Hook `useFormStatus` em um componente renderizado em um `<form>` e ler a propriedade `pending` retornada.

Aqui, usamos a propriedade `pending` para indicar que o formulário está sendo submetido. 

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submetendo..." : "Submeter"}
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

<Pitfall>

##### `useFormStatus` não retornará informações de status para um `<form>` renderizado no mesmo componente. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

O Hook `useFormStatus` apenas retorna informações de status para um `<form>` pai e não para qualquer `<form>` renderizado no mesmo componente que chama o Hook, ou componentes filhos.

```js
function Form() {
  // 🚩 `pending` nunca será true
  // useFormStatus não rastreia o formulário renderizado neste componente
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

Em vez disso, chame o `useFormStatus` de dentro de um componente que está localizado dentro do `<form>`.

```js
function Submit() {
  // ✅ `pending` será derivado do formulário que envolve o componente Submit
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // Este é o <form> que o useFormStatus rastreia
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### Ler os dados do formulário que estão sendo submetidos {/*read-form-data-being-submitted*/}

Você pode usar a propriedade `data` das informações de status retornadas pelo `useFormStatus` para exibir quais dados estão sendo submetidos pelo usuário.

Aqui, temos um formulário onde os usuários podem solicitar um nome de usuário. Podemos usar o `useFormStatus` para exibir uma mensagem de status temporária confirmando qual nome de usuário eles solicitaram.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Solicitar um Nome de Usuário: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submeter
      </button>
      <br />
      <p>{data ? `Solicitando ${data?.get("username")}...`: ''}</p>
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

---

## Solução de Problemas {/*troubleshooting*/}

### `status.pending` nunca é `true` {/*pending-is-never-true*/}

O `useFormStatus` apenas retornará informações de status para um `<form>` pai. 

Se o componente que chama o `useFormStatus` não estiver aninhado em um `<form>`, `status.pending` sempre retornará `false`. Verifique se o `useFormStatus` é chamado em um componente que é filho de um elemento `<form>`.

O `useFormStatus` não rastreará o status de um `<form>` renderizado no mesmo componente. Veja [Pitfall](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) para mais detalhes.