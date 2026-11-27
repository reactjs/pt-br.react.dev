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

### Criando uma Função do Servidor em um Componente do Servidor {/*creating-a-server-function-from-a-server-component*/}

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

### Importando uma Função do Servidor em um Componente Cliente {/*importing-server-functions-from-client-components*/}

Componentes Cliente podem importar Funções do Servidor de arquivos que usam a diretiva `"use server"`:

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

### Chamando uma Função do Servidor a partir de uma Ação {/*server-functions-with-actions*/}

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

Para mais informações, consulte a documentação para [Chamando uma Função do Servidor fora de `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passando uma Função do Servidor para a prop `action` de `<form>` {/*using-server-functions-with-form-actions*/}

Funções do Servidor funcionam com os novos recursos de Formulário no React 19.

Passe uma Função do Servidor para a prop `action` de `<form>` para enviar o formulário ao servidor. O React passa o [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) enviado para a Função do Servidor como seu primeiro argumento:

```js [[1, 4, "updateName"]]
// actions.js
"use server";

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

Quando a Função do Servidor passada para a prop `action` de `<form>` for bem-sucedida, o React redefinirá automaticamente os campos não controlados do formulário. Os usuários podem enviar o formulário antes que o bundle JavaScript seja carregado. Use `useActionState` para acessar o estado pendente da Ação e o valor retornado mais recente.

Para mais informações, consulte a documentação para [Funções do Servidor em Formulários](/reference/rsc/use-server#server-functions-in-forms).

### Chamando uma Função do Servidor com `useActionState` {/*server-functions-with-use-action-state*/}

Chame uma Função do Servidor com `useActionState` para acessar o estado pendente da Ação e o valor retornado mais recente. A Função do Servidor recebe o estado anterior como primeiro argumento e o [`FormData`](https://developer.mozilla.org/pt-BR/docs/Web/API/FormData) enviado como segundo argumento. Seu valor de retorno se torna o próximo estado:

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

Quando a função passada para `useActionState` é uma Função do Servidor, os usuários podem enviar o formulário antes que a hidratação termine. O React pode exibir o valor retornado pela Função do Servidor antes que o JavaScript seja carregado.

Para mais informações, consulte a documentação para [`useActionState`](/reference/react/useActionState).

Para manter os valores enviados ou controlar quando o formulário é redefinido, consulte [Preservando os valores do formulário após uma Ação](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Oferecendo suporte a aprimoramento progressivo com `useActionState` {/*progressive-enhancement-with-useactionstate*/}

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

Se você passar o <CodeStep step={2}>`permalink`</CodeStep> para `useActionState`, o navegador navegará para essa URL quando o formulário for enviado antes que o bundle JavaScript seja carregado. No destino, renderize o mesmo componente de formulário com a mesma Função do Servidor e o mesmo `permalink` para que o React possa passar o estado retornado para ele.

Para mais informações, consulte a documentação para [`useActionState`](/reference/react/useActionState).
