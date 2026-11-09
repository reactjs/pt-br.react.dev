---
title: Funções do Servidor
---

<RSC>

Funções do Servidor são para uso em [Componentes do Servidor React](/reference/rsc/server-components).

**Observação:** Até setembro de 2024, nos referíamos a todas as Funções do Servidor como "Ações do Servidor". Se uma Função do Servidor for passada para uma propriedade `action` ou chamada de dentro de uma ação, então ela é uma Ação do Servidor, mas nem todas as Funções do Servidor são Ações do Servidor. A nomenclatura nesta documentação foi atualizada para refletir que as Funções do Servidor podem ser usadas para múltiplos propósitos.

</RSC>

<Intro>

As Funções do Servidor permitem que Componentes Cliente chamem funções assíncronas executadas no servidor.

</Intro>

<InlineToc />

<Note>

#### Como eu construo suporte para as Funções do Servidor? {/*how-do-i-build-support-for-server-functions*/}

Embora as Funções do Servidor no React 19 sejam estáveis e não quebrarão entre versões secundárias, as APIs subjacentes usadas para implementar Funções do Servidor em um bundler ou framework de Componentes do Servidor React não seguem semver e podem quebrar entre secundárias no React 19.x.

Para oferecer suporte às Funções do Servidor como um bundler ou framework, recomendamos fixar em uma versão específica do React ou usar o lançamento Canary. Continuaremos trabalhando com bundlers e frameworks para estabilizar as APIs usadas para implementar Funções do Servidor no futuro.

</Note>

Quando uma Função do Servidor é definida com a diretiva [`"use server"`](/reference/rsc/use-server), seu framework criará automaticamente uma referência à Função do Servidor e passará essa referência para o Componente Cliente. Quando essa função for chamada no cliente, o React enviará uma requisição para o servidor para executar a função e retornará o resultado.

As Funções do Servidor podem ser criadas em Componentes do Servidor e passadas como props para Componentes Cliente, ou podem ser importadas e usadas em Componentes Cliente.

## Uso {/*usage*/}

<<<<<<< HEAD
### Criando uma Função do Servidor de um Componente do Servidor {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Componentes do Servidor podem definir Funções do Servidor com a diretiva `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Componente do Servidor
import Button from './Button';

function EmptyNote() {
  async function createNoteAction() {
    // Função do Servidor
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

Quando o React renderiza o Componente do Servidor `EmptyNote`, ele criará uma referência à função `createNoteAction` e passará essa referência para o Componente Cliente `Button`. Quando o botão for clicado, o React enviará uma requisição para o servidor para executar a função `createNoteAction` com a referência fornecida:

```js {5}
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

Para mais informações, consulte a documentação para [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD
### Importando Funções do Servidor de Componentes Cliente {/*importing-server-functions-from-client-components*/}

Componentes Cliente podem importar Funções do Servidor de arquivos que usam a diretiva `"use server"`:
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}

Client Components can import Server Functions from files that use the `"use server"` directive:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

Quando o bundler constrói o Componente Cliente `EmptyNote`, ele criará uma referência à função `createNote` no bundle. Quando o `button` for clicado, o React enviará uma requisição para o servidor para executar a função `createNote` usando a referência fornecida:

```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

Para mais informações, consulte a documentação para [`"use server"`](/reference/rsc/use-server).

<<<<<<< HEAD
### Funções do Servidor com Ações {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Funções do Servidor podem ser chamadas de Ações no cliente:

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  );
}
```

Isso permite que você acesse o estado `isPending` da Função do Servidor, encapsulando-a em uma Ação no cliente.

<<<<<<< HEAD
Para mais informações, consulte a documentação para [Chamando uma Função do Servidor fora de `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form)

### Funções do Servidor com Ações de Formulário {/*using-server-functions-with-form-actions*/}

Funções do Servidor funcionam com os novos recursos de Formulário no React 19.

Você pode passar uma Função do Servidor para um Formulário para automaticamente enviar o formulário ao servidor:
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}

Server Functions work with the new Form features in React 19.

Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:

```js [[1, 4, "updateName"]]
// actions.js
"use server";
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
Quando a submissão do Formulário for bem-sucedida, o React redefinirá automaticamente o formulário. Você pode adicionar `useActionState` para acessar o estado pendente, a última resposta ou para oferecer suporte a aprimoramento progressivo.
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Para mais informações, consulte a documentação para [Funções do Servidor em Formulários](/reference/rsc/use-server#server-functions-in-forms).

<<<<<<< HEAD
### Funções do Servidor com `useActionState` {/*server-functions-with-use-action-state*/}

Você pode chamar Funções do Servidor com `useActionState` para o caso comum em que você só precisa acessar o estado pendente da ação e a última resposta retornada:
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

<<<<<<< HEAD
Ao usar `useActionState` com Funções do Servidor, o React também reproduzirá automaticamente as submissões de formulário inseridas antes que a hidratação termine. Isso significa que os usuários podem interagir com seu aplicativo mesmo antes que o aplicativo tenha hidratado.
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Para mais informações, consulte a documentação para [`useActionState`](/reference/react/useActionState).

<<<<<<< HEAD
### Aprimoramento progressivo com `useActionState` {/*progressive-enhancement-with-useactionstate*/}
=======
To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Funções do Servidor também oferecem suporte a aprimoramento progressivo com o terceiro argumento de `useActionState`.

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
Quando o <CodeStep step={2}>permalink</CodeStep> for fornecido para `useActionState`, o React redirecionará para a URL fornecida se o formulário for enviado antes que o bundle JavaScript seja carregado.
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

Para mais informações, consulte a documentação para [`useActionState`](/reference/react/useActionState).
