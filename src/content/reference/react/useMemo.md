---
title: useMemo
---

<Intro>

`useMemo` é um Hook do React que permite que você armazene em cache o resultado de um cálculo entre as renderizações.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

Chame `useMemo` no nível superior do seu componente para armazenar em cache um cálculo entre as renderizações:

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

*   `calculateValue`: A função que calcula o valor que você quer armazenar em cache. Ela deve ser pura, não deve receber argumentos e deve retornar um valor de qualquer tipo. O React chamará sua função durante a renderização inicial. Nas renderizações seguintes, o React retornará o mesmo valor novamente se as `dependencies` não tiverem mudado desde a última renderização. Caso contrário, ele chamará `calculateValue`, retornará seu resultado e o armazenará para que possa ser reutilizado mais tarde.

*   `dependencies`: A lista de todos os valores reativos referenciados dentro do código `calculateValue`. Valores reativos incluem props, state e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se seu linter estiver [configurado para React](/learn/editor-setup#linting), ele verificará se cada valor reativo é especificado corretamente como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita inline, como `[dep1, dep2, dep3]`. O React comparará cada dependência com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Retorna {/*returns*/}

Na renderização inicial, `useMemo` retorna o resultado de chamar `calculateValue` sem argumentos.

Durante as próximas renderizações, ele retornará um valor já armazenado da última renderização (se as dependências não tiverem mudado) ou chamará `calculateValue` novamente e retornará o resultado que `calculateValue` retornou.

#### Ressalvas {/*caveats*/}

*   `useMemo` é um Hook, então você só pode chamá-lo **no nível superior do seu componente** ou dos seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se você precisar disso, extraia um novo componente e mova o state para ele.
*   Em Strict Mode, o React **chamará sua função de cálculo duas vezes** para [ajudá-lo a encontrar impurezas acidentais.](#my-calculation-runs-twice-on-every-re-render) Este é um comportamento apenas de desenvolvimento e não afeta a produção. Se sua função de cálculo for pura (como deveria ser), isso não deve afetar sua lógica. O resultado de uma das chamadas será ignorado.
*   O React **não vai descartar o valor armazenado em cache, a menos que haja um motivo específico para isso.** Por exemplo, em desenvolvimento, o React descarta o cache quando você edita o arquivo do seu componente. Tanto em desenvolvimento quanto em produção, o React descartará o cache se seu componente suspender durante a montagem inicial. No futuro, o React pode adicionar mais recursos que se beneficiam de descartar o cache - por exemplo, se o React adicionar suporte embutido para listas virtualizadas no futuro, faria sentido descartar o cache para itens que saem da janela de visualização da tabela virtualizada. Isso deve ser bom se você confiar no `useMemo` apenas como uma otimização de desempenho. Caso contrário, uma [variável de state](/reference/react/useState#avoiding-recreating-the-initial-state) ou uma [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) pode ser mais apropriada.

<Note>

Armazenar em cache valores de retorno como este também é conhecido como [*memoization*,](https://pt.wikipedia.org/wiki/Memoiza%C3%A7%C3%A3o) e é por isso que este Hook é chamado `useMemo`.

</Note>

---

## Uso {/*usage*/}

### Ignorando cálculos caros {/*skipping-expensive-recalculations*/}

Para armazenar em cache um cálculo entre as renderizações, envolva-o em uma chamada `useMemo` no nível superior do seu componente:

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Você precisa passar duas coisas para `useMemo`:

1. Uma <CodeStep step={1}>função de cálculo</CodeStep> que não recebe argumentos, como `() =>`, e retorna o que você queria calcular.
2. Uma <CodeStep step={2}>lista de dependências</CodeStep> incluindo cada valor dentro do seu componente que é usado dentro do seu cálculo.

Na renderização inicial, o <CodeStep step={3}>valor</CodeStep> que você obterá de `useMemo` será o resultado da chamada da sua <CodeStep step={1}>cálculo</CodeStep>.

Em cada renderização subsequente, o React comparará as <CodeStep step={2}>dependências</CodeStep> com as dependências que você passou durante a última renderização. Se nenhuma das dependências tiver mudado (comparada com [`Object.is`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), `useMemo` retornará o valor que você já calculou antes. Caso contrário, o React irá executar seu cálculo e retornar o novo valor.

Em outras palavras, `useMemo` armazena em cache um resultado de cálculo entre as renderizações até que suas dependências mudem.

**Vamos analisar um exemplo para ver quando isso é útil.**

Por padrão, o React irá executar todo o corpo do seu componente toda vez que ele renderizar novamente. Por exemplo, se este `TodoList` atualizar seu state ou receber novas props de seu pai, a função `filterTodos` será executada novamente:

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

Normalmente, isso não é um problema porque a maioria dos cálculos é muito rápida. No entanto, se você estiver filtrando ou transformando uma array grande ou fazendo alguma computação cara, talvez você queira pular fazê-lo novamente se os dados não tiverem mudado. Se ambos `todos` e `tab` forem os mesmos do que eram durante a última renderização, envolver o cálculo em `useMemo` como antes permite que você reutilize `visibleTodos` que você já calculou antes.

Este tipo de armazenamento em cache é chamado de *[memoization](https://pt.wikipedia.org/wiki/Memoiza%C3%A7%C3%A3o)*.

<Note>

**Você só deve confiar em `useMemo` como uma otimização de desempenho.** Se seu código não funcionar sem ele, encontre o problema subjacente e corrija-o primeiro. Então você pode adicionar `useMemo` para melhorar o desempenho.

</Note>

<DeepDive>

#### Como saber se um cálculo é caro? {/*how-to-tell-if-a-calculation-is-expensive*/}

Em geral, a menos que você esteja criando ou percorrendo milhares de objetos, provavelmente não é caro. Se você quiser ter mais confiança, pode adicionar um console log para medir o tempo gasto em um trecho de código:

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

Execute a interação que você está medindo (por exemplo, digitar na entrada). Você verá logs como `filter array: 0.15ms` no seu console. Se o tempo total registrado somar uma quantidade significativa (digamos, `1ms` ou mais), pode fazer sentido memorizar esse cálculo. Como um experimento, você pode então envolver o cálculo em `useMemo` para verificar se o tempo total registrado diminuiu para aquela interação ou não:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Ignorado se todos e tab não mudaram
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` não vai tornar a *primeira* renderização mais rápida. Ele só ajuda você a pular trabalho desnecessário em atualizações.

Tenha em mente que sua máquina provavelmente é mais rápida do que a de seus usuários, então é uma boa ideia testar o desempenho com uma lentidão artificial. Por exemplo, o Chrome oferece uma opção de [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) para isso.

Observe também que medir o desempenho no desenvolvimento não fornecerá os resultados mais precisos. (Por exemplo, quando o [Strict Mode](/reference/react/StrictMode) estiver ativado, você verá cada componente renderizar duas vezes em vez de uma.) Para obter os tempos mais precisos, crie seu aplicativo para produção e teste-o em um dispositivo como seus usuários têm.

</DeepDive>

<DeepDive>

#### Você deve adicionar useMemo em todos os lugares? {/*should-you-add-usememo-everywhere*/}

Se seu app for como este site e a maioria das interações for grosseira (como substituir uma página ou uma seção inteira), a memoization geralmente é desnecessária. Por outro lado, se seu app for mais parecido com um editor de desenho e a maioria das interações for granular (como mover formas), você pode achar a memoization muito útil.

Otimizar com `useMemo` só é valioso em alguns casos:

* O cálculo que você está colocando em `useMemo` é notavelmente lento e suas dependências raramente mudam.
* Você o passa como uma prop para um componente encapsulado em [`memo`.](/reference/react/memo) Você quer pular a re-renderização se o valor não tiver mudado. A memoization permite que seu componente renderize novamente apenas quando as dependências não são as mesmas.
* O valor que você está passando é posteriormente usado como uma dependência de algum Hook. Por exemplo, talvez outro valor de cálculo `useMemo` dependa dele. Ou talvez você esteja dependendo desse valor de [`useEffect.`](/reference/react/useEffect)

Não há nenhum benefício em encapsular um cálculo em `useMemo` em outros casos. Também não há nenhum dano significativo em fazer isso, então algumas equipes optam por não pensar em casos individuais e memorizar o máximo possível. A desvantagem dessa abordagem é que o código se torna menos legível. Além disso, nem toda memoization é eficaz: um único valor que é "sempre novo" é suficiente para quebrar a memoization para um componente inteiro.

**Na prática, você pode tornar muita memoization desnecessária seguindo alguns princípios:**

1. Quando um componente envolve visualmente outros componentes, deixe-o [aceitar JSX como filhos.](/learn/passing-props-to-a-component#passing-jsx-as-children) Dessa forma, quando o componente wrapper atualiza seu próprio state, o React sabe que seus filhos não precisam renderizar novamente.
2. Prefira o state local e não [eleve o state](/learn/sharing-state-between-components) mais do que o necessário. Por exemplo, não mantenha o state transitório, como formulários e se um item está em hover, no topo da sua árvore ou em uma biblioteca de state global.
3. Mantenha sua [lógica de renderização pura.](/learn/keeping-components-pure) Se renderizar novamente um componente causar um problema ou produzir algum artefato visual perceptível, é um erro no seu componente! Corrija o erro em vez de adicionar memoization.
4. Evite [Effects desnecessários que atualizam o state.](/learn/you-might-not-need-an-effect) A maioria dos problemas de desempenho em aplicativos React é causada por cadeias de atualizações originadas de Effects que fazem seus componentes renderizarem repetidamente.
5. Tente [remover dependências desnecessárias de seus Effects.](/learn/removing-effect-dependencies) Por exemplo, em vez de memoization, muitas vezes é mais simples mover algum objeto ou uma função dentro de um Effect ou fora do componente.

Se uma interação específica ainda parecer lenta, [use o React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver quais componentes se beneficiariam mais da memoization e adicione memoization onde for necessário. Esses princípios tornam seus componentes mais fáceis de depurar e entender, por isso é bom segui-los em qualquer caso. A longo prazo, estamos pesquisando [fazer memoization granularmente automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver isso de uma vez por todas.

</DeepDive>

<Recipes titleText="A diferença entre useMemo e calcular um valor diretamente" titleId="examples-recalculation">

#### Ignorando o recálculo com `useMemo` {/*skipping-recalculation-with-usememo*/}

Neste exemplo, a implementação `filterTodos` é **artificialmente retardada** para que você possa ver o que acontece quando alguma função JavaScript que você está chamando durante a renderização é genuinamente lenta. Tente alternar as guias e alternar o tema.

Alternar as guias parece lento porque força o `filterTodos` desacelerado a ser reexecutado. Isso é esperado porque a `tab` mudou e, portanto, todo o cálculo *precisa* ser executado novamente. (Se você está curioso por que ele é executado duas vezes, é explicado [aqui.](#my-calculation-runs-twice-on-every-re-render))

Alterne o tema. **Graças ao `useMemo`, ele é rápido apesar da lentidão artificial!** A chamada `filterTodos` lenta foi ignorada porque tanto `todos` quanto `tab` (que você passa como dependências para `useMemo`) não mudaram desde a última renderização.

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
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
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
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

Neste exemplo, a implementação `filterTodos` também está **artificialmente desacelerada** para que você possa ver o que acontece quando alguma função JavaScript que você está chamando durante a renderização é genuinamente lenta. Tente alternar as guias e alternar o tema.

Ao contrário do exemplo anterior, alternar o tema também é lento agora! Isso ocorre porque **não há nenhuma chamada `useMemo` nesta versão,** então o `filterTodos` artificialmente desacelerado é chamado em cada nova renderização. Ele é chamado mesmo que apenas o `theme` tenha mudado.

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
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
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
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

No entanto, aqui está o mesmo código **com a desaceleração artificial removida.** A ausência de `useMemo` parece perceptível ou não?

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

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

Muitas vezes, o código sem memoization funciona bem. Se suas interações forem rápidas o suficiente, talvez você não precise de memoization.

Você pode tentar aumentar o número de itens de tarefas em `utils.js` e ver como o comportamento muda. Este cálculo em particular não era muito caro para começar, mas se o número de tarefas crescer significativamente, a maior parte da sobrecarga estará na nova renderização em vez da filtragem. Continue lendo abaixo para ver como você pode otimizar a nova renderização com `useMemo`.

<Solution />

</Recipes>

---

### Ignorando a nova renderização de componentes {/*skipping-re-rendering-of-components*/}

Em alguns casos, `useMemo` também pode ajudá-lo a otimizar o desempenho da nova renderização de componentes filhos. Para ilustrar isso, digamos que este componente `TodoList` passe o `visibleTodos` como uma prop para o componente filho `List`:

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

Você notou que alternar a prop `theme` trava o aplicativo por um momento, mas se você remover `<List />` do seu JSX, ele parece rápido. Isso indica que vale a pena tentar otimizar o componente `List`.

**Por padrão, quando um componente renderiza novamente, o React renderiza novamente todos os seus filhos recursivamente.** É por isso que, quando `TodoList` renderiza novamente com um `theme` diferente, o componente `List` *também* renderiza novamente. Isso é bom para componentes que não exigem muito cálculo para renderizar novamente. Mas se você verificou que uma nova renderização é lenta, pode dizer ao `List` para pular a nova renderização quando suas props forem as mesmas da última renderização, envolvendo-o em [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**Com essa alteração, `List` pulará a nova renderização se todas as suas props forem *iguais* às da última renderização.** É aqui que o armazenamento em cache do cálculo se torna importante! Imagine que você calculou `visibleTodos` sem `useMemo`:

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Sempre que o tema muda, esta será uma array diferente...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ...então as props do List nunca serão as mesmas e ele irá renderizar novamente toda vez */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**No exemplo acima, a função `filterTodos` sempre cria uma array *diferente*,** semelhante à forma como o literal de objeto `{}` sempre cria um novo objeto. Normalmente, isso não seria um problema, mas significa que as props de `List` nunca serão as mesmas, e sua otimização [`memo`](/reference/react/memo) não funcionará. É aqui que `useMemo` é útil:

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Diga ao React para armazenar em cache seu cálculo entre novas renderizações...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...para que, desde que essas dependências não mudem...
  );
  return (
    <div className={theme}>
      {/* ...List receberá as mesmas props e poderá pular a nova renderização */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**Ao encapsular o cálculo `visibleTodos` em `useMemo`, você garante que ele tenha o *mesmo* valor entre as novas renderizações** (até que as dependências mudem). Você não *precisa* encapsular um cálculo em `useMemo`, a menos que o faça por algum motivo específico. Neste exemplo, a razão é que você o passa para um componente encapsulado em [`memo`,](/reference/react/memo) e isso permite que ele pule a nova renderização. Existem algumas outras razões para adicionar `useMemo`, que são descritas mais adiante nesta página.

<DeepDive>

#### Memorizando nós JSX individuais {/*memoizing-individual-jsx-nodes*/}

Em vez de encapsular `List` em [`memo`](/reference/react/memo), você pode encapsular o próprio nó JSX `<List />` em `useMemo`:

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
O comportamento seria o mesmo. Se os `visibleTodos` não mudaram, `List` não será renderizado novamente.

Um nó JSX como `<List items={visibleTodos} />` é um objeto como `{ type: List, props: { items: visibleTodos } }`. Criar este objeto é muito barato, mas o React não sabe se seu conteúdo é o mesmo da última vez ou não. É por isso que, por padrão, o React irá renderizar novamente o componente `List`.

No entanto, se o React vê o mesmo JSX exato que durante a renderização anterior, ele não tentará renderizar seu componente novamente. Isso ocorre porque os nós JSX são [imutáveis.](https://pt.wikipedia.org/wiki/Objeto_imutável) Um objeto de nó JSX não poderia ter mudado com o tempo, então o React sabe que é seguro pular uma nova renderização. No entanto, para que isso funcione, o nó tem que *realmente ser o mesmo objeto*, não apenas ter a mesma aparência no código. É isso que o `useMemo` faz neste exemplo.

Envolver manualmente nós JSX em `useMemo` não é conveniente. Por exemplo, você não pode fazer isso condicionalmente. É por isso que geralmente você envolveria componentes com [`memo`](/reference/react/memo) em vez de envolver nós JSX.

</DeepDive>

<Recipes titleText="A diferença entre pular as renderizações e sempre renderizar novamente" titleId="examples-rerendering">

#### Pular a renderização novamente com `useMemo` e `memo` {/*skipping-re-rendering-with-usememo-and-memo*/}

Neste exemplo, o componente `List` é **artificialmente atrasado** para que você possa ver o que acontece quando um componente React que você está renderizando é realmente lento. Tente alternar as abas e alternar o tema.

Alternar as abas parece lento porque força o `List` atrasado a renderizar novamente. Isso é esperado porque a `tab` mudou e, portanto, você precisa refletir a nova escolha do usuário na tela.

Em seguida, tente alternar o tema. **Graças ao `useMemo` em conjunto com [`memo`](/reference/react/memo), é rápido, apesar da lentidão artificial!** O `List` pulou a renderização novamente porque o array `visibleTodos` não foi alterado desde a última renderização. O array `visibleTodos` não foi alterado porque tanto `todos` quanto `tab` (que você passa como dependências para `useMemo`) não foram alterados desde a última renderização.

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
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

#### Sempre renderizando novamente um componente {/*always-re-rendering-a-component*/}

Neste exemplo, a implementação do `List` também é **artificialmente atrasada** para que você possa ver o que acontece quando algum componente React que você está renderizando é realmente lento. Tente alternar as abas e alternar o tema.

Ao contrário do exemplo anterior, alternar o tema também está lento agora! Isso ocorre porque **não há nenhuma chamada `useMemo` nesta versão,** então o `visibleTodos` é sempre um array diferente, e o componente `List` com lentidão não pode pular a renderização novamente.

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
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

No entanto, aqui está o mesmo código **com a lentidão artificial removida.** A ausência de `useMemo` parece perceptível ou não?

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
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
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

```js src/List.js
import { memo } from 'react';

function List({ items }) {
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
}

export default memo(List);
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

Muitas vezes, o código sem memoização funciona bem. Se suas interações forem rápidas o suficiente, você não precisa de memoização.

Tenha em mente que você precisa executar o React no modo de produção, desativar as [Ferramentas de Desenvolvedor React](/learn/react-developer-tools) e usar dispositivos semelhantes aos que os usuários do seu aplicativo têm para obter uma noção realista do que realmente está deixando seu aplicativo lento.

<Solution />

</Recipes>

---

### Impedindo que um Effect dispare com muita frequência {/*preventing-an-effect-from-firing-too-often*/}

Às vezes, você pode querer usar um valor dentro de um [Effect:](/learn/synchronizing-with-effects)

```js {4-7,10}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: 'https://localhost:1234',
    roomId: roomId
  }

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Isso cria um problema. [Cada valor reativo deve ser declarado como uma dependência do seu Effect.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) No entanto, se você declarar `options` como dependência, isso fará com que seu Effect se reconecte constantemente ao chat room:

```js {5}
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🔴 Problem: This dependency changes on every render
  // ...
```

Para resolver isso, você pode envolver o objeto que você precisa chamar de um Effect em `useMemo`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = useMemo(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Only changes when options changes
  // ...
```

Isso garante que o objeto `options` seja o mesmo entre as novas renderizações se `useMemo` retornar o objeto em cache.

No entanto, como `useMemo` é uma otimização de desempenho, não uma garantia semântica, o React pode descartar o valor armazenado em cache se [houver uma razão específica para fazê-lo](#caveats). Isso também fará com que o efeito seja disparado novamente, **portanto, é ainda melhor remover a necessidade de uma dependência de função** movendo seu objeto *dentro* do Effect:

```js {5-8,13}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { // ✅ No need for useMemo or object dependencies!
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    }
    
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

Agora seu código é mais simples e não precisa de `useMemo`. [Saiba mais sobre como remover dependências de Effect.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

### Memoizando uma dependência de outro Hook {/*memoizing-a-dependency-of-another-hook*/}

Suponha que você tenha um cálculo que dependa de um objeto criado diretamente no corpo do componente:

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

Depender de um objeto como esse anula a utilidade da memoização. Quando um componente renderiza novamente, todo o código diretamente dentro do corpo do componente é executado novamente. **As linhas de código que criam o objeto `searchOptions` também serão executadas em cada nova renderização.** Como `searchOptions` é uma dependência da sua chamada `useMemo` e é diferente toda vez, o React sabe que as dependências são diferentes e recalcula `searchItems` toda vez.

Para corrigir isso, você pode memoizar o próprio objeto `searchOptions` antes de passá-lo como dependência:

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

No exemplo acima, se o `text` não mudar, o objeto `searchOptions` também não mudará. No entanto, uma correção ainda melhor é mover a declaração do objeto `searchOptions` *dentro* da função de cálculo `useMemo`:

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

Agora seu cálculo depende diretamente de `text` (que é uma string e não pode "acidentalmente" se tornar diferente).

---

### Memoizando uma função {/*memoizing-a-function*/}

Suponha que o componente `Form` esteja envolvido em [`memo`.](/reference/react/memo) Você quer passar uma função para ele como uma prop:

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

Assim como `{}` cria um objeto diferente, declarações de função como `function() {}` e expressões como `() => {}` produzem uma função *diferente* em cada nova renderização. Sozinho, criar uma nova função não é um problema. Isso não é algo a ser evitado! No entanto, se o componente `Form` for memoizado, presume-se que você deseja pular a renderização dele quando nenhuma prop foi alterada. Uma prop que é *sempre* diferente frustraria o propósito da memoização.

Para memoizar uma função com `useMemo`, sua função de cálculo teria que retornar outra função:

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

Isso parece desajeitado! **Memoizar funções é comum o suficiente que o React possui um Hook embutido especificamente para isso. Envolva suas funções em [`useCallback`](/reference/react/useCallback) em vez de `useMemo`** para evitar ter que escrever uma função aninhada extra:

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

Os dois exemplos acima são completamente equivalentes. A única vantagem do `useCallback` é que ele permite que você evite escrever uma função aninhada extra por dentro. Ele não faz mais nada. [Leia mais sobre `useCallback`.](/reference/react/useCallback)

---

## Solução de problemas {/*troubleshooting*/}

### Meu cálculo é executado duas vezes em cada nova renderização {/*my-calculation-runs-twice-on-every-re-render*/}

No [Strict Mode](/reference/react/StrictMode), o React chamará algumas de suas funções duas vezes em vez de uma:

```js {2,5,6}
function TodoList({ todos, tab }) {
  // Esta função componente será executada duas vezes para cada renderização.

  const visibleTodos = useMemo(() => {
    // Este cálculo será executado duas vezes se alguma das dependências mudar.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

Isso é esperado e não deve quebrar seu código.

Este comportamento **apenas para desenvolvimento** ajuda você a [manter os componentes puros.](/learn/keeping-components-pure) O React usa o resultado de uma das chamadas e ignora o resultado da outra chamada. Contanto que seu componente e as funções de cálculo sejam puros, isso não deve afetar sua lógica. No entanto, se eles forem acidentalmente impuros, isso o ajudará a notar e corrigir o erro.

Por exemplo, esta função de cálculo impura muta uma array que você recebeu como prop:

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Erro: mutando uma prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

O React chama sua função duas vezes, então você notaria que o todo é adicionado duas vezes. Seu cálculo não deve alterar nenhum objeto existente, mas tudo bem alterar quaisquer objetos *novos* que você criou durante o cálculo. Por exemplo, se a função `filterTodos` sempre retornar um array *diferente*, você pode mutar *esse* array em vez disso:

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correto: mutando um objeto que você criou durante o cálculo
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

Leia [mantendo os componentes puros](/learn/keeping-components-pure) para saber mais sobre pureza.

Além disso, confira os guias sobre [atualização de objetos](/learn/updating-objects-in-state) e [atualização de arrays](/learn/updating-arrays-in-state) sem mutação.

---

### Minha chamada `useMemo` é suposta retornar um objeto, mas retorna undefined {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

Este código não funciona:

```js {1-2,5}
  // 🔴 Você não pode retornar um objeto de uma arrow function com () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

Em JavaScript, `() => {` inicia o corpo da função de seta, então a chave `{` não faz parte do seu objeto. É por isso que ele não retorna um objeto e leva a erros. Você pode corrigi-lo adicionando parênteses como `({` e `})`:

```js {1-2,5}
  // Isso funciona, mas é fácil para alguém quebrar novamente
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

No entanto, isso ainda é confuso e fácil demais para alguém quebrar removendo os parênteses.

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

### Toda vez que meu componente renderiza, o cálculo em `useMemo` é executado novamente {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

Certifique-se de ter especificado o array de dependência como o segundo argumento!

Se você esquecer o array de dependência, `useMemo` executará novamente o cálculo toda vez:

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalcula toda vez: nenhum array de dependência
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

Esta é a versão corrigida passando o array de dependência como um segundo argumento:

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Não recalcula desnecessariamente
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

Se isso não ajudar, o problema é que pelo menos uma de suas dependências é diferente da renderização anterior. Você pode depurar este problema registrando manualmente suas dependências no console:

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

Você pode clicar com o botão direito do mouse nos arrays de diferentes novas renderizações no console e selecionar "Armazenar como variável global" para ambos. Supondo que o primeiro tenha sido salvo como `temp1` e o segundo tenha sido salvo como `temp2`, você pode usar o console do navegador para verificar se cada dependência em ambos os arrays é a mesma:

```js
Object.is(temp1[0], temp2[0]); // A primeira dependência é a mesma entre os arrays?
Object.is(temp1[1], temp2[1]); // A segunda dependência é a mesma entre os arrays?
Object.is(temp1[2], temp2[2]); // ... e assim por diante para cada dependência ...
```

Quando você descobrir qual dependência quebra a memoização, encontre uma maneira de removê-la ou [memorize-a também.](#memoizing-a-dependency-of-another-hook)

---

### Preciso chamar `useMemo` para cada item da lista em um loop, mas não é permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suponha que o componente `Chart` esteja envolvido em [`memo`](/reference/react/memo). Você quer pular a renderização de cada `Chart` na lista quando o componente `ReportList` renderizar novamente. No entanto, você não pode chamar `useMemo` em um loop:

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Você não pode chamar useMemo em um loop como este:
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

Em vez disso, extraia um componente para cada item e memorize dados para itens individuais:

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

Alternativamente, você pode remover `useMemo` e, em vez disso, envolver o próprio `Report` em [`memo`.](/reference/react/memo) Se a prop `item` não mudar, `Report` pulará a renderização novamente, então `Chart` pulará a renderização novamente também:

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
