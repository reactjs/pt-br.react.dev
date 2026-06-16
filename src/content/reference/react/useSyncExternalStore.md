---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` é um Hook do React que permite que você se inscreva em uma store externa.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Chame `useSyncExternalStore` no nível superior do seu componente para ler um valor de uma store de dados externa.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Ele retorna o snapshot dos dados na store. Você precisa passar duas funções como argumentos:

1.  A função `subscribe` deve se inscrever na store e retornar uma função que se desinscreva.
2.  A função `getSnapshot` deve ler um snapshot dos dados da store.

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

*   `subscribe`: Uma função que recebe um único argumento `callback` e o inscreve na store. Quando a store muda, ela deve invocar o `callback` fornecido, o que fará com que o React chame `getSnapshot` novamente e (se necessário) renderize novamente o componente. A função `subscribe` deve retornar uma função que limpa a inscrição.

*   `getSnapshot`: Uma função que retorna um snapshot dos dados na store que são necessários pelo componente. Enquanto a store não tiver mudado, as chamadas repetidas para `getSnapshot` deverão retornar o mesmo valor. Se a store mudar e o valor retornado for diferente (conforme comparado por [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), o React renderiza novamente o componente.

*   **opcional** `getServerSnapshot`: Uma função que retorna o snapshot inicial dos dados na store. Ele será usado apenas durante a renderização do servidor e durante a hidratação do conteúdo renderizado no servidor no cliente. O snapshot do servidor deve ser o mesmo entre o cliente e o servidor, e geralmente é serializado e passado do servidor para o cliente. Se você omitir esse argumento, renderizar o componente no servidor lançará um erro.

#### Retorna {/*returns*/}

O snapshot atual da store que você pode usar em sua lógica de renderização.

#### Ressalvas {/*caveats*/}

*   O snapshot da store retornado por `getSnapshot` deve ser **imutável**. Se a store subjacente tiver dados mutáveis, retorne um novo snapshot imutável se os dados tiverem mudado. Caso contrário, retorne um snapshot em cache existente.

*   Se uma função `subscribe` diferente for passada durante uma nova renderização, o React se reinscreverá na store usando a função `subscribe` recém-passada. Você pode evitar isso declarando `subscribe` fora do componente.

*   Se a store for alterada durante uma atualização de [Transição não bloqueante](/reference/react/useTransition), o React recorrerá à execução dessa atualização como bloqueante. Especificamente, para cada atualização de Transição, o React chamará `getSnapshot` uma segunda vez, logo antes de aplicar as alterações ao DOM. Se retornar um valor diferente do que quando foi chamado originalmente, o React reiniciará a atualização do zero, aplicando-a desta vez como uma atualização de bloqueio, para garantir que cada componente na tela esteja refletindo a mesma versão da store.

*  Não é recomendado _suspender_ uma renderização com base em um valor da store retornado por `useSyncExternalStore`. A razão é que as alterações na store externa não podem ser marcadas como [atualizações de Transição não bloqueantes](/reference/react/useTransition), então elas acionarão o [`Suspense` fallback](/reference/react/Suspense) mais próximo, substituindo o conteúdo já renderizado na tela por um indicador de carregamento, o que normalmente gera uma experiência do usuário ruim.

  Por exemplo, o seguinte é desencorajado:

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Chamando `use` com uma Promise dependente de `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Renderizando condicionalmente um componente lazy com base em `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## Uso {/*usage*/}

### Inscrevendo-se em uma store externa {/*subscribing-to-an-external-store*/}

A maioria dos seus componentes React só lerá dados de suas [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) e [context.](/reference/react/useContext) No entanto, às vezes, um componente precisa ler alguns dados de alguma store fora do React que muda com o tempo. Isso inclui:

*   Bibliotecas de gerenciamento de estado de terceiros que mantêm o estado fora do React.
*   APIs do navegador que expõem um valor mutável e eventos para se inscrever em suas mudanças.

Chame `useSyncExternalStore` no nível superior do seu componente para ler um valor de uma store de dados externa.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Ele retorna o <CodeStep step={3}>snapshot</CodeStep> dos dados na store. Você precisa passar duas funções como argumentos:

1.  A <CodeStep step={1}>função `subscribe`</CodeStep> deve se inscrever na store e retornar uma função que se desinscreva.
2.  A <CodeStep step={2}>função `getSnapshot`</CodeStep> deve ler um snapshot dos dados da store.

O React usará essas funções para manter seu componente inscrito na store e renderizá-lo novamente em caso de alterações.

Por exemplo, no sandbox abaixo, `todosStore` é implementado como uma store externa que armazena dados fora do React. O componente `TodosApp` se conecta a essa store externa com o Hook `useSyncExternalStore`.

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Sempre que possível, recomendamos o uso do state do React integrado com [`useState`](/reference/react/useState) e [`useReducer`](/reference/react/useReducer). A API `useSyncExternalStore` é útil principalmente se você precisar integrar-se a código existente não React.

</Note>

---

### Inscrevendo-se em uma API do navegador {/*subscribing-to-a-browser-api*/}

Outra razão para adicionar `useSyncExternalStore` é quando você deseja se inscrever em algum valor exposto pelo navegador que muda com o tempo. Por exemplo, suponha que você queira que seu componente exiba se a conexão de rede está ativa. O navegador expõe esta informação através de uma propriedade chamada [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Este valor pode mudar sem o conhecimento do React, então você deve lê-lo com `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Para implementar a função `getSnapshot`, leia o valor atual da API do navegador:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Em seguida, você precisa implementar a função `subscribe`. Por exemplo, quando `navigator.onLine` muda, o navegador dispara os eventos [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) e [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) no objeto `window`. Você precisa inscrever o argumento `callback` nos eventos correspondentes e, em seguida, retornar uma função que limpe as inscrições:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Agora o React sabe como ler o valor da API externa `navigator.onLine` e como se inscrever em suas alterações. Desconecte seu dispositivo da rede e observe que o componente é renderizado novamente em resposta:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Extraindo a lógica para um Hook personalizado {/*extracting-the-logic-to-a-custom-hook*/}

