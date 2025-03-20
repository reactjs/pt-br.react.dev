---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 está disponível no npm! Neste post, daremos uma visão geral dos novos recursos do React 19 e como adotá-los.
---

December 05, 2024 by [The React Team](/community/team)

---
<Note>

### React 19 está estável agora! {/*react-19-is-now-stable*/}

Adições desde que este post foi compartilhado originalmente com o React 19 RC em abril:

- **Pré-aquecimento para árvores suspensas**: veja [Melhorias para o Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **APIs estáticas do React DOM**: veja [Novas APIs Estáticas do React DOM](#new-react-dom-static-apis).

_A data para este post foi atualizada para refletir a data de lançamento estável._

</Note>

<Intro>

React v19 está disponível no npm!

</Intro>

Em nosso [Guia de Atualização do React 19](/blog/2024/04/25/react-19-upgrade-guide), compartilhamos instruções passo a passo para atualizar seu aplicativo para React 19. Neste post, daremos uma visão geral dos novos recursos do React 19 e como você pode adotá-los.

- [O que há de novo no React 19](#whats-new-in-react-19)
- [Melhorias no React 19](#improvements-in-react-19)
- [Como atualizar](#how-to-upgrade)

Para uma lista de mudanças significativas, consulte o [Guia de Atualização](/blog/2024/04/25/react-19-upgrade-guide).

---

## O que há de novo no React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

Um caso de uso comum em aplicativos React é realizar uma mutação de dados e, em seguida, atualizar o estado em resposta. Por exemplo, quando um usuário envia um formulário para alterar seu nome, você fará uma solicitação de API e, em seguida, lidará com a resposta. No passado, você precisaria lidar com estados pendentes, erros, atualizações otimistas e solicitações sequenciais manualmente.

Por exemplo, você pode lidar com o estado pendente e de erro em `useState`:

```js
// Before Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

No React 19, estamos adicionando suporte para usar funções assíncronas em transições para lidar com estados pendentes, erros, formulários e atualizações otimistas automaticamente.

Por exemplo, você pode usar `useTransition` para lidar com o estado pendente por você:

```js
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

A transição assíncrona definirá imediatamente o estado `isPending` como true, fará as solicitações assíncronas e mudará `isPending` para false após quaisquer transições. Isso permite que você mantenha a UI atual responsiva e interativa enquanto os dados estão mudando.

<Note>

#### Por convenção, as funções que usam transições assíncronas são chamadas de "Actions". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Actions gerenciam automaticamente o envio de dados para você:

- **Estado pendente**: Actions fornecem um estado pendente que começa no início de uma solicitação e é redefinido automaticamente quando a atualização final do estado é confirmada.
- **Atualizações otimistas**: Actions suportam o novo hook [`useOptimistic`](#new-hook-optimistic-updates) para que você possa mostrar aos usuários feedback instantâneo enquanto as solicitações estão sendo enviadas.
- **Manipulação de erros**: Actions fornecem tratamento de erros para que você possa exibir Error Boundaries quando uma solicitação falha e reverter atualizações otimistas para seu valor original automaticamente.
- **Formulários**: Os elementos `<form>` agora suportam a passagem de funções para as props `action` e `formAction`. Passar funções para as props `action` usa Actions por padrão e redefine o formulário automaticamente após o envio.

</Note>

Com base no Actions, o React 19 introduz [`useOptimistic`](#new-hook-optimistic-updates) para gerenciar atualizações otimistas e um novo hook [`React.useActionState`](#new-hook-useactionstate) para lidar com casos comuns para Actions. No `react-dom`, estamos adicionando [`<form>` Actions](#form-actions) para gerenciar formulários automaticamente e [`useFormStatus`](#new-hook-useformstatus) para suportar os casos comuns para Actions em formulários.

No React 19, o exemplo acima pode ser simplificado para:

```js
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

Na próxima seção, detalharemos cada um dos novos recursos do Action no React 19.

### Novo hook: `useActionState` {/*new-hook-useactionstate*/}

Para facilitar os casos comuns para Actions, adicionamos um novo hook chamado `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // You can return any result of the action.
      // Here, we return only the error.
      return error;
    }

    // handle success
    return null;
  },
  null,
);
```

`useActionState` aceita uma função (a "Action") e retorna uma Action encapsulada para chamar. Isso funciona porque Actions se compõem. Quando a Action encapsulada é chamada, `useActionState` retornará o último resultado da Action como `data` e o estado pendente da Action como `pending`.

<Note>

`React.useActionState` costumava ser chamado de `ReactDOM.useFormState` nas versões Canary, mas o renomeamos e descontinuamos `useFormState`.

Veja [#28491](https://github.com/facebook/react/pull/28491) para mais informações.

</Note>

Para mais informações, consulte os documentos para [`useActionState`](/reference/react/useActionState).

### React DOM: `<form>` Actions {/*form-actions*/}

Actions também estão integrados aos novos recursos `<form>` do React 19 para `react-dom`. Adicionamos suporte para passar funções como as props `action` e `formAction` dos elementos `<form>`, `<input>` e `<button>` para enviar automaticamente formulários com Actions:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Quando uma Action `<form>` é bem-sucedida, o React irá redefinir automaticamente o formulário para componentes não controlados. Se você precisar redefinir o `<form>` manualmente, poderá chamar a nova API `requestFormReset` do React DOM.

Para mais informações, consulte os documentos `react-dom` para [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) e `<button>`.

### React DOM: Novo hook: `useFormStatus` {/*new-hook-useformstatus*/}

Em sistemas de design, é comum escrever componentes de design que precisam acessar informações sobre o `<form>` em que estão, sem passar props para o componente. Isso pode ser feito via Context, mas para facilitar o caso comum, adicionamos um novo hook `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` lê o status do `<form>` pai como se o formulário fosse um provedor de Context.

Para mais informações, consulte os documentos `react-dom` para [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Novo hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Outro padrão comum de UI ao realizar uma mutação de dados é mostrar o estado final otimisticamente enquanto a solicitação assíncrona está em andamento. No React 19, estamos adicionando um novo hook chamado `useOptimistic` para facilitar isso:

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

O hook `useOptimistic` irá renderizar imediatamente o `optimisticName` enquanto a requisição `updateName` está em andamento. Quando a atualização termina ou ocorre um erro, o React mudará automaticamente de volta para o valor `currentName`.

Para mais informações, consulte os documentos para [`useOptimistic`](/reference/react/useOptimistic).

### Nova API: `use` {/*new-feature-use*/}

No React 19, estamos introduzindo uma nova API para ler recursos em renderização: `use`.

Por exemplo, você pode ler uma promise com `use`, e o React irá Suspender até que a promise seja resolvida:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` não suporta promises criadas em renderização. {/*use-does-not-support-promises-created-in-render*/}

Se você tentar passar uma promise criada em renderização para `use`, o React irá avisar:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Um componente foi suspenso por uma promise não armazenada em cache. Criar promises dentro de um Componente Cliente ou hook ainda não é suportado, exceto através de uma biblioteca ou framework compatível com Suspense.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir, você precisa passar uma promise de uma biblioteca ou framework compatível com Suspense que suporte o cache para promises. No futuro, planejamos lançar recursos para facilitar o cache de promises em renderização.

</Note>

Você também pode ler context com `use`, permitindo que você leia o Context condicionalmente, como após retornos antecipados:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

A API `use` só pode ser chamada em renderização, de forma semelhante aos hooks. Ao contrário dos hooks, `use` pode ser chamado condicionalmente. No futuro, planejamos suportar mais maneiras de consumir recursos em renderização com `use`.

Para mais informações, consulte os documentos para [`use`](/reference/react/use).

## Novas APIs Estáticas do React DOM {/*new-react-dom-static-apis*/}

Adicionamos duas novas APIs a `react-dom/static` para geração de site estático:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Essas novas APIs melhoram o `renderToString` esperando que os dados sejam carregados para a geração de HTML estático. Elas são projetadas para funcionar com ambientes de streaming como Node.js Streams e Web Streams. Por exemplo, em um ambiente Web Stream, você pode pré-renderizar uma árvore React para HTML estático com `prerender`:

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

As APIs de pré-renderização esperarão que todos os dados sejam carregados antes de retornar o fluxo HTML estático. Os fluxos podem ser convertidos em strings ou enviados com uma resposta de streaming. Elas não suportam streaming de conteúdo à medida que ele carrega, o que é suportado pelas [APIs de renderização do servidor React DOM existentes](/reference/react-dom/server).

Para mais informações, consulte [APIs Estáticas do React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components são uma nova opção que permite renderizar componentes com antecedência, antes do empacotamento, em um ambiente separado do seu aplicativo cliente ou servidor SSR. Este ambiente separado é o "servidor" no React Server Components. Server Components podem ser executados uma vez no tempo de construção no seu servidor CI, ou eles podem ser executados para cada solicitação usando um servidor web.

React 19 inclui todos os recursos do React Server Components incluídos do canal Canary. Isso significa que bibliotecas que acompanham os Server Components agora podem ter como alvo o React 19 como uma dependência peer com uma [condição de exportação](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server` para uso em frameworks que suportam a [Visão de Arquitetura Full-stack React da Equipe React](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision).

<Note>

#### Como construo suporte para Server Components? {/*how-do-i-build-support-for-server-components*/}

Embora o React Server Components no React 19 seja estável e não quebre entre as versões secundárias, as APIs subjacentes usadas para implementar um empacotador ou framework do React Server Components não seguem o semver e podem quebrar entre as versões menores no React 19.x.

Para suportar o React Server Components como um empacotador ou framework, recomendamos fixar em uma versão específica do React ou usar a versão Canary. Continuaremos trabalhando com empacotadores e frameworks para estabilizar as APIs usadas para implementar o React Server Components no futuro.

</Note>

Para mais informações, consulte os documentos para [React Server Components](/reference/rsc/server-components).

### Server Actions {/*server-actions*/}

Server Actions permitem que Client Components chamem funções assíncronas executadas no servidor.

Quando uma Server Action é definida com a diretiva `"use server"`, seu framework criará automaticamente uma referência à função do servidor e passará essa referência para o Client Component. Quando essa função é chamada no cliente, o React enviará uma solicitação ao servidor para executar a função e retornará o resultado.

<Note>

#### Não há diretiva para Server Components. {/*there-is-no-directive-for-server-components*/}

Um mal-entendido comum é que os Server Components são denotados por `"use server"`, mas não há diretiva para Server Components. A diretiva `"use server"` é usada para Server Actions.

Para mais informações, consulte os documentos para [Diretivas](/reference/rsc/directives).

</Note>

Server Actions podem ser criadas em Server Components e passadas como props para Client Components, ou podem ser importadas e usadas em Client Components.

Para mais informações, consulte os documentos para [React Server Actions](/reference/rsc/server-actions).

## Melhorias no React 19 {/*improvements-in-react-19*/}

### `ref` como uma prop {/*ref-as-a-prop*/}

A partir do React 19, agora você pode acessar `ref` como uma prop para componentes de função:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Novos componentes de função não precisarão mais de `forwardRef`, e publicaremos um codemod para atualizar automaticamente seus componentes para usar a nova prop `ref`. Em versões futuras, descontinuaremos e removeremos `forwardRef`.

<Note>

`refs` passadas para classes não são passadas como props, pois elas referenciam a instância do componente.

</Note>

### Diffs para erros de hidratação {/*diffs-for-hydration-errors*/}

Também melhoramos a relatórios de erros para erros de hidratação em `react-dom`. Por exemplo, em vez de registrar vários erros em DEV sem nenhuma informação sobre a incompatibilidade:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.``html
<ConsoleLogLine level="error">

Aviso: O conteúdo do texto não correspondeu. Servidor: "Servidor" Cliente: "Cliente"
{'  '}em span
{'  '}em App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Aviso: Um erro ocorreu durante a hidratação. O HTML do servidor foi substituído pelo conteúdo do cliente em \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Erro não detectado: O conteúdo do texto não corresponde ao HTML renderizado pelo servidor.
{'  '}em checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Agora, registramos uma única mensagem com uma diferença da não correspondência:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Erro não detectado: A hidratação falhou porque o HTML renderizado pelo servidor não correspondeu ao do cliente. Como resultado, esta árvore será regenerada no cliente. Isso pode acontecer se um Componente do Cliente SSR-izado usou:{'\n'}
\- Uma ramificação servidor/cliente `if (typeof window !== 'undefined')`.
\- Entradas variáveis como `Date.now()` ou `Math.random()` que mudam a cada vez que são chamadas.
\- Formatação de data na localidade de um usuário que não corresponde ao servidor.
\- Dados externos em mudança sem enviar um snapshot dele junto com o HTML.
\- Ninhos de tags HTML inválidos.{'\n'}
Também, isso pode ocorrer se o cliente tiver uma extensão de navegador instalada que bagunça o HTML antes que o React carregue.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Cliente
{'-    '}Servidor{'\n'}
{'  '}em throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` como um provedor {/*context-as-a-provider*/}

No React 19, você pode renderizar `<Context>` como um provedor em vez de `<Context.Provider>`:

```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

Novos provedores de contexto podem usar `<Context>` e estaremos publicando um codemod para converter os provedores existentes. Em versões futuras, descontinuaremos `<Context.Provider>`.

### Funções de limpeza para refs {/*cleanup-functions-for-refs*/}

Agora suportamos retornar uma função de limpeza de callbacks `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref criado

    // NOVO: retorna uma função de limpeza para redefinir
    // a ref quando o elemento for removido do DOM.
    return () => {
      // limpeza da ref
    };
  }}
/>
```

Quando o componente desmontar, o React chamará a função de limpeza retornada do callback `ref`. Isso funciona para refs do DOM, refs para componentes de classe e `useImperativeHandle`.

<Note>

Anteriormente, o React chamava funções `ref` com `null` ao desmontar o componente. Se sua `ref` retornar uma função de limpeza, o React agora pulará esta etapa.

Em versões futuras, descontinuaremos a chamada de refs com `null` ao desmontar componentes.

</Note>

Devido à introdução de funções de limpeza de ref, retornar qualquer outra coisa de um callback `ref` agora será rejeitado pelo TypeScript. A correção costuma ser parar de usar retornos implícitos, por exemplo:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornou a instância do `HTMLDivElement` e o TypeScript não saberia se isso era _suposto_ ser uma função de limpeza ou se você não queria retornar uma função de limpeza.

Você pode codemod este padrão com [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### `useDeferredValue` valor inicial {/*use-deferred-value-initial-value*/}

Adicionamos uma opção `initialValue` para `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // Na renderização inicial, o valor é ''.
  // Então, uma nova renderização é agendada com o deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

Quando o <CodeStep step={2}>initialValue</CodeStep> é fornecido, `useDeferredValue` o retornará como `value` para a renderização inicial do componente e agenda uma nova renderização em segundo plano com o <CodeStep step={1}>deferredValue</CodeStep> retornado.

Para saber mais, consulte [`useDeferredValue`](/reference/react/useDeferredValue).

### Suporte para metadados do documento {/*support-for-metadata-tags*/}

Em HTML, as tags de metadados do documento como `<title>`, `<link>` e `<meta>` são reservadas para colocação na seção `<head>` do documento. No React, o componente que decide quais metadados são apropriados para o aplicativo pode estar muito longe do local onde você renderiza o `<head>` ou o React não renderiza o `<head>` de forma alguma. No passado, esses elementos precisariam ser inseridos manualmente em um efeito ou por bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet) e exigiam tratamento cuidadoso ao renderizar um aplicativo React no servidor.

No React 19, estamos adicionando suporte para renderizar tags de metadados do documento em componentes nativamente:

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-ce-squared...
      </p>
    </article>
  );
}
```

Quando o React renderiza este componente, ele verá as tags `<title>`, `<link>` e `<meta>` e as moverá automaticamente para a seção `<head>` do documento. Ao suportar essas tags de metadados nativamente, podemos garantir que elas funcionem com aplicativos somente para cliente, streaming SSR e Componentes de Servidor.

<Note>

#### Você ainda pode querer uma biblioteca de metadados {/*you-may-still-want-a-metadata-library*/}

Para casos de uso simples, a renderização de Metadados do Documento como tags pode ser adequada, mas as bibliotecas podem oferecer recursos mais poderosos, como substituir metadados genéricos por metadados específicos com base na rota atual. Esses recursos tornam mais fácil para frameworks e bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet) suportarem tags de metadados, em vez de substituí-las.

</Note>

Para obter mais informações, consulte a documentação de [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) e [`<meta>`](/reference/react-dom/components/meta).

### Suporte para folhas de estilo {/*support-for-stylesheets*/}

As folhas de estilo, tanto as vinculadas externamente (`<link rel="stylesheet" href="...">`) quanto as embutidas (`<style>...</style>`), exigem posicionamento cuidadoso no DOM devido às regras de precedência de estilo. Construir uma capacidade de folha de estilo que permita a composição dentro de componentes é difícil, então os usuários costumam acabar carregando todos os seus estilos longe dos componentes que podem depender deles ou usam uma biblioteca de estilo que encapsula essa complexidade.

No React 19, estamos abordando essa complexidade e fornecendo uma integração ainda mais profunda na Renderização Concorrente no Cliente e na Renderização de Streaming no Servidor com suporte integrado para folhas de estilo. Se você informar ao React a `precedência` de sua folha de estilo, ele gerenciará a ordem de inserção da folha de estilo no DOM e garantirá que a folha de estilo (se externa) seja carregada antes de revelar o conteúdo que depende dessas regras de estilo.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- será inserido entre foo & bar
    </div>
  )
}
```

Durante o Server Side Rendering, o React incluirá a folha de estilo no `<head>`, o que garante que o navegador não renderize até que ela seja carregada. Se a folha de estilo for descoberta tardiamente depois que já começamos a transmitir, o React garantirá que a folha de estilo seja inserida no `<head>` no cliente antes de revelar o conteúdo de um limite de Suspense que dependa dessa folha de estilo.

Durante o Client Side Rendering, o React aguardará o carregamento das folhas de estilo recém-renderizadas antes de confirmar a renderização. Se você renderizar este componente de vários lugares em seu aplicativo, o React incluirá a folha de estilo apenas uma vez no documento:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // não levará a um link de folha de estilo duplicado no DOM
  </>
}
```

Para usuários acostumados a carregar folhas de estilo manualmente, esta é uma oportunidade de localizar essas folhas de estilo ao lado dos componentes que dependem delas, permitindo um melhor raciocínio local e facilitando a tarefa de garantir que você carregue apenas as folhas de estilo das quais você realmente depende.

As bibliotecas de estilo e as integrações de estilo com empacotadores também podem adotar essa nova capacidade, então, mesmo que você não renderize diretamente suas próprias folhas de estilo, você ainda pode se beneficiar à medida que suas ferramentas forem atualizadas para usar esse recurso.

Para obter mais detalhes, leia a documentação de [`<link>`](/reference/react-dom/components/link) e [`<style>`](/reference/react-dom/components/style).

### Suporte para scripts assíncronos {/*support-for-async-scripts*/}

Em HTML, os scripts normais (`<script src="...">`) e os scripts adiados (`<script defer="" src="...">`) são carregados na ordem do documento, o que torna a renderização desses tipos de scripts no fundo de sua árvore de componentes um desafio. No entanto, os scripts assíncronos (`<script async="" src="...">`) serão carregados em ordem arbitrária.

No React 19, incluímos melhor suporte para scripts assíncronos, permitindo que você os renderize em qualquer lugar em sua árvore de componentes, dentro dos componentes que realmente dependem do script, sem ter que gerenciar a realocação e a deduplicação de instâncias de script.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Olá Mundo
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // não levará a um script duplicado no DOM
    </body>
  </html>
}
```

