---
title: useContext
---

<Intro>

`useContext` é um Hook do React que permite que você leia e se inscreva em [contexto](/learn/passing-data-deeply-with-context) a partir do seu componente.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Chame `useContext` na raiz do seu componente para ler e se inscrever em [contexto.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `SomeContext`: O contexto que você criou anteriormente com [`createContext`](/reference/react/createContext). O contexto em si não contém as informações, ele apenas representa o tipo de informação que você pode fornecer ou ler a partir dos componentes.

#### Retornos {/*returns*/}

<<<<<<< HEAD
`useContext` retorna o valor do contexto para o componente chamador. Ele é determinado como o `value` passado para o mais próximo `SomeContext.Provider` acima do componente chamador na árvore. Se não houver tal provedor, o valor retornado será o `defaultValue` que você passou para [`createContext`](/reference/react/createContext) para esse contexto. O valor retornado está sempre atualizado. O React re-renderiza automaticamente os componentes que leem algum contexto se ele mudar.
=======
`useContext` returns the context value for the calling component. It is determined as the `value` passed to the closest `SomeContext` above the calling component in the tree. If there is no such provider, then the returned value will be the `defaultValue` you have passed to [`createContext`](/reference/react/createContext) for that context. The returned value is always up-to-date. React automatically re-renders components that read some context if it changes.
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619

#### Ressalvas {/*caveats*/}

<<<<<<< HEAD
* A chamada `useContext()` em um componente não é afetada pelos provedores retornados do *mesmo* componente. O correspondente `<Context.Provider>` **precisa estar *acima*** do componente que faz a chamada `useContext()`.
* O React **re-renderiza automaticamente** todos os filhos que usam um determinado contexto, começando do provedor que recebe um `value` diferente. Os valores anteriores e próximos são comparados com a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Pular re-renderizações com [`memo`](/reference/react/memo) não impede que os filhos recebam novos valores de contexto.
* Se o seu sistema de build produzir módulos duplicados na saída (o que pode acontecer com symlinks), isso pode quebrar o contexto. Passar algo via contexto só funciona se `SomeContext` que você usa para fornecer o contexto e `SomeContext` que você usa para lê-lo são ***exatamente* o mesmo objeto**, conforme determinado por uma comparação `===`.
=======
* `useContext()` call in a component is not affected by providers returned from the *same* component. The corresponding `<Context>` **needs to be *above*** the component doing the `useContext()` call.
* React **automatically re-renders** all the children that use a particular context starting from the provider that receives a different `value`. The previous and the next values are compared with the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. Skipping re-renders with [`memo`](/reference/react/memo) does not prevent the children receiving fresh context values.
* If your build system produces duplicates modules in the output (which can happen with symlinks), this can break context. Passing something via context only works if `SomeContext` that you use to provide context and `SomeContext` that you use to read it are ***exactly* the same object**, as determined by a `===` comparison.
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619

---

## Uso {/*usage*/}

### Passando dados profundamente na árvore {/*passing-data-deeply-into-the-tree*/}

Chame `useContext` na raiz do seu componente para ler e se inscrever em [contexto.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` retorna o <CodeStep step={2}>valor do contexto</CodeStep> para o <CodeStep step={1}>contexto</CodeStep> que você passou. Para determinar o valor do contexto, o React pesquisa na árvore de componentes e encontra **o provedor de contexto mais próximo acima** para esse contexto específico.

Para passar contexto para um `Button`, envolva-o ou um de seus componentes pai no provedor de contexto correspondente:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renderiza botões dentro ...
}
```

Não importa quantas camadas de componentes existam entre o provedor e o `Button`. Quando um `Button` *qualquer lugar* dentro de `Form` chama `useContext(ThemeContext)`, ele receberá `"dark"` como o valor.

<Pitfall>

`useContext()` sempre procura o provedor mais próximo *acima* do componente que o chama. Ele pesquisa para cima e **não** considera provedores no componente de onde você está chamando `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Atualizando dados passados via contexto {/*updating-data-passed-via-context*/}

Frequentemente, você vai querer que o contexto mude com o tempo. Para atualizar o contexto, combine-o com [state.](/reference/react/useState) Declare uma variável de estado no componente pai e passe o estado atual como o <CodeStep step={2}>valor do contexto</CodeStep> para o provedor.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Mudar para o tema claro
      </Button>
    </ThemeContext>
  );
}
```

Agora qualquer `Button` dentro do provedor receberá o valor atual de `theme`. Se você chamar `setTheme` para atualizar o valor de `theme` que você passa para o provedor, todos os componentes `Button` serão re-renderizados com o novo valor `'light'`.

<Recipes titleText="Exemplos de atualização do contexto" titleId="examples-basic">

#### Atualizando um valor via contexto {/*updating-a-value-via-context*/}

Neste exemplo, o componente `MyApp` mantém uma variável de estado que é então passada para o provedor `ThemeContext`. Marcar a caixa "Modo escuro" atualiza o estado. Alterar o valor fornecido re-renderiza todos os componentes que usam esse contexto.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usar modo escuro
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Note que `value="dark"` passa a string `"dark"`, mas `value={theme}` passa o valor da variável JavaScript `theme` com [chaves JSX.](/learn/javascript-in-jsx-with-curly-braces) As chaves também permitem que você passe valores de contexto que não são strings.

<Solution />

#### Atualizando um objeto via contexto {/*updating-an-object-via-context*/}

Neste exemplo, há uma variável de estado `currentUser` que mantém um objeto. Você combina `{ currentUser, setCurrentUser }` em um único objeto e o passa através do contexto dentro do `value={}`. Isso permite que qualquer componente abaixo, como `LoginButton`, leia tanto `currentUser` quanto `setCurrentUser`, e depois chame `setCurrentUser` quando necessário.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>Você está logado como {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Entrar como Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Múltiplos contextos {/*multiple-contexts*/}

Neste exemplo, existem dois contextos independentes. `ThemeContext` fornece o tema atual, que é uma string, enquanto `CurrentUserContext` contém o objeto representando o usuário atual.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Usar modo escuro
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Você está logado como {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        Nome{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Sobrenome{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Entrar
      </Button>
      {!canLogin && <i>Preencha ambos os campos.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Extraindo provedores para um componente {/*extracting-providers-to-a-component*/}

Conforme sua aplicação cresce, é esperado que você tenha uma "pirâmide" de contextos mais próximo da raiz da sua aplicação. Não há nada de errado com isso. No entanto, se você não gostar da aninhamento esteticamente, pode extrair os provedores em um único componente. Neste exemplo, `MyProviders` oculta a "plumbing" e renderiza os filhos passados a ele dentro dos provedores necessários. Note que o estado `theme` e `setTheme` ainda são necessários em `MyApp`, então `MyApp` ainda é responsável por essa parte do estado.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Usar modo escuro
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>Você está logado como {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        Nome{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Sobrenome{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Entrar
      </Button>
      {!canLogin && <i>Preencha ambos os campos.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Escalando com contexto e um redutor {/*scaling-up-with-context-and-a-reducer*/}

Em aplicações maiores, é comum combinar o contexto com um [reducer](/reference/react/useReducer) para extrair a lógica relacionada a algum estado de dentro dos componentes. Neste exemplo, toda a "fiação" está oculta no `TasksContext.js`, que contém um redutor e dois contextos separados.

Leia um [passo a passo completo](/learn/scaling-up-with-reducer-and-context) deste exemplo.

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Dia de folga em Quioto</h1>
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
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
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
  { id: 0, text: 'Caminho do filósofo', done: true },
  { id: 1, text: 'Visitar o templo', done: false },
  { id: 2, text: 'Beber matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
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

```js src/TaskList.js
import { useState, useContext } from 'react';
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

<Solution />

</Recipes>

---

### Especificando um valor padrão fallback {/*specifying-a-fallback-default-value*/}

Se o React não encontrar nenhum provedor desse <CodeStep step={1}>contexto</CodeStep> na árvore pai, o valor do contexto retornado por `useContext()` será igual ao <CodeStep step={3}>valor padrão</CodeStep> que você especificou quando criou esse contexto (/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

O valor padrão **nunca muda**. Se você quiser atualizar o contexto, use-o com estado como [descrito acima.](#updating-data-passed-via-context)

Frequentemente, em vez de `null`, há algum valor mais significativo que você pode usar como padrão, por exemplo:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Dessa forma, se você acidentalmente renderizar algum componente sem um provedor correspondente, não quebrará. Isso também ajuda seus componentes a funcionarem bem em um ambiente de teste sem precisar configurar muitos provedores nos testes.

No exemplo abaixo, o botão "Alternar tema" está sempre claro porque está **fora de qualquer provedor de contexto de tema** e o valor do tema de contexto padrão é `'light'`. Tente editar o tema padrão para ser `'dark'`.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Alternar tema
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Sobrescrevendo contexto para uma parte da árvore {/*overriding-context-for-a-part-of-the-tree*/}

Você pode sobrescrever o contexto para uma parte da árvore envolvendo essa parte em um provedor com um valor diferente.

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

Você pode aninhar e sobrescrever provedores quantas vezes precisar.

<Recipes titleText="Exemplos de sobrescrita de contexto">

#### Sobrescrevendo um tema {/*overriding-a-theme*/}

Aqui, o botão *dentro* do `Footer` recebe um valor de contexto diferente (`"light"`) do que os botões fora (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Configurações</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Cabeçalhos automaticamente aninhados {/*automatically-nested-headings*/}

Você pode "acumular" informações ao aninhar provedores de contexto. Neste exemplo, o componente `Section` rastreia o `LevelContext`, que especifica a profundidade do aninhamento da seção. Ele lê o `LevelContext` da seção pai e fornece o número do `LevelContext` aumentado em um para seus filhos. Como resultado, o componente `Heading` pode decidir automaticamente qual das tags `<h1>`, `<h2>`, `<h3>`, ..., usar com base em quantos componentes `Section` ele está aninhado.

Leia um [passo a passo detalhado](/learn/passing-data-deeply-with-context) deste exemplo.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Título</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-título</Heading>
          <Heading>Sub-título</Heading>
          <Heading>Sub-título</Heading>
          <Section>
            <Heading>Sub-sub-título</Heading>
            <Heading>Sub-sub-título</Heading>
            <Heading>Sub-sub-título</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Cabeçalho deve estar dentro de uma Seção!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Nível desconhecido: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Otimizando re-renderizações ao passar objetos e funções {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Você pode passar qualquer valor via contexto, incluindo objetos e funções.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

Aqui, o <CodeStep step={2}>valor do contexto</CodeStep> é um objeto JavaScript com duas propriedades, uma das quais é uma função. Sempre que `MyApp` re-renderiza (por exemplo, em uma atualização de rota), isso será um objeto *diferente* apontando para uma função *diferente*, então o React também terá que re-renderizar todos os componentes profundamente na árvore que chamam `useContext(AuthContext)`.

Em aplicações menores, isso não é um problema. No entanto, não há necessidade de re-renderizá-los se os dados subjacentes, como `currentUser`, não mudaram. Para ajudar o React a tirar proveito desse fato, você pode envolver a função `login` com [`useCallback`](/reference/react/useCallback) e envolver a criação do objeto dentro de [`useMemo`](/reference/react/useMemo). Esta é uma otimização de desempenho:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

Como resultado dessa alteração, mesmo que `MyApp` precise ser re-renderizado, os componentes que chamam `useContext(AuthContext)` não precisarão ser re-renderizados, a menos que `currentUser` tenha mudado.

Leia mais sobre [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) e [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Solução de Problemas {/*troubleshooting*/}

### Meu componente não vê o valor do meu provedor {/*my-component-doesnt-see-the-value-from-my-provider*/}

Existem algumas maneiras comuns de isso acontecer:

<<<<<<< HEAD
1. Você está renderizando `<SomeContext.Provider>` no mesmo componente (ou abaixo) de onde você está chamando `useContext()`. Mova `<SomeContext.Provider>` *acima e fora* do componente que chama `useContext()`.
2. Você pode ter esquecido de envolver seu componente com `<SomeContext.Provider>`, ou pode tê-lo colocado em uma parte diferente da árvore do que você pensou. Verifique se a hierarquia está correta usando [React DevTools.](/learn/react-developer-tools)
3. Você pode estar enfrentando algum problema de build com suas ferramentas que faz com que `SomeContext` visto do componente provedor e `SomeContext` visto pelo componente leitor sejam dois objetos diferentes. Isso pode acontecer se você usar symlinks, por exemplo. Você pode verificar isso atribuindo-os a globais como `window.SomeContext1` e `window.SomeContext2` e depois verificando se `window.SomeContext1 === window.SomeContext2` no console. Se eles não forem os mesmos, conserte esse problema no nível da ferramenta de build.
=======
1. You're rendering `<SomeContext>` in the same component (or below) as where you're calling `useContext()`. Move `<SomeContext>` *above and outside* the component calling `useContext()`.
2. You may have forgotten to wrap your component with `<SomeContext>`, or you might have put it in a different part of the tree than you thought. Check whether the hierarchy is right using [React DevTools.](/learn/react-developer-tools)
3. You might be running into some build issue with your tooling that causes `SomeContext` as seen from the providing component and `SomeContext` as seen by the reading component to be two different objects. This can happen if you use symlinks, for example. You can verify this by assigning them to globals like `window.SomeContext1` and `window.SomeContext2` and then checking whether `window.SomeContext1 === window.SomeContext2` in the console. If they're not the same, fix that issue on the build tool level.
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619

### Estou sempre recebendo `undefined` do meu contexto, embora o valor padrão seja diferente {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Você pode ter um provedor sem um `value` na árvore:

```js {1,2}
<<<<<<< HEAD
// 🚩 Não funciona: sem a prop value
<ThemeContext.Provider>
=======
// 🚩 Doesn't work: no value prop
<ThemeContext>
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619
   <Button />
</ThemeContext>
```

Se você esquecer de especificar `value`, é como passar `value={undefined}`.

Você pode também ter usado acidentalmente um nome de prop diferente por engano:

```js {1,2}
<<<<<<< HEAD
// 🚩 Não funciona: a prop deve ser chamada "value"
<ThemeContext.Provider theme={theme}>
=======
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619
   <Button />
</ThemeContext>
```

Em ambos os casos, você deve ver um aviso do React no console. Para corrigir, chame a prop de `value`:

```js {1,2}
<<<<<<< HEAD
// ✅ Passando a prop value
<ThemeContext.Provider value={theme}>
=======
// ✅ Passing the value prop
<ThemeContext value={theme}>
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619
   <Button />
</ThemeContext>
```

<<<<<<< HEAD
Note que o [valor padrão da sua chamada `createContext(defaultValue)`](#specifying-a-fallback-default-value) é usado **se não houver um provedor correspondente acima de tudo.** Se houver um `<SomeContext.Provider value={undefined}>` em algum lugar na árvore pai, o componente chamando `useContext(SomeContext)` *receberá* `undefined` como o valor do contexto.
=======
Note that the [default value from your `createContext(defaultValue)` call](#specifying-a-fallback-default-value) is only used **if there is no matching provider above at all.** If there is a `<SomeContext value={undefined}>` component somewhere in the parent tree, the component calling `useContext(SomeContext)` *will* receive `undefined` as the context value.
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619
