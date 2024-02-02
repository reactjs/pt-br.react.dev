---
title: Utilizando Typescript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript é uma forma popular de adicionar definições de tipos à bases de códigos JavaScript. Por padrão, o TypeScript oferece [suporte ao JSX](/learn/writing-markup-with-jsx) e permite que você tenha total suporte para o React Web adicionando [`@types/react`](https://www.npmjs.com/package/@types/react) e [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) ao seu projeto.

</Intro>

<YouWillLearn>

* [TypeScript com Componentes React](/learn/typescript#typescript-with-react-components)
* [Exemplos de tipagem com hooks](/learn/typescript#example-hooks)
* [Tipos úteis do `@types/react`](/learn/typescript/#useful-types)
* [Conteúdo adicional para aprendizagem](/learn/typescript/#further-learning)

</YouWillLearn>

## Instalação {/*installation*/}

Todos os [frameworks React em produção](https://react-dev-git-fork-orta-typescriptpage-fbopensource.vercel.app/learn/start-a-new-react-project#production-grade-react-frameworks) oferecem suporte para o uso de TypeScript. Siga o guia específico do framework para instalação:

- [Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Adicionando TypeScript a um projeto React existente {/*adding-typescript-to-an-existing-react-project*/}

Para instalar a versão mais recente das definições de tipos do React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

As seguintes opções do compilador precisam ser definidas em seu `tsconfig.json`:

1. `dom` precisa ser incluído em [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Nota: se nenhuma opção de `lib` for especificada, `dom` será incluido por padrão).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) deve ser definido como uma das opções válidas. `preserve` deve ser suficiente para a maioria das aplicações.
  Se você está publicando uma biblioteca, consulte a [documentação do `jsx`](https://www.typescriptlang.org/tsconfig/#jsx) sobre qual valor escolher. 

## TypeScript com Componentes React {/*typescript-with-react-components*/}

<Note>
Todo arquivo contendo JSX deve utilizar a extensão de arquivo `.tsx`. Esta é uma extensão específica do TypeScript que indica ao TypeScript que este arquivo contém JSX.

</Note>

Escrever TypeScript com React é muito parecido com escrever JavaScript com React. A principal diferença ao trabalhar com um componente é que você pode especificar tipos para as `props` do seu componente. Estes tipos podem ser usados para checar sua exatidão e prover documentação incorporada em editores.

Utilizando o [componente `MyButton`](/learn#components) do Guia de [Quick Start](/learn), podemos adicionar um tipo descrevendo o `title` para o botão.

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bem-vindo ao my app</h1>
      <MyButton title="Eu sou um botão" />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Estes trechos de código conseguem lidar com código TypeScript, porém eles não executarão nenhuma checagem de tipos. Isso significa que você pode alterar este trecho de código para fins de aprendizado, mas não receberá nenhum erro ou warning. para ter uma checagem de tipos, você pode usar o [TypeScript Playground](https://www.typescriptlang.org/play) ou utilizar uma ferramenta online de sandbox mais completa.

</Note>

Esta sintaxe em uma mesma linha é a forma mais simples de fornecer tipos para um componente, no entanto a medida que se tem alguns campos a mais para serem descritos, as coisas podem ficar complicadas. Ao invés disso, você pode usar um `type` ou uma `interface` para descrever as props de um componente:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** O texto à ser exibido dentro do botão */
  title: string;
  /** Se poderá haver interação com o botão */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Bem-vindo ao my app</h1>
      <MyButton title="Eu sou um botão desabilitado" disabled={true} />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

O tipo que descreve as props do seu componente pode ser mais simples ou mais complexo conforme sua necessidade, embora deva ser um tipo objeto descrito seja como `type`ou `interface`. Você pode aprender mais sobre como o TypeScript descreve objetos em [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) assim como você pode se interessar no uso de [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) para descrever uma prop que possa ser uma entre alguns diferentes tipos e o guia [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) para casos de uso mais avançados.


## Exemplos de Hooks {/*example-hooks*/}

As definições de tipos em `@types/react` incluem tipos para os hooks nativos, então você pode usá-los em seus componentes sem nenhuma configuração adicional. Eles são construídos levando em conta o código que você escreve em seu componente, então você terá a [inferência de tipo](https://www.typescriptlang.org/pt/docs/handbook/type-inference.html) na maior parte do tempo e idealmente você não precisará se preocupar com as minúcias de fornecer tipos.

Entretanto, podemos observar alguns exemplos de como fornecer tipos para hooks.

### `useState` {/*typing-usestate*/}

O [hook `useState`](/reference/react/useState) irá reutilizar o valor passado como state inicial para determinar qual o tipo o valor deve ser. Por exemplo: 

```ts
// Tipo inferido como "boolean"
const [enabled, setEnabled] = useState(false);
```

Atribuirá o tipo `boolean` à `enabled` e `setEnable` será uma função que ou aceita um `boolean` como argumento ou uma função que retorna `boolean`. Se você deseja informar explicitamente um tipo para o state, você pode informat um tipo como argumento à chamada do `useState`:

```ts 
// Explicitamente define o tipo como "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Não é algo muito útil neste caso, mas um caso comum seria onde você deseja informar um tipo que representa um _union type_. Por exemplo, `status` aqui pode ser uma dentre algumas _strings_:

```ts
type Status = "ocioso" | "carregando" | "sucesso" | "erro";

const [status, setStatus] = useState<Status>("ocioso");
```

Ou, como recomendado em [Princípios para estruturação de estado](/learn/choosing-the-state-structure#principles-for-structuring-state), você pode agrupar estados relacionados em um objeto descrevendo suas diferentes possibilidades através de tipos objetos:

```ts
type RequestState =
  | { status: 'ocioso' }
  | { status: 'carregando' }
  | { status: 'sucesso', data: any }
  | { status: 'erro', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'ocioso' });
```

### `useReducer` {/*typing-usereducer*/}

O [hook `useReducer`](/reference/react/useReducer) é um hook mais complexo que recebe uma função _reducer_ e um _state_ inicial. os tipos para a função _reducer_ são inferidos a partir do _state_ inicial. Você pode opcionalmente informar um tipo como argumendo para a chamada de `useReducer` para informar um tipo para o _state_, mas é frequentemente melhor, ao invés disso, definir o tipo no _state_ inicial:

<Sandpack>

```tsx App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Ação desconhecida");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Bem vindo ao meu contador</h1>

      <p>Contador: {state.count}</p>
      <button onClick={addFive}>Adicione 5</button>
      <button onClick={reset}>Resetar</button>
    </div>
  );
}

```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Estamos usando TypeScript em alguns lugares importantes:

 - `interface State` descreve a forma do _state_ do _reducer_.
 - `type CounterAction` descreve as diferentes _actions_ das quais podem ser executadas no _reducer_.
 - `const initialState: State` informa um tipo para o _state_ inicial assim como o tipo usado pelo `useReducer` por padrão.
 - `stateReducer(state: State, action: CounterAction): State` define os tipos para os argumentos da função _reducer_ e o valor do retorno.

Uma alternativa mais explícita para definir o tipo de `initialState` é informar um tipo como argumento para o `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

o [hook `useContext`](/reference/react/useContext) é uma técnica de transmissão de dados pela árvore de componentes sem a necessidade de passar _props_ entre componentes. É utilizado criando um componente _provider_ e um hook que consome o valor em um componente filho.

O tipo do valor informado pelo contexto é inferido a partir do valor passado durante a chamada da função `createContext`:

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "claro" | "escuro" | "sistema";
const ThemeContext = createContext<Theme>("sistema");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('claro');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Tema atual: {theme}</p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Essa técnica funciona quando você tem um valor padrão que faz sentido, mas há casos onde isso não acontece, como por exemplo ao utilizar `null` como um valor padrão, o que faz todo o sentido. Portanto, para permitir que o sistema de tipos compreenda o seu código, você precisa explicitamente definir `ContextShape | null` na chamada de `createContext`.

Isso causa um problema onde é necessário eliminar o `| null` no tipo onde se consome o contexto. A recomendação é fazer com que o hook faça uma checagem de sua existência em tempo de execução e cause um erro caso não exista.

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Este é um exemplo mais simples, mas você pode imaginar um objeto mais complexo aqui
type ComplexObject = {
  kind: string
};

// O contexto foi criado com `| null` no tipo, para refletir precisamente o valor padrão.
const Context = createContext<ComplexObject | null>(null);

// O `| null` será removido via checagem pelo hook
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject deve ser usado dentro de um Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complexo" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Objeto atual: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

O [hook `useMemo`](/reference/react/useMemo) criam/reacessam um valor memoizado de uma chamada de função, executando-a novamente apenas quando as dependências passadas como segundo parâmetro mudarem. O resultado da chamada do hook é inferido pelo valor retornado pela função do primeiro parâmetro. Você pode ser mais explícito informando um tipo como argumento para o hook.

```ts
// O tipo de visibleTodos é inferido pelo retorno do valor de filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

O [`useCallback`](/reference/react/useCallback) fornece uma referência estável à uma função, desde que as dependências passadas no segundo parâmetro sejam as mesmas. Assim como o `useMemo`, o tipo da função é inferido a partir do valor de retorno da função do primeiro parâmetro, e você pode ser mais explícito fornecendo um tipo como argumento ao hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Ao trabalhar no _strict mode_ do TypeScript, o `useCallback` requer a adição de tipos para os parâmetros da callback. Isso ocorre porque o tipo da callback é inferido a partir do valor de retorno da função e, sem parâmetros, o tipo não pode ser totalmente compreendido.

Dependendo de suas preferências de estilo de código, você pode usar as funções `EventHandler` dos tipos do React para fornecer o tipo do manipulador de eventos ao mesmo tempo em que define a callback: 

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Mude-me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valor: {value}</p>
    </>
  );
}
```

## Tipos Úteis {/*useful-types*/}

Há um conjunto bastante amplo de tipos provenientes do pacote `@types/react`, que vale a pena ler quando você se sentir confortável sobre como o React e o TypeScript interagem. Você pode encontrá-los [na pasta do React em DefinitelyTyped] (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Abordaremos alguns dos tipos mais comuns aqui.

### Eventos do DOM {/*typing-dom-events*/}

Ao trabalhar com eventos do DOM no React, o tipo do evento geralmente pode ser inferido a partir do manipulador de eventos. No entanto, quando você quiser extrair uma função passada à um manipulador de eventos, será necessário definir explicitamente o tipo do evento.

<Sandpack>

```tsx App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Mude-me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Valor: {value}</p>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Há muitos tipos de eventos fornecidos nos tipos do React - a lista completa pode ser encontrada [aqui](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373), que se baseia nos [eventos mais populares do DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Para determinar o tipo que está procurando, você pode examinar as informações do manipulador de eventos utilizado colocando o ponteiro do mouse sobre ele, que mostrará o tipo do evento

Se precisar usar um evento que não esteja incluído nessa lista, você poderá usar o tipo `React.SyntheticEvent`, que é o tipo base para todos os eventos.

### Children {/*typing-children*/}

Há dois meios comuns para descrever o _children_ de um componente. O primeiro é usar o tipo `React.ReactNode`, que é uma união de todos os tipos possíveis que podem ser passados como filhos no JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Essa é uma definição bem ampla de _children_. A segunda é usar o tipo `React.ReactElement`, que corresponde apenas à elementos JSX e não tipos primitivos do JavaScript, como strings ou numbers:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Note, você não pode usar o TypeScript para descrever que os filhos são de um determinado tipo de elemento JSX, portanto, não é possível usar o sistema de tipos para descrever um componente que só aceita filhos `<li>`.

Você pode ver todos os exemplos de `React.ReactNode` e `React.ReactElement` com checagem de tipos com [este playground do TypeScript](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Props de Estilo {/*typing-style-props*/}

Ao usar estilos inline no React, você pode usar `React.CSSProperties` para descrever o objeto passado para a prop `style`. Esse tipo é uma união de todas as propriedades CSS possíveis e é uma boa forma de garantir que você esteja passando propriedades CSS válidas para a prop `style` e de obter o preenchimento automático em seu editor.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Conteúdo adicional {/*further-learning*/}

Este guia abordou os conceitos básicos do uso do TypeScript com React, mas há muito mais para aprender.
As páginas individuais de cada API nas documentação pode conter uma informação mais detalhada sobre como usá-las com o TypeScript.

Recomendamos as seguintes fontes

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) é a documentação oficial do TypeScript e abrange a maioria dos principais recursos da linguagem.

 - [The TypeScript release notes](https://devblogs.microsoft.com/typescript/) aborda detalhadamente cada um dos novos recursos.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) é um guia mantido pela comunidade para o uso de TypeScript com React, cobrindo um monte de casos específicos e oferecendo mais aprofundamento do que este documento.

 - [TypeScript Community Discord](https://discord.com/invite/typescript) é um ótimo lugar para fazer perguntas e obter ajuda com problemas de TypeScript e React.