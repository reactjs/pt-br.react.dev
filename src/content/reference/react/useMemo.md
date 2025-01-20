---
title: useMemo
---

<Intro>

`useMemo` é um Hook do React que permite armazenar em cache o resultado de um cálculo entre re-renderizações.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Chame `useMemo` no nível superior do seu componente para armazenar em cache um cálculo entre re-renderizações:

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `calculateValue`: A função que calcula o valor que você deseja armazenar em cache. Ela deve ser pura, não deve receber argumentos e deve retornar um valor de qualquer tipo. O React chamará sua função durante a renderização inicial. Em renderizações seguintes, o React retornará o mesmo valor novamente se as `dependencies` não tiverem mudado desde a última renderização. Caso contrário, chamará `calculateValue`, retornará seu resultado e o armazenará para que possa ser reutilizado posteriormente.

* `dependencies`: A lista de todos os valores reativos referenciados dentro do código de `calculateValue`. Valores reativos incluem props, estado, e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se seu linter estiver [configurado para React](/learn/editor-setup#linting), ele verificará se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita inline como `[dep1, dep2, dep3]`. O React comparará cada dependência com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Retornos {/*returns*/}

Na renderização inicial, `useMemo` retorna o resultado da chamada de `calculateValue` sem argumentos.

Durante as renderizações seguintes, ele retornará um valor já armazenado da última renderização (se as dependências não mudaram) ou chamará `calculateValue` novamente e retornará o resultado que `calculateValue` retornou.

#### Ressalvas {/*caveats*/}

* `useMemo` é um Hook, portanto você só pode chamá-lo **no nível superior do seu componente** ou de seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o estado para ele.
* No Modo Estrito, o React **chamará sua função de cálculo duas vezes** para [ajudá-lo a encontrar impurezas acidentais.](#my-calculation-runs-twice-on-every-re-render) Este é um comportamento exclusivo de desenvolvimento e não afeta a produção. Se sua função de cálculo for pura (como deveria ser), isso não deve afetar sua lógica. O resultado de uma das chamadas será ignorado.
* O React **não descartará o valor armazenado em cache a menos que haja um motivo específico para fazê-lo.** Por exemplo, em desenvolvimento, o React descarta o cache quando você edita o arquivo do seu componente. Tanto em desenvolvimento quanto em produção, o React descartará o cache se seu componente suspender durante a montagem inicial. No futuro, o React pode adicionar mais recursos que aproveitem o descarte do cache – por exemplo, se o React adicionar suporte embutido para listas virtualizadas no futuro, faria sentido descartar o cache para itens que saem da viewport da tabela virtualizada. Isso deve estar bem se você confiar no `useMemo` apenas como uma otimização de desempenho. Caso contrário, uma [variável de estado](/reference/react/useState#avoiding-recreating-the-initial-state) ou uma [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) podem ser mais apropriadas.

<Note>

Armazenar em cache valores de retorno assim é conhecido como [*memoization*,](https://en.wikipedia.org/wiki/Memoization) e é por isso que este Hook é chamado `useMemo`.

</Note>

---

## Uso {/*usage*/}

### Evitando recalculos dispendiosos {/*skipping-expensive-recalculations*/}

Para armazenar em cache um cálculo entre re-renderizações, envolva-o em uma chamada a `useMemo` no nível superior do seu componente:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Você precisa passar duas coisas para `useMemo`:

1. Uma <CodeStep step={1}>função de cálculo</CodeStep> que não receba argumentos, como `() =>`, e retorne o que você deseja calcular.
2. Uma <CodeStep step={2}>lista de dependências</CodeStep> incluindo cada valor dentro do seu componente que é usado dentro do seu cálculo.

Na renderização inicial, o <CodeStep step={3}>valor</CodeStep> que você receberá de `useMemo` será o resultado da chamada de sua <CodeStep step={1}>cálculo</CodeStep>.

Em cada renderização subsequente, o React comparará as <CodeStep step={2}>dependências</CodeStep> com as dependências que você passou durante a última renderização. Se nenhuma das dependências tiver mudado (comparando com [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` retornará o valor que você já calculou anteriormente. Caso contrário, o React executará sua função de cálculo novamente e retornará o novo valor.

Em outras palavras, `useMemo` armazena em cache o resultado de um cálculo entre re-renderizações até que suas dependências mudem.

**Vamos passar por um exemplo para ver quando isso é útil.**

Por padrão, o React re-executará todo o corpo do seu componente sempre que ele for re-renderizado. Por exemplo, se esta `TodoList` atualizar seu estado ou receber novas props de seu pai, a função `filterTodos` será re-executada:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Geralmente, isso não é um problema, uma vez que a maioria dos cálculos é muito rápida. No entanto, se você estiver filtrando ou transformando um grande array, ou fazendo algum cálculo dispendioso, você pode querer evitar fazê-lo novamente se os dados não mudaram. Se tanto `todos` quanto `tab` forem os mesmos que eram durante a última renderização, embrulhar o cálculo em `useMemo`, como antes, permitirá que você reutilize `visibleTodos` que você já calculou antes.

Esse tipo de cache é chamado de *[memoization.](https://en.wikipedia.org/wiki/Memoization)*

<Note>

**Você deve confiar em `useMemo` apenas como uma otimização de desempenho.** Se seu código não funcionar sem ele, encontre o problema subjacente e conserte primeiro. Depois você pode adicionar `useMemo` para melhorar o desempenho.

</Note>

<DeepDive>

#### Como saber se um cálculo é dispendioso? {/*how-to-tell-if-a-calculation-is-expensive*/}

Em geral, a menos que você esteja criando ou iterando sobre milhares de objetos, provavelmente não é dispendioso. Se você quiser ter mais confiança, pode adicionar um log de console para medir o tempo gasto em um pedaço de código:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Realize a interação que você está medindo (por exemplo, digitando na entrada). Você verá logs como `filter array: 0.15ms` no seu console. Se o tempo total registrado somar um valor significativo (digamos, `1ms` ou mais), pode fazer sentido armazenar esse cálculo em cache. Como um experimento, você pode então envolver o cálculo em `useMemo` para verificar se o tempo total registrado diminuiu para essa interação ou não:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Pulado se todos e tab não mudaram
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` não tornará a *primeira* renderização mais rápida. Ele apenas ajuda você a evitar trabalho desnecessário em atualizações.

Lembre-se de que sua máquina provavelmente é mais rápida do que a dos seus usuários, portanto é uma boa ideia testar o desempenho com uma desaceleração artificial. Por exemplo, o Chrome oferece uma opção de [Throttling de CPU](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) para isso.

Além disso, note que medir o desempenho em desenvolvimento não fornecerá os resultados mais precisos. (Por exemplo, quando [Modo Estrito](/reference/react/StrictMode) está ativado, você verá cada componente sendo renderizado duas vezes em vez de uma.) Para obter as cronometragens mais precisas, construa seu aplicativo para produção e teste-o em um dispositivo como os que seus usuários têm.

</DeepDive>

<DeepDive>

#### Você deve adicionar useMemo em todos os lugares? {/*should-you-add-usememo-everywhere*/}

Se seu aplicativo for como este site, e a maioria das interações forem grossas (como substituir uma página ou uma seção inteira), a memoization geralmente é desnecessária. Por outro lado, se seu aplicativo for mais como um editor de desenho, e a maioria das interações forem granulares (como mover formas), então pode ser que você encontre a memoization muito útil.

Otimizar com `useMemo` é valioso apenas em alguns casos:

- O cálculo que você está colocando em `useMemo` é notavelmente lento, e suas dependências raramente mudam.
- Você o passa como prop para um componente envolto em [`memo`.](/reference/react/memo) Você quer pular a re-renderização se o valor não mudou. A memoization permite que seu componente re-renderize apenas quando as dependências não forem as mesmas.
- O valor que você está passando é posteriormente usado como uma dependência de algum Hook. Por exemplo, talvez o valor do cálculo de outro `useMemo` dependa disso. Ou talvez você esteja dependendo desse valor de [`useEffect.`](/reference/react/useEffect)

Não há benefício em embrulhar um cálculo em `useMemo` em outros casos. Não há dano significativo em fazer isso também, então algumas equipes escolhem não pensar sobre casos individuais e memoizar o máximo possível. A desvantagem dessa abordagem é que o código se torna menos legível. Além disso, nem toda memoization é eficaz: um único valor que é "sempre novo" é suficiente para quebrar a memoization para um componente inteiro.

**Na prática, você pode tornar a memoization desnecessária seguindo alguns princípios:**

1. Quando um componente envolve visualmente outros componentes, deixe-o [aceitar JSX como filhos.](/learn/passing-props-to-a-component#passing-jsx-as-children) Dessa forma, quando o componente wrapper atualiza seu próprio estado, o React sabe que seus filhos não precisam ser re-renderizados.
1. Prefira estado local e não [elevar o estado](/learn/sharing-state-between-components) mais do que o necessário. Por exemplo, não mantenha estado transitório como formulários e se um item está sendo pairado no topo da sua árvore ou em uma biblioteca de estado global.
1. Mantenha sua [lógica de renderização pura.](/learn/keeping-components-pure) Se re-renderizar um componente causar um problema ou produzir algum artefato visual notável, é um bug no seu componente! Conserte o bug em vez de adicionar memoization.
1. Evite [Efeitos desnecessários que atualizam o estado.](/learn/you-might-not-need-an-effect) A maioria dos problemas de desempenho em aplicativos React é causada por cadeias de atualizações originadas de Efeitos que fazem com que seus componentes renderizem repetidamente.
1. Tente [remover dependências desnecessárias de seus Efeitos.](/learn/removing-effect-dependencies) Por exemplo, em vez de memoization, muitas vezes é mais simples mover algum objeto ou uma função para dentro de um Efeito ou fora do componente.

Se uma interação específica ainda parecer lenta, [use o profiler da ferramenta de desenvolvedor do React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver quais componentes se beneficiariam mais da memoization e adicione memoization onde necessário. Esses princípios tornam seus componentes mais fáceis de depurar e entender, portanto, é bom segui-los em qualquer caso. A longo prazo, estamos pesquisando [fazer memoization granular automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver isso de uma vez por todas.

</DeepDive>

<Recipes titleText="A diferença entre useMemo e calcular um valor diretamente" titleId="examples-recalculation">

#### Evitando recálculo com `useMemo` {/*skipping-recalculation-with-usememo*/}

Neste exemplo, a implementação de `filterTodos` é **artificialmente desacelerada** para que você possa ver o que acontece quando alguma função JavaScript que você está chamando durante a renderização é genuinamente lenta. Tente alternar as guias e alternar o tema.

Alternar as guias parece lenta porque força o `filterTodos` desacelerado a ser reexecutado. Isso é esperado porque a `tab` mudou, e assim todo o cálculo *precisa* ser re-executado. (Se você está curioso por que ele executa duas vezes, isso é explicado [aqui.](#my-calculation-runs-twice-on-every-re-render))

Alternar o tema. **Graças ao `useMemo`, é rápido apesar da desaceleração artificial!** A chamada lenta de `filterTodos` foi pulada, porque tanto `todos` quanto `tab` (que você passa como dependências para o `useMemo`) não mudaram desde a última renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: <code>filterTodos</code> foi artificialmente desacelerado!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALMENTE LENTO] Filtrando ' + todos.length + ' todos para a guia "' + tab + '".');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não fazer nada por 500 ms para emular um código extremamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Sempre recalculando um valor {/*always-recalculating-a-value*/}

Neste exemplo, a implementação de `filterTodos` também é **artificialmente desacelerada** para que você possa ver o que acontece quando alguma função JavaScript que você está chamando durante a renderização é genuinamente lenta. Tente alternar as guias e alternar o tema.

Ao contrário do exemplo anterior, alternar o tema também é lento agora! Isso ocorre porque **não há chamada `useMemo` nesta versão,** portanto a `visibleTodos` é sempre um array diferente e o desacelerado componente `List` não pode pular a re-renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Nota: <code>filterTodos</code> foi artificialmente desacelerado!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALMENTE LENTO] Filtrando ' + todos.length + ' todos para a guia "' + tab + '".');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não fazer nada por 500 ms para emular um código extremamente lento
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Entretanto, aqui está o mesmo código **sem a desaceleração artificial**. A falta de `useMemo` parece notável ou não?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtrando ' + todos.length + ' todos para a guia "' + tab + '".');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Com frequência, o código sem memoization funciona bem. Se suas interações forem rápidas o suficiente, você pode não precisar de memoization.

Você pode tentar aumentar o número de itens de todo em `utils.js` e ver como o comportamento muda. Este cálculo particular não era muito dispendioso para começar, mas se o número de todos crescer significativamente, a maior parte da sobrecarga estará na re-renderização em vez da filtragem. Continue lendo abaixo para ver como você pode otimizar a re-renderização com `useMemo`.

<Solution />

</Recipes>

---

### Evitando a re-renderização de componentes {/*skipping-re-rendering-of-components*/}

Em alguns casos, `useMemo` também pode ajudar a otimizar o desempenho de re-renderização de componentes filhos. Para ilustrar isso, digamos que este componente `TodoList` passa os `visibleTodos` como uma prop para o componente filho `List`:

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

Você notou que alternar a prop `theme` congela o aplicativo por um momento, mas se você remover `<List />` do seu JSX, a sensação é rápida. Isso indica que vale a pena tentar otimizar o componente `List`.

**Por padrão, quando um componente re-renderiza, o React re-renderiza todos os seus filhos recursivamente.** É por isso que, quando `TodoList` re-renderiza com um `theme` diferente, o componente `List` *também* re-renderiza. Isso é aceitável para componentes que não requerem muito cálculo para re-renderizar. Mas se você verificou que uma re-renderização é lenta, pode dizer ao `List` para pular a re-renderização quando suas props forem as mesmas da última renderização embrulhando-o em [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Com essa mudança, `List` pulará a re-renderização se todas as suas props forem as *mesmas* da última renderização.** É aqui que o armazenamento em cache do cálculo se torna importante! Imagine que você calculou `visibleTodos` sem `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Cada vez que o tema muda, isso será um array diferente...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... então as props do List nunca serão as mesmas, e ele será re-renderizado todas as vezes */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**No exemplo acima, a função `filterTodos` sempre cria um array *diferente*,** semelhante a como a literal de objeto `{}` sempre cria um novo objeto. Normalmente, isso não seria um problema, mas significa que as props do `List` nunca serão as mesmas, e sua otimização [`memo`](/reference/react/memo) não funcionará. É aqui que `useMemo` se torna útil:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Diga ao React para armazenar em cache seu cálculo entre re-renderizações...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...desde que essas dependências não mudem...
  );
  return (
    <div className={theme}>
      {/* ...List receberá as mesmas props e pode pular a re-renderização */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Ao embrulhar o cálculo de `visibleTodos` em `useMemo`, você garante que ele tenha o *mesmo* valor entre as re-renderizações** (até que as dependências mudem). Você *não precisa* embrulhar um cálculo em `useMemo` a menos que o faça por algum motivo específico. Neste exemplo, o motivo é que você o passa para um componente envolto em [`memo`,](/reference/react/memo) e isso permite que ele pule a re-renderização. Há alguns outros motivos para adicionar `useMemo`, que são descritos mais adiante nesta página.

<DeepDive>

#### Memoizando nós JSX individuais {/*memoizing-individual-jsx-nodes*/}

Em vez de embrulhar `List` em [`memo`]{/reference/react/memo}, você poderia embrulhar o nó JSX `<List />` em `useMemo`:

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

O comportamento seria o mesmo. Se os `visibleTodos` não mudaram, `List` não será re-renderizado.

Um nó JSX como `<List items={visibleTodos} />` é um objeto como `{ type: List, props: { items: visibleTodos } }`. Criar este objeto é muito barato, mas o React não sabe se seu conteúdo é o mesmo que da última vez ou não. É por isso que, por padrão, o React re-renderiza o componente `List`.

No entanto, se o React vê o mesmo JSX exato que durante a renderização anterior, ele não tentará re-renderizar seu componente. Isso ocorre porque nós JSX são [imutáveis.](https://en.wikipedia.org/wiki/Immutable_object) Um objeto nó JSX não poderia ter mudado ao longo do tempo, então o React sabe que é seguro pular uma re-renderização. No entanto, para que isso funcione, o nó precisa *realmente ser o mesmo objeto*, não apenas parecer o mesmo no código. É isso que `useMemo` faz neste exemplo.

Embrulhar manualmente nós JSX em `useMemo` não é conveniente. Por exemplo, você não pode fazer isso condicionalmente. Essa é geralmente a razão pela qual você embrulharia componentes com [`memo`](/reference/react/memo) em vez de embrulhar nós JSX.

</DeepDive>

<Recipes titleText="A diferença entre pular re-renderizações e sempre re-renderizar" titleId="examples-rerendering">

#### Pulando re-renderizações com `useMemo` e `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Neste exemplo, o componente `List` é **artificialmente desacelerado** para que você possa ver o que acontece quando um componente React que você está renderizando é genuinamente lento. Tente alternar as guias e alternar o tema.

Alternar as guias parece lento porque força o `List` desacelerado a re-renderizar. Isso é esperado porque a `tab` mudou, e assim você precisa refletir a nova escolha do usuário na tela.

Em seguida, tente alternar o tema. **Graças ao `useMemo` juntamente com [`memo`](/reference/react/memo), é rápido apesar da desaceleração artificial!** O componente `List` pulou a re-renderização porque o array `visibleTodos` não mudou desde a última renderização. O array `visibleTodos` não mudou porque tanto `todos` quanto `tab` (que você passa como dependências para `useMemo`) não mudaram desde a última renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Nota: <code>List</code> foi artificialmente desacelerado!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALMENTE LENTO] Renderizando <List /> com ' + items.length + ' itens');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não fazer nada por 500 ms para emular um código extremamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Sempre re-renderizando um componente {/*always-re-rendering-a-component*/}

Neste exemplo, a implementação do `List` também é **artificialmente desacelerada** para que você possa ver o que acontece quando algum componente React que você está renderizando é genuinamente lento. Tente alternar as guias e alternar o tema.

Ao contrário do exemplo anterior, alternar o tema também é lento agora! Isso ocorre porque **não há chamada `useMemo` nesta versão,** portanto o `visibleTodos` é sempre um array diferente, e o componente `List` desacelerado não consegue pular a re-renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Nota: <code>List</code> foi artificialmente desacelerado!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALMENTE LENTO] Renderizando <List /> com ' + items.length + ' itens');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não fazer nada por 500 ms para emular um código extremamente lento
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Entretanto, aqui está o mesmo código **sem a desaceleração artificial**. A falta de `useMemo` parece notável ou não?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        Todos
      </button>
      <button onClick={() => setTab('active')}>
        Ativos
      </button>
      <button onClick={() => setTab('completed')}>
        Completos
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtrando ' + todos.length + ' todos para a guia "' + tab + '".');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Com frequência, o código sem memoization funciona bem. Se suas interações forem rápidas o suficiente, você pode não precisar de memoization.

Mantenha em mente que você precisa executar o React em modo de produção, desativar [Ferramentas do Desenvolvedor do React](/learn/react-developer-tools) e usar dispositivos semelhantes aos que os usuários do seu aplicativo possuem para obter uma noção realista do que está realmente desacelerando seu aplicativo.

<Solution />

</Recipes>

---

### Memoizando uma dependência de outro Hook {/*memoizing-a-dependency-of-another-hook*/}

Suponha que você tenha um cálculo que depende de um objeto criado diretamente no corpo do componente:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Atenção: Dependência de um objeto criado no corpo do componente
  // ...
```

Dependendo de um objeto como esse derrota o propósito da memoization. Quando um componente re-renderiza, todo o código diretamente dentro do corpo do componente é executado novamente. **As linhas de código que criam o objeto `searchOptions` também serão executadas em cada re-renderização.** Como `searchOptions` é uma dependência da sua chamada `useMemo`, e é diferente a cada vez, o React sabe que as dependências são diferentes e recalcula `searchItems` toda vez.

Para corrigir isso, você poderia memoizar o objeto `searchOptions` *ele mesmo* antes de passá-lo como uma dependência:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Só muda quando text muda

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Só muda quando allItems ou searchOptions mudam
  // ...
```

No exemplo acima, se o `text` não mudar, o objeto `searchOptions` também não mudará. No entanto, uma correção ainda melhor é mover a declaração do objeto `searchOptions` *para dentro* da função de cálculo do `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Só muda quando allItems ou text mudam
  // ...
```

Agora seu cálculo depende diretamente de `text` (que é uma string e não pode "acidentalmente" se tornar diferente).

---

### Memoizando uma função {/*memoizing-a-function*/}

Suponha que o componente `Form` esteja envolto em [`memo`.](/reference/react/memo) Você deseja passar uma função para ele como uma prop:

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

Assim como `{}` cria um objeto diferente, declarações de função como `function() {}` e expressões como `() => {}` produzem uma *função diferente* a cada re-renderização. Por si só, criar uma nova função não é um problema. Isso não é algo a ser evitado! No entanto, se o componente `Form` estiver memoizado, presumivelmente você deseja pular a re-renderização dele quando nenhuma prop tiver mudado. Uma prop que está *sempre* diferente derrotaria o propósito da memoization.

Para memoizar uma função com `useMemo`, sua função de cálculo precisaria retornar outra função:

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Isso parece desajeitado! **Memoizar funções é comum o suficiente para que o React tenha um Hook embutido especificamente para isso. Envolva suas funções em [`useCallback`](/reference/react/useCallback) em vez de `useMemo`** para evitar ter que escrever uma função aninhada extra:

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

Os dois exemplos acima são completamente equivalentes. O único benefício do `useCallback` é que ele permite que você evite escrever uma função aninhada extra dentro. Ele não faz nada mais. [Leia mais sobre `useCallback`.](/reference/react/useCallback)

---

## Solução de Problemas {/*troubleshooting*/}

### Meu cálculo é executado duas vezes em cada re-renderização {/*my-calculation-runs-twice-on-every-re-render*/}

No [Modo Estrito](/reference/react/StrictMode), o React chamará algumas das suas funções duas vezes em vez de uma:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Esta função de componente será executada duas vezes para cada renderização.

  const visibleTodos = useMemo(() => {
    // Este cálculo será executado duas vezes se alguma das dependências mudar.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Isso é esperado e não deve quebrar seu código.

Esse comportamento **exclusivo de desenvolvimento** ajuda você a [manter os componentes puros.](/learn/keeping-components-pure) O React usa o resultado de uma das chamadas e ignora o resultado da outra chamada. Desde que seu componente e suas funções de cálculo sejam puras, isso não deve afetar sua lógica. No entanto, se forem acidentalmente impuras, isso ajuda você a notar e corrigir o erro.

Por exemplo, esta função de cálculo impura modifica um array que você recebeu como prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Erro: modificando uma prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

O React chama sua função duas vezes, então você notaria que a tarefa foi adicionada duas vezes. Sua função de cálculo não deve alterar nenhum objeto existente, mas é aceitável alterar qualquer objeto *novo* que você criou durante o cálculo. Por exemplo, se a função `filterTodos` sempre retornar um *array diferente*, você pode modificar *aquele* array em vez disso:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correto: modificando um objeto que você criou durante o cálculo
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Leia [mantendo os componentes puros](/learn/keeping-components-pure) para saber mais sobre pureza.

Além disso, confira os guias sobre [atualizando objetos](/learn/updating-objects-in-state) e [atualizando arrays](/learn/updating-arrays-in-state) sem mutação.

---

### Minha chamada `useMemo` deveria retornar um objeto, mas retorna undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Este código não funciona:

```js {1-2,5}
  // 🔴 Você não pode retornar um objeto de uma função de seta com () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

Em JavaScript, `() => {` inicia o corpo da função de seta, então a chave `{` não faz parte do seu objeto. É por isso que não retorna um objeto, e leva a erros. Você pode corrigir isso adicionando parênteses como `({` e `})`:

```js {1-2,5}
  // Isso funciona, porém é fácil para alguém quebrar novamente
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

No entanto, isso ainda é confuso e fácil de quebrar removendo os parênteses.

Para evitar esse erro, escreva uma instrução `return` explicitamente:

```js {1-3,6-7}
  // ✅ Isso funciona e é explícito
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### Sempre que meu componente renderiza, o cálculo em `useMemo` re-executa {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Certifique-se de que você especificou a matriz de dependência como um segundo argumento!

Se você esquecer a matriz de dependências, `useMemo` re-executará o cálculo toda vez:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalcula toda vez: sem matriz de dependências
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Esta é a versão corrigida passando a matriz de dependências como um segundo argumento:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Não recalcula desnecessariamente
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Se isso não ajudar, então o problema é que pelo menos uma de suas dependências é diferente da renderização anterior. Você pode depurar esse problema registrando manualmente suas dependências no console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Você pode então clicar com o botão direito do mouse nas matrizes de diferentes re-renderizações no console e selecionar "Armazenar como uma variável global" para ambas. Supondo que a primeira fosse salva como `temp1` e a segunda como `temp2`, você poderia então usar o console do navegador para verificar se cada dependência em ambas as matrizes é a mesma:

```js
Object.is(temp1[0], temp2[0]); // A primeira dependência é a mesma entre as matrizes?
Object.is(temp1[1], temp2[1]); // A segunda dependência é a mesma entre as matrizes?
Object.is(temp1[2], temp2[2]); // ... e assim por diante para cada dependência ...
```

Quando você descobrir qual dependência quebra a memoization, ou encontra uma maneira de removê-la ou [memoiza-a também.](#memoizing-a-dependency-of-another-hook)

---

### Preciso chamar `useMemo` para cada item da lista em um loop, mas não é permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suponha que o componente `Chart` esteja envolto em [`memo`](/reference/react/memo). Você deseja pular re-renderização de cada `Chart` na lista quando o componente `ReportList` re-renderiza. No entanto, você não pode chamar `useMemo` em um loop:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Você não pode chamar useMemo em um loop assim:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

Em vez disso, extraia um componente para cada item e memoize os dados para itens individuais:

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Chame useMemo no nível superior:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

Alternativamente, você poderia remover `useMemo` e, em vez disso, embrulhar o `Report` em [`memo`.](/reference/react/memo) Se a prop `item` não mudar, `Report` pulará a re-renderização, então `Chart` também pulará a re-renderização.

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```