Em todos os ambientes de renderização, os scripts assíncronos serão deduplicados para que o React carregue e execute o script apenas uma vez, mesmo que ele seja renderizado por vários componentes diferentes.

No Server Side Rendering, os scripts assíncronos serão incluídos no `<head>` e priorizados em relação a recursos mais críticos que bloqueiam a renderização, como folhas de estilo, fontes e pré-carregamento de imagens.

Para obter mais detalhes, leia a documentação de [`<script>`](/reference/react-dom/components/script).

### Suporte para pré-carregamento de recursos {/*support-for-preloading-resources*/}

Durante o carregamento inicial do documento e nas atualizações do lado do cliente, informar ao Navegador sobre os recursos que ele provavelmente precisará carregar o mais cedo possível pode ter um efeito dramático no desempenho da página.

O React 19 inclui um número de novas APIs para carregar e pré-carregar recursos do Navegador para facilitar a criação de ótimas experiências que não são prejudicadas pelo carregamento ineficiente de recursos.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // carrega e executa este script ansiosamente
  preload('https://.../path/to/font.woff', { as: 'font' }) // pré-carrega esta fonte
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // pré-carrega esta folha de estilo
  prefetchDNS('https://...') // quando você pode não solicitar algo deste host
  preconnect('https://...') // quando você solicitará algo, mas não tem certeza do quê
}
```
```html
<!-- os exemplos acima resultariam no DOM/HTML a seguir -->
<html>
  <head>
    <!-- links/scripts são priorizados por sua utilidade para carregamento antecipado, não por ordem de chamada -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Essas APIs podem ser usadas para otimizar o carregamento inicial da página, movendo a descoberta de recursos adicionais, como fontes, para fora do carregamento da folha de estilo. Elas também podem tornar as atualizações do cliente mais rápidas, pré-buscando uma lista de recursos usados por uma navegação antecipada e, em seguida, pré-carregando esses recursos ansiosamente no clique ou até mesmo no passar do mouse.

