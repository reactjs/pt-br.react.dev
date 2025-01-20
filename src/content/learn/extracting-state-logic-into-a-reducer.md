---
title: Extraindo a Lógica de Estado em um Redutor
---

<Intro>

Componentes com muitas atualizações de estado espalhadas por muitos manipuladores de eventos podem se tornar confusos. Para esses casos, você pode consolidar toda a lógica de atualização de estado fora do seu componente em uma única função, chamada de _redutor_.

</Intro>

<YouWillLearn>

- O que é uma função redutora
- Como refatorar `useState` para `useReducer`
- Quando usar um redutor
- Como escrever um bem

</YouWillLearn>

## Consolide a lógica de estado com um redutor {/*consolidate-state-logic-with-a-reducer*/}

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
  {id: 1, text: 'Assistir a um teatro de marionetes', done: false},
  {id: 2, text: 'Foto do Muro Lennon', done: false},
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

Cada um dos seus manipuladores de eventos chama `setTasks` para atualizar o estado. À medida que esse componente cresce, também cresce a quantidade de lógica de estado espalhada por ele. Para reduzir essa complexidade e manter toda a sua lógica em um único lugar de fácil acesso, você pode mover essa lógica de estado para uma única função fora do seu componente, **chamada de "redutor".**

Redutores são uma maneira diferente de lidar com estado. Você pode migrar de `useState` para `useReducer` em três etapas:

1. **Mover** de definir estado para despachar ações.
2. **Escrever** uma função redutora.
3. **Usar** o redutor a partir do seu componente.

### Etapa 1: Mover de definir estado para despachar ações {/*step-1-move-from-setting-state-to-dispatching-actions*/}

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

Remova toda a lógica de configuração de estado. O que você terá são três manipuladores de eventos:

- `handleAddTask(text)` é chamado quando o usuário pressiona "Adicionar".
- `handleChangeTask(task)` é chamado quando o usuário alterna uma tarefa ou pressiona "Salvar".
- `handleDeleteTask(taskId)` é chamado quando o usuário pressiona "Excluir".

Gerenciar estado com redutores é um pouco diferente de definir estado diretamente. Em vez de dizer ao React "o que fazer" definindo estado, você especifica "o que o usuário acabou de fazer" despachando "ações" a partir dos seus manipuladores de eventos. (A lógica de atualização de estado residirá em outro lugar!) Assim, em vez de "definir `tasks`" via um manipulador de eventos, você está despachando uma ação "adicionada/alterada/excluída uma tarefa". Isso é mais descritivo da intenção do usuário.

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
    // objeto "ação":
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

É um objeto JavaScript comum. Você decide o que colocar nele, mas geralmente deve conter as informações mínimas sobre _o que aconteceu_. (Você adicionará a função `dispatch` em uma etapa posterior.)

<Note>

Um objeto de ação pode ter qualquer forma.

Por convenção, é comum dar a ele uma string `type` que descreve o que aconteceu e passar qualquer informação adicional em outros campos. O `type` é específico para um componente, então neste exemplo, tanto `'added'` quanto `'added_task'` seriam adequados. Escolha um nome que diga o que aconteceu!

```js
dispatch({
  // específico do componente
  type: 'what_happened',
  // outros campos vão aqui
});
```

</Note>

### Etapa 2: Escrever uma função redutora {/*step-2-write-a-reducer-function*/}

Uma função redutora é onde você colocará sua lógica de estado. Ela recebe dois argumentos, o estado atual e o objeto de ação, e retorna o próximo estado:

```js
function yourReducer(state, action) {
  // retorna o próximo estado para o React definir
}
```

O React definirá o estado para o que você retornar da redutora.

Para mover sua lógica de configuração de estado dos manipuladores de eventos para uma função redutora neste exemplo, você precisará:

1. Declarar o estado atual (`tasks`) como o primeiro argumento.
2. Declarar o objeto `action` como o segundo argumento.
3. Retornar o _próximo_ estado da redutora (que o React definirá como o estado).

