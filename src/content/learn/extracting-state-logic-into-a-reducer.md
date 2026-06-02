---
title: Extracting State Logic into a Reducer
---

<Intro>

Componentes com muitas atualizações de estado espalhadas por vários manipuladores de eventos podem se tornar confusos. Para esses casos, você pode consolidar toda a lógica de atualização de estado fora do seu componente em uma única função, chamada _reducer_.

</Intro>

<YouWillLearn>

- O que é uma função reducer
- Como refatorar `useState` para `useReducer`
- Quando usar um reducer
- Como escrever um bom reducer

</YouWillLearn>

## Consolide a lógica de estado com um reducer {/*consolidate-state-logic-with-a-reducer*/}

À medida que seus componentes crescem em complexidade, pode se tornar mais difícil ver rapidamente todas as diferentes maneiras pelas quais o estado de um componente é atualizado. Por exemplo, o componente `TaskApp` abaixo mantém um array de `tasks` no estado e usa três manipuladores de eventos diferentes para adicionar, remover e editar tarefas:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Roteiro de Praga</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visitar o Museu Kafka', done: true},
  {id: 1, text: 'Assistir a um show de marionetes', done: false},
  {id: 2, text: 'Foto na Lennon Wall', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Adicionar
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Salvar</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Editar</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Excluir</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Cada um dos seus manipuladores de eventos chama `setTasks` para atualizar o estado. À medida que este componente cresce, também cresce a quantidade de lógica de estado espalhada por ele. Para reduzir essa complexidade e manter toda a sua lógica em um local de fácil acesso, você pode mover essa lógica de estado para uma única função fora do seu componente, **chamada "reducer".**

Reducers são uma maneira diferente de lidar com o estado. Você pode migrar de `useState` para `useReducer` em três etapas:

1. **Mova** de definir o estado para despachar ações.
2. **Escreva** uma função reducer.
3. **Use** o reducer do seu componente.

### Etapa 1: Mova de definir o estado para despachar ações {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Seus manipuladores de eventos atualmente especificam _o que fazer_ definindo o estado:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Remova toda a lógica de definição de estado. O que resta são três manipuladores de eventos:

- `handleAddTask(text)` é chamado quando o usuário clica em "Adicionar".
- `handleChangeTask(task)` é chamado quando o usuário alterna uma tarefa ou clica em "Salvar".
- `handleDeleteTask(taskId)` é chamado quando o usuário clica em "Excluir".

Gerenciar estado com reducers é um pouco diferente de definir o estado diretamente. Em vez de dizer ao React "o que fazer" definindo o estado, você especifica "o que o usuário acabou de fazer" despachando "ações" de seus manipuladores de eventos. (A lógica de atualização de estado ficará em outro lugar!) Portanto, em vez de "definir `tasks`" por meio de um manipulador de eventos, você está despachando uma ação de "adicionou/alterou/excluiu uma tarefa". Isso é mais descritivo da intenção do usuário.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

O objeto que você passa para `dispatch` é chamado de "ação":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // Objeto "ação":
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

É um objeto JavaScript comum. Você decide o que colocar nele, mas geralmente ele deve conter as informações mínimas sobre _o que aconteceu_. (Você adicionará a própria função `dispatch` em uma etapa posterior.)

<Note>

Um objeto de ação pode ter qualquer formato.

Por convenção, é comum dar a ele um `type` de string que descreve o que aconteceu e passar quaisquer informações adicionais em outros campos. O `type` é específico para um componente, então neste exemplo, `'added'` ou `'added_task'` estariam bem. Escolha um nome que diga o que aconteceu!

```js
dispatch({
  // específico para o componente
  type: 'o_que_aconteceu',
  // outros campos vão aqui
});
```

</Note>

### Etapa 2: Escreva uma função reducer {/*step-2-write-a-reducer-function*/}

Uma função reducer é onde você colocará sua lógica de estado. Ela recebe dois argumentos, o estado atual e o objeto de ação, e retorna o próximo estado:

```js
function seuReducer(state, action) {
  // retorna o próximo estado para o React definir
}
```

O React definirá o estado com o que você retornar do reducer.

Para mover sua lógica de definição de estado dos seus manipuladores de eventos para uma função reducer neste exemplo, você irá:

1. Declare o estado atual (`tasks`) como o primeiro argumento.
2. Declare o objeto `action` como o segundo argumento.
3. Retorne o _próximo_ estado do reducer (que o React definirá o estado para).

Aqui está toda a lógica de definição de estado migrada para uma função reducer:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

Como a função reducer recebe o estado (`tasks`) como argumento, você pode **declarar fora do seu componente.** Isso diminui o nível de indentação e pode tornar seu código mais fácil de ler.

<Note>

O código acima usa instruções if/else, mas é uma convenção usar [instruções switch](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/switch) dentro de reducers. O resultado é o mesmo, mas pode ser mais fácil ler instruções switch rapidamente.

Nós as usaremos em toda a documentação restante assim:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Recomendamos envolver cada bloco `case` em chaves `{` e `}` para que variáveis declaradas dentro de diferentes `case`s não entrem em conflito umas com as outras. Além disso, um `case` geralmente deve terminar com um `return`. Se você esquecer de `return`, o código "cairá" para o próximo `case`, o que pode levar a erros!

Se você ainda não está familiarizado com instruções switch, usar if/else está completamente bem.

</Note>

<DeepDive>

#### Por que os reducers são chamados assim? {/*why-are-reducers-called-this-way*/}

Embora os reducers possam "reduzir" a quantidade de código dentro do seu componente, eles são na verdade nomeados após a operação [`reduce()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) que você pode realizar em arrays.

A operação `reduce()` permite que você pegue um array e "acumule" um único valor de muitos:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

A função que você passa para `reduce` é conhecida como "reducer". Ela pega o _resultado até agora_ e o _item atual,_ e então retorna o _próximo resultado._ Reducers do React são um exemplo da mesma ideia: eles pegam o _estado até agora_ e a _ação_, e retornam o _próximo estado._ Dessa forma, eles acumulam ações ao longo do tempo em estado.

Você poderia até usar o método `reduce()` com um `initialState` e um array de `actions` para calcular o estado final, passando sua função reducer para ele:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visitar o Museu Kafka'},
  {type: 'added', id: 2, text: 'Assistir a um show de marionetes'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Foto na Lennon Wall'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Provavelmente você não precisará fazer isso, mas é semelhante ao que o React faz!

</DeepDive>

### Etapa 3: Use o reducer do seu componente {/*step-3-use-the-reducer-from-your-component*/}

Finalmente, você precisa conectar o `tasksReducer` ao seu componente. Importe o Hook `useReducer` do React:

```js
import { useReducer } from 'react';
```

Então você pode substituir `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

por `useReducer` assim:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

O Hook `useReducer` é semelhante ao `useState`—você deve passar um estado inicial para ele e ele retorna um valor com estado e uma maneira de definir o estado (neste caso, a função dispatch). Mas é um pouco diferente.

O Hook `useReducer` recebe dois argumentos:

1. Uma função reducer
2. Um estado inicial

E retorna:

1. Um valor com estado
2. Uma função dispatch (para "despachar" ações do usuário para o reducer)

Agora está totalmente conectado! Aqui, o reducer é declarado na parte inferior do arquivo do componente:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Roteiro de Praga</h1>
      <AddTask onAddTask={handleAddTask} />
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
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visitar o Museu Kafka', done: true},
  {id: 1, text: 'Assistir a um show de marionetes', done: false},
  {id: 2, text: 'Foto na Lennon Wall', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Adicionar
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Salvar</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Editar</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Excluir</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Se quiser, você pode até mover o reducer para um arquivo diferente:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Roteiro de Praga</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visitar o Museu Kafka', done: true},
  {id: 1, text: 'Assistir a um show de marionetes', done: false},
  {id: 2, text: 'Foto na Lennon Wall', done: false},
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Adicionar
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Salvar</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Editar</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Excluir</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

A lógica do componente pode ser mais fácil de ler quando você separa as preocupações dessa forma. Agora os manipuladores de eventos apenas especificam _o que aconteceu_ despachando ações, e a função reducer determina _como o estado é atualizado_ em resposta a elas.

## Comparando `useState` e `useReducer` {/*comparing-usestate-and-usereducer*/}

Reducers não são isentos de desvantagens! Aqui estão algumas maneiras de compará-los:

- **Tamanho do código:** Geralmente, com `useState` você tem que escrever menos código inicialmente. Com `useReducer`, você tem que escrever tanto a função reducer _quanto_ despachar ações. No entanto, `useReducer` pode ajudar a reduzir o código se muitos manipuladores de eventos modificarem o estado de maneira semelhante.
- **Legibilidade:** `useState` é muito fácil de ler quando as atualizações de estado são simples. Quando elas ficam mais complexas, podem inchar o código do seu componente e dificultar a leitura. Neste caso, `useReducer` permite que você separe claramente o _como_ da lógica de atualização do _o que aconteceu_ dos manipuladores de eventos.
- **Depuração:** Quando você tem um bug com `useState`, pode ser difícil saber _onde_ o estado foi definido incorretamente e _por quê_. Com `useReducer`, você pode adicionar um `console.log` ao seu reducer para ver cada atualização de estado e _por que_ ela aconteceu (devido a qual `action`). Se cada `action` estiver correta, você saberá que o erro está na própria lógica do reducer. No entanto, você tem que percorrer mais código do que com `useState`.
- **Testes:** Um reducer é uma função pura que não depende do seu componente. Isso significa que você pode exportá-lo e testá-lo separadamente em isolamento. Embora geralmente seja melhor testar componentes em um ambiente mais realista, para lógica de atualização de estado complexa pode ser útil afirmar que seu reducer retorna um estado particular para um estado inicial e ação particulares.
- **Preferência pessoal:** Algumas pessoas gostam de reducers, outras não. Tudo bem. É uma questão de preferência. Você sempre pode converter entre `useState` e `useReducer` de um lado para o outro: eles são equivalentes!

Recomendamos o uso de um reducer se você frequentemente encontrar bugs devido a atualizações de estado incorretas em algum componente e quiser introduzir mais estrutura em seu código. Você não precisa usar reducers para tudo: sinta-se à vontade para misturar e combinar! Você pode até usar `useState` e `useReducer` no mesmo componente.

## Escrevendo bons reducers {/*writing-reducers-well*/}

Mantenha estas duas dicas em mente ao escrever reducers:

- **Reducers devem ser puros.** Semelhante às [funções de atualização de estado](/learn/queueing-a-series-of-state

## Redutores Concisos com Immer {/*writing-concise-reducers-with-immer*/}

Assim como ao [atualizar objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) e [arrays](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) no estado normal, você pode usar a biblioteca Immer para tornar os redutores mais concisos. Aqui, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) permite que você muta o estado com `push` ou atribuição `arr[i] =`:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Roteiro de Praga</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visitar o Museu Kafka', done: true},
  {id: 1, text: 'Assistir a um show de marionetes', done: false},
  {id: 2, text: 'Foto na Lennon Wall', done: false},
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Adicionar tarefa"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Adicionar
      </button>
    </>
  );
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Salvar</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Editar</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Excluir</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
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

Redutores devem ser puros, então eles não devem mutar o estado. Mas o Immer fornece um objeto especial `draft` que é seguro para mutar. Por baixo dos panos, o Immer criará uma cópia do seu estado com as alterações que você fez no `draft`. É por isso que redutores gerenciados por `useImmerReducer` podem mutar seu primeiro argumento e não precisam retornar o estado.

<Recap>

- Para converter de `useState` para `useReducer`:
  1. Dispare ações de manipuladores de eventos.
  2. Escreva uma função redutora que retorne o próximo estado para um determinado estado e ação.
  3. Substitua `useState` por `useReducer`.
- Redutores exigem que você escreva um pouco mais de código, mas ajudam na depuração e nos testes.
- Redutores devem ser puros.
- Cada

#### Restaurar valores de entrada ao alternar entre abas {/*restore-input-values-when-switching-between-tabs*/}

Neste exemplo, alternar entre diferentes destinatários sempre limpa a entrada de texto:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Limpa a entrada
  };
```

Isso ocorre porque você não quer compartilhar um único rascunho de mensagem entre vários destinatários. Mas seria melhor se seu aplicativo "lembrasse" um rascunho para cada contato separadamente, restaurando-os ao alternar de contato.

Sua tarefa é alterar a forma como o estado é estruturado para que você se lembre de um rascunho de mensagem separado _por contato_. Você precisará fazer algumas alterações no reducer, no estado inicial e nos componentes.

<Hint>

Você pode estruturar seu estado assim:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Rascunho para contactId = 0
    1: 'Hello, Alice', // Rascunho para contactId = 1
  },
};
```

A sintaxe de propriedade computada `[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) pode ajudá-lo a atualizar o objeto `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Você precisará atualizar o reducer para armazenar e atualizar um rascunho de mensagem separado por contato:

```js
// Quando a entrada é editada
case 'edited_message': {
  return {
    // Mantém outro estado como a seleção
    ...state,
    messages: {
      // Mantém mensagens para outros contatos
      ...state.messages,
      // Mas altera a mensagem do contato selecionado
      [state.selectedId]: action.message
    }
  };
}
```

Você também atualizaria o componente `Messenger` para ler a mensagem do contato atualmente selecionado:

```js
const message = state.messages[state.selectedId];