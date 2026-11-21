---
title: useOptimistic
---

<Intro>

`useOptimistic` é um Hook do React que permite que você atualize a UI de forma otimista.

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useOptimistic(value, reducer?)` {/*useoptimistic*/}

Chame `useOptimistic` no nível superior do seu componente para criar estado otimista para um valor.

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `value`: O valor retornado quando não há Ações pendentes.
* **opcional** `reducer(currentState, action)`: A função redutora que especifica como o estado otimista é atualizado. Deve ser pura, deve receber o estado atual e os argumentos da ação redutora, e deve retornar o próximo estado otimista.

#### Retorna {/*returns*/}

`useOptimistic` retorna um array com exatamente dois valores:

1. `optimisticState`: O estado otimista atual. É igual a `value` a menos que uma Ação esteja pendente, caso em que é igual ao estado retornado por `reducer` (ou o valor passado para a função `set` se nenhum `reducer` foi fornecido).
2. A [função `set`](#setoptimistic) que permite atualizar o estado otimista para um valor diferente dentro de uma Ação.

---

### Funções `set`, como `setOptimistic(optimisticState)` {/*setoptimistic*/}

A função `set` retornada por `useOptimistic` permite atualizar o estado pela duração de uma [Ação](reference/react/useTransition#functions-called-in-starttransition-are-called-actions). Você pode passar o próximo estado diretamente, ou uma função que o calcula a partir do estado anterior:

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

#### Parâmetros {/*setoptimistic-parameters*/}

* `optimisticState`: O valor que você quer que o estado otimista tenha durante uma [Ação](reference/react/useTransition#functions-called-in-starttransition-are-called-actions). Se você forneceu um `reducer` para `useOptimistic`, esse valor será passado como segundo argumento para o seu reducer. Pode ser um valor de qualquer tipo.
    * Se você passar uma função como `optimisticState`, ela será tratada como uma _função atualizadora_. Deve ser pura, deve receber o estado pendente como único argumento, e deve retornar o próximo estado otimista. O React colocará sua função atualizadora em uma fila e re-renderizará o seu componente. Durante a próxima renderização, o React calculará o próximo estado aplicando os atualizadores enfileirados ao estado anterior, de forma similar aos [atualizadores do `useState`](/reference/react/useState#setstate-parameters).

#### Retorna {/*setoptimistic-returns*/}

As funções `set` não têm valor de retorno.

#### Ressalvas {/*setoptimistic-caveats*/}

* A função `set` deve ser chamada dentro de uma [Ação](reference/react/useTransition#functions-called-in-starttransition-are-called-actions). Se você chamar o setter fora de uma Ação, [o React mostrará um aviso](#an-optimistic-state-update-occurred-outside-a-transition-or-action) e o estado otimista será renderizado brevemente.

<DeepDive>

#### Como o estado otimista funciona {/*how-optimistic-state-works*/}

`useOptimistic` permite mostrar um valor temporário enquanto uma Ação está em andamento:

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

Quando o setter é chamado dentro de uma Ação, `useOptimistic` acionará uma re-renderização para mostrar esse estado enquanto a Ação está em andamento. Caso contrário, o `value` passado para `useOptimistic` é retornado.

Esse estado é chamado de "otimista" porque é usado para apresentar imediatamente ao usuário o resultado da execução de uma Ação, mesmo que a Ação leve tempo para ser concluída.

**Como a atualização flui**

1. **Atualização imediata**: Quando `setOptimistic('b')` é chamado, o React renderiza imediatamente com `'b'`.

2. **(Opcional) await na Ação**: Se você usar await na Ação, o React continua mostrando `'b'`.

3. **Transição agendada**: `setValue(newValue)` agenda uma atualização para o estado real.

4. **(Opcional) aguardar o Suspense**: Se `newValue` suspender, o React continua mostrando `'b'`.

5. **Commit de renderização única**: Finalmente, o `newValue` é commitado para `value` e `optimistic`.

Não há uma renderização extra para "limpar" o estado otimista. O estado otimista e o real convergem na mesma renderização quando a Transição é concluída.

<Note>

#### O estado otimista é temporário {/*optimistic-state-is-temporary*/}

O estado otimista só é renderizado enquanto uma Ação está em andamento; caso contrário, `value` é renderizado.

Se `saveChanges` retornou `'c'`, então tanto `value` quanto `optimistic` serão `'c'`, não `'b'`.

</Note>

**Como o estado final é determinado**

O argumento `value` para `useOptimistic` determina o que é exibido após a Ação terminar. Como isso funciona depende do padrão que você usa:

- **Valores fixos** como `useOptimistic(false)`: Após a Ação, `state` ainda é `false`, então a UI mostra `false`. Isso é útil para estados pendentes onde você sempre começa de `false`.

- **Props ou state passados** como `useOptimistic(isLiked)`: Se o pai atualizar `isLiked` durante a Ação, o novo valor será usado após a Ação ser concluída. É assim que a UI reflete o resultado da Ação.

- **Padrão redutor** como `useOptimistic(items, fn)`: Se `items` mudar enquanto a Ação está pendente, o React re-executará seu `reducer` com os novos `items` para recalcular o estado. Isso mantém suas adições otimistas sobre os dados mais recentes.

**O que acontece quando a Ação falha**

Se a Ação lança um erro, a Transição ainda termina, e o React renderiza com qualquer `value` que esteja atualmente. Como o pai normalmente só atualiza `value` em caso de sucesso, uma falha significa que `value` não mudou, então a UI mostra o que mostrava antes da atualização otimista. Você pode capturar o erro para mostrar uma mensagem ao usuário.

</DeepDive>

---

## Uso {/*usage*/}

### Adicionando estado otimista a um componente {/*adding-optimistic-state-to-a-component*/}

Chame `useOptimistic` no nível superior do seu componente para declarar um ou mais estados otimistas.

```js [[1, 4, "age"], [1, 5, "name"], [1, 6, "todos"], [2, 4, "optimisticAge"], [2, 5, "optimisticName"], [2, 6, "optimisticTodos"], [3, 4, "setOptimisticAge"], [3, 5, "setOptimisticName"], [3, 6, "setOptimisticTodos"], [4, 6, "reducer"]]
import { useOptimistic } from 'react';