Normalmente, você não escreverá `useSyncExternalStore` diretamente em seus componentes. Em vez disso, você normalmente o chamará de seu próprio Hook personalizado. Isso permite que você use a mesma store externa de diferentes componentes.

Por exemplo, este Hook personalizado `useOnlineStatus` acompanha se a rede está online:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Agora diferentes componentes podem chamar `useOnlineStatus` sem repetir a implementação subjacente:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Adicionando suporte para renderização do servidor {/*adding-support-for-server-rendering*/}

Se seu aplicativo React usar [renderização do servidor,](/reference/react-dom/server) seus componentes React também serão executados fora do ambiente do navegador para gerar o HTML inicial. Isso cria alguns desafios ao conectar-se a uma store externa:

*   Se você estiver se conectando a uma API somente do navegador, ela não funcionará porque não existe no servidor.
*   Se você estiver se conectando a uma store de dados de terceiros, precisará que seus dados correspondam entre o servidor e o cliente.

Para resolver esses problemas, passe uma função `getServerSnapshot` como o terceiro argumento para `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

A função `getServerSnapshot` é semelhante a `getSnapshot`, mas ela é executada apenas em duas situações:

*   Ele é executado no servidor ao gerar o HTML.
*   Ele é executado no cliente durante a [hidratação](/reference/react-dom/client/hydrateRoot), ou seja, quando o React pega o HTML do servidor e o torna interativo.

Isso permite que você forneça o valor inicial do snapshot, que será usado antes que o aplicativo se torne interativo. Se não houver um valor inicial significativo para a renderização do servidor, omita este argumento para [forçar a renderização no cliente.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

<Note>

Certifique-se de que `getServerSnapshot` retorna exatamente os mesmos dados na renderização inicial do cliente que retornou no servidor. Por exemplo, se `getServerSnapshot` retornasse algum conteúdo da store pré-populado no servidor, você precisaria transferir esse conteúdo para o cliente. Uma maneira de fazer isso é emitir uma tag `<script>` durante a renderização do servidor que define uma global como `window.MY_STORE_DATA` e ler dessa global no cliente em `getServerSnapshot`. Sua store externa deve fornecer instruções sobre como fazer isso.

</Note>

---

## Solução de problemas {/*troubleshooting*/}

### Estou recebendo um erro: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Este erro significa que sua função `getSnapshot` retorna um novo objeto toda vez que é chamada, por exemplo:

```js {2-5}
function getSnapshot() {
  // 🔴 Não retorne sempre objetos diferentes de getSnapshot
  return {
    todos: myStore.todos
  };
}
```

O React renderizará novamente o componente se o valor de retorno `getSnapshot` for diferente da última vez. É por isso que, se você sempre retornar um valor diferente, entrará em um loop infinito e obterá esse erro.

Seu objeto `getSnapshot` deve retornar apenas um objeto diferente se algo realmente mudou. Se sua store contiver dados imutáveis, você pode retornar esses dados diretamente:

```js {2-3}
function getSnapshot() {
  // ✅ Você pode retornar dados imutáveis
  return myStore.todos;
}
```

Se seus dados da store forem mutáveis, sua função `getSnapshot` deverá retornar um snapshot imutável. Isso significa que *precisa* criar novos objetos, mas não deve fazer isso para cada chamada. Em vez disso, ele deve armazenar o último snapshot calculado e retornar o mesmo snapshot da última vez se os dados na store não tiverem mudado. Como você determina se os dados mutáveis foram alterados depende da sua store mutável.

---

### Minha função `subscribe` é chamada após cada nova renderização {/*my-subscribe-function-gets-called-after-every-re-render*/}

Esta função `subscribe` é definida *dentro* de um componente, portanto, é diferente em cada nova renderização:

```js {2-5}
function ChatIndicator() {
  // 🚩 Sempre uma função diferente, então o React se reinscreverá em cada nova renderização
  function subscribe() {
    // ...
  }

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```

O React se reinscreverá em sua store se você passar uma função `subscribe` diferente entre as novas renderizações. Se isso causar problemas de desempenho e você quiser evitar a reinscrição, mova a função `subscribe` para fora:

```js {1-4}
// ✅ Sempre a mesma função, então o React não precisará se inscrever novamente
function subscribe() {
  // ...
}

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Alternativamente, encapsule `subscribe` em [`useCallback`](/reference/react/useCallback) para se reinscrever apenas quando algum argumento mudar:

```js {2-5}
function ChatIndicator({ userId }) {
  // ✅ Mesma função, enquanto userId não mudar
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // ...
}
```