Para obter mais detalhes, consulte [APIs de Pré-carregamento de Recursos](/reference/react-dom#resource-preloading-apis).

### Compatibilidade com scripts e extensões de terceiros {/*compatibility-with-third-party-scripts-and-extensions*/}

Melhoramos a hidratação para levar em conta scripts de terceiros e extensões de navegador.

Ao hidratar, se um elemento que rende no cliente não corresponder ao elemento encontrado no HTML do servidor, o React forçará uma nova renderização do cliente para corrigir o conteúdo. Anteriormente, se um elemento fosse inserido por scripts de terceiros ou extensões de navegador, isso acionaria um erro de incompatibilidade e a renderização do cliente.

No React 19, as tags inesperadas no `<head>` e `<body>` serão ignoradas, evitando os erros de incompatibilidade. Se o React precisar renderizar todo o documento novamente devido a uma incompatibilidade de hidratação não relacionada, ele deixará em vigor as folhas de estilo inseridas por scripts de terceiros e extensões de navegador.

### Melhor relatório de erros {/*error-handling*/}

Melhoramos o tratamento de erros no React 19 para remover duplicações e fornecer opções para lidar com erros capturados e não capturados. Por exemplo, quando há um erro na renderização capturado por um Error Boundary, anteriormente o React lançaria o erro duas vezes (uma vez para o erro original e outra depois de falhar ao recuperar automaticamente) e, em seguida, chamaria `console.error` com informações sobre onde o erro ocorreu.

Isso resultou em três erros para cada erro capturado:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Erro não detectado: hit
{'  '}em Throws
{'  '}em renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Erro não detectado: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicado</span>
{'  '}em Throws
{'  '}em renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

O erro acima ocorreu no componente Throws:
{'  '}em Throws
{'  '}em ErrorBoundary
{'  '}em App{'\n'}
O React tentará recriar esta árvore de componentes do zero usando o limite de erro fornecido, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

No React 19, registramos um único erro com todas as informações de erro incluídas:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Erro: hit
{'  '}em Throws
{'  '}em renderWithHooks
{'  '}...{'\n'}
O erro acima ocorreu no componente Throws:
{'  '}em Throws
{'  '}em ErrorBoundary
{'  '}em App{'\n'}
O React tentará recriar esta árvore de componentes do zero usando o limite de erro fornecido, ErrorBoundary.
{'  '}em ErrorBoundary
{'  '}em App

</ConsoleLogLine>

</ConsoleBlockMulti>

Além disso, adicionamos duas novas opções raiz para complementar `onRecoverableError`:

- `onCaughtError`: chamado quando o React captura um erro em um Error Boundary.
- `onUncaughtError`: chamado quando um erro é lançado e não capturado por um Error Boundary.
- `onRecoverableError`: chamado quando um erro é lançado e recuperado automaticamente.

Para obter mais informações e exemplos, consulte a documentação de [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Suporte para Elementos Personalizados {/*support-for-custom-elements*/}

O React 19 adiciona suporte total para elementos personalizados e passa em todos os testes no [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Em versões anteriores, usar Elementos Personalizados no React era difícil porque o React tratava propriedades não reconhecidas como atributos em vez de propriedades. No React 19, adicionamos suporte para propriedades que funcionam no cliente e durante SSR com a seguinte estratégia:

- **Renderização do lado do servidor**: as propriedades passadas para um elemento personalizado serão renderizadas como atributos se seu tipo for um valor primitivo como `string`, `number` ou `true`. As propriedades com tipos não primitivos como `object`, `symbol`, `function` ou valor `false` serão omitidas.
- **Renderização do lado do cliente**: as propriedades que correspondem a uma propriedade na instância do Elemento Personalizado serão atribuídas como propriedades, caso contrário, serão atribuídas como atributos.

Agradecimentos a [Joey Arhar](https://github.com/josepharhar) por impulsionar o design e a implementação do suporte a Elementos Personalizados no React.

#### Como atualizar {/*how-to-upgrade*/}

Consulte o [Guia de Atualização do React 19](/blog/2024/04/25/react-19-upgrade-guide) para obter instruções passo a passo e uma lista completa de alterações importantes e notáveis.

_Observação: esta postagem foi originalmente publicada em 25/04/2024 e foi atualizada para 05/12/2024 com o lançamento estável._
``