function MyComponent({age, name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(age);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, reducer);
  // ...
```

`useOptimistic` retorna um array com exatamente dois itens:

1. O <CodeStep step={2}>estado otimista</CodeStep>, inicialmente definido como o <CodeStep step={1}>value</CodeStep> fornecido.
2. A <CodeStep step={3}>função set</CodeStep> que permite alterar temporariamente o estado durante uma [Ação](reference/react/useTransition#functions-called-in-starttransition-are-called-actions).
   * Se um <CodeStep step={4}>reducer</CodeStep> for fornecido, ele será executado antes de retornar o estado otimista.

Para usar o <CodeStep step={2}>estado otimista</CodeStep>, chame a função `set` dentro de uma Ação.

Ações são funções chamadas dentro de `startTransition`:

```js {3}
function onAgeChange(e) {
  startTransition(async () => {
    setOptimisticAge(42);
    const newAge = await postAge(42);
    setAge(newAge);
  });
}
```

O React renderizará o estado otimista `42` primeiro enquanto `age` permanece a idade atual. A Ação aguarda o POST e então renderiza o `newAge` para `age` e `optimisticAge`.

Veja [Como o estado otimista funciona](#how-optimistic-state-works) para uma análise detalhada.

<Note>

Ao usar [props de Ação](/reference/react/useTransition#exposing-action-props-from-components), você pode chamar a função set sem `startTransition`:

```js [[3, 2, "setOptimisticName"]]
async function submitAction() {
  setOptimisticName('Taylor');
  await updateName('Taylor');
}
```

Isso funciona porque props de Ação já são chamadas dentro de `startTransition`.

Para um exemplo, veja: [Usando estado otimista em props de Ação](#using-optimistic-state-in-action-props).

</Note>

---

### Usando estado otimista em props de Ação {/*using-optimistic-state-in-action-props*/}

Em uma [prop de Ação](/reference/react/useTransition#exposing-action-props-from-components), você pode chamar o setter otimista diretamente sem `startTransition`.

Este exemplo define estado otimista dentro de uma prop `submitAction` de `<form>`:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Alice');

  return <EditName name={name} action={setName} />;
}
```

```js src/EditName.js active
import { useOptimistic, startTransition } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, action }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    startTransition(() => {
      action(updatedName);
    })
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change it: </label>
        <input
          type="text"
          name="name"
          disabled={name !== optimisticName}
        />
      </p>
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise((res) => setTimeout(res, 1000));
  return name;
}
```

</Sandpack>

Neste exemplo, quando o usuário envia o formulário, `optimisticName` é atualizado imediatamente para mostrar o `newName` de forma otimista enquanto a requisição ao servidor está em andamento. Quando a requisição é concluída, `name` e `optimisticName` são renderizados com o `updatedName` real da resposta.

<DeepDive>

#### Por que isso não precisa de `startTransition`? {/*why-doesnt-this-need-starttransition*/}

Por convenção, props chamadas dentro de `startTransition` são nomeadas com "Action".

Como `submitAction` é nomeada com "Action", você sabe que já é chamada dentro de `startTransition`.

Veja [Expondo a prop `action` de componentes](/reference/react/useTransition#exposing-action-props-from-components) para o padrão de prop de Ação.

</DeepDive>

---

### Adicionando estado otimista a props de Ação {/*adding-optimistic-state-to-action-props*/}

Ao criar uma [prop de Ação](/reference/react/useTransition#exposing-action-props-from-components), você pode adicionar `useOptimistic` para mostrar feedback imediato.

Aqui está um botão que mostra "Enviando..." enquanto a `action` está pendente:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        startTransition(() => {
          setCount(c => c + 1);
        });
      }}>Increment</Button>
      {count > 0 && <p>Submitted {count}!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

Quando o botão é clicado, `setIsPending(true)` usa o estado otimista para mostrar imediatamente "Submitting..." e desabilitar o botão. Quando a Ação termina, `isPending` é renderizado como `false` automaticamente.

Esse padrão mostra automaticamente um estado pendente, não importa como a prop `action` seja usada com `Button`:

```js
// Mostra o estado pendente para uma atualização de estado
<Button action={() => { setState(c => c + 1) }} />

// Mostra o estado pendente para uma navegação
<Button action={() => { navigate('/done') }} />

// Mostra o estado pendente para um POST
<Button action={async () => { await fetch(/* ... */) }} />

// Mostra o estado pendente para qualquer combinação
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

O estado pendente vai ser exibido até que tudo na prop `action` termine.

<Note>

Você também pode usar [`useTransition`](/reference/react/useTransition) para obter o estado pendente via `isPending`.

A diferença é que `useTransition` fornece a função `startTransition`, enquanto `useOptimistic` funciona com qualquer Transição. Use o que fizer mais sentido para o seu componente.

</Note>

---

### Atualizando props ou estado de forma otimista {/*updating-props-or-state-optimistically*/}

Você pode envolver props ou estado em `useOptimistic` para atualizá-los imediatamente enquanto uma Ação está em andamento.

Neste exemplo, `LikeButton` recebe `isLiked` como prop e o alterna imediatamente quando clicado:

<Sandpack>

```js src/App.js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked
      console.log('⏳ setting optimistic state: ' + newValue);

      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);

      startTransition(() => {
        console.log('⏳ setting real state: ' + updatedValue );
        setIsLiked(updatedValue);
      });
    });
  }

  if (optimisticIsLiked !== isLiked) {
    console.log('✅ rendering optimistic state: ' + optimisticIsLiked);
  } else {
    console.log('✅ rendering real value: ' + optimisticIsLiked);
  }


  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike(value) {
  return await new Promise((res) => setTimeout(() => res(value), 1000));
  // Em um app real, isto atualizaria o servidor
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// Sem StrictMode, para que os logs da renderização dupla não apareçam.
root.render(<App />);
```

</Sandpack>

Quando o botão é clicado, `setOptimisticIsLiked` atualiza imediatamente o estado exibido para mostrar o coração como curtido. Enquanto isso, `await toggleLike` é executado em segundo plano. Quando o `await` termina, o `setIsLiked` do componente pai atualiza o estado `isLiked` "real", e o estado otimista é renderizado de acordo com esse novo valor.

<Note>

Este exemplo lê `optimisticIsLiked` para calcular o próximo valor. Isso funciona quando o estado base não vai mudar, mas, se o estado base puder mudar enquanto a sua Ação está pendente, talvez seja melhor usar uma função atualizadora ou o reducer.

Veja [Atualizando o estado com base no estado atual](#updating-state-based-on-current-state) para um exemplo.

</Note>

---

### Atualizando vários valores juntos {/*updating-multiple-values-together*/}

Quando uma atualização otimista afeta vários valores relacionados, use um reducer para atualizá-los juntos. Isso garante que a UI permaneça consistente.

Aqui está um botão de seguir que atualiza tanto o estado de seguir quanto a contagem de seguidores:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

O reducer recebe o novo valor de `isFollowing` e calcula tanto o novo estado de seguir quanto a contagem de seguidores atualizada em uma única atualização. Isso garante que o texto do botão e a contagem fiquem sempre sincronizados.


<DeepDive>

#### Escolhendo entre funções atualizadoras e reducers {/*choosing-between-updaters-and-reducers*/}

`useOptimistic` suporta dois padrões para calcular o estado com base no estado atual:

**Funções atualizadoras** funcionam como as [funções atualizadoras do useState](/reference/react/useState#updating-state-based-on-the-previous-state). Passe uma função para o setter:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducers** separam a lógica de atualização da chamada do setter:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Calcula o próximo estado com base no estado atual e na action
});
dispatch(action);
```

**Use funções atualizadoras** para cálculos em que a chamada do setter descreve naturalmente a atualização. É parecido com usar `setState(prev => ...)` com `useState`.

**Use reducers** quando precisar passar dados para a atualização (como qual item adicionar) ou quando tratar vários tipos de atualização com um único Hook.

**Por que usar um reducer?**

Reducers são essenciais quando o estado base pode mudar enquanto a sua Transição está pendente. Se `todos` mudar enquanto a sua adição está pendente (por exemplo, outro usuário adicionou um todo), o React vai executar o seu reducer de novo com o novo `todos` para recalcular o que mostrar. Isso garante que o seu novo todo seja adicionado à lista mais recente, e não a uma cópia desatualizada.

Uma função atualizadora como `setOptimistic(prev => [...prev, newItem])` só veria o estado do momento em que a Transição começou, perdendo quaisquer atualizações que tenham acontecido durante o trabalho assíncrono.

</DeepDive>

---

### Adicionando itens a uma lista de forma otimista {/*optimistically-adding-to-a-list*/}

Quando você precisar adicionar itens a uma lista de forma otimista, use um `reducer`:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>Add Todo</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(Adding...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // Em um app real, isto salvaria no servidor
  return { ...todo, pending: false };
}
```

</Sandpack>

O `reducer` recebe a lista atual de todos e o novo todo a adicionar. Isso é importante porque se a prop `todos` mudar enquanto sua adição está pendente (por exemplo, outro usuário adicionou um todo), o React atualizará seu estado otimista re-executando o reducer com a lista atualizada. Isso garante que seu novo todo seja adicionado à lista mais recente, não a uma cópia desatualizada.

<Note>

Cada item otimista inclui uma flag `pending: true` para que você possa mostrar o estado de carregamento para itens individuais. Quando o servidor responde e o pai atualiza a lista canônica `todos` com o item salvo, o estado otimista é atualizado para o item confirmado sem a flag pendente.

</Note>

---

### Tratando múltiplos tipos de `action` {/*handling-multiple-action-types*/}

Quando você precisa tratar múltiplos tipos de atualizações otimistas (como adicionar e remover itens), use um padrão redutor com objetos `action`.

Este exemplo de carrinho de compras mostra como tratar adição e remoção com um único reducer:

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({
          id: 1, name: 'T-Shirt', price: 25
        })}>
          Add T-Shirt ($25)
        </button>{' '}
        <button onClick={() => handleAdd({
          id: 2, name: 'Mug', price: 15
        })}>
          Add Mug ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button
                onClick={() => handleRemove(item.id)}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>Total: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

O reducer trata três tipos de `action` (`add`, `remove`, `update_quantity`) e retorna o novo estado otimista para cada um. Cada `action` define uma flag `pending: true` para que você possa mostrar feedback visual enquanto a [Função do Servidor](/reference/rsc/server-functions) é executada.

---

### Exclusão otimista com recuperação de erros {/*optimistic-delete-with-error-recovery*/}

Ao excluir itens de forma otimista, você deve tratar o caso em que a Ação falha.

Este exemplo mostra como exibir uma mensagem de erro quando uma exclusão falha, e a UI reverte automaticamente para mostrar o item novamente.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Learn React' },
    { id: 2, name: 'Build an app' },
    { id: 3, name: 'Deploy to production' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>Your Items</h2>
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // O item 3 sempre falha, para demonstrar a recuperação de erros
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

Tente excluir 'Deploy to production'. Quando a exclusão falha, o item reaparece automaticamente na lista.

---

## Solução de problemas {/*troubleshooting*/}

### Estou recebendo um erro: "An optimistic state update occurred outside a Transition or Action" {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

Você pode ver este erro:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

A função setter otimista deve ser chamada dentro de `startTransition`:

```js
// 🚩 Incorreto: fora de uma Transição
function handleClick() {
  setOptimistic(newValue);  // Aviso!
  // ...
}

// ✅ Correto: dentro de uma Transição
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Também correto: dentro de uma prop de Ação
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

Quando você chama o setter fora de uma Ação, o estado otimista aparecerá brevemente e depois reverterá imediatamente para o valor original. Isso acontece porque não há Transição para "manter" o estado otimista enquanto sua Ação é executada.

### Estou recebendo um erro: "Cannot update optimistic state while rendering" {/*cannot-update-optimistic-state-while-rendering*/}

Você pode ver este erro:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

Este erro ocorre quando você chama o setter otimista durante a fase de renderização de um componente. Você só pode chamá-lo a partir de manipuladores de eventos, efeitos ou outros callbacks:

```js
// 🚩 Incorreto: chamando durante a renderização
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // Isso é executado durante a renderização - não permitido!
  setPending(true);

  // ...
}

// ✅ Correto: chamando dentro de startTransition
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ Também correto: chamando a partir de uma Ação
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### Minhas atualizações otimistas mostram valores desatualizados {/*my-optimistic-updates-show-stale-values*/}

Se o seu estado otimista parece estar baseado em dados antigos, considere usar uma função atualizadora ou reducer para calcular o estado otimista relativo ao estado atual.

```js
// Pode mostrar dados desatualizados se o estado mudar durante a Ação
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // Sempre define como 5, mesmo se count mudou

// Melhor: atualizações relativas tratam mudanças de estado corretamente
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Sempre adiciona 1 ao count atual
```

Veja [Atualizando o estado com base no estado atual](#updating-state-based-on-current-state) para detalhes.

### Não sei se minha atualização otimista está pendente {/*i-dont-know-if-my-optimistic-update-is-pending*/}

Para saber quando `useOptimistic` está pendente, você tem três opções:

1. **Verifique se `optimisticValue === value`**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

Se os valores não forem iguais, há uma Transição em andamento.

2. **Adicione um `useTransition`**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

Como `useTransition` usa `useOptimistic` para `isPending` internamente, isso é equivalente à opção 1.

3. **Adicione uma flag `pending` no seu reducer**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

Como cada item otimista tem sua própria flag, você pode mostrar o estado de carregamento para itens individuais.