Aqui está toda a lógica de configuração de estado migrada para uma função redutora:

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
    throw Error('Ação desconhecida: ' + action.type);
  }
}
```

Como a função redutora leva o estado (`tasks`) como um argumento, você pode **declarar isso fora do seu componente.** Isso diminui o nível de indentação e pode deixar seu código mais fácil de ler.

<Note>

O código acima usa instruções if/else, mas é uma convenção usar [instruções switch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) dentro das redutoras. O resultado é o mesmo, mas pode ser mais fácil de ler instruções switch à primeira vista.

Usaremos ao longo do resto desta documentação da seguinte maneira:

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
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}
```

Recomendamos encapsular cada bloco `case` nas chaves `{` e `}` para que as variáveis declaradas dentro de diferentes `case`s não conflitem entre si. Além disso, um `case` deve geralmente terminar com um `return`. Se você esquecer de `return`, o código "cairá" para o próximo `case`, o que pode levar a erros!

Se você ainda não está confortável com instruções switch, usar if/else é completamente aceitável.

</Note>

<DeepDive>

#### Por que os redutores são chamados assim? {/*why-are-reducers-called-this-way*/}

Embora os redutores possam "reduzir" a quantidade de código dentro do seu componente, eles na verdade têm esse nome devido à operação [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) que você pode realizar em arrays.

A operação `reduce()` permite que você pegue um array e "acumule" um único valor a partir de muitos:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

A função que você passa para `reduce` é conhecida como "redutor". Ela recebe o _resultado até agora_ e o _item atual_, em seguida, retorna o _próximo resultado_. Redutores do React são um exemplo da mesma ideia: eles pegam o _estado até agora_ e a _ação_, e retornam o _próximo estado_. Dessa forma, eles acumulam ações ao longo do tempo em estado.

