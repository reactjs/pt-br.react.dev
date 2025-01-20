---
title: Ações do Servidor
canary: true
---

<Intro>

As Ações do Servidor permitem que Componentes de Cliente chamem funções assíncronas executadas no servidor.

</Intro>

<InlineToc />

<Note>

#### Como posso adicionar suporte para Ações do Servidor? {/*how-do-i-build-support-for-server-actions*/}

Enquanto as Ações do Servidor no React 19 são estáveis e não quebrarão entre versões principais, as APIs subjacentes usadas para implementar Ações do Servidor em um empacotador ou framework de Componentes do Servidor do React não seguem o semver e podem quebrar entre versões menores no React 19.x.

Para suportar Ações do Servidor como um empacotador ou framework, recomendamos travar em uma versão específica do React ou usar a versão Canary. Continuaremos trabalhando com empacotadores e frameworks para estabilizar as APIs usadas para implementar Ações do Servidor no futuro.

</Note>

Quando uma Ação do Servidor é definida com a diretiva `"use server"`, seu framework criará automaticamente uma referência à função do servidor e passará essa referência para o Componente de Cliente. Quando essa função é chamada no cliente, o React enviará uma solicitação ao servidor para executar a função e retornar o resultado.

As Ações do Servidor podem ser criadas em Componentes do Servidor e passadas como props para Componentes de Cliente, ou podem ser importadas e usadas em Componentes de Cliente.

### Criando uma Ação do Servidor a partir de um Componente do Servidor {/*creating-a-server-action-from-a-server-component*/}

Os Componentes do Servidor podem definir Ações do Servidor com a diretiva `"use server"`:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Componente do Servidor
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Ação do Servidor
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

Quando o React renderiza o Componente do Servidor `EmptyNote`, ele criará uma referência à função `createNoteAction` e passará essa referência para o Componente de Cliente `Button`. Quando o botão for clicado, o React enviará uma solicitação ao servidor para executar a função `createNoteAction` com a referência fornecida:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Criar Nota Vazia</button>
}
```

Para mais, veja a documentação sobre [`"use server"`](/reference/rsc/use-server).

### Importando Ações do Servidor a partir de Componentes de Cliente {/*importing-server-actions-from-client-components*/}

Os Componentes de Cliente podem importar Ações do Servidor de arquivos que usam a diretiva `"use server"`:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

Quando o empacotador constrói o Componente de Cliente `EmptyNote`, ele criará uma referência à função `createNoteAction` no pacote. Quando o `button` for clicado, o React enviará uma solicitação ao servidor para executar a função `createNoteAction` usando a referência fornecida:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

Para mais, veja a documentação sobre [`"use server"`](/reference/rsc/use-server).

### Compondo Ações do Servidor com Ações {/*composing-server-actions-with-actions*/}

As Ações do Servidor podem ser compostas com Ações no cliente:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'O nome é obrigatório'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Falhou: {state.error}</span>}
    </form>
  )
}
```

Isso permite que você acesse o estado `isPending` da Ação do Servidor ao encapsulá-la em uma Ação no cliente.

Para mais, veja a documentação sobre [Chamando uma Ação do Servidor fora de `<form>`](/reference/rsc/use-server#calling-a-server-action-outside-of-form).

### Ações de Formulário com Ações do Servidor {/*form-actions-with-server-actions*/}

As Ações do Servidor funcionam com os novos recursos de Formulário no React 19.

Você pode passar uma Ação do Servidor para um Formulário para enviar automaticamente o formulário para o servidor:

```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Quando a submissão do Formulário for bem-sucedida, o React irá automaticamente redefinir o formulário. Você pode adicionar `useActionState` para acessar o estado pendente, a última resposta ou para suportar melhoria progressiva.

Para mais, veja a documentação sobre [Ações do Servidor em Formulários](/reference/rsc/use-server#server-actions-in-forms).

### Ações do Servidor com `useActionState` {/*server-actions-with-use-action-state*/}

Você pode compor Ações do Servidor com `useActionState` para o caso comum em que você apenas precisa acessar o estado pendente da ação e a última resposta retornada:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Falhou: {state.error}</span>}
    </form>
  );
}
```

Ao usar `useActionState` com Ações do Servidor, o React também irá automaticamente reproduzir as submissões de formulários inseridas antes que a hidratação termine. Isso significa que os usuários podem interagir com seu aplicativo mesmo antes que ele tenha sido hidratado.

Para mais, veja a documentação sobre [`useActionState`](/reference/react-dom/hooks/useFormState).

### Melhoria progressiva com `useActionState` {/*progressive-enhancement-with-useactionstate*/}

As Ações do Servidor também suportam melhoria progressiva com o terceiro argumento de `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

Quando o <CodeStep step={2}>permalink</CodeStep> é fornecido para `useActionState`, o React irá redirecionar para a URL fornecida se o formulário for submetido antes que o pacote JavaScript carregue.

Para mais, veja a documentação sobre [`useActionState`](/reference/react-dom/hooks/useFormState).