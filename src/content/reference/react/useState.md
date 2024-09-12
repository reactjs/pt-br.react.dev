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

Chame `useState` no nível superior do seu componente para declarar uma [variável de estado.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MeuComponente() {
  const [idade, setIdade] = useState(28);
  const [nome, setNome] = useState('Taylor');
  const [tarefas, setTarefas] = useState(() => criarTarefas());
  // ...
```

A convenção é nomear variáveis de estado como `[algo, setAlgo]` usando [desestruturação de array.](https://javascript.info/destructuring-assignment)

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `initialState`: O valor que você quer que o estado tenha inicialmente. Pode ser um valor de qualquer tipo, mas há um comportamento especial para funções. Este argumento é ignorado após a renderização inicial.
  * Se você passar uma função como `initialState`, ela será tratada como uma _função inicializadora_. Ela deve ser pura, não deve receber argumentos e deve retornar um valor de qualquer tipo. O React chamará sua função inicializadora ao inicializar o componente e armazenará seu valor de retorno como o estado inicial. [Veja um exemplo abaixo.](#avoiding-recreating-the-initial-state)

#### Retornos {/*returns*/}

`useState` retorna um array com exatamente dois valores:

1. O estado atual. Durante a primeira renderização, ele corresponderá ao `initialState` que você passou.
2. A [função `set`](#setstate) que permite atualizar o estado para um valor diferente e acionar uma nova renderização.

#### Ressalvas {/*caveats*/}

* `useState` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou em seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o estado para ele.
* No Modo Estrito, o React chamará sua função inicializadora duas vezes para [ajudar você a encontrar impurezas acidentais.](#my-initializer-or-updater-function-runs-twice) Este é um comportamento apenas de desenvolvimento e não afeta a produção. Se sua função inicializadora for pura (como deveria ser), isso não afetará o comportamento. O resultado de uma das chamadas será ignorado.

---

### Funções `set`, como `setAlgo(proximoEstado)` {/*setstate*/}

A função `set` retornada por `useState` permite atualizar o estado para um valor diferente e acionar uma nova renderização. Você pode passar o próximo estado diretamente ou uma função que o calcule a partir do estado anterior:

```js
const [nome, setNome] = useState('Edward');

function handleClick() {
  setNome('Taylor');
  setIdade(i => i + 1);
  // ...
```

#### Parâmetros {/*setstate-parameters*/}

* `proximoEstado`: O valor que você quer que o estado seja. Pode ser um valor de qualquer tipo, mas há um comportamento especial para funções.
  * Se você passar uma função como `proximoEstado`, ela será tratada como uma _função atualizadora_. Ela deve ser pura, deve receber o estado pendente como seu único argumento e deve retornar o próximo estado. O React colocará sua função atualizadora em uma fila e renderizará novamente seu componente. Durante a próxima renderização, o React calculará o próximo estado aplicando todas as atualizações enfileiradas ao estado anterior. [Veja um exemplo abaixo.](#updating-state-based-on-the-previous-state)

#### Retornos {/*setstate-returns*/}

As funções `set` não têm valor de retorno.

#### Ressalvas {/*setstate-caveats*/}

* A função `set` **apenas atualiza a variável de estado para a *próxima* renderização**. Se você ler a variável de estado após chamar a função `set`, [você ainda obterá o valor antigo](#ive-updated-the-state-but-logging-gives-me-the-old-value) que estava na tela antes da sua chamada.

* Se o novo valor que você fornecer for idêntico ao `state` atual, determinado por uma comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), o React **ignorará a renderização do componente e seus filhos**. Esta é uma otimização. Embora em alguns casos o React ainda possa precisar chamar seu componente antes de ignorar os filhos, isso não deve afetar seu código.

* O React [agrupa atualizações de estado.](/learn/queueing-a-series-of-state-updates) Ele atualiza a tela **depois que todos os manipuladores de eventos foram executados** e chamaram suas funções `set`. Isso evita múltiplas renderizações durante um único evento. No raro caso em que você precise forçar o React a atualizar a tela mais cedo, por exemplo, para acessar o DOM, você pode usar [`flushSync`.](/reference/react-dom/flushSync)

* Chamar a função `set` *durante a renderização* só é permitido dentro do componente atualmente em renderização. O React descartará sua saída e tentará imediatamente renderizá-lo novamente com o novo estado. Este padrão raramente é necessário, mas você pode usá-lo para **armazenar informações das renderizações anteriores**. [Veja um exemplo abaixo.](#storing-information-from-previous-renders)

* No Modo Estrito, o React chamará sua função atualizadora duas vezes para [ajudar você a encontrar impurezas acidentais.](#my-initializer-or-updater-function-runs-twice) Este é um comportamento apenas de desenvolvimento e não afeta a produção. Se sua função atualizadora for pura (como deveria ser), isso não afetará o comportamento. O resultado de uma das chamadas será ignorado.

---

## Uso {/*usage*/}

### Adicionando estado a um componente {/*adding-state-to-a-component*/}

Chame `useState` no nível superior do seu componente para declarar uma ou mais [variáveis de estado.](/learn/state-a-components-memory)

```js [[1, 4, "idade"], [2, 4, "setIdade"], [3, 4, "42"], [1, 5, "nome"], [2, 5, "setNome"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MeuComponente() {
  const [idade, setIdade] = useState(42);
  const [nome, setNome] = useState('Taylor');
  // ...
```

A convenção é nomear variáveis de estado como `[algo, setAlgo]` usando [desestruturação de array.](https://javascript.info/destructuring-assignment)

`useState` retorna um array com exatamente dois itens:

1. O <CodeStep step={1}>estado atual</CodeStep> desta variável de estado, inicialmente definido como o <CodeStep step={3}>estado inicial</CodeStep> que você forneceu.
2. A <CodeStep step={2}>função `set`</CodeStep> que permite alterá-lo para qualquer outro valor em resposta à interação.

Para atualizar o que está na tela, chame a função `set` com algum estado seguinte:

```js [[2, 2, "setNome"]]
function handleClick() {
  setNome('Robin');
}
```

O React armazenará o próximo estado, renderizará seu componente novamente com os novos valores e atualizará a UI.

<Pitfall>

Chamar a função `set` [**não** altera o estado atual no código já em execução](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setNome('Robin');
  console.log(nome); // Ainda "Taylor"!
}
```

Isso apenas afeta o que `useState` retornará a partir da *próxima* renderização.

</Pitfall>

<Recipes titleText="Exemplos básicos de useState" titleId="examples-basic">

#### Contador (número) {/*counter-number*/}

Neste exemplo, a variável de estado `count` contém um número. Clicar no botão o incrementa.

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Você clicou {count} vezes
    </button>
  );
}
```

</Sandpack>

<Solution />

#### Campo de texto (string) {/*text-field-string*/}

Neste exemplo, a variável de estado `text` contém uma string. Quando você digita, `handleChange` lê o último valor de entrada do elemento DOM de entrada do navegador e chama `setText` para atualizar o estado. Isso permite exibir o `text` atual abaixo.

<Sandpack>

```js
import { useState } from 'react';

export default function MeuInput() {
  const [text, setText] = useState('olá');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>Você digitou: {text}</p>
      <button onClick={() => setText('olá')}>
        Resetar
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Caixa de seleção (booleano) {/*checkbox-boolean*/}

Neste exemplo, a variável de estado `liked` contém um booleano. Quando você clica na entrada, `setLiked` atualiza a variável de estado `liked` com base no estado da caixa de seleção do navegador. A variável `liked` é usada para renderizar o texto abaixo da caixa de seleção.

<Sandpack>

```js
import { useState } from 'react';

export default function MinhaCaixaSelecao() {
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

export default function Formulario() {
  const [nome, setNome] = useState('Taylor');
  const [idade, setIdade] = useState(42);

  return (
    <>
      <input
        value={nome}
        onChange={e => setNome(e.target.value)}
      />
      <button onClick={() => setIdade(idade + 1)}>
        Incrementar idade
      </button>
      <p>Olá, {nome}. Você tem {idade} anos.</p>
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

Suponha que `idade` seja 42. Este manipulador chama `setIdade(idade + 1)` três vezes:

```js
function handleClick() {
  setIdade(idade + 1); // setIdade(42 + 1)
  setIdade(idade + 1); // setIdade(42 + 1)
  setIdade(idade + 1); // setIdade(42 + 1)
}
```

No entanto, após um clique, `idade` será apenas 43 em vez de 45! Isso ocorre porque chamar a função `set` [não atualiza](/learn/state-as-a-snapshot) a variável de estado `idade` no código já em execução. Então, cada chamada `setIdade(idade + 1)` se torna `setIdade(43)`.

Para resolver esse problema, **você pode passar uma *função atualizadora*** para `setIdade` em vez do próximo estado:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setIdade(a => a + 1); // setIdade(42 => 43)
  setIdade(a => a + 1); // setIdade(43 => 44)
  setIdade(a => a + 1); // setIdade(44 => 45)
}
```

Aqui, `a => a + 1` é sua função atualizadora. Ela recebe o <CodeStep step={1}>estado pendente</CodeStep> e calcula o <CodeStep step={2}>próximo estado</CodeStep> a partir dele.

O React coloca suas funções atualizadoras em uma [fila.](/learn/queueing-a-series-of-state-updates) Em seguida, durante a próxima renderização, ele as chamará na mesma ordem:

1. `a => a + 1` receberá `42` como o estado pendente e retornará `43` como o próximo estado.
1. `a => a + 1` receberá `43` como o estado pendente e retornará `44` como o próximo estado.
1. `a => a + 1` receberá `44` como o estado pendente e retornará `45` como o próximo estado.

Não há outras atualizações enfileiradas, então o React armazenará `45` como o estado atual no final.

Por convenção, é comum nomear o argumento do estado pendente com a primeira letra do nome da variável de estado, como `a` para `idade`. No entanto, você também pode chamá-lo de `idadeAnterior` ou algo que considere mais claro.

O React pode [chamar suas atualizações duas vezes](#my-initializer-or-updater-function-runs-twice) no desenvolvimento para verificar se são [puras.](/learn/keeping-components-pure)

<DeepDive>

#### Usar sempre uma função atualizadora é preferível? {/*is-using-an-updater-always-preferred*/}

Você pode ouvir uma recomendação para sempre escrever código como `setIdade(a => a + 1)` se o estado que você está definindo for calculado a partir do estado anterior. Não há problema nisso, mas nem sempre é necessário.

Na maioria dos casos, não há diferença entre essas duas abordagens. O React sempre garante que para ações intencionais do usuário, como cliques, a variável de estado `idade` seria atualizada antes do próximo clique. Isso significa que não há risco de um manipulador de cliques ver um valor "obsoleto" de `idade` no início do manipulador de eventos.

No entanto, se você fizer várias atualizações dentro do mesmo evento, as funções atualizadoras podem ser úteis. Elas também são úteis se acessar a própria variável de estado for inconveniente (você pode encontrar isso ao otimizar re-renderizações).

Se você preferir consistência em vez de uma sintaxe um pouco mais verbosa, é razoável sempre escrever uma função atualizadora se o estado que você está definindo for calculado a partir do estado anterior. Se for calculado a partir do estado anterior de alguma *outra* variável de estado, você pode querer combiná-las em um objeto e [usar um reducer.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="A diferença entre passar uma função atualizadora e passar o próximo estado diretamente" titleId="examples-updater">

#### Passando a função atualizadora {/*passing-the-updater-function*/}

Este exemplo passa a função atualizadora, então o botão "+3" funciona.

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [idade, setIdade] = useState(42);

  function incrementar() {
    setIdade(a => a + 1);
  }

  return (
    <>
      <h1>Sua idade: {idade}</h1>
      <button onClick={() => {
        incrementar();
        incrementar();
        incrementar();
      }}>+3</button>
      <button onClick={() => {
        incrementar();
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

Este exemplo **não** passa a função atualizadora, então o botão "+3" **não funciona como esperado**.

<Sandpack>

```js
import { useState } from 'react';

export default function Contador() {
  const [idade, setIdade] = useState(42);

  function incrementar() {
    setIdade(idade + 1);
  }

  return (
    <>
      <h1>Sua idade: {idade}</h1>
      <button onClick={() => {
        incrementar();
        incrementar();
        incrementar();
      }}>+3</button>
      <button onClick={() => {
        incrementar();
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

Você pode colocar objetos e arrays no estado. No React, o estado é considerado somente leitura, então **você deve *substituí-lo* em vez de *mutar* seus objetos existentes**. Por exemplo, se você tem um objeto `form` no estado, não o mute:

```js
// 🚩 Não mute um objeto no estado desta forma:
form.firstName = 'Taylor';
```

Em vez disso, substitua o objeto inteiro criando um novo:

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

Neste exemplo, a variável de estado `form` contém um objeto. Cada entrada tem um manipulador de alteração que chama `setForm` com o próximo estado de todo o formulário. A sintaxe de propagação `{ ...form }` garante que o objeto de estado seja substituído em vez de mutado.

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

Neste exemplo, o estado é mais aninhado. Quando você atualiza um estado aninhado, você precisa criar uma cópia do objeto que está atualizando, bem como de quaisquer objetos que o "contenham" no caminho ascendente. Leia [atualizando um objeto aninhado](/learn/updating-objects-in-state#updating-a-nested-object) para saber mais.

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
        {' por '}
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

#### Lista (array) {/*list-array*/}

Neste exemplo, a variável de estado `todos` contém um array. Cada manipulador de botão chama `setTodos` com a próxima versão desse array. A sintaxe de propagação `[...todos]`, `todos.map()` e `todos.filter()` garante que o array de estado seja substituído em vez de mutado.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Comprar leite', done: true },
  { id: 1, title: 'Comer tacos', done: false },
  { id: 2, title: 'Preparar chá', done: false },
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
        placeholder="Adicionar tarefa"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Adicionar</button>
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
          Salvar
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        Excluir
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

#### Escrevendo lógica de atualização concisa com Immer {/*writing-concise-update-logic-with-immer*/}

Se atualizar arrays e objetos sem mutação parecer tedioso, você pode usar uma biblioteca como [Immer](https://github.com/immerjs/use-immer) para reduzir código repetitivo. O Immer permite escrever código conciso como se você estivesse mutando objetos, mas sob o capô ele realiza atualizações imutáveis:

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
      <h1>Lista de Desejos de Arte</h1>
      <h2>Minha lista de arte para ver:</h2>
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

O React salva o estado inicial uma vez e ignora-o nas renderizações subsequentes.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Embora o resultado de `createInitialTodos()` seja usado apenas para a renderização inicial, você ainda está chamando essa função em toda renderização. Isso pode ser dispendioso se estiver criando grandes arrays ou realizando cálculos caros.

Para resolver isso, você pode **passar uma *função inicializadora*** para `useState`:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Note que você está passando `createInitialTodos`, que é a *função em si*, e não `createInitialTodos()`, que é o resultado de chamá-la. Se você passar uma função para `useState`, o React só a chamará durante a inicialização.

O React pode [chamar seus inicializadores duas vezes](#my-initializer-or-updater-function-runs-twice) no modo de desenvolvimento para verificar se eles são [puros.](/learn/keeping-components-pure)

<Recipes titleText="A diferença entre passar uma função inicializadora e passar o estado inicial diretamente" titleId="examples-initializer">

#### Passando a função inicializadora {/*passing-the-initializer-function*/}

Este exemplo passa a função inicializadora, então a função `createInitialTodos` só é executada durante a inicialização. Ela não é executada quando o componente é re-renderizado, como quando você digita na entrada.

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
      }}>Adicionar</button>
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

#### Passando o estado inicial diretamente {/*passing-the-initial-state-directly*/}

Este exemplo **não** passa a função inicializadora, então a função `createInitialTodos` é executada em toda renderização, como quando você digita na entrada. Não há diferença observável no comportamento, mas este código é menos eficiente.

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
      }}>Adicionar</button>
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

### Reiniciando o estado com uma chave {/*resetting-state-with-a-key*/}

Você frequentemente encontrará o atributo `key` ao [renderizar listas.](/learn/rendering-lists) No entanto, ele também serve a outro propósito.

Você pode **reiniciar o estado de um componente passando uma `key` diferente para um componente.** Neste exemplo, o botão Reset altera a variável de estado `version`, que passamos como uma `key` para o `Form`. Quando a `key` muda, o React recria o componente `Form` (e todos os seus filhos) do zero, então seu estado é reiniciado.

Leia [preservando e reiniciando o estado](/learn/preserving-and-resetting-state) para saber mais.

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
      <button onClick={handleReset}>Reiniciar</button>
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
      <p>Olá, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Armazenando informações de renderizações anteriores {/*storing-information-from-previous-renders*/}

Normalmente, você atualizará o estado em manipuladores de eventos. No entanto, em casos raros, você pode querer ajustar o estado em resposta à renderização -- por exemplo, você pode querer alterar uma variável de estado quando uma prop muda.

Na maioria dos casos, você não precisa disso:

* **Se o valor que você precisa pode ser calculado inteiramente a partir das props atuais ou de outro estado, [remova esse estado redundante completamente.](/learn/choosing-the-state-structure#avoid-redundant-state)** Se você estiver preocupado em recalcular com muita frequência, o [Hook `useMemo`](/reference/react/useMemo) pode ajudar.
* Se você quiser reiniciar todo o estado da árvore de componentes, [passe uma `key` diferente para o seu componente.](#resetting-state-with-a-key)
* Se possível, atualize todo o estado relevante nos manipuladores de eventos.

No raro caso em que nenhuma dessas se aplica, há um padrão que você pode usar para atualizar o estado com base nos valores que foram renderizados até agora, chamando uma função `set` enquanto seu componente está renderizando.

Aqui está um exemplo. Este componente `CountLabel` exibe a prop `count` passada a ele:

```js src/CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Digamos que você queira mostrar se o contador *aumentou ou diminuiu* desde a última alteração. A prop `count` não lhe diz isso -- você precisa manter o controle de seu valor anterior. Adicione a variável de estado `prevCount` para rastreá-la. Adicione outra variável de estado chamada `trend` para manter se o count aumentou ou diminuiu. Compare `prevCount` com `count`, e se não forem iguais, atualize tanto `prevCount` quanto `trend`. Agora você pode mostrar tanto a prop count atual quanto *como ela mudou desde a última renderização*.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrementar
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
    setTrend(count > prevCount ? 'aumentando' : 'diminuindo');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>O contador está {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Note que se você chamar uma função `set` durante a renderização, ela deve estar dentro de uma condição como `prevCount !== count`, e deve haver uma chamada como `setPrevCount(count)` dentro da condição. Caso contrário, seu componente renderizaria em um loop até travar. Além disso, você só pode atualizar o estado do componente *atualmente renderizando* desta forma. Chamar a função `set` de *outro* componente durante a renderização é um erro. Finalmente, sua chamada `set` ainda deve [atualizar o estado sem mutação](#updating-objects-and-arrays-in-state) -- isso não significa que você pode quebrar outras regras das [funções puras.](/learn/keeping-components-pure)

Este padrão pode ser difícil de entender e geralmente é melhor evitá-lo. No entanto, é melhor do que atualizar o estado em um efeito. Quando você chama a função `set` durante a renderização, o React renderizará esse componente imediatamente após seu componente sair com uma instrução `return`, e antes de renderizar os filhos. Desta forma, os filhos não precisam renderizar duas vezes. O resto da função do seu componente ainda será executado (e o resultado será descartado). Se sua condição estiver abaixo de todas as chamadas de Hook, você pode adicionar um `return;` antecipado para reiniciar a renderização mais cedo.

---

## Solução de problemas {/*troubleshooting*/}

### Atualizei o estado, mas o log me dá o valor antigo {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

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

Isso ocorre porque [o estado se comporta como um snapshot.](/learn/state-as-a-snapshot) Atualizar o estado solicita outra renderização com o novo valor de estado, mas não afeta a variável JavaScript `count` no seu manipulador de eventos já em execução.

Se você precisa usar o próximo estado, você pode salvá-lo em uma variável antes de passá-lo para a função `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Atualizei o estado, mas a tela não atualiza {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

O React **ignorará sua atualização se o próximo estado for igual ao estado anterior**, determinado por uma comparação [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Isso geralmente acontece quando você altera um objeto ou um array no estado diretamente:

```js
obj.x = 10;  // 🚩 Errado: mutando um objeto existente
setObj(obj); // 🚩 Não faz nada
```

Você mutou um objeto `obj` existente e o passou de volta para `setObj`, então o React ignorou a atualização. Para corrigir isso, você precisa garantir que sempre está _substituindo_ objetos e arrays no estado em vez de _mutá-los_:

```js
// ✅ Correto: criando um novo objeto
setObj({
  ...obj,
  x: 10
});
```

---

### Estou recebendo um erro: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Você pode receber um erro que diz: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Tipicamente, isso significa que você está definindo o estado incondicionalmente *durante a renderização*, então o componente entra em um loop: renderiza, define o estado (o que causa uma renderização), renderiza, define o estado (o que causa uma renderização), e assim por diante. Muito frequentemente, isso é causado por um erro na especificação de um manipulador de eventos:

```js {1-2}
// 🚩 Errado: chama o manipulador durante a renderização
return <button onClick={handleClick()}>Clique aqui</button>

// ✅ Correto: passa o manipulador de eventos
return <button onClick={handleClick}>Clique aqui</button>

// ✅ Correto: passa uma função inline
return <button onClick={(e) => handleClick(e)}>Clique aqui</button>
```

Se você não consegue encontrar a causa deste erro, clique na seta ao lado do erro no console e olhe através da pilha JavaScript para encontrar a chamada específica da função `set` responsável pelo erro.

---

### Minha função inicializadora ou atualizadora é executada duas vezes {/*my-initializer-or-updater-function-runs-twice*/}

No [Modo Estrito](/reference/react/StrictMode), o React chamará algumas de suas funções duas vezes em vez de uma:

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

Este comportamento **apenas de desenvolvimento** ajuda você a [manter os componentes puros.](/learn/keeping-components-pure) O React usa o resultado de uma das chamadas e ignora o resultado da outra chamada. Desde que suas funções de componente, inicializadoras e atualizadoras sejam puras, isso não deve afetar sua lógica. No entanto, se elas forem acidentalmente impuras, isso ajuda você a perceber os erros.

Por exemplo, esta função atualizadora impura muta um array no estado:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Erro: mutando o estado
  prevTodos.push(createTodo());
});
```

Como o React chama sua função atualizadora duas vezes, você verá que o todo foi adicionado duas vezes, então você saberá que há um erro. Neste exemplo, você pode corrigir o erro [substituindo o array em vez de mutá-lo](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correto: substituindo por um novo estado
  return [...prevTodos, createTodo()];
});
```

Agora que esta função atualizadora é pura, chamá-la uma vez extra não faz diferença no comportamento. É por isso que o React chamar duas vezes ajuda você a encontrar erros. **Apenas funções de componente, inicializadoras e atualizadoras precisam ser puras.** Manipuladores de eventos não precisam ser puros, então o React nunca chamará seus manipuladores de eventos duas vezes.

Leia [mantendo componentes puros](/learn/keeping-components-pure) para saber mais.

---

### Estou tentando definir o estado para uma função, mas ela é chamada em vez disso {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Você não pode colocar uma função no estado assim:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Porque você está passando uma função, o React assume que `someFunction` é uma [função inicializadora](#avoiding-recreating-the-initial-state), e que `someOtherFunction` é uma [função atualizadora](#updating-state-based-on-the-previous-state), então tenta chamá-las e armazenar o resultado. Para realmente *armazenar* uma função, você precisa colocar `() =>` antes delas em ambos os casos. Então o React armazenará as funções que você passa.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