Você poderia até usar o método `reduce()` com um `initialState` e um array de `actions` para calcular o estado final passando sua função redutora para ele:

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visitar o Museu Kafka'},
  {type: 'added', id: 2, text: 'Assistir a um teatro de marionetes'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Foto do Muro Lennon'},
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
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Você provavelmente não precisará fazer isso você mesmo, mas é semelhante ao que o React faz!

</DeepDive>

### Etapa 3: Usar o redutor a partir do seu componente {/*step-3-use-the-reducer-from-your-component*/}

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

O Hook `useReducer` é semelhante ao `useState`—você deve passar um estado inicial e ele retorna um valor com estado e uma forma de definir estado (neste caso, a função dispatch). Mas é um pouco diferente.

O Hook `useReducer` leva dois argumentos:

1. Uma função redutora
2. Um estado inicial

E retorna:

1. Um valor com estado
2. Uma função dispatch (para "despachar" ações do usuário para o redutor)

Agora está totalmente conectado! Aqui, o redutor é declarado na parte inferior do arquivo do componente:

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
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visitar o Museu Kafka', done: true},
  {id: 1, text: 'Assistir a um teatro de marionetes', done: false},
  {id: 2, text: 'Foto do Muro Lennon', done: false},
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

Se você quiser, você pode até mover o redutor para um arquivo diferente:

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
  {id: 1, text: 'Assistir a um teatro de marionetes', done: false},
  {id: 2, text: 'Foto do Muro Lennon', done: false},
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
      throw Error('Ação desconhecida: ' + action.type);
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

A lógica do componente pode ser mais fácil de ler quando você separa as responsabilidades assim. Agora os manipuladores de eventos apenas especificam _o que aconteceu_ despachando ações, e a função redutora determina _como o estado é atualizado_ em resposta a elas.

## Comparando `useState` e `useReducer` {/*comparing-usestate-and-usereducer*/}

Redutores não estão sem desvantagens! Aqui estão algumas maneiras de você compará-los:

- **Tamanho do código:** Geralmente, com `useState` você precisa escrever menos código no início. Com `useReducer`, você precisa escrever tanto uma função redutora _quanto_ despachar ações. No entanto, `useReducer` pode ajudar a reduzir o código se muitos manipuladores de eventos modificam o estado de maneira semelhante.
- **Legibilidade:** `useState` é muito fácil de ler quando as atualizações de estado são simples. Quando elas se tornam mais complexas, podem inchar o código do seu componente e dificultar a verificação. Nesse caso, `useReducer` permite que você separe claramente o _como_ da lógica de atualização do _o que aconteceu_ dos manipuladores de eventos.
- **Depuração:** Quando você tem um erro com `useState`, pode ser difícil dizer _onde_ o estado foi definido incorretamente, e _por que_. Com `useReducer`, você pode adicionar um console log dentro do seu redutor para ver cada atualização de estado, e _por que_ isso aconteceu (devido a qual `ação`). Se cada `ação` estiver correta, você saberá que o erro está na lógica do redutor em si. No entanto, você tem que percorrer mais código do que com `useState`.
- **Teste:** Um redutor é uma função pura que não depende do seu componente. Isso significa que você pode exportá-lo e testá-lo separadamente em isolamento. Embora geralmente seja melhor testar componentes em um ambiente mais realista, para lógica de atualização de estado complexa pode ser útil afirmar que seu redutor retorna um estado específico para um determinado estado inicial e ação.
- **Preferência pessoal:** Algumas pessoas preferem redutores, outras não. Tudo bem. É uma questão de preferência. Você sempre pode converter entre `useState` e `useReducer` repetidamente: eles são equivalentes!

Recomendamos usar um redutor se você frequentemente encontrar erros devido a atualizações de estado incorretas em algum componente e quiser introduzir mais estrutura ao seu código. Você não precisa usar redutores para tudo: sinta-se à vontade para misturar e combinar! Você pode até usar `useState` e `useReducer` no mesmo componente.

## Escrevendo redutores bem {/*writing-reducers-well*/}

Mantenha estas duas dicas em mente ao escrever redutores:

- **Redutores devem ser puros.** Semelhante às [funções de atualização de estado](/learn/queueing-a-series-of-state-updates), redutores são executados durante a renderização! (As ações são enfileiradas até a próxima renderização.) Isso significa que os redutores [devem ser puros](/learn/keeping-components-pure)—as mesmas entradas sempre resultam na mesma saída. Eles não devem enviar solicitações, agendar timeouts ou realizar quaisquer efeitos colaterais (operações que impactam coisas fora do componente). Eles devem atualizar [objetos](/learn/updating-objects-in-state) e [arrays](/learn/updating-arrays-in-state) sem mutações.
- **Cada ação descreve uma única interação do usuário, mesmo que isso leve a várias mudanças nos dados.** Por exemplo, se um usuário pressiona "Redefinir" em um formulário com cinco campos gerenciados por um redutor, faz mais sentido despachar uma ação `reset_form` em vez de cinco ações `set_field` separadas. Se você registrar cada ação em um redutor, esse registro deve ser claro o suficiente para você reconstruir quais interações ou respostas aconteceram em que ordem. Isso ajuda na depuração!

## Escrevendo redutores concisos com Immer {/*writing-concise-reducers-with-immer*/}

Assim como com [atualizando objetos](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) e [arrays](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) em estado regular, você pode usar a biblioteca Immer para tornar os redutores mais concisos. Aqui, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) permite que você mutile o estado com `push` ou atribuição `arr[i] =`:

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
      throw Error('Ação desconhecida: ' + action.type);
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
  {id: 1, text: 'Assistir a um teatro de marionetes', done: false},
  {id: 2, text: 'Foto do Muro Lennon', done: false},
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

