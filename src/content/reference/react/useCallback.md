---
title: useCallback
---

<Intro>

`useCallback` é um Hook do React que permite armazenar em cache uma definição de função entre re-renderizações.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Referência {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Chame `useCallback` na raiz do seu componente para armazenar em cache uma definição de função entre re-renderizações:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `fn`: O valor da função que você deseja armazenar em cache. Pode receber quaisquer argumentos e retornar quaisquer valores. O React retornará (não chamará!) sua função de volta durante a renderização inicial. Nas próximas renderizações, o React lhe dará a mesma função novamente se as `dependencies` não tiverem mudado desde a última renderização. Caso contrário, ele lhe fornecerá a função que você passou durante a renderização atual e a armazenará para que possa ser reutilizada mais tarde. O React não chamará sua função. A função é retornada para que você possa decidir quando e se chamá-la.

* `dependencies`: A lista de todos os valores reativos referenciados dentro do código da `fn`. Os valores reativos incluem props, estado e todas as variáveis e funções declaradas diretamente dentro do corpo do seu componente. Se o seu linter estiver [configurado para React](/learn/editor-setup#linting), ele verificará se cada valor reativo está corretamente especificado como uma dependência. A lista de dependências deve ter um número constante de itens e ser escrita em linha como `[dep1, dep2, dep3]`. O React comparará cada dependência com seu valor anterior usando o algoritmo de comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

#### Retornos {/*returns*/}

Na renderização inicial, `useCallback` retorna a função `fn` que você passou.

Durante renderizações subsequentes, ele retornará uma função `fn` já armazenada da última renderização (se as dependências não mudaram), ou retornará a função `fn` que você passou durante esta renderização.

#### Ressalvas {/*caveats*/}

* `useCallback` é um Hook, portanto, você só pode chamá-lo **na raiz do seu componente** ou nos seus próprios Hooks. Você não pode chamá-lo dentro de loops ou condições. Se precisar disso, extraia um novo componente e mova o estado para ele.
* O React **não descartará a função armazenada em cache a menos que haja um motivo específico para isso.** Por exemplo, em desenvolvimento, o React descarta o cache quando você edita o arquivo do seu componente. Tanto em desenvolvimento quanto em produção, o React descartará o cache se seu componente suspender durante a montagem inicial. No futuro, o React pode adicionar mais recursos que aproveitam o descarte do cache - por exemplo, se o React adicionar suporte interno para listas virtualizadas no futuro, faria sentido descartar o cache para itens que rolam para fora da área de visualização da tabela virtualizada. Isso deve corresponder às suas expectativas se você depender de `useCallback` como uma otimização de desempenho. Caso contrário, uma [variável de estado](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) ou uma [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) podem ser mais apropriadas.

---

## Uso {/*usage*/}

### Ignorando re-renderizações de componentes {/*skipping-re-rendering-of-components*/}

Quando você otimiza o desempenho de renderização, às vezes precisará armazenar em cache as funções que você passa para componentes filhos. Vamos primeiro olhar para a sintaxe de como fazer isso e, em seguida, ver em quais casos isso é útil.

Para armazenar em cache uma função entre re-renderizações do seu componente, envolva sua definição no Hook `useCallback`:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

Você precisa passar duas coisas para `useCallback`:

1. Uma definição de função que você deseja armazenar em cache entre re-renderizações.
2. Uma <CodeStep step={2}>lista de dependências</CodeStep> incluindo cada valor dentro do seu componente que é usado dentro da sua função.

Na renderização inicial, a <CodeStep step={3}>função retornada</CodeStep> que você receberá do `useCallback` será a função que você passou.

Nas renderizações seguintes, o React comparará as <CodeStep step={2}>dependências</CodeStep> com as dependências que você passou durante a renderização anterior. Se nenhuma das dependências mudou (comparada com [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), o `useCallback` retornará a mesma função que antes. Caso contrário, `useCallback` retornará a função que você passou nesta renderização.

Em outras palavras, `useCallback` armazena em cache uma função entre re-renderizações até que suas dependências mudem.

**Vamos analisar um exemplo para ver quando isso é útil.**

Digamos que você está passando uma função `handleSubmit` do `ProductPage` para o componente `ShippingForm`:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

Você notou que alternar a prop `theme` faz o aplicativo travar por um momento, mas se você remover `<ShippingForm />` do seu JSX, ele parece rápido. Isso indica que vale a pena tentar otimizar o componente `ShippingForm`.

**Por padrão, quando um componente re-renderiza, o React re-renderiza todos os seus filhos recursivamente.** É por isso que, quando `ProductPage` re-renderiza com um `theme` diferente, o componente `ShippingForm` *também* re-renderiza. Isso é aceitável para componentes que não exigem muito cálculo para re-renderizar. Mas se você verificou que uma re-renderização é lenta, pode avisar o `ShippingForm` para pular a re-renderização quando suas props forem as mesmas da última renderização, envolvendo-o em [`memo`:](/reference/react/memo)

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Com essa mudança, `ShippingForm` pulará a re-renderização se todas as suas props forem as *mesmas* da última renderização.** É aqui que armazenar em cache uma função se torna importante! Vamos supor que você definiu `handleSubmit` sem `useCallback`:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Toda vez que o tema muda, esta será uma função diferente...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... assim as props do ShippingForm nunca serão as mesmas, e ele será re-renderizado toda vez */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Em JavaScript, uma `function () {}` ou `() => {}` sempre cria uma função _diferente_,** semelhante a como o literal de objeto `{}` sempre cria um novo objeto. Normalmente, isso não seria um problema, mas significa que as props do `ShippingForm` nunca serão as mesmas, e sua otimização [`memo`](/reference/react/memo) não funcionará. É aqui que `useCallback` é útil:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Diga ao React para armazenar em cache sua função entre re-renderizações...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...desde que essas dependências não mudem...

  return (
    <div className={theme}>
      {/* ...ShippingForm receberá as mesmas props e pode pular a re-renderização */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**Ao envolver `handleSubmit` em `useCallback`, você garante que é a *mesma* função entre as re-renderizações** (até que as dependências mudem). Você não *precisa* envolver uma função em `useCallback` a menos que faça isso por um motivo específico. Neste exemplo, o motivo é que você a passa para um componente envolto em [`memo`,](/reference/react/memo) e isso permite que ele pule a re-renderização. Existem outros motivos pelos quais você pode precisar de `useCallback`, que são descritos mais adiante nesta página.

<Note>

**Você deve se basear apenas em `useCallback` como uma otimização de desempenho.** Se seu código não funcionar sem ele, encontre o problema subjacente e conserte-o primeiro. Depois, você pode adicionar `useCallback` novamente.

</Note>

<DeepDive>

#### Como o useCallback se relaciona ao useMemo? {/*how-is-usecallback-related-to-usememo*/}

Você verá muitas vezes [`useMemo`](/reference/react/useMemo) ao lado de `useCallback`. Ambos são úteis quando você está tentando otimizar um componente filho. Eles permitem que você [memoize](https://pt.wikipedia.org/wiki/Memoiza%C3%A7%C3%A3o) (ou, em outras palavras, armazene em cache) algo que você está passando para baixo:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Chama sua função e armazena seu resultado em cache
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Armazena em cache sua função
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

A diferença está em *o que* eles permitem que você armazene em cache:

* **[`useMemo`](/reference/react/useMemo) armazena em cache o *resultado* de chamar sua função.** Neste exemplo, ele armazena em cache o resultado de chamar `computeRequirements(product)` para que não mude a menos que `product` tenha mudado. Isso permite que você passe o objeto `requirements` sem re-renderizar desnecessariamente o `ShippingForm`. Quando necessário, o React chamará a função que você passou durante a renderização para calcular o resultado.
* **`useCallback` armazena *a própria função.*" Diferente de `useMemo`, ele não chama a função que você fornece. Em vez disso, armazena a função que você forneceu para que a própria `handleSubmit` *não mude* a menos que `productId` ou `referrer` tenham mudado. Isso permite que você passe a função `handleSubmit` sem re-renderizar desnecessariamente o `ShippingForm`. Seu código não será executado até que o usuário envie o formulário.

Se você já está familiarizado com [`useMemo`,](/reference/react/useMemo) pode achar útil pensar em `useCallback` assim:

```js {expectedErrors: {'react-compiler': [3]}}
// Implementação simplificada (dentro do React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[Leia mais sobre a diferença entre `useMemo` e `useCallback`.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### Você deve adicionar useCallback em todos os lugares? {/*should-you-add-usecallback-everywhere*/}

Se seu aplicativo for como este site, e a maioria das interações forem grosseiras (como substituir uma página ou uma seção inteira), a memoização geralmente é desnecessária. Por outro lado, se seu aplicativo se assemelhar mais a um editor de desenhos, e a maioria das interações forem granulares (como mover formas), então você pode achar a memoização muito útil.

Armazenar uma função em cache com `useCallback` só é valioso em alguns casos:

- Você a passa como uma prop para um componente envolto em [`memo`.](/reference/react/memo) Você deseja pular a re-renderização se o valor não mudou. A memoização permite que seu componente re-renderize apenas se as dependências mudaram.
- A função que você está passando é usada posteriormente como uma dependência de algum Hook. Por exemplo, outra função envolta em `useCallback` depende dela, ou você depende dessa função do [`useEffect.`](/reference/react/useEffect)

Não há benefício em envolver uma função em `useCallback` em outros casos. Também não há dano significativo em fazer isso, então algumas equipes optam por não pensar sobre casos individuais e memoizar o máximo possível. O lado negativo é que o código se torna menos legível. Além disso, nem toda memoização é eficaz: um único valor que é "sempre novo" é suficiente para quebrar a memoização para um componente inteiro.

Observe que `useCallback` não impede *a criação* da função. Você sempre está criando uma função (e isso é bom!), mas o React ignora isso e lhe dá de volta uma função em cache se nada mudou.

**Na prática, você pode tornar a maioria das memoizações desnecessárias seguindo alguns princípios:**

1. Quando um componente embrulha visualmente outros componentes, deixe-o [aceitar JSX como filhos.](/learn/passing-props-to-a-component#passing-jsx-as-children) Assim, se o componente wrapper atualizar seu próprio estado, o React saberá que seus filhos não precisam re-renderizar.
2. Prefira o estado local e não [eleve o estado](/learn/sharing-state-between-components) mais do que o necessário. Não mantenha estado transitório como formulários e se um item está sendo sobreposto no topo da sua árvore ou em uma biblioteca de estado global.
3. Mantenha sua [lógica de renderização pura.](/learn/keeping-components-pure) Se re-renderizar um componente causar um problema ou produzir algum artefato visual perceptível, isso é um erro no seu componente! Corrija o erro em vez de adicionar memoização.
4. Evite [Efeitos desnecessários que atualizam o estado.](/learn/you-might-not-need-an-effect) A maioria dos problemas de desempenho em aplicativos React é causada por cadeias de atualizações originadas de Efeitos que fazem seus componentes renderizarem repetidamente.
5. Tente [remover dependências desnecessárias dos seus Efeitos.](/learn/removing-effect-dependencies) Por exemplo, em vez de memoização, muitas vezes é mais simples mover algum objeto ou uma função para dentro de um Efeito ou fora do componente.

Se uma interação específica ainda parecer lenta, [use a ferramenta de perfis do React Developer Tools](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver quais componentes se beneficiam mais da memoização e adicione memoização onde for necessário. Esses princípios tornam seus componentes mais fáceis de depurar e entender, portanto, é bom segui-los em qualquer caso. A longo prazo, estamos pesquisando [fazer memoização automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver isso de uma vez por todas.

</DeepDive>

<Recipes titleText="A diferença entre useCallback e declarar uma função diretamente" titleId="examples-rerendering">

#### Ignorando re-renderização com `useCallback` e `memo` {/*skipping-re-rendering-with-usecallback-and-memo*/}

Neste exemplo, o componente `ShippingForm` é **artificialmente desacelerado** para que você possa ver o que acontece quando um componente React que você está renderizando é realmente lento. Tente incrementar o contador e alternar o tema.

Incrementar o contador parece lento porque força o desacelerado `ShippingForm` a re-renderizar. Isso é esperado porque o contador mudou e, portanto, você precisa refletir a nova escolha do usuário na tela.

Em seguida, tente alternar o tema. **Graças a `useCallback` junto com [`memo`](/reference/react/memo), é rápido apesar da desaceleração artificial!** O `ShippingForm` pulou a re-renderização porque a função `handleSubmit` não mudou. A função `handleSubmit` não mudou porque tanto `productId` quanto `referrer` (suas dependências do `useCallback`) não mudaram desde a última renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine que isso envia uma solicitação...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALMENTE LENTO] Renderizando <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não faça nada por 500 ms para emular código extremamente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Nota: <code>ShippingForm</code> é artificialmente desacelerado!</b></p>
      <label>
        Número de itens:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rua:
        <input name="street" />
      </label>
      <label>
        Cidade:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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

Neste exemplo, a implementação do `ShippingForm` também é **artificialmente desacelerada** para que você possa ver o que acontece quando um componente React que você está renderizando é realmente lento. Tente incrementar o contador e alternar o tema.

Ao contrário do exemplo anterior, agora alternar o tema também é lento! Isso ocorre porque **não há chamada `useCallback` nesta versão,** portanto `handleSubmit` é sempre uma nova função, e o desacelerado componente `ShippingForm` não consegue pular a re-renderização.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine que isso envia uma solicitação...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALMENTE LENTO] Renderizando <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Não faça nada por 500 ms para emular código extremamente lento
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número de itens:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rua:
        <input name="street" />
      </label>
      <label>
        Cidade:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


No entanto, aqui está o mesmo código **com a desaceleração artificial removida.** A falta de `useCallback` é perceptível ou não?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Modo escuro
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine que isso envia uma solicitação...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Renderizando <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número de itens:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Rua:
        <input name="street" />
      </label>
      <label>
        Cidade:
        <input name="city" />
      </label>
      <label>
        Código postal:
        <input name="zipCode" />
      </label>
      <button type="submit">Enviar</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
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


Com bastante frequência, o código sem memoização funciona bem. Se suas interações forem rápidas o suficiente, você não precisa de memoização.

Tenha em mente que você precisa executar o React em modo de produção, desativar [React Developer Tools](/learn/react-developer-tools) e usar dispositivos semelhantes aos que os usuários do seu aplicativo têm para obter uma noção realista do que está realmente desacelerando seu aplicativo.

<Solution />

</Recipes>

---

### Atualizando o estado a partir de um callback memoizado {/*updating-state-from-a-memoized-callback*/}

Às vezes, você pode precisar atualizar o estado com base no estado anterior a partir de um callback memoizado.

Esta função `handleAddTodo` especifica `todos` como uma dependência porque ela calcula os próximos todos a partir dele:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Normalmente, você desejará que funções memoizadas tenham o menor número possível de dependências. Quando você lê algum estado apenas para calcular o próximo estado, pode remover essa dependência passando uma [função atualizadora](/reference/react/useState#updating-state-based-on-the-previous-state) em vez:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ Sem necessidade da dependência todos
  // ...
```

Aqui, em vez de tornar `todos` uma dependência e lê-lo por dentro, você passa uma instrução sobre *como* atualizar o estado (`todos => [...todos, newTodo]`) para o React. [Leia mais sobre funções atualizadoras.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Impedindo um efeito de disparar com muita frequência {/*preventing-an-effect-from-firing-too-often*/}

Às vezes, você pode querer chamar uma função de dentro de um [Efeito:](/learn/synchronizing-with-effects)

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Isso cria um problema. [Todo valor reativo deve ser declarado como uma dependência do seu Efeito.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) No entanto, se você declarar `createOptions` como uma dependência, isso fará com que seu Efeito reconecte constantemente à sala de chat:


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problema: Esta dependência muda a cada renderização
  // ...
```

Para resolver isso, você pode envolver a função que precisa chamar de um Efeito em `useCallback`:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Muda apenas quando roomId muda

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Muda apenas quando createOptions muda
  // ...
```

Isso garante que a função `createOptions` seja a mesma entre as re-renderizações se o `roomId` for o mesmo. **No entanto, é ainda melhor remover a necessidade de uma dependência de função.** Mova sua função *para dentro* do Efeito:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ Sem necessidade de useCallback ou dependências de função!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Muda apenas quando roomId muda
  // ...
```

Agora seu código está mais simples e não precisa de `useCallback`. [Saiba mais sobre como remover dependências de Efeitos.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Otimizando um Hook personalizado {/*optimizing-a-custom-hook*/}

Se você estiver escrevendo um [Hook personalizado,](/learn/reusing-logic-with-custom-hooks) é recomendável envolver qualquer função que ele retorna em `useCallback`:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Isso garante que os consumidores do seu Hook possam otimizar seu próprio código quando necessário.

---

## Solução de Problemas {/*troubleshooting*/}

### Toda vez que meu componente renderiza, `useCallback` retorna uma função diferente {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Certifique-se de que você especificou a array de dependências como um segundo argumento!

Se você esquecer a array de dependências, `useCallback` retornará uma nova função a cada vez:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Retorna uma nova função toda vez: sem array de dependências
  // ...
```

Esta é a versão corrigida passando a array de dependências como um segundo argumento:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Não retorna uma nova função desnecessariamente
  // ...
```

Se isso não ajudar, então o problema é que pelo menos uma de suas dependências é diferente da renderização anterior. Você pode depurar esse problema registrando manualmente suas dependências no console:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Você pode então clicar com o botão direito nas arrays de diferentes re-renderizações no console e selecionar "Armazenar como uma variável global" para ambas. Supondo que o primeiro tenha sido salvo como `temp1` e o segundo como `temp2`, você pode então usar o console do navegador para verificar se cada dependência nas duas arrays é a mesma:

```js
Object.is(temp1[0], temp2[0]); // A primeira dependência é a mesma entre as arrays?
Object.is(temp1[1], temp2[1]); // A segunda dependência é a mesma entre as arrays?
Object.is(temp1[2], temp2[2]); // ... e assim por diante para cada dependência ...
```

Quando você descobrir qual dependência está quebrando a memoização, encontre uma maneira de removê-la ou [memoize também.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Preciso chamar `useCallback` para cada item da lista em um loop, mas não é permitido {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

Suponha que o componente `Chart` esteja envolto em [`memo`](/reference/react/memo). Você quer pular a re-renderização de cada `Chart` na lista quando o componente `ReportList` re-renderizar. No entanto, você não pode chamar `useCallback` em um loop:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 Você não pode chamar useCallback em um loop assim:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Em vez disso, extraia um componente para um item individual e coloque `useCallback` lá:

```js {5,12-21}
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
  // ✅ Chame useCallback na raiz:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Alternativamente, você poderia remover `useCallback` no último snippet e, em vez disso, envolver `Report` em [`memo`.](/reference/react/memo) Se a prop `item` não mudar, `Report` pulará a re-renderização, então `Chart` também pulará a re-renderização:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```