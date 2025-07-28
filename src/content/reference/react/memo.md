---
title: memo
---

<Intro>

`memo` permite que você evite a re-renderização de um componente quando suas props permanecem inalteradas.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically applies the equivalent of `memo` to all components, reducing the need for manual memoization. You can use the compiler to handle component memoization automatically.

</Note>

<InlineToc />

---

## Referência {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Envolva um componente em `memo` para obter uma versão *memoizada* desse componente. Essa versão memoizada do seu componente geralmente não será re-renderizada quando seu componente pai for re-renderizado, desde que suas props não tenham mudado. Mas o React ainda pode re-renderizá-lo: a memoização é uma otimização de desempenho, não uma garantia.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[Veja mais exemplos abaixo.](#usage)

#### Parâmetros {/*parameters*/}

* `Component`: O componente que você deseja memoizar. O `memo` não modifica este componente, mas retorna um novo componente memoizado. Qualquer componente React válido, incluindo funções e componentes [`forwardRef`](/reference/react/forwardRef), é aceito.

* **opcional** `arePropsEqual`: Uma função que aceita dois argumentos: as props anteriores do componente e suas novas props. Ela deve retornar `true` se as props antigas e novas forem iguais: ou seja, se o componente renderizar a mesma saída e se comportar da mesma forma com as novas props como com as antigas. Caso contrário, deve retornar `false`. Normalmente, você não especificará essa função. Por padrão, o React comparará cada prop usando [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Retorna {/*returns*/}

`memo` retorna um novo componente React. Ele se comporta da mesma forma que o componente fornecido ao `memo`, exceto que o React não re-renderizará sempre que seu pai estiver sendo re-renderizado, a menos que suas props tenham mudado.

---

## Uso {/*usage*/}

### Ignorando re-renderizações quando as props estão inalteradas {/*skipping-re-rendering-when-props-are-unchanged*/}

O React normalmente re-renderiza um componente sempre que seu pai re-renderiza. Com `memo`, você pode criar um componente que o React não re-renderizará quando seu pai re-renderizar, desde que suas novas props sejam as mesmas que as antigas. Um componente assim é dito ser *memoizado*.

Para memoizar um componente, enrole-o em `memo` e use o valor que ele retorna em vez do seu componente original:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Um componente React deve sempre ter [lógica de renderização pura.](/learn/keeping-components-pure) Isso significa que ele deve retornar a mesma saída se suas props, estado e contexto não tiverem mudado. Ao usar `memo`, você está dizendo ao React que seu componente atende a esse requisito, então o React não precisa re-renderizar enquanto suas props não tiverem mudado. Mesmo com `memo`, seu componente re-renderizará se seu próprio estado mudar ou se um contexto que ele está usando mudar.

Neste exemplo, note que o componente `Greeting` re-renderiza sempre que `name` é alterado (porque essa é uma de suas props), mas não quando `address` é alterado (porque isso não é passado para `Greeting` como uma prop):

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting foi renderizado em", new Date().toLocaleTimeString());
  return <h3>Olá{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**Você deve confiar no `memo` apenas como uma otimização de desempenho.** Se seu código não funcionar sem ele, encontre o problema subjacente e conserte-o primeiro. Depois, você pode adicionar `memo` para melhorar o desempenho.

</Note>

<DeepDive>

#### Você deve adicionar memo em todo lugar? {/*should-you-add-memo-everywhere*/}

<<<<<<< HEAD
Se seu aplicativo é como este site, e a maioria das interações são grosseiras (como substituir uma página ou uma seção inteira), a memoização geralmente é desnecessária. Por outro lado, se seu aplicativo é mais como um editor de desenho, e a maioria das interações é granular (como mover formas), então você pode achar a memoização muito útil.
=======
If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful.
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

Otimizar com `memo` só é valioso quando seu componente re-renderiza frequentemente com as mesmas props exatas, e sua lógica de re-renderização é cara. Se não houver um atraso perceptível quando seu componente re-renderiza, `memo` é desnecessário. Lembre-se de que `memo` é completamente inútil se as props passadas para seu componente são *sempre diferentes*, como se você passasse um objeto ou uma função simples definida durante a renderização. É por isso que você frequentemente precisará de [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) e [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) juntamente com `memo`.

Não há benefício em envolver um componente em `memo` em outros casos. Não há dano significativo em fazer isso também, então algumas equipes escolhem não pensar em casos individuais e memoizar o máximo possível. O lado negativo dessa abordagem é que o código se torna menos legível. Além disso, nem toda memoização é eficaz: um único valor que é "sempre novo" é suficiente para quebrar a memoização de um componente inteiro.

**Na prática, você pode tornar desnecessária muita memoização seguindo alguns princípios:**

1. Quando um componente envolve visualmente outros componentes, deixe-o [aceitar JSX como filhos.](/learn/passing-props-to-a-component#passing-jsx-as-children) Dessa forma, quando o componente envolvente atualiza seu próprio estado, o React sabe que seus filhos não precisam re-renderizar.
1. Prefira estado local e não [eleve o estado](/learn/sharing-state-between-components) mais do que o necessário. Por exemplo, não mantenha estado transitório como formulários e se um item está sendo destacado no topo da sua árvore ou em uma biblioteca de estado global.
1. Mantenha sua [lógica de renderização pura.](/learn/keeping-components-pure) Se re-renderizar um componente causar um problema ou produzir algum artefato visual perceptível, é um bug no seu componente! Corrija o bug em vez de adicionar memoização.
1. Evite [Efeitos desnecessários que atualizam o estado.](/learn/you-might-not-need-an-effect) A maioria dos problemas de desempenho em aplicativos React são causados por cadeias de atualizações originadas a partir de Efeitos que fazem seus componentes renderizarem repetidamente.
1. Tente [remover dependências desnecessárias de seus Efeitos.](/learn/removing-effect-dependencies) Por exemplo, em vez de memoização, muitas vezes é mais simples mover algum objeto ou função dentro de um Efeito ou fora do componente.

Se uma interação específica ainda parecer lenta, [use o perfilador de Ferramentas de Desenvolvedor do React](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) para ver quais componentes se beneficiariam mais da memoização e adicione memoização onde necessário. Esses princípios tornam seus componentes mais fáceis de depurar e entender, então é bom segui-los em qualquer caso. A longo prazo, estamos pesquisando [fazer memoização granular automaticamente](https://www.youtube.com/watch?v=lGEMwh32soc) para resolver isso de uma vez por todas.

</DeepDive>

---

### Atualizando um componente memoizado usando estado {/*updating-a-memoized-component-using-state*/}

Mesmo quando um componente é memoizado, ele ainda re-renderiza quando seu próprio estado muda. A memoização só tem relação com as props que são passadas para o componente a partir do seu pai.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting foi renderizado em', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Saudação regular
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Saudação entusiástica
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

Se você definir uma variável de estado para seu valor atual, o React ignorará a re-renderização do seu componente mesmo sem `memo`. Você ainda pode ver a função do seu componente sendo chamada uma vez a mais, mas o resultado será descartado.

---

### Atualizando um componente memoizado usando um contexto {/*updating-a-memoized-component-using-a-context*/}

Mesmo quando um componente é memoizado, ele ainda re-renderiza quando um contexto que está usando muda. A memoização só tem a ver com as props que são passadas para o componente a partir do seu pai.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext value={theme}>
      <button onClick={handleClick}>
        Trocar tema
      </button>
      <Greeting name="Taylor" />
    </ThemeContext>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting foi renderizado em", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Olá, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

Para fazer seu componente re-renderizar apenas quando _parte_ de algum contexto mudar, divida seu componente em dois. Leia o que você precisa do contexto no componente externo e passe-o para um filho memoizado como uma prop.

---

### Minimizar mudanças nas props {/*minimizing-props-changes*/}

Quando você usa `memo`, seu componente re-renderiza sempre que qualquer prop não é *shallowly equal* ao que era anteriormente. Isso significa que o React compara cada prop em seu componente com seu valor anterior usando a comparação [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Note que `Object.is(3, 3)` é `true`, mas `Object.is({}, {})` é `false`.

Para aproveitar ao máximo `memo`, minimize as vezes que as props mudam. Por exemplo, se a prop for um objeto, impeça o componente pai de recriar esse objeto toda vez que ele re-renderizar usando [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

Uma maneira melhor de minimizar mudanças nas props é garantir que o componente aceite as informações mínimas necessárias em suas props. Por exemplo, ele poderia aceitar valores individuais em vez de um objeto inteiro:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Mesmo valores individuais podem às vezes ser projetados para aqueles que mudam com menos frequência. Por exemplo, aqui um componente aceita um booleano que indica a presença de um valor em vez do valor em si:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

Quando você precisa passar uma função para um componente memoizado, declare-a fora do seu componente para que ela nunca mude, ou use [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) para armazenar sua definição entre re-renderizações.

---

### Especificando uma função de comparação personalizada {/*specifying-a-custom-comparison-function*/}

Em casos raros, pode ser inviável minimizar as mudanças nas props de um componente memoizado. Nesse caso, você pode fornecer uma função de comparação personalizada, que o React usará para comparar as props antigas e novas em vez de usar igualdade superficial. Essa função é passada como um segundo argumento para `memo`. Ela deve retornar `true` apenas se as novas props resultarem na mesma saída que as props antigas; caso contrário, deve retornar `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

Se você fizer isso, use o painel de Desempenho nas ferramentas de desenvolvedor do seu navegador para ter certeza de que sua função de comparação é realmente mais rápida do que re-renderizar o componente. Você pode ficar surpreso.

Quando você fizer medições de desempenho, certifique-se de que o React esteja sendo executado no modo produção.

<Pitfall>

Se você fornecer uma implementação personalizada para `arePropsEqual`, **você deve comparar todas as props, incluindo funções.** Funções frequentemente [fecham sobre](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) as props e o estado dos componentes pai. Se você retornar `true` quando `oldProps.onClick !== newProps.onClick`, seu componente continuará "vendo" as props e o estado de uma renderização anterior dentro de seu manipulador `onClick`, levando a bugs muito confusos.

Evite fazer verificações de igualdade profunda dentro de `arePropsEqual` a menos que você tenha 100% de certeza de que a estrutura de dados com a qual está trabalhando tem uma profundidade limitada conhecida. **Verificações de igualdade profunda podem se tornar incrivelmente lentas** e podem travar seu aplicativo por muitos segundos se alguém mudar a estrutura de dados posteriormente.

</Pitfall>

---

<<<<<<< HEAD
## Resolução de Problemas {/*troubleshooting*/}
### Meu componente re-renderiza quando uma prop é um objeto, array ou função {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}
=======
### Do I still need React.memo if I use React Compiler? {/*react-compiler-memo*/}

When you enable [React Compiler](/learn/react-compiler), you typically don't need `React.memo` anymore. The compiler automatically optimizes component re-rendering for you.

Here's how it works:

**Without React Compiler**, you need `React.memo` to prevent unnecessary re-renders:

```js
// Parent re-renders every second
function Parent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1>Seconds: {seconds}</h1>
      <ExpensiveChild name="John" />
    </>
  );
}

// Without memo, this re-renders every second even though props don't change
const ExpensiveChild = memo(function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
});
```

**With React Compiler enabled**, the same optimization happens automatically:

```js
// No memo needed - compiler prevents re-renders automatically
function ExpensiveChild({ name }) {
  console.log('ExpensiveChild rendered');
  return <div>Hello, {name}!</div>;
}
```

Here's the key part of what the React Compiler generates:

```js {6-12}
function Parent() {
  const $ = _c(7);
  const [seconds, setSeconds] = useState(0);
  // ... other code ...

  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = <ExpensiveChild name="John" />;
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  // ... return statement ...
}
```

Notice the highlighted lines: The compiler wraps `<ExpensiveChild name="John" />` in a cache check. Since the `name` prop is always `"John"`, this JSX is created once and reused on every parent re-render. This is exactly what `React.memo` does - it prevents the child from re-rendering when its props haven't changed.

The React Compiler automatically:
1. Tracks that the `name` prop passed to `ExpensiveChild` hasn't changed
2. Reuses the previously created JSX for `<ExpensiveChild name="John" />`
3. Skips re-rendering `ExpensiveChild` entirely

This means **you can safely remove `React.memo` from your components when using React Compiler**. The compiler provides the same optimization automatically, making your code cleaner and easier to maintain.

<Note>

The compiler's optimization is actually more comprehensive than `React.memo`. It also memoizes intermediate values and expensive computations within your components, similar to combining `React.memo` with `useMemo` throughout your component tree.

</Note>

---

## Troubleshooting {/*troubleshooting*/}
### My component re-renders when a prop is an object, array, or function {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

O React compara antigas e novas props por igualdade superficial: ou seja, considera se cada nova prop é igual em referência à antiga. Se você criar um novo objeto ou array toda vez que o pai re-renderizar, mesmo que os elementos individuais sejam os mesmos, o React ainda considerará que ele foi alterado. Da mesma forma, se você criar uma nova função ao renderizar o componente pai, o React considerará que ela mudou mesmo que a função tenha a mesma definição. Para evitar isso, [simplifique as props ou memoize as props no componente pai](#minimizing-props-changes).