Os redutores devem ser puros, então eles não devem mutar o estado. Mas o Immer fornece a você um objeto `draft` especial que é seguro para mutar. Nos bastidores, o Immer irá criar uma cópia do seu estado com as alterações que você fez no `draft`. É por isso que redutores gerenciados por `useImmerReducer` podem mutar seu primeiro argumento e não precisam retornar estado.

<Recap>

- Para converter de `useState` para `useReducer`:
  1. Despache ações a partir dos manipuladores de eventos.
  2. Escreva uma função redutora que retorna o próximo estado para um dado estado e ação.
  3. Substitua `useState` por `useReducer`.
- Redutores exigem que você escreva um pouco mais de código, mas ajudam com depuração e teste.
- Redutores devem ser puros.
- Cada ação descreve uma única interação do usuário.
- Use Immer se você quiser escrever redutores em um estilo mutável.

</Recap>

<Challenges>

#### Despachar ações a partir dos manipuladores de eventos {/*dispatch-actions-from-event-handlers*/}

Atualmente, os manipuladores de eventos em `ContactList.js` e `Chat.js` têm comentários `// TODO`. Por isso, digitar na entrada não funciona, e clicar nos botões não muda o destinatário selecionado.

Substitua esses dois `// TODO`s pelo código para `despachar` as ações correspondentes. Para ver a forma esperada e o tipo das ações, verifique o redutor em `messengerReducer.js`. O redutor já está escrito, então você não precisará mudá-lo. Você só precisa despachar as ações em `ContactList.js` e `Chat.js`.

<Hint>

A função `dispatch` já está disponível em ambos os componentes porque ela foi passada como uma propriedade. Portanto, você precisa chamar `dispatch` com o objeto de ação correspondente.

Para verificar a forma do objeto de ação, você pode olhar para o redutor e ver quais campos `action` ele espera ver. Por exemplo, o caso `changed_selection` no redutor se parece com isto:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

