---
title: Using TypeScript
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript é uma maneira popular de adicionar definições de tipo a códigos JavaScript. Por padrão, o TypeScript [suporta JSX](/learn/writing-markup-with-jsx), e você pode obter suporte completo para o desenvolvimento web com React adicionando [`@types/react`](https://www.npmjs.com/package/@types/react) e [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) ao seu projeto.
</Intro>

<YouWillLearn>

* [TypeScript em Componentes React](/learn/typescript#typescript-with-react-components)
* [Exemplos de tipagem com hooks](/learn/typescript#example-hooks)
* [Tipos comuns de `@types/react`](/learn/typescript/#useful-types)
* [Outros locais para aprendizagem](/learn/typescript/#further-learning)

</YouWillLearn>

## Instalação {/*installation*/}

Todos os [frameworks React de produção] (https://react-dev-git-fork-orta-typescriptpage-fbopensource.vercel.app/learn/start-a-new-react-project#production-grade-react-frameworks) oferecem suporte ao uso de TypeScript. Siga o guia específico do framework para a instalação:

- [Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Adicionando TypeScript a um projeto React existente {/*adding-typescript-to-an-existing-react-project*/}

Para instalar a versão mais recente das definições de tipos do React:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

As seguintes opções devem ser configuradas no seu arquivp `tsconfig.json`:

1. `dom` deve ser adicionado em [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Observação: Se nenhuma opção `lib` for especificada, `dom` será adicionado por padrão).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) deve ser definido como uma das opções válidas. Para a maioria das aplicações, `preserve` deve ser suficiente.
  Se você estiver publicando uma biblioteca, consulte a [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) para saber qual valor escolher.

## TypeScript com Componentes React {/*typescript-with-react-components*/}

<Note>

Todo arquivo contendo JSX deve usar a extensão `.tsx`. Esta é uma extensão específica do TypeScript que informa ao TypeScript que este arquivo contém JSX.

</Note>

Codificar TypeScript com React é muito semelhante a utilizar JavaScript com React. A principal diferença ao trabalhar com um componente é que você pode fornecer tipos para as propriedades do seu componente. Esses tipos podem ser usados para verificação de correção e fornecer documentação em linha nos editores.

Usando o componente [`MyButton` component](/learn#components) do [Guia de Início Rápido](/learn), podemos adicionar um tipo que descreve o `title` para o botão: 

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
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
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

Essas áreas de teste podem lidar com código TypeScript, mas não executam a verificação de tipos. Isso significa que você pode modificar as áreas de teste do TypeScript para aprendizado, mas não receberá erros ou avisos de tipo. Para obter a verificação de tipos, você pode usar o [TypeScript Playground](https://www.typescriptlang.org/play) ou usar uma plataforma de teste online mais completa.

</Note>

Esta sintaxe em linha é a maneira mais simples de fornecer tipos para um componente, embora, à medida que você começa a ter várias propriedades para descrever, ela pode se tornar deselegante. Em vez disso, você pode usar uma `interface` or `type` para descrever as propriedades do componente:

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** Texto a ser exibido dentro do botão */
  title: string;
  /** Se o botão pode ter interação */
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
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

O tipo que descreve as propriedades do seu componente pode ser tão simples ou complexo quanto necessário, embora ele deva ser um tipo de objeto descrito como `type` ou `interface`. Você pode aprender sobre como o TypeScript descreve objetos em [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) mas também pode estar interessado em usar [Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) para descrever uma propriedade que pode ser de alguns tipos diferentes e o guia [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) para casos de uso mais avançados.

## Exemplos de Hooks {/*example-hooks*/}

As definições de tipo de `@types/react` incluem tipos para os hooks integrados, para que você possa usá-los em seus componentes sem configuração adicional. Eles são projetados para levar em consideração o código que você escreve em seu componente, portanto, você obterá [inferred types](https://www.typescriptlang.org/docs/handbook/type-inference.html) na maioria das vezes e, idealmente, não precisará lidar com os detalhes de fornecer os tipos. 

No entanto, podemos dar uma olhada em alguns exemplos de como fornecer tipos para os hooks.

### `useState` {/*typing-usestate*/}

O [hook `useState`](/reference/react/useState) reutilizará o valor passado como estado inicial para determinar qual deve ser o tipo do valor. Por exemplo:

```ts
// Inferir o tipo como "boolean"
const [enabled, setEnabled] = useState(false);
```

Atribuirá o tipo `boolean` to `enabled`, e `setEnabled` será uma função que aceita um argumento `boolean`, ou uma função que retorna um `boolean`. e você quiser fornecer explicitamente um tipo para o estado, pode fazê-lo fornecendo um argumento de tipo na chamada `useState`:

```ts 
// Definir explicitamente o tipo como "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

Isso não é muito útil neste caso, mas um caso comum em que você pode querer fornecer um tipo é quando você tem um tipo de união. Por exemplo, `status` aqui pode ser uma das várias strings diferentes:

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Ou, como recomendado em [Principles for structuring state](/learn/choosing-the-state-structure#principles-for-structuring-state), você pode agrupar estados relacionados em um objeto e descrever as diferentes possibilidades por meio de tipos de objetos:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

O [ hook `useReducer`](/reference/react/useReducer) é um hook mais complexo que recebe uma função de redução e um estado inicial. Os tipos para a função de redução são inferidos a partir do estado inicial. Você pode opcionalmente fornecer um argumento de tipo na chamada `useReducer` para fornecer um tipo para o estado, mas geralmente é melhor definir o tipo no estado inicial em vez disso:

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
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Estamos usando TypeScript em alguns pontos específicos:

 - `interface State` descreve a forma do estado do redutor.
 - `type CounterAction` descreve as diferentes ações que podem ser despachadas para o redutor.
 - `const initialState: State` fornece um tipo para o estado inicial e também o tipo usado por `useReducer` por padrão.
 - `stateReducer(state: State, action: CounterAction): State` define os tipos dos argumentos e do valor de retorno da função de redução.

Uma alternativa mais explícita para definir o tipo em `initialState` é fornecer um argumento de tipo para `useReducer`:

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

O [hook `useContext`](/reference/react/useContext) é uma técnica para passar dados pela árvore de componentes sem a necessidade de passar props pelos componentes. Isso é feito criando um componente provedor e frequentemente criando um hook para consumir o valor em um componente filho.

O tipo do valor fornecido pelo contexto é inferido a partir do valor passado para a chamada de `createContext`:

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

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
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Essa técnica funciona quando você tem um valor padrão que faz sentido - mas ocasionalmente existem casos em que isso não ocorre, e, nesses casos, `null` pode ser uma escolha razoável como valor padrão. No entanto, para permitir que o sistema de tipos entenda seu código, você precisa definir explicitamente `ContextShape | null` na chamada de `createContext`. 

Isso gera a questão de que você precisa eliminar o  `| null` no tipo para consumidores de contexto. Nossa recomendação é que o hook faça uma verificação em tempo de execução para verificar sua existência e lançar um erro quando não estiver presente:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Este é um exemplo mais simples, mas você pode imaginar um objeto mais complexo aqui
type ComplexObject = {
  kind: string
};

// O contexto é criado com `| null` no tipo, para refletir com precisão o valor padrão.
const Context = createContext<ComplexObject | null>(null);

// O `| null` será removido por meio da verificação no hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

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
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

O [hook `useMemo`](/reference/react/useMemo) irá criar/acessar um valor memorizado a partir de uma chamada de função, executando a função novamente apenas quando as dependências passadas como segundo parâmetro forem alteradas. O resultado da chamada do hook é inferido a partir do valor de retorno da função no primeiro parâmetro. Você pode ser mais explícito fornecendo um argumento de tipo para o hook.

```ts
// O tipo de visibleTodos é inferido a partir do valor de retorno de filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` {/*typing-usecallback*/}

O [hook `useCallback`](/reference/react/useCallback) fornece uma referência estável a uma função, desde que as dependências passadas como segundo parâmetro sejam as mesmas. Assim como o `useMemo`, o tipo da função é inferido a partir do valor de retorno da função no primeiro parâmetro, e você pode ser mais explícito fornecendo um argumento de tipo para o hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

Ao trabalhar no modo estrito do TypeScript, o `useCallback` exige a adição de tipos para os parâmetros em seu retorno de chamada. Isso ocorre porque o tipo do retorno de chamada é inferido a partir do valor de retorno da função e, sem parâmetros, o tipo não pode ser completamente compreendido.

Dependendo das preferências do seu estilo de código, você pode usar as funções `*EventHandler` dos tipos React para fornecer o tipo para o manipulador de eventos ao mesmo tempo em que define o retorno de chamada: 

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Tipos Úteis {/*useful-types*/}

Existe um conjunto bastante abrangente de tipos que vêm do pacote `@types/react`, vale a pena ler quando você se sentir confortável com a interação entre React e TypeScript. Você pode encontrá-los [na pasta React em DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). Vamos cobrir alguns dos tipos mais comuns aqui.

### Eventos DOM {/*typing-dom-events*/}

Ao trabalhar com eventos do DOM no React, o tipo do evento frequentemente pode ser inferido a partir do manipulador de eventos. No entanto, quando você deseja extrair uma função para ser passada a um manipulador de eventos, será necessário definir explicitamente o tipo do evento.

<Sandpack>

```tsx App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Existem muitos tipos de eventos fornecidos nos tipos do React - a lista completa pode ser encontrada [aqui](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) com base nos [most popular events from the DOM](https://developer.mozilla.org/en-US/docs/Web/Events).

Ao determinar o tipo que você procura, você pode primeiro verificar as informações de sobreposição para o manipulador de eventos que está usando, o que mostrará o tipo do evento.

Se você precisar usar um evento que não está incluído nesta lista, pode usar o tipo `React.SyntheticEvent` que é o tipo base para todos os eventos. 

### Children {/*typing-children*/}

Existem duas maneiras comuns de descrever componentes filho. A primeira é usar o tipo `React.ReactNode` que é uma união de todos os tipos possíveis que podem ser passados como filhos em JSX:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Essa é uma definição muito ampla de filhos. A segunda opção é usar o tipo `React.ReactElement` que inclui apenas elementos JSX e não tipos primitivos do JavaScript, como strings ou números:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Observe que você não pode usar o TypeScript para descrever que os filhos são de um tipo específico de elementos JSX, portanto, não pode usar o sistema de tipos para descrever um componente que aceita apenas filhos `<li>`. 

Você pode ver um exemplo de ambos `React.ReactNode` and `React.ReactElement` com o verificador de tipos em [this TypeScript playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA).

### Propriedades de Estilo {/*typing-style-props*/}

Ao usar estilos embutidos no React, você pode usar `React.CSSProperties` para descrever o objeto passado para a propriedade `style`. Este tipo é uma união de todas as possíveis propriedades CSS e é uma boa maneira de garantir que você está passando propriedades CSS válidas para a propriedade `style` e obter auto-completar em seu editor.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Aprendizado Adicional {/*further-learning*/}

Este guia abordou o básico do uso do TypeScript com o React, mas há muito mais a aprender. 
Páginas individuais de API na documentação podem conter documentação mais detalhada sobre como usá-las com o TypeScript.

Recomendamos os seguintes recursos:

 - [O Manual do TypeScript](https://www.typescriptlang.org/docs/handbook/) é a documentação oficial do TypeScript e abrange a maioria das principais características da linguagem.

 - [Notas de lançamento do TypeScript](https://devblogs.microsoft.com/typescript/) aborda cada nova funcionalidade em profundidade.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) é uma folha de dicas mantida pela comunidade para o uso do TypeScript com o React, abrangendo muitos casos úteis e fornecendo uma amplitude maior do que este documento.

 - [Comunidade TypeScript no Discord](https://discord.com/invite/typescript) é um ótimo lugar para fazer perguntas e obter ajuda com problemas relacionados ao TypeScript e ao React.