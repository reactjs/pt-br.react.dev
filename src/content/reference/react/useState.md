---
title: useState
---

<Intro>

`useState` é um Hook do React que permite adicionar uma [variável de estado](/learn/state-a-components-memory) ao seu componente.

```js
const [state, setState] = useState(initialState)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Chame `useState` no nível raiz do seu componente para declarar uma [variável de estado.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

A convenção é nomear as variáveis de estado como `[algo, setAlgo]` usando [destructuring de array.](https://javascript.info/destructuring-assignment)

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `initialState`: O valor que você deseja que o estado tenha inicialmente. Pode ser um valor de qualquer tipo, mas há um comportamento especial para funções. Este argumento é ignorado após a renderização inicial.
  * Se você passar uma função como `initialState`, ela será tratada como uma _função inicializadora_. Ela deve ser pura, não deve receber argumentos e deve retornar um valor de qualquer tipo. React chamará sua função inicializadora ao inicializar o componente, e armazenará seu valor de retorno como o estado inicial. [Veja um exemplo abaixo.](#avoiding-recreating-the-initial-state)

#### Retorna {/*returns*/}

`useState` retorna um array com exatamente dois valores:

1. O estado atual. Durante a primeira renderização, ele corresponderá ao `initialState` que você passou.
2. A função [`set`](#setstate) que permite atualizar o estado para um valor diferente e acionar uma nova renderização.

#### Ressalvas {/*caveats*/}

* `useState` é um Hook, então você só pode chamá-lo **no nível raiz do seu componente** ou seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o estado para ele.
* No Modo Strict, React **chamará sua função inicializadora duas vezes** para [ajudá-lo a encontrar impurezas acidentais.](#my-initializer-or-updater-function-runs-twice) Este é um comportamento apenas para desenvolvimento e não afeta a produção. Se sua função inicializadora for pura (como deveria ser), isso não deve afetar o comportamento. O resultado de uma das chamadas será ignorado.

---

### Funções `set`, como `setSomething(nextState)` {/*setstate*/}

A função `set` retornada por `useState` permite que você atualize o estado para um valor diferente e acione uma nova renderização. Você pode passar o próximo estado diretamente, ou uma função que o calcula a partir do estado anterior:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parâmetros {/*setstate-parameters*/}

* `nextState`: O valor que você quer que o estado tenha. Pode ser um valor de qualquer tipo, mas há um comportamento especial para funções.
  * Se você passar uma função como `nextState`, ela será tratada como uma _função atualizadora_. Ela deve ser pura, deve receber o estado pendente como seu único argumento e deve retornar o próximo estado. React colocará sua função atualizadora em uma fila e renderizará seu componente novamente. Durante a próxima renderização, React calculará o próximo estado aplicando todos os atualizadores enfileirados ao estado anterior. [Veja um exemplo abaixo.](#updating-state-based-on-the-previous-state)

#### Retorna {/*setstate-returns*/}

Funções `set` não têm um valor de retorno.

#### Ressalvas {/*setstate-caveats*/}

* A função `set` **só atualiza a variável de estado para a *próxima* renderização**. Se você ler a variável de estado após chamar a função `set`, [você ainda obterá o valor antigo](#ive-updated-the-state-but-logging-gives-me-the-old-value) que estava na tela antes da sua chamada.

* Se o novo valor que você fornecer for idêntico ao `state` atual, como determinado por uma comparação [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React **pulará a re-renderização do componente e seus filhos.** Esta é uma otimização. Embora, em alguns casos, o React ainda precise chamar seu componente antes de pular os filhos, isso não deve afetar seu código.

* React [processa atualizações de estado em lote.](/learn/queueing-a-series-of-state-updates) Ele atualiza a tela **após todos os manipuladores de eventos terem sido executados** e tiverem chamado suas funções `set`. Isso impede múltiplas re-renderizações durante um único evento. No raro caso de precisar forçar o React a atualizar a tela mais cedo, por exemplo, para acessar o DOM, você pode usar [`flushSync`.](/reference/react-dom/flushSync)

* A função `set` tem uma identidade estável, então você frequentemente a verá omitida das dependências de Effect, mas incluí-la não fará com que o Effect dispare. Se o linter permitir que você omita uma dependência sem erros, é seguro fazê-lo. [Saiba mais sobre como remover dependências de Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* Chamar a função `set` *durante a renderização* só é permitido dentro do componente atualmente em renderização. React descartará sua saída e tentará imediatamente renderizá-lo novamente com o novo estado. Este padrão raramente é necessário, mas você pode usá-lo para **armazenar informações das renderizações anteriores**. [Veja um exemplo abaixo.](#storing-information-from-previous-renders)

* No Modo Strict, React **chamará sua função atualizadora duas vezes** para [ajudá-lo a encontrar impurezas acidentais.](#my-initializer-or-updater-function-runs-twice) Este é um comportamento apenas para desenvolvimento e não afeta a produção. Se sua função atualizadora for pura (como deveria ser), isso não deve afetar o comportamento. O resultado de uma das chamadas será ignorado.

---

## Uso {/*usage*/}

### Adicionando estado a um componente {/*adding-state-to-a-component*/}

Chame `useState` no nível raiz do seu componente para declarar uma ou mais [variáveis de estado.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

A convenção é nomear as variáveis de estado como `[algo, setAlgo]` usando [destructuring de array.](https://javascript.info/destructuring-assignment)

`useState` retorna um array com exatamente dois itens:

1. O <CodeStep step={1}>estado atual</CodeStep> desta variável de estado, inicialmente definido para o <CodeStep step={3}>estado inicial</CodeStep> que você forneceu.
2. A <CodeStep step={2}>função `set`</CodeStep> que permite alterá-lo para qualquer outro valor em resposta à interação.

Para atualizar o que está na tela, chame a função `set` com algum próximo estado:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React armazenará o próximo estado, renderizará seu componente novamente com os novos valores e atualizará a UI.

<Pitfall>

Chamar a função `set` [**não** altera o estado atual no código já em execução](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

Isso só afeta o que `useState` retornará a partir do *próximo* render.

</Pitfall>

<Recipes titleText="Exemplos básicos de useState" titleId="examples-basic">

#### Contador (número) {/*counter-number*/}

Neste exemplo, a variável de estado `count` armazena um número. Clicar no botão o incrementa.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Você me pressionou {count} vezes
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo de texto (string) {/*text-field-string*/}

Neste exemplo, a variável de estado `text` armazena uma string. Quando você digita, `handleChange` lê o valor de entrada mais recente do elemento DOM de entrada do navegador e chama `setText` para atualizar o estado. Isso permite que você exiba o `text` atual abaixo.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Você digitou: {text}</p>
      <button onClick={() => setText('hello')}>
        Redefinir
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Checkbox (booleano) {/*checkbox-boolean*/}

Neste exemplo, a variável de estado `liked` armazena um booleano. Ao clicar na entrada, `setLiked` atualiza a variável de estado `liked` com o valor da checkbox do navegador, com o valor em `checked`. A variável `liked` é usada para renderizar o texto abaixo da checkbox.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        Eu gostei disso
      </label>
      <p>Você {liked ? 'gostou' : 'não gostou'} disso.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Formulário (duas variáveis) {/*form-two-variables*/}

Você pode declarar mais de uma variável de estado no mesmo componente. Cada variável de estado é completamente independente.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Incrementar idade
      </button>
      <p>Olá, {name}. Você tem {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Atualizando o estado com base no estado anterior {/*updating-state-based-on-the-previous-state*/}

Suponha que a `idade` seja `42`. Este manipulador chama `setAge(age + 1)` três vezes:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

No entanto, após um clique, a `idade` será apenas `43` em vez de `45`! Isso ocorre porque chamar a função `set` [não atualiza](/learn/state-as-a-snapshot) a variável de estado `age` no código já em execução. Portanto, cada chamada `setAge(age + 1)` se torna `setAge(43)`.

Para resolver esse problema, **você pode passar uma *função atualizadora*** para `setAge` em vez do próximo estado:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Aqui, `a => a + 1` é sua função atualizadora. Ela recebe o <CodeStep step={1}>estado pendente</CodeStep> e calcula o <CodeStep step={2}>próximo estado</CodeStep> a partir dele.

React coloca suas funções atualizadoras em uma [fila.](/learn/queueing-a-series-of-state-updates) Então, durante a próxima renderização, ele as chamará na mesma ordem:

1. `a => a + 1` receberá `42` como o estado pendente e retornará `43` como o próximo estado.
1. `a => a + 1` receberá `43` como o estado pendente e retornará `44` como o próximo estado.
1. `a => a + 1` receberá `44` como o estado pendente e retornará `45` como o próximo estado.

Não há outras atualizações enfileiradas, então React armazenará `45` como o estado atual no final.

Por convenção, é comum nomear o argumento de estado pendente para a primeira letra do nome da variável de estado, como `a` para `age`. No entanto, você também pode chamá-lo de `prevAge` ou algo mais que você ache mais claro.

React pode [chamar seus atualizadores duas vezes](#my-initializer-or-updater-function-runs-twice) no desenvolvimento para verificar se eles são [puros.](/learn/keeping-components-pure)

<DeepDive>

#### Usar um atualizador é sempre preferível? {/*is-using-an-updater-always-preferred*/}

Você pode ouvir uma recomendação para sempre escrever código como `setAge(a => a + 1)` se o estado que você está definindo for calculado a partir do estado anterior. Não há nenhum dano nisso, mas também não é sempre necessário.

Na maioria dos casos, não há diferença entre essas duas abordagens. React sempre garante que, para ações intencionais do usuário, como cliques, a variável de estado `age` seja atualizada antes do próximo clique. Isso significa que não há risco de um manipulador de clique ver uma `idade` "desatualizada" no início do manipulador de eventos.

No entanto, se você fizer várias atualizações dentro do mesmo evento, os atualizadores podem ser úteis. Eles também são úteis se acessar a própria variável de estado for inconveniente (você pode se deparar com isso ao otimizar re-renders).

Se você prefere consistência a uma sintaxe ligeiramente mais verbosa, é razoável sempre escrever um atualizador se o estado que você está definindo for calculado a partir do estado anterior. Se ele for calculado a partir do estado anterior de alguma *outra* variável de estado, você pode querer combiná-los em um objeto e [usar um reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="A diferença entre passar um atualizador e passar o próximo estado diretamente" titleId="examples-updater">

#### Passando a função atualizadora {/*passing-the-updater-function*/}

Este exemplo passa a função atualizadora, então o botão "+3" funciona.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Sua idade: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Passando o próximo estado diretamente {/*passing-the-next-state-directly*/}

Este exemplo **não** passa a função atualizadora, então o botão "+3" **não funciona como o esperado**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Sua idade: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Atualizando objetos e arrays no estado {/*updating-objects-and-arrays-in-state*/}

Você pode colocar objetos e arrays no estado. Em React, o estado é considerado somente leitura, então **você deve *substituí-lo* em vez de *mutar* seus objetos existentes**. Por exemplo, se você tiver um objeto `form` no estado, não o mute:

```js
// 🚩 Não mute um objeto no estado assim:
form.firstName = 'Taylor';
```

Em vez disso, substitua todo o objeto criando um novo:

```js
// ✅ Substitua o estado com um novo objeto
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Leia [atualizando objetos no estado](/learn/updating-objects-in-state) e [atualizando arrays no estado](/learn/updating-arrays-in-state) para saber mais.

<Recipes titleText="Exemplos de objetos e arrays no estado" titleId="examples-objects">

#### Formulário (objeto) {/*form-object*/}

Neste exemplo, a variável de estado `form` armazena um objeto. Cada entrada tem um manipulador de alteração que chama `setForm` com o próximo estado de todo o formulário. A sintaxe de espalhamento `{ ...form }` garante que o objeto de estado seja substituído em vez de mutado.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        Primeiro nome:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Sobrenome:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Formulário (objeto aninhado) {/*form-nested-object*/}

Neste exemplo, o estado está mais aninhado. Quando você atualiza o estado aninhado, você precisa criar uma cópia do objeto que você está atualizando, bem como quaisquer objetos "contêineres" no caminho ascendente. Leia [atualizando um objeto aninhado](/learn/updating-objects-in-state#updating-a-nested-object) para saber mais.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Nome:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Título:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Cidade:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Imagem:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (localizado em {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Lista (array) {/*list-array*/}```md {/*lista-array-list-arraymd*/}
Neste exemplo, a variável de estado `todos` contém um array. Cada manipulador de botões chama `setTodos` com a próxima versão desse array. A sintaxe de espalhamento `[...todos]`, `todos.map()` e `todos.filter()` garante que o array de estado seja substituído em vez de mutado.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

<Solution />

#### Escrevendo lógica de atualização concisa com Immer {/*escrevendo-logica-de-atualizacao-concisa-com-immer*/}

Se atualizar arrays e objetos sem mutação parecer tedioso, você pode usar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir o código repetitivo. Immer permite que você escreva um código conciso como se estivesse mutando objetos, mas por baixo dos panos, ele executa atualizações imutáveis:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
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

<Solution />

</Recipes>

---

### Evitando recriar o estado inicial {/*avoiding-recreating-the-initial-state*/}

React salva o estado inicial uma vez e o ignora nas próximas renderizações.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Embora o resultado de `createInitialTodos()` seja usado apenas para a renderização inicial, você ainda está chamando essa função em cada renderização. Isso pode ser um desperdício se estiver criando grandes arrays ou realizando cálculos caros.

Para resolver isso, você pode **passá-lo como uma função _inicializadora_** para `useState` em vez disso:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Observe que você está passando `createInitialTodos`, que é a *própria função*, e não `createInitialTodos()`, que é o resultado de chamá-la. Se você passar uma função para `useState`, React só a chamará durante a inicialização.

O React pode [chamar suas inicializadoras duas vezes](#my-initializer-or-updater-function-runs-twice) no desenvolvimento para verificar se elas são [puras.](/learn/keeping-components-pure)

<Recipes titleText="A diferença entre passar uma inicializadora e passar o estado inicial diretamente" titleId="examples-initializer">

#### Passando a função inicializadora {/*passando-a-funcao-inicializadora*/}

Este exemplo passa a função inicializadora, então a função `createInitialTodos` só é executada durante a inicialização. Ela não é executada quando o componente é renderizado novamente, como quando você digita no input.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

#### Passando o estado inicial diretamente {/*passando-o-estado-inicial-diretamente*/}

Este exemplo **não** passa a função inicializadora, então a função `createInitialTodos` é executada em cada renderização, como quando você digita no input. Não há diferença observável no comportamento, mas esse código é menos eficiente.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
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

### Redefinindo o estado com uma chave {/*redefinindo-o-estado-com-uma-chave*/}

Você geralmente encontrará o atributo `key` ao [renderizar listas.](/learn/rendering-lists) No entanto, ele também serve a outro propósito.

Você pode **redefinir o estado de um componente passando uma `key` diferente para um componente.** Neste exemplo, o botão Reset altera a variável de estado `version`, que passamos como uma `key` para o `Form`. Quando a `key` muda, React recria o componente `Form` (e todos os seus filhos) do zero, então seu estado é redefinido.

Leia [preservando e redefinindo o estado](/learn/preserving-and-resetting-state) para saber mais.

<Sandpack>

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Armazenando informações das renderizações anteriores {/*storing-information-from-previous-renders*/}

Normalmente, você atualizará o estado em manipuladores de eventos. No entanto, em casos raros, você pode querer ajustar o estado em resposta à renderização -- por exemplo, você pode querer alterar uma variável de estado quando uma prop for alterada.

Na maioria dos casos, você não precisa disso:

* **Se o valor de que você precisa puder ser calculado inteiramente a partir das props atuais ou de outro estado, [remova completamente esse estado redundante.](/learn/choosing-the-state-structure#avoid-redundant-state)** Se você está preocupado em recalcular com muita frequência, o [`useMemo` Hook](/reference/react/useMemo) pode ajudar.
* Se você deseja redefinir o estado de toda a árvore de componentes, [passe um `key` diferente para seu componente.](#resetting-state-with-a-key)
* Se puder, atualize todo o estado relevante nos manipuladores de eventos.

No raro caso de que nenhum deles se aplique, há um padrão que você pode usar para atualizar o estado com base nos valores que foram renderizados até agora, chamando uma função `set` enquanto seu componente está renderizando.

Aqui está um exemplo. Este componente `CountLabel` exibe a prop `count` que foi passada para ele:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Digamos que você queira mostrar se o contador *aumentou ou diminuiu* desde a última alteração. A prop `count` não informa isso -- você precisa manter o controle de seu valor anterior. Adicione a variável de estado `prevCount` para rastreá-la. Adicione outra variável de estado chamada `trend` para armazenar se a contagem aumentou ou diminuiu. Compare `prevCount` com `count`, e se eles não forem iguais, atualize `prevCount` e `trend`. Agora você pode mostrar a prop de contagem atual e *como ela foi alterada desde a última renderização*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js src/CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Observe que, se você chamar uma função `set` durante a renderização, ela deve estar dentro de uma condição como `prevCount !== count`, e deve haver uma chamada como `setPrevCount(count)` dentro da condição. Caso contrário, seu componente seria renderizado novamente em um loop até travar. Além disso, você só pode atualizar o estado do componente que está sendo renderizado no momento dessa maneira. Chamar a função `set` de *outro* componente durante a renderização é um erro. Por fim, sua chamada `set` ainda deve [atualizar o estado sem mutação](#updating-objects-and-arrays-in-state) -- isso não significa que você pode quebrar outras regras das [funções puras.](/learn/keeping-components-pure)

É possível que este padrão seja difícil de entender e geralmente é melhor evitá-lo. No entanto, é melhor do que atualizar o estado em um efeito. Quando você chama a função `set` durante a renderização, o React renderizará novamente esse componente imediatamente após seu componente sair com uma instrução `return`, e antes de renderizar os filhos. Dessa forma, os filhos não precisam renderizar duas vezes. O restante da função do seu componente ainda será executado (e o resultado será descartado). Se sua condição estiver abaixo de todas as chamadas de Hook, você poderá adicionar um `return;` antecipado para reiniciar a renderização mais cedo.

---

## Solução de problemas {/*troubleshooting*/}

### Eu atualizei o estado, mas o log mostra o valor antigo {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Chamar a função `set` **não altera o estado no código em execução**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Solicita uma nova renderização com 1
  console.log(count);  // Ainda 0!

  setTimeout(() => {
    console.log(count); // Também 0!
  }, 5000);
}
```

Isso ocorre porque [os estados se comportam como um snapshot.](/learn/state-as-a-snapshot) Atualizar o estado solicita outra renderização com o novo valor de estado, mas não afeta a variável JavaScript `count` no seu manipulador de eventos já em execução.

Se você precisar usar o próximo estado, você pode salvá-lo em uma variável antes de passá-lo para a função `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Eu atualizei o estado, mas a tela não atualiza {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

O React irá **ignorar sua atualização se o próximo estado for igual ao estado anterior,** conforme determinado por uma comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Isso geralmente acontece quando você altera um objeto ou um array no estado diretamente:

```js
obj.x = 10;  // 🚩 Errado: mutando um objeto existente
setObj(obj); // 🚩 Não faz nada
```

Você mutou um objeto `obj` existente e o passou de volta para `setObj`, então o React ignorou a atualização. Para corrigir isso, você precisa garantir que esteja sempre [_substituindo_ objetos e arrays no estado em vez de _mutá-los_](#updating-objects-and-arrays-in-state):

```js
// ✅ Correto: criando um novo objeto
setObj({
  ...obj,
  x: 10
});
```

---

### Estou recebendo um erro: "Too many re-renders" (Muitas renderizações) {/*im-getting-an-error-too-many-re-renders*/}

Você pode obter um erro que diz: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` (Muitas renderizações. O React limita o número de renderizações para evitar um loop infinito.) Normalmente, isso significa que você está definindo condicionalmente o estado *durante a renderização*, então seu componente entra em um loop: renderizar, definir o estado (o que causa uma renderização), renderizar, definir o estado (o que causa uma renderização) e assim por diante. Com muita frequência, isso é causado por um erro na especificação de um manipulador de eventos:

```js {1-2}
// 🚩 Errado: chama o manipulador durante a renderização
return <button onClick={handleClick()}>Click me</button>

// ✅ Correto: passa o manipulador de eventos
return <button onClick={handleClick}>Click me</button>

// ✅ Correto: passa uma função inline
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Se você não conseguir encontrar a causa desse erro, clique na seta ao lado do erro no console e examine a pilha JavaScript para encontrar a chamada de função `set` específica responsável pelo erro.

---

### Minha função inicializadora ou atualizadora executa duas vezes {/*my-initializer-or-updater-function-runs-twice*/}

No [Strict Mode](/reference/react/StrictMode), o React chamará algumas de suas funções duas vezes em vez de uma:

```js {2,5-6,11-12}
function TodoList() {
  // Esta função de componente será executada duas vezes para cada renderização.

  const [todos, setTodos] = useState(() => {
    // Esta função inicializadora será executada duas vezes durante a inicialização.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // Esta função atualizadora será executada duas vezes para cada clique.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Isso é esperado e não deve quebrar seu código.

Este comportamento **apenas de desenvolvimento** ajuda você a [manter os componentes puros.](/learn/keeping-components-pure) O React usa o resultado de uma das chamadas e ignora o resultado da outra chamada. Contanto que suas funções de componente, inicializadora e atualizadora sejam puras, isso não deve afetar sua lógica. No entanto, se elas forem acidentalmente impuras, isso o ajudará a notar os erros.

Por exemplo, esta função atualizadora impura muta um array no estado:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Erro: mutando o estado
  prevTodos.push(createTodo());
});
```

Como o React chama sua função atualizadora duas vezes, você verá o todo adicionado duas vezes, então saberá que há um erro. Neste exemplo, você pode corrigir o erro [substituindo o array em vez de mutá-lo](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correto: substituindo por um novo estado
  return [...prevTodos, createTodo()];
});
```

Agora que essa função atualizadora é pura, chamá-la uma vez a mais não faz diferença no comportamento. É por isso que o React chamá-la duas vezes ajuda você a encontrar erros. **Apenas as funções de componente, inicializadora e atualizadora precisam ser puras.** Os manipuladores de eventos não precisam ser puros, então o React nunca chamará seus manipuladores de eventos duas vezes.

Leia [mantendo os componentes puro](/learn/keeping-components-pure) para saber mais.

---

### Estou tentando definir o estado para uma função, mas ela é chamada em vez disso {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Você não pode colocar uma função no estado assim:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Como você está passando uma função, o React assume que `someFunction` é uma [função inicializadora](#avoiding-recreating-the-initial-state) e que `someOtherFunction` é uma [função atualizadora](#updating-state-based-on-the-previous-state), então ele tenta chamá-las e armazenar o resultado. Para realmente *armazenar* uma função, você precisa colocar `() =>` antes delas em ambos os casos. Então o React armazenará as funções que você passar.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