Isso significa que seu objeto de ação deve ter um `type: 'changed_selection'`. Você também verá o `action.contactId` sendo usado, então você precisa incluir uma propriedade `contactId` no seu objeto de ação.

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
  message: 'Olá',
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
    default: {
      throw Error('Ação desconhecida: ' + action.type);
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
                // TODO: despachar changed_selection
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
        placeholder={'Conversar com ' + contact.name}
        onChange={(e) => {
          // TODO: despachar edited_message
          // (Leia o valor de entrada de e.target.value)
        }}
      />
      <br />
      <button>Enviar para {contact.email}</button>
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

A partir do código do redutor, você pode inferir que as ações precisam se parecer com isto:

```js
// Quando o usuário pressionar "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// Quando o usuário digita "Olá!"
dispatch({
  type: 'edited_message',
  message: 'Olá!',
});
```

Aqui está o exemplo atualizado para despachar as mensagens correspondentes:

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
  message: 'Olá',
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
    default: {
      throw Error('Ação desconhecida: ' + action.type);
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
        placeholder={'Conversar com ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Enviar para {contact.email}</button>
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

Isso funciona e limpa a entrada quando você aperta "Enviar".

No entanto, _do ponto de vista do usuário_, enviar uma mensagem é uma ação diferente de editar o campo. Para refletir isso, você poderia criar uma _nova_ ação chamada `sent_message`, e lidar com ela separadamente no redutor:

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

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Olá',
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
      throw Error('Ação desconhecida: ' + action.type);
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
        placeholder={'Conversar com ' + contact.name}
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
          alert(`Enviando "${message}" para ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Enviar para {contact.email}
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

O comportamento resultante é o mesmo. Mas tenha em mente que os tipos de ação devem descrever idealmente "o que o usuário fez" em vez de "como você quer que o estado mude". Isso facilita a adição de mais recursos posteriormente.

Com qualquer uma das soluções, é importante que você **não** coloque o `alert` dentro de um redutor. O redutor deve ser uma função pura—ele deve apenas calcular o próximo estado. Ele não deve "fazer" nada, incluindo exibir mensagens para o usuário. Isso deve acontecer no manipulador de eventos. (Para ajudar a capturar erros como este, o React chamará seus redutores várias vezes no Modo Estrito. É por isso que, se você colocar um alerta em um redutor, isso aparecerá duas vezes.)

</Solution>

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

Isso ocorre porque você não quer compartilhar um único rascunho de mensagem entre vários destinatários. Mas seria melhor se seu aplicativo "lembrasse" um rascunho para cada contato separadamente, restaurando-os ao alternar contatos.

Sua tarefa é mudar a maneira como o estado é estruturado para que você se lembre de um rascunho de mensagem _por contato_. Você precisaria fazer algumas mudanças no redutor, no estado inicial e nos componentes.

<Hint>

Você pode estruturar seu estado assim:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Olá, Taylor', // Rascunho para contactId = 0
    1: 'Olá, Alice', // Rascunho para contactId = 1
  },
};
```

A sintaxe de [propriedade computada](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) `[key]: value` pode ajudar você a atualizar o objeto `messages`:

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
  message: 'Olá',
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
      throw Error('Ação desconhecida: ' + action.type);
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
        placeholder={'Conversar com ' + contact.name}
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
          alert(`Enviando "${message}" para ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Enviar para {contact.email}
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

Você precisará atualizar o redutor para armazenar e atualizar um rascunho de mensagem separado por contato:

```js
// Quando a entrada é editada
case 'edited_message': {
  return {
    // Manter outros estados como seleção
    ...state,
    messages: {
      // Manter mensagens para outros contatos
      ...state.messages,
      // Mas mudar a mensagem do contato selecionado
      [state.selectedId]: action.message
    }
  };
}
```

Você também precisaria atualizar o componente `Messenger` para ler a mensagem para o contato atualmente selecionado:

```js
const message = state.messages[state.selectedId];
```

Aqui está a solução completa:

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
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
  messages: {
    0: 'Olá, Taylor',
    1: 'Olá, Alice',
    2: 'Olá, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
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
        placeholder={'Conversar com ' + contact.name}
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
          alert(`Enviando "${message}" para ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Enviar para {contact.email}
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

Notavelmente, você não precisou mudar nenhum dos manipuladores de eventos para implementar esse comportamento diferente. Sem um redutor, você teria que mudar cada manipulador de eventos que atualiza o estado.

</Solution>

#### Implementar `useReducer` do zero {/*implement-usereducer-from-scratch*/}

Nos exemplos anteriores, você importou o Hook `useReducer` do React. Desta vez, você implementará _o próprio Hook `useReducer`!_ Aqui está um esboço para começar. Não deve levar mais de 10 linhas de código.

Para testar suas alterações, tente digitando na entrada ou selecionando um contato.

<Hint>

Aqui está um esboço mais detalhado da implementação:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Lembre-se de que uma função redutora leva dois argumentos—o estado atual e o objeto de ação—e retorna o próximo estado. O que sua implementação `dispatch` deve fazer com isso?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
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
  messages: {
    0: 'Olá, Taylor',
    1: 'Olá, Alice',
    2: 'Olá, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
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

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Conversar com ' + contact.name}
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
          alert(`Enviando "${message}" para ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Enviar para {contact.email}
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

Despachar uma ação chama um redutor com o estado atual e a ação, e armazena o resultado como o próximo estado. É assim que fica o código:

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
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
  messages: {
    0: 'Olá, Taylor',
    1: 'Olá, Alice',
    2: 'Olá, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Ação desconhecida: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
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

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Conversar com ' + contact.name}
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
          alert(`Enviando "${message}" para ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Enviar para {contact.email}
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

Embora não importe na maioria dos casos, uma implementação um pouco mais precisa se parece com isto:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Isso ocorre porque as ações despachadas são enfileiradas até a próxima renderização, [semelhante às funções de atualização.](/learn/queueing-a-series-of-state-updates)

</Solution>

</Challenges>