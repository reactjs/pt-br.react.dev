---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 is now available on npm! In this post, we'll give an overview of the new features in React 19, and how you can adopt them.
---

05 de Dezembro de 2024 por [The React Team](/community/team)

---
<Note>

### O React 19 já está estável! {/*react-19-is-now-stable*/}

Adições desde que esta postagem foi originalmente compartilhada com o React 19 RC em abril:

- **Pré-aquecimento para árvores suspensas**: veja [Melhorias no Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **APIs estáticas do React DOM**: veja [Novas APIs estáticas do React DOM](#new-react-dom-static-apis).

_A data desta postagem foi atualizada para refletir a data de lançamento estável._

</Note>

<Intro>

O React v19 já está disponível no npm!

</Intro>

Em nosso [Guia de Atualização do React 19](/blog/2024/04/25/react-19-upgrade-guide), compartilhamos instruções passo a passo para atualizar seu aplicativo para o React 19. Nesta postagem, forneceremos uma visão geral dos novos recursos do React 19 e como você pode adotá-los.

- [O que há de novo no React 19](#whats-new-in-react-19)
- [Melhorias no React 19](#improvements-in-react-19)
- [Como atualizar](#how-to-upgrade)

Para obter uma lista de mudanças significativas, consulte o [Guia de Atualização](/blog/2024/04/25/react-19-upgrade-guide).

---

## O que há de novo no React 19 {/*whats-new-in-react-19*/}

### Ações {/*actions*/}

Um caso de uso comum em aplicativos React é realizar uma mutação de dados e, em seguida, atualizar o estado em resposta. Por exemplo, quando um usuário envia um formulário para alterar seu nome, você fará uma solicitação de API e, em seguida, lidará com a resposta. No passado, você precisaria lidar manualmente com estados pendentes, erros, atualizações otimistas e solicitações sequenciais.

Por exemplo, você pode lidar com o estado pendente e de erro em `useState`:

```js
// Antes das Ações
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

No React 19, estamos adicionando suporte para o uso de funções assíncronas em transições para lidar com estados pendentes, erros, formulários e atualizações otimistas automaticamente.

Por exemplo, você pode usar `useTransition` para lidar com o estado pendente por você:

```js
// Usando estado pendente das Ações
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

A transição assíncrona definirá imediatamente o estado `isPending` como true, fará as solicitações assíncronas e definirá `isPending` como false após quaisquer transições. Isso permite que você mantenha a interface do usuário atual responsiva e interativa enquanto os dados estão mudando.

<Note>

#### Por convenção, as funções que usam transições assíncronas são chamadas de "Ações". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

As Ações gerenciam o envio de dados automaticamente:

- **Estado pendente**: As Ações fornecem um estado pendente que começa no início de uma solicitação e redefine automaticamente quando a atualização final do estado é confirmada.
- **Atualizações otimistas**: As Ações oferecem suporte ao novo hook [`useOptimistic`](#new-hook-optimistic-updates) para que você possa mostrar aos usuários feedback instantâneo enquanto as solicitações são enviadas.
- **Tratamento de erros**: As Ações fornecem tratamento de erros para que você possa exibir Error Boundaries quando uma solicitação falhar e reverter as atualizações otimistas para seu valor original automaticamente.
- **Formulários**: Os elementos `<form>` agora oferecem suporte à passagem de funções para as propriedades `action` e `formAction`. A passagem de funções para as propriedades `action` usa Ações por padrão e redefine o formulário automaticamente após o envio.

</Note>

Com base nas Ações, o React 19 apresenta [`useOptimistic`](#new-hook-optimistic-updates) para gerenciar atualizações otimistas, e um novo hook [`React.useActionState`](#new-hook-useactionstate) para lidar com casos comuns para Ações. Em `react-dom`, estamos adicionando [`<form>` Ações](#form-actions) para gerenciar formulários automaticamente e [`useFormStatus`](#new-hook-useformstatus) para dar suporte aos casos comuns para Ações em formulários.

No React 19, o exemplo acima pode ser simplificado para:

```js
// Usando <form> Actions e useActionState
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

Na próxima seção, detalharemos cada um dos novos recursos de Ação no React 19.

### Novo hook: `useActionState` {/*new-hook-useactionstate*/}

Para facilitar os casos comuns para as Ações, adicionamos um novo hook chamado `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Você pode retornar qualquer resultado da ação.
      // Aqui, retornamos apenas o erro.
      return error;
    }

    // handle success
    return null;
  },
  null,
);
```

`useActionState` aceita uma função (a "Ação") e retorna uma Ação encapsulada para chamar. Isso funciona porque as Ações se compõem. Quando a Ação encapsulada é chamada, `useActionState` retornará o último resultado da Ação como `data` e o estado pendente da Ação como `pending`.

<Note>

`React.useActionState` foi chamado anteriormente de `ReactDOM.useFormState` nas versões Canary, mas renomeamos e descontinuamos `useFormState`.

Veja [#28491](https://github.com/facebook/react/pull/28491) para obter mais informações.

</Note>

Para obter mais informações, consulte a documentação para [`useActionState`](/reference/react/useActionState).

### React DOM: `<form>` Ações {/*form-actions*/}

As Ações também são integradas aos novos recursos do `<form>` do React 19 para `react-dom`. Adicionamos suporte para passar funções como propriedades `action` e `formAction` dos elementos `<form>`, `<input>` e `<button>` para enviar formulários automaticamente com Ações:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Quando uma Ação do `<form>` é bem-sucedida, o React redefinirá automaticamente o formulário para componentes não controlados. Se você precisar redefinir o `<form>` manualmente, poderá chamar a nova API `requestFormReset` do React DOM.

Para obter mais informações, consulte a documentação do `react-dom` para [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) e `<button>`.

### React DOM: Novo hook: `useFormStatus` {/*new-hook-useformstatus*/}

Em sistemas de design, é comum escrever componentes de design que precisam acessar informações sobre o `<form>` em que estão, sem passar as propriedades para baixo para o componente. Isso pode ser feito por meio do Context, mas para facilitar o caso comum, adicionamos um novo hook `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` lê o status do `<form>` pai como se o formulário fosse um provedor de Context.

Para obter mais informações, consulte a documentação do `react-dom` para [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Novo hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Outro padrão comum de UI ao realizar uma mutação de dados é mostrar o estado final de forma otimista enquanto a solicitação assíncrona está em andamento. No React 19, estamos adicionando um novo hook chamado `useOptimistic` para facilitar isso:

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

O hook `useOptimistic` renderizará imediatamente o `optimisticName` enquanto a solicitação `updateName` estiver em andamento. Quando a atualização terminar ou ocorrer um erro, o React mudará automaticamente de volta para o valor `currentName`.

Para obter mais informações, consulte a documentação para [`useOptimistic`](/reference/react/useOptimistic).

### Nova API: `use` {/*new-feature-use*/}

No React 19, estamos introduzindo uma nova API para ler recursos em renderização: `use`.

Por exemplo, você pode ler uma promise com `use`, e o React vai Suspend até a promise ser resolvida:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` vai suspender até a promise ser resolvida.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Quando `use` suspende em Comments,
  // este limite Suspense será exibido.
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` não oferece suporte a promises criadas em renderização. {/*use-does-not-support-promises-created-in-render*/}

Se você tentar passar uma promise criada em renderização para `use`, o React emitirá um aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Um componente foi suspenso por uma promise não armazenada em cache. Criar promises dentro de um Componente Cliente ou hook ainda não é compatível, exceto por meio de uma biblioteca ou framework compatível com Suspense.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir, você precisa passar uma promise de uma biblioteca ou framework com suporte a Suspense que oferece suporte ao cache para promises. No futuro, planejamos lançar recursos para facilitar o cache de promises em renderização.

</Note>

Você também pode ler o contexto com `use`, permitindo que você leia o Context condicionalmente, como após retornos antecipados:

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // Isso não funcionaria com useContext
  // por causa do retorno antecipado.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

A API `use` só pode ser chamada em renderização, semelhante aos hooks. Ao contrário dos hooks, `use` pode ser chamado condicionalmente. No futuro, planejamos dar suporte a mais maneiras de consumir recursos em renderização com `use`.

Para obter mais informações, consulte a documentação para [`use`](/reference/react/use).

## Novas APIs estáticas do React DOM {/*new-react-dom-static-apis*/}

Adicionamos duas novas APIs ao `react-dom/static` para geração de site estático:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Essas novas APIs melhoram o `renderToString` aguardando o carregamento dos dados para a geração de HTML estático. Elas são projetadas para funcionar com ambientes de streaming, como Node.js Streams e Web Streams. Por exemplo, em um ambiente de Web Stream, você pode pré- renderizar uma árvore React para HTML estático com `prerender`:

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

As APIs Prerender aguardarão o carregamento de todos os dados antes de retornar o fluxo de HTML estático. Os fluxos podem ser convertidos em strings ou enviados com uma resposta de streaming. Elas não oferecem suporte ao conteúdo de streaming conforme ele carrega, o qual é compatível com as [APIs de renderização do servidor do React DOM](/reference/react-dom/server) existentes.

Para obter mais informações, consulte [APIs estáticas do React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Componentes do Servidor {/*server-components*/}

Os Componentes do Servidor são uma nova opção que permite renderizar componentes com antecedência, antes do bundling, em um ambiente separado do seu aplicativo cliente ou servidor SSR. Esse ambiente separado é o "servidor" nos Componentes do Servidor React. Os Componentes do Servidor podem ser executados uma vez no momento da compilação no seu servidor CI ou podem ser executados para cada solicitação usando um servidor web.

O React 19 inclui todos os recursos dos Componentes do Servidor React incluídos do canal Canary. Isso significa que as bibliotecas que são enviadas com Componentes do Servidor agora podem ter como destino o React 19 como uma dependência peer com uma [condição de exportação](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server` para uso em frameworks que oferecem suporte à [Arquitetura Full-stack React](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision) da equipe React.

<Note>

#### Como crio suporte para Componentes do Servidor? {/*how-do-i-build-support-for-server-components*/}

Embora os Componentes do Servidor React no React 19 sejam estáveis e não quebrem entre as versões secundárias, as APIs subjacentes usadas para implementar um bundler ou framework de Componentes do Servidor React não seguem semver e podem quebrar entre os secundários no React 19.x.

Para oferecer suporte aos Componentes do Servidor React como um bundler ou framework, recomendamos fixar em uma versão específica do React ou usar a versão Canary. Continuaremos trabalhando com bundlers e frameworks para estabilizar as APIs usadas para implementar os Componentes do Servidor React no futuro.

</Note>

Para obter mais informações, consulte a documentação para [Componentes do Servidor React](/reference/rsc/server-components).

### Ações do Servidor {/*server-actions*/}

As Ações do Servidor permitem que os Componentes Cliente chamem funções assíncronas executadas no servidor.

Quando uma Ação do Servidor é definida com a diretiva `"use server"`, seu framework criará automaticamente uma referência à função do servidor e passará essa referência para o Componente Cliente. Quando essa função é chamada no cliente, o React enviará uma solicitação ao servidor para executar a função e retornar o resultado.

<Note>

#### Não existe uma diretiva para Componentes do Servidor. {/*there-is-no-directive-for-server-components*/}

Um mal-entendido comum é que os Componentes do Servidor são denotados por `"use server"`, mas não existe uma diretiva para Componentes do Servidor. A diretiva `"use server"` é usada para Ações do Servidor.

Para obter mais informações, consulte a documentação para [Diretivas](/reference/rsc/directives).

</Note>

As Ações do Servidor podem ser criadas em Componentes do Servidor e passadas como props para Componentes Cliente ou podem ser importadas e usadas em Componentes Cliente.

Para obter mais informações, consulte a documentação para [Ações do Servidor React](/reference/rsc/server-actions).

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

Também melhoramos a geração de relatórios de erro para erros de hidratação em `react-dom`. Por exemplo, em vez de registrar vários erros em DEV sem nenhuma informação sobre a incompatibilidade:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Aviso: O conteúdo do texto não correspondeu. Servidor: "Servidor" Cliente: "Cliente"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Aviso: Ocorreu um erro durante a hidratação. O HTML do servidor foi substituído pelo conteúdo do cliente em \<div\>.```html
<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Agora, nós exibimos uma única mensagem com uma diferença da incompatibilidade:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
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

Novos provedores de Context podem usar `<Context>` e nós publicaremos um codemod para converter provedores existentes. Em versões futuras, nós depreciararemos `<Context.Provider>`.

### Funções de limpeza para refs {/*cleanup-functions-for-refs*/}

Agora nós suportamos retornar uma função de limpeza de retornos de chamada de `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref criado

    // NOVO: retornar uma função de limpeza para reiniciar
    // a ref quando o elemento for removido do DOM.
    return () => {
      // limpeza da ref
    };
  }}
/>
```

Quando o componente desmontar, o React chamará a função de limpeza retornada dos retornos de chamada `ref`. Isso funciona para refs do DOM, refs para componentes de classe e `useImperativeHandle`.

<Note>

Anteriormente, o React chamava funções `ref` com `null` ao desmontar o componente. Se sua `ref` retornar uma função de limpeza, o React agora pulará esta etapa.

Em versões futuras, nós depreciararemos chamar refs com `null` ao desmontar componentes.

</Note>

Devido a introdução de funções de limpeza de ref, retornar algo diferente de um retorno de chamada `ref` agora será rejeitado pelo TypeScript. A correção geralmente é parar de usar retornos implícitos, por exemplo:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornou a instância do `HTMLDivElement` e o TypeScript não saberia se isso era _suposto_ ser uma função de limpeza ou se você não queria retornar uma função de limpeza.

Você pode fazer o codemod deste padrão com [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### valor inicial `useDeferredValue` {/*use-deferred-value-initial-value*/}

Nós adicionamos uma opção `initialValue` para `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // No render inicial, o valor é ''.
  // Então uma re-renderização é agendada com o deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
```

Quando <CodeStep step={2}>initialValue</CodeStep> é fornecido, `useDeferredValue` o retornará como `value` para a renderização inicial do componente e agenda uma re-renderização em segundo plano com o <CodeStep step={1}>deferredValue</CodeStep> retornado.

Para mais informações, veja [`useDeferredValue`](/reference/react/useDeferredValue).

### Suporte para metadados do Documento {/*support-for-metadata-tags*/}

Em HTML, as tags de metadados do documento, como `<title>`, `<link>` e `<meta>`, são reservadas para serem colocadas na seção `<head>` do documento. No React, o componente que decide quais metadados são apropriados para o aplicativo pode estar muito distante do local onde você renderiza o `<head>` ou o React não renderiza o `<head>` de forma alguma. No passado, esses elementos precisavam ser inseridos manualmente em um efeito ou por bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet) e exigiam tratamento cuidadoso ao renderizar um aplicativo React no servidor.

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
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

Quando o React renderizar este componente, ele verá às tags `<title>`  `<link>` e `<meta>`, e  automaticamente as elevará para a seção `<head>` do documento. Ao compatibilizar essas tags de metadados nativamente, somos capazes de garantir que elas funcionem com aplicativos somente cliente, SSR de streaming e Componentes de Servidor.

<Note>

#### Você talvez ainda precise de uma biblioteca de metadados {/*you-may-still-want-a-metadata-library*/}

Para casos de uso simples, renderizar metadados do documento como tags pode ser adequado, mas as bibliotecas podem oferecer recursos mais poderosos, como substituir metadados genéricos por metadados específicos com base na rota atual. Esses recursos tornam mais fácil para frameworks e bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet) suportarem as tags de metadados, em vez de substituí-las.

</Note>

Para mais informações, veja os docs para [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), e [`<meta>`](/reference/react-dom/components/meta).

### Suporte para folhas de estilo {/*support-for-stylesheets*/}

Folhas de estilo, tanto as vinculadas externamente (`<link rel="stylesheet" href="...">`) quanto as embutidas (`<style>...</style>`), exigem um posicionamento cuidadoso no DOM devido às regras de precedência de estilo. Construir um recurso de folha de estilo que permita a capacidade de composição dentro de componentes é difícil, portanto, os usuários geralmente acabam carregando todos os seus estilos longe dos componentes que podem depender deles, ou usam uma biblioteca de estilo que encapsula essa complexidade.

No React 19, estamos resolvendo essa complexidade e fornecendo uma integração ainda mais profunda na Renderização Concorrente no Cliente e na Renderização de Streaming no Servidor com suporte integrado para folhas de estilo. Se você informar ao React a `precedência` da sua folha de estilo, ele gerenciará a ordem de inserção da folha de estilo no DOM e garantirá que a folha de estilo (se externa) seja carregada antes de revelar o conteúdo que depende dessas regras de estilo.

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
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```

Durante a Renderização no Servidor, o React incluirá a folha de estilo no `<head>`, o que garante que o navegador não pintará até que a tenha carregado. Se a folha de estilo for descoberta tardiamente depois que já começamos a fazer streaming, o React garantirá que a folha de estilo seja inserida no `<head>` no cliente antes de revelar o conteúdo de uma limite de Suspense que depende dessa folha de estilo.

Durante a Renderização no Cliente, o React esperará que as folhas de estilo recém-renderizadas carreguem antes de confirmar a renderização. Se você renderizar este componente de vários lugares dentro de seu aplicativo, o React incluirá a folha de estilo apenas uma vez no documento:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // won't lead to a duplicate stylesheet link in the DOM
  </>
}
```

Para usuários acostumados a carregar folhas de estilo manualmente, esta é uma oportunidade de localizar essas folhas de estilo junto aos componentes que dependem delas, permitindo uma melhor raciocínio local e uma maneira mais fácil de garantir que você carregue apenas as folhas de estilo das quais realmente depende.

Bibliotecas de estilo e integrações de estilo com empacotadores também podem adotar essa nova capacidade, portanto, mesmo que você não renderize diretamente suas próprias folhas de estilo, ainda poderá se beneficiar à medida que suas ferramentas forem atualizadas para usar esse recurso.

Para obter mais detalhes, leia os documentos para [`<link>`](/reference/react-dom/components/link) e [`<style>`](/reference/react-dom/components/style).

### Suporte para scripts assíncronos {/*support-for-async-scripts*/}

Em HTML, scripts normais (`<script src="...">`) e scripts adiados (`<script defer="" src="...">`) carregam na ordem do documento, o que torna a renderização desse tipo de script profundamente em sua árvore de componentes um desafio. Scripts assíncronos (`<script async="" src="...">`), no entanto, carregarão em ordem arbitrária.

No React 19, incluímos melhor suporte para scripts assíncronos, permitindo que você os renderize em qualquer lugar em sua árvore de componentes, dentro dos componentes que realmente dependem do script, sem ter que gerenciar a realocação e a desduplicação de instâncias de script.

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
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

Em todos os ambientes de renderização, os scripts assíncronos serão desduplicados para que o React carregue e execute o script apenas uma vez, mesmo que ele seja renderizado por vários componentes diferentes.

Na Renderização no Servidor, os scripts assíncronos serão incluídos no `<head>` e priorizados em relação a recursos mais críticos que bloqueiam a pintura, como folhas de estilo, fontes e pré-carregamentos de imagem.

Para mais detalhes, leia os docs para [`<script>`](/reference/react-dom/components/script).

### Suporte para pré-carregamento de recursos {/*support-for-preloading-resources*/}

Durante o carregamento inicial do documento e nas atualizações do lado do cliente, informar ao navegador sobre recursos que ele provavelmente precisará carregar o mais cedo possível pode ter um efeito dramático no desempenho da página.

O React 19 inclui vários novos APIs para carregar e pré-carregar recursos do navegador para tornar o mais fácil possível construir ótimas experiências que não sejam impedidas pelo carregamento ineficiente de recursos.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
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

Essas APIs podem ser usadas para otimizar os carregamentos iniciais da página, movendo a descoberta de recursos adicionais, como fontes, fora do carregamento da folha de estilo. Elas também podem tornar as atualizações do cliente mais rápidas, pré-buscando uma lista de recursos usados por uma navegação antecipada e, em seguida, pré-carregando esses recursos ansiosamente, no clique ou mesmo no passe o mouse.

Para obter mais detalhes, consulte [APIs de pré-carregamento de recursos](/reference/react-dom#resource-preloading-apis).

### Compatibilidade com scripts e extensões de terceiros {/*compatibility-with-third-party-scripts-and-extensions*/}

Nós melhoramos a hidratação para levar em conta scripts de terceiros e extensões de navegador.

Ao hidratar, se um elemento que renderiza no cliente não corresponder ao elemento encontrado no HTML do servidor, o React forçará uma nova renderização do cliente para corrigir o conteúdo. Anteriormente, se um elemento fosse inserido por scripts de terceiros ou extensões de navegador, isso acionaria um erro de incompatibilidade e uma renderização do cliente.

No React 19, tags inesperadas no `<head>` e `<body>` serão ignoradas, evitando os erros de incompatibilidade. Se o React precisar re-renderizar todo o documento devido a uma incompatibilidade de hidratação não relacionada, ele deixará no lugar as folhas de estilo inseridas por scripts de terceiros e extensões de navegador.

### Melhor relatório de erros {/*error-handling*/}

Nós melhoramos o tratamento de erros no React 19 para remover a duplicação e fornecer opções para lidar com erros capturados e não capturados. Por exemplo, quando há um erro na renderização capturado por um Error Boundary, anteriormente o React lançaria o erro duas vezes (uma vez para o erro original, depois novamente após falhar em se recuperar automaticamente) e, em seguida, chamaria `console.error` com informações sobre onde o erro ocorreu.

Isso resultou em três erros para cada erro capturado:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

No React 19, nós exibimos um único erro com todas as informações de erro incluídas:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Além disso, nós adicionamos duas novas opções de raiz para complementar `onRecoverableError`:

- `onCaughtError`: chamado quando o React captura um erro em um Error Boundary.
- `onUncaughtError`: chamado quando um erro é lançado e não é capturado por um Error Boundary.
- `onRecoverableError`: chamado quando um erro é lançado e recuperado automaticamente.

Para mais informações e exemplos, veja os docs para [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Support for Custom Elements {/*support-for-custom-elements*/}

O React 19 adiciona suporte total para Custom Elements e passa em todos os testes em [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Em versões anteriores, usar Custom Elements no React tem sido difícil porque o React tratava props não reconhecidas como atributos em vez de propriedades. No React 19, nós adicionamos suporte para propriedades que funciona no cliente e durante o SSR com a seguinte estratégia:

- **Renderização no Servidor**: props passadas para um elemento personalizado serão renderizadas como atributos se seu tipo for um valor primitivo como `string`, `number` ou o valor for `true`. Props com tipos não primitivos como `object`, `symbol`, `function` ou valor `false` serão omitidas.
- **Renderização no Cliente**: props que correspondem a uma propriedade na instância do Custom Element serão atribuídas como propriedades, caso contrário, elas serão atribuídas como atributos.

Obrigado a [Joey Arhar](https://github.com/josepharhar) por liderar o projeto e a implementação do suporte a Custom Element no React.

#### Como atualizar {/*how-to-upgrade*/}

Veja o [Guia de Atualização do React 19](/blog/2024/04/25/react-19-upgrade-guide) para obter instruções passo a passo e uma lista completa de alterações importantes e notáveis.

_Observação: este post foi publicado originalmente em 25/04/2024 e foi atualizado para 05/12/2024 com o lançamento estável._
