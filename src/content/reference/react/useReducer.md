```js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

</Recipes>

---

### Initializing state lazily {/*initializing-state-lazily*/}

You can provide the initial state as the second argument to `useReducer`:

```js
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

Sometimes, calculating the initial state is expensive. You might need to make an API call, read from local storage, or perform some other computation that you might want to avoid if the component is rendering for the first time. In that case, you can provide an *initializer* function as the third argument. React will call your initializer function and use its return value as the initial state.

```js
function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
```

In the example above, `init(initialCount)` is only called once, during the initial render.

<Recipes titleText="useReducer with lazy initialization" titleId="examples-lazy-initialization">

#### Counter with a lazy initialization {/*counter-with-a-lazy-initialization*/}

In this example, the initial count is read from the `props`. Using an initializer function ensures that the `init` function is only called during the initial render, so you avoid unnecessary calculations.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function init(initialCount) {
  return { count: initialCount };
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({ type: 'decrement' })}
      >
        -
      </button>
      <button
        onClick={() => dispatch({ type: 'increment' })}
      >
        +
      </button>
    </>
  );
}

export default function App() {
  return (
    <Counter initialCount={0} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Troubleshooting {/*troubleshooting*/}

### My reducer or initializer function runs twice {/*my-reducer-or-initializer-function-runs-twice*/}

In Strict Mode, React will call your reducer and initializer functions twice in development to [help you find accidental impurities.](/reference/react/StrictMode#how-to-enable-strict-mode) This is a development-only behavior and does not affect production.

If your reducer and initializer functions are pure, this should not affect your logic. The result from one of the calls is ignored. However, if your reducer or initializer has side effects (e.g. logging, modifying the input, or mutating state), you will notice them running twice. To fix this, make sure that your reducer and initializer functions are pure.

### I've dispatched an action, but logging gives me the old state value {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Calling `dispatch` does not update the `state` variable inside the *current* execution of your component.

```js
function handleClick() {
  dispatch({ type: 'incremented_age' });
  console.log(state.age); // This will log the old state value.
}
```

This is by design. Your component will re-render with the new state value *after* the event handler finishes running.

If you need to know the next state value immediately after dispatching the action, you could calculate it manually by calling the `reducer` function directly:

```js
function handleClick() {
  const nextState = reducer(state, { type: 'incremented_age' });
  console.log(nextState.age); // This will log the next state value.
  dispatch({ type: 'incremented_age' });
}
```

However, usually you don't need to do this. React will re-render your component with the updated values in the next render.
```js
function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Itinerário de Praga</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visitar Museu Kafka', done: true },
  { id: 1, text: 'Assistir um show de fantoches', done: false },
  { id: 2, text: 'Foto no Muro de Lennon', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Adicionar</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Salvar
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Editar
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Apagar
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Evitando recriar o estado inicial {/*avoiding-recreating-the-initial-state*/}

React salva o estado inicial uma vez e o ignora nos próximos renders.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Embora o resultado de `createInitialState(username)` seja usado apenas para o render inicial, você ainda está chamando esta função em cada render. Isso pode ser um desperdício se estiver criando grandes arrays ou realizando cálculos caros.

Para resolver isso, você pode **passá-lo como uma função _inicializadora_** para o `useReducer` como o terceiro argumento:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Observe que você está passando `createInitialState`, que é a *própria função*, e não `createInitialState()`, que é o resultado de chamá-la. Dessa forma, o estado inicial não é recriado após a inicialização.

No exemplo acima, `createInitialState` recebe um argumento `username`. Se sua inicializadora não precisar de nenhuma informação para calcular o estado inicial, você pode passar `null` como o segundo argumento para `useReducer`.

<Recipes titleText="A diferença entre passar uma inicializadora e passar o estado inicial diretamente" titleId="examples-initializer">

#### Passando a função inicializadora {/*passing-the-initializer-function*/}

Este exemplo passa a função inicializadora, de modo que a função `createInitialState` é executada apenas durante a inicialização. Ela não é executada quando o componente é renderizado novamente, como quando você digita no input.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Ação desconhecida: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Adicionar</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Passando o estado inicial diretamente {/*passing-the-initial-state-directly*/}

Este exemplo **não** passa a função inicializadora, portanto, a função `createInitialState` é executada em cada render, como quando você digita no input. Não há diferença observável no comportamento, mas esse código é menos eficiente.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Ação desconhecida: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Adicionar</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Solução de problemas {/*troubleshooting*/}

### Eu despachei uma ação, mas o log me dá o valor de estado antigo {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Chamar a função `dispatch` **não altera o estado no código em execução**:

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Solicita um novo render com 43
  console.log(state.age);  // Ainda 42!

  setTimeout(() => {
    console.log(state.age); // Também 42!
  }, 5000);
}
```

Isso ocorre porque [os estados se comportam como um snapshot.](/learn/state-as-a-snapshot) Atualizar o estado solicita outro render com o novo valor do estado, mas não afeta a variável JavaScript `state` no seu manipulador de eventos já em execução.

Se você precisar adivinhar o próximo valor do estado, poderá calculá-lo manualmente chamando o redutor você mesmo:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Eu despachei uma ação, mas a tela não atualiza {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

O React **ignorará sua atualização se o próximo estado for igual ao estado anterior,** conforme determinado por uma comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Isso geralmente acontece quando você altera um objeto ou array no estado diretamente:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Errado: mutando objeto existente
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Errado: mutando objeto existente
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Você mutou um objeto `state` existente e o retornou, então o React ignorou a atualização. Para corrigir isso, você precisa garantir que está sempre [atualizando objetos no estado](/learn/updating-objects-in-state) e [atualizando arrays no estado](/learn/updating-arrays-in-state) em vez de mutá-los:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correto: criando um novo objeto
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correto: criando um novo objeto
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Uma parte do meu estado do redutor se torna undefined após o despacho {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Certifique-se de que cada ramificação `case` **copia todos os campos existentes** ao retornar o novo estado:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Não se esqueça disso!
        age: state.age + 1
      };
    }
    // ...
```

Sem `...state` acima, o próximo estado retornado conteria apenas o campo `age` e mais nada.

---

### Todo o meu estado do redutor se torna undefined após o despacho {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Se o seu estado inesperadamente se tornar `undefined`, provavelmente você está esquecendo de `return` o estado em um dos casos, ou o seu tipo de ação não corresponde a nenhuma das declarações `case`. Para descobrir por que, lance um erro fora do `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Ação desconhecida: ' + action.type);
}
```

Você também pode usar um verificador de tipo estático como o TypeScript para detectar esses erros.

---

### Estou recebendo um erro: "Muitos re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Você pode obter um erro que diz: `Muitos re-renders. O React limita o número de renders para evitar um loop infinito.` Normalmente, isso significa que você está despachando incondicionalmente uma ação *durante a renderização*, então seu componente entra em loop: renderizar, dispatch (o que causa um render), renderizar, dispatch (o que causa um render) e assim por diante. Muito frequentemente, isso é causado por um erro na especificação de um manipulador de eventos:

```js {1-2}
// 🚩 Errado: chama o manipulador durante a renderização
return <button onClick={handleClick()}>Clique em mim</button>

// ✅ Correto: passa o manipulador de eventos
return <button onClick={handleClick}>Clique em mim</button>

// ✅ Correto: passa uma função inline
return <button onClick={(e) => handleClick(e)}>Clique em mim</button>
```

Se você não conseguir encontrar a causa desse erro, clique na seta ao lado do erro no console e examine a pilha JavaScript para encontrar a chamada de função `dispatch` específica responsável pelo erro.

---

### Minha função de redutor ou inicializadora é executada duas vezes {/*my-reducer-or-initializer-function-runs-twice*/}

No [Modo Strict](/reference/react/StrictMode), o React chamará suas funções de redutor e inicializadoras duas vezes. Isso não deve quebrar seu código.

Este comportamento **apenas para desenvolvimento** ajuda você a [manter os componentes puros.](/learn/keeping-components-pure) O React usa o resultado de uma das chamadas e ignora o resultado da outra chamada. Contanto que seus componentes, inicializadores e funções de redutor sejam puros, isso não deve afetar sua lógica. No entanto, se eles forem acidentalmente impuros, isso o ajudará a perceber os erros.

Por exemplo, esta função de redutor impura muta um array no estado:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Erro: mutando o estado
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Como o React chama sua função de redutor duas vezes, você verá que o todo foi adicionado duas vezes, então saberá que há um erro. Neste exemplo, você pode corrigir o erro [substituindo o array em vez de mutá-lo](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correto: substituindo com novo estado
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Agora que esta função de redutor é pura, chamá-la uma vez extra não faz diferença no comportamento. É por isso que o React chamá-la duas vezes ajuda você a encontrar erros. **Somente componentes, inicializadores e funções de redutor precisam ser puros.** Os manipuladores de eventos não precisam ser puros, então o React nunca chamará seus manipuladores de eventos duas vezes.

Leia [manter os componentes puros](/learn/keeping-components-pure) para saber mais.