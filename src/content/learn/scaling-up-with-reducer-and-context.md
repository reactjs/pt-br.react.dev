---
title: Escalando com Reducer e Contexto
---

<Intro>

Reducers permitem consolidar a lógica de atualização de estado de um componente. O contexto permite passar informações profundamente para outros componentes. Você pode combinar reducers e contexto para gerenciar o estado de uma tela complexa.

</Intro>

<YouWillLearn>

* Como combinar um reducer com contexto
* Como evitar passar estado e dispatch através de props
* Como manter a lógica de contexto e estado em um arquivo separado

</YouWillLearn>

## Combinando um reducer com contexto {/*combining-a-reducer-with-context*/}

Neste exemplo da [introdução aos reducers](/learn/extracting-state-logic-into-a-reducer), o estado é gerenciado por um reducer. A função reducer contém toda a lógica de atualização de estado e é declarada na parte inferior deste arquivo:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
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
      <h1>Dia de folga em Kyoto</h1>
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

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/AddTask.js
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

```js src/TaskList.js
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
        Deletar
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

Um reducer ajuda a manter os manipuladores de eventos curtos e concisos. No entanto, à medida que seu aplicativo cresce, você pode encontrar outra dificuldade. **Atualmente, o estado `tasks` e a função `dispatch` estão disponíveis apenas no componente de nível superior `TaskApp`.** Para permitir que outros componentes leiam a lista de tarefas ou a alterem, você deve explicitamente [passar](/learn/passing-props-to-a-component) o estado atual e os manipuladores de eventos que o alteram como props.

Por exemplo, `TaskApp` passa uma lista de tarefas e os manipuladores de eventos para `TaskList`:

```js
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

E `TaskList` passa os manipuladores de eventos para `Task`:

```js
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

Em um pequeno exemplo como este, isso funciona bem, mas se você tiver dezenas ou centenas de componentes no meio, passar todos os estados e funções pode ser bastante frustrante!

É por isso que, como alternativa a passar através de props, você pode querer colocar tanto o estado `tasks` quanto a função `dispatch` [no contexto.](/learn/passing-data-deeply-with-context) **Dessa forma, qualquer componente abaixo de `TaskApp` na árvore pode ler as tarefas e despachar ações sem a repetitiva "prop drilling".**

Aqui está como você pode combinar um reducer com contexto:

1. **Criar** o contexto.
2. **Colocar** estado e dispatch no contexto.
3. **Usar** o contexto em qualquer lugar na árvore.

### Passo 1: Criar o contexto {/*step-1-create-the-context*/}

O Hook `useReducer` retorna os atuais `tasks` e a função `dispatch` que permite que você os atualize:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Para passá-los para baixo na árvore, você irá [criar](/learn/passing-data-deeply-with-context#step-2-use-the-context) dois contextos separados:

- `TasksContext` fornece a lista atual de tarefas.
- `TasksDispatchContext` fornece a função que permite que componentes despachem ações.

Exporte-os de um arquivo separado para que você possa importá-los mais tarde a partir de outros arquivos:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
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
      <h1>Dia de folga em Kyoto</h1>
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

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/TasksContext.js active
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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
        Deletar
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

Aqui, você está passando `null` como o valor padrão para ambos os contextos. Os valores reais serão fornecidos pelo componente `TaskApp`.

### Passo 2: Colocar estado e dispatch no contexto {/*step-2-put-state-and-dispatch-into-context*/}

Agora você pode importar ambos os contextos no seu componente `TaskApp`. Pegue os `tasks` e `dispatch` retornados por `useReducer()` e [forneça-os](/learn/passing-data-deeply-with-context#step-3-provide-the-context) para toda a árvore abaixo:

```js {4,7-8}
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

Por enquanto, você passa as informações tanto via props quanto no contexto:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
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
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Dia de folga em Kyoto</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
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

```js src/TaskList.js
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
        Deletar
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

No próximo passo, você irá remover a passagem de props.

### Passo 3: Usar contexto em qualquer lugar na árvore {/*step-3-use-context-anywhere-in-the-tree*/}

Agora você não precisa passar a lista de tarefas ou os manipuladores de eventos para baixo na árvore:

```js {4-5}
<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>Dia de folga em Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

Em vez disso, qualquer componente que precise da lista de tarefas pode lê-la do `TasksContext`:

```js {2}
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

Para atualizar a lista de tarefas, qualquer componente pode ler a função `dispatch` do contexto e chamá-la:

```js {3,9-13}
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Adicionar</button>
    // ...
```

**O componente `TaskApp` não passa nenhum manipulador de eventos para baixo, e o `TaskList` também não passa nenhum manipulador de eventos para o componente `Task`.** Cada componente lê o contexto de que precisa:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Dia de folga em Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Adicionar</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Deletar
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

**O estado ainda "vive" no componente de nível superior `TaskApp`, gerenciado com `useReducer`.** Mas seus `tasks` e `dispatch` agora estão disponíveis para todos os componentes abaixo na árvore, importando e usando esses contextos.

## Movendo toda a ligação para um único arquivo {/*moving-all-wiring-into-a-single-file*/}

Você não precisa fazer isso, mas pode ainda mais limpar os componentes movendo tanto o reducer quanto o contexto para um único arquivo. Atualmente, `TasksContext.js` contém apenas duas declarações de contexto:

```js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

Esse arquivo vai ficar lotado! Você moverá o reducer para esse mesmo arquivo. Então, você declarará um novo componente `TasksProvider` no mesmo arquivo. Este componente juntará todas as peças:

1. Ele gerenciará o estado com um reducer.
2. Ele fornecerá ambos os contextos para componentes abaixo.
3. Ele [receberá `children` como uma prop](/learn/passing-props-to-a-component#passing-jsx-as-children) para que você possa passar JSX para ele.

```js
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

**Isso remove toda a complexidade e a ligação do seu componente `TaskApp`:**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Dia de folga em Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Adicionar</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Deletar
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

Você também pode exportar funções que _usam_ o contexto de `TasksContext.js`:

```js
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

Quando um componente precisa ler o contexto, ele pode fazê-lo através dessas funções:

```js
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

Isso não altera o comportamento de forma alguma, mas permite que você separe ainda mais esses contextos ou adicione alguma lógica a essas funções mais tarde. **Agora toda a ligação de contexto e reducer está em `TasksContext.js`. Isso mantém os componentes limpos e sem complicações, focados no que exibem em vez de onde obtêm os dados:**

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Dia de folga em Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Caminho do Filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        }); 
      }}>Adicionar</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js active
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Deletar
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

Você pode pensar em `TasksProvider` como uma parte da tela que sabe como lidar com tarefas, `useTasks` como uma maneira de lê-las, e `useTasksDispatch` como uma maneira de atualizá-las de qualquer componente abaixo na árvore.

<Note>

Funções como `useTasks` e `useTasksDispatch` são chamadas *[Hooks Personalizados](/learn/reusing-logic-with-custom-hooks)* Sua função é considerada um Hook personalizado se seu nome começar com `use`. Isso permite que você use outros Hooks, como `useContext`, dentro dela.

</Note>

À medida que seu aplicativo cresce, você pode ter muitos pares de contexto-reducer como este. Essa é uma maneira poderosa de escalar seu aplicativo e [elevar o estado](/learn/sharing-state-between-components) sem muito trabalho sempre que você quiser acessar os dados profundamente na árvore.

<Recap>

- Você pode combinar reducer com contexto para permitir que qualquer componente leia e atualize o estado acima dele.
- Para fornecer estado e a função dispatch para componentes abaixo:
  1. Crie dois contextos (um para estado e outro para funções de dispatch).
  2. Forneça ambos os contextos do componente que usa o reducer.
  3. Use qualquer contexto a partir dos componentes que precisam lê-los.
- Você pode ainda mais limpar os componentes movendo toda a ligação para um arquivo.
  - Você pode exportar um componente como `TasksProvider` que fornece contexto.
  - Você também pode exportar Hooks personalizados como `useTasks` e `useTasksDispatch` para lê-lo.
- Você pode ter muitos pares de contexto-reducer como este em seu aplicativo.

</Recap>