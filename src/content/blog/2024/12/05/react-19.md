---
title: "React v19"
author: The React Team
date: 2024/12/05
description: O React 19 já está disponível no npm! Nesta publicação, vamos dar uma visão geral dos novos recursos do React 19 e de como você pode adotá-los.
---

5 de dezembro de 2024 por [A Equipe do React](/community/team)

---
<Note>

### O React 19 agora é estável! {/*react-19-is-now-stable*/}

Adições desde que esta publicação foi compartilhada originalmente com o React 19 RC, em abril:

- **Pré-aquecimento para árvores suspensas**: veja [Melhorias no Suspense](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense).
- **APIs estáticas do React DOM**: veja [Novas APIs estáticas do React DOM](#new-react-dom-static-apis).

_A data desta publicação foi atualizada para refletir a data do lançamento estável._

</Note>

<Intro>

O React v19 já está disponível no npm!

</Intro>

No nosso [Guia de Atualização para o React 19](/blog/2024/04/25/react-19-upgrade-guide), compartilhamos instruções passo a passo para atualizar o seu app para o React 19. Nesta publicação, vamos dar uma visão geral dos novos recursos do React 19 e de como você pode adotá-los.

- [O que há de novo no React 19](#whats-new-in-react-19)
- [Melhorias no React 19](#improvements-in-react-19)
- [Como atualizar](#how-to-upgrade)

Para ver a lista de mudanças incompatíveis, consulte o [Guia de Atualização](/blog/2024/04/25/react-19-upgrade-guide).

---

## O que há de novo no React 19 {/*whats-new-in-react-19*/}

### Ações {/*actions*/}

Um caso de uso comum em apps React é fazer uma mutação de dados e então atualizar o estado em resposta. Por exemplo, quando um usuário envia um formulário para mudar o nome, você faz uma requisição à API e depois trata a resposta. Antes, você precisava lidar manualmente com estados pendentes, erros, atualizações otimistas e requisições sequenciais.

Por exemplo, você poderia lidar com o estado pendente e de erro com `useState`:

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

No React 19, estamos adicionando suporte ao uso de funções assíncronas em transições para lidar automaticamente com estados pendentes, erros, formulários e atualizações otimistas.

Por exemplo, você pode usar `useTransition` para lidar com o estado pendente por você:

```js
// Usando o estado pendente das Ações
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

A transição assíncrona vai definir imediatamente o estado `isPending` como true, fazer a(s) requisição(ões) assíncrona(s) e mudar `isPending` para false depois de quaisquer transições. Isso permite manter a UI atual responsiva e interativa enquanto os dados estão mudando.

<Note>

#### Por convenção, funções que usam transições assíncronas são chamadas de "Ações". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

As Ações gerenciam automaticamente o envio de dados para você:

- **Estado pendente**: as Ações fornecem um estado pendente que começa no início de uma requisição e é redefinido automaticamente quando a atualização final do estado é confirmada (commit).
- **Atualizações otimistas**: as Ações suportam o novo Hook [`useOptimistic`](#new-hook-optimistic-updates), para que você possa mostrar um feedback instantâneo aos usuários enquanto as requisições estão sendo enviadas.
- **Tratamento de erros**: as Ações fornecem tratamento de erros para que você possa exibir Error Boundaries quando uma requisição falha e reverter automaticamente as atualizações otimistas para o valor original.
- **Formulários**: elementos `<form>` agora suportam passar funções para as props `action` e `formAction`. Passar funções para as props `action` usa Ações por padrão e redefine o formulário automaticamente após o envio.

</Note>

Com base nas Ações, o React 19 introduz o [`useOptimistic`](#new-hook-optimistic-updates) para gerenciar atualizações otimistas e um novo Hook, o [`React.useActionState`](#new-hook-useactionstate), para lidar com casos comuns de Ações. No `react-dom`, estamos adicionando as [Ações de `<form>`](#form-actions) para gerenciar formulários automaticamente e o [`useFormStatus`](#new-hook-useformstatus) para dar suporte aos casos comuns de Ações em formulários.

No React 19, o exemplo acima pode ser simplificado para:

```js
// Usando Ações de <form> e useActionState
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

Na próxima seção, vamos detalhar cada um dos novos recursos de Ações do React 19.

### Novo Hook: `useActionState` {/*new-hook-useactionstate*/}

Para facilitar os casos comuns de Ações, adicionamos um novo Hook chamado `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Você pode retornar qualquer resultado da ação.
      // Aqui, retornamos apenas o erro.
      return error;
    }

    // tratar o sucesso
    return null;
  },
  null,
);
```

`useActionState` aceita uma função (a "Ação") e retorna uma Ação encapsulada para ser chamada. Isso funciona porque as Ações são componíveis. Quando a Ação encapsulada é chamada, `useActionState` retorna o último resultado da Ação como `data` e o estado pendente da Ação como `pending`.

<Note>

`React.useActionState` se chamava `ReactDOM.useFormState` nas versões Canary, mas nós o renomeamos e descontinuamos `useFormState`.

Veja [#28491](https://github.com/facebook/react/pull/28491) para mais informações.

</Note>

Para mais informações, veja a documentação de [`useActionState`](/reference/react/useActionState).

### React DOM: Ações de `<form>` {/*form-actions*/}

As Ações também estão integradas aos novos recursos de `<form>` do React 19 para o `react-dom`. Adicionamos suporte para passar funções como as props `action` e `formAction` de elementos `<form>`, `<input>` e `<button>`, para enviar formulários automaticamente com Ações:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Quando uma Ação de `<form>` é bem-sucedida, o React redefine automaticamente o formulário para componentes não controlados. Se você precisar redefinir o `<form>` manualmente, pode chamar a nova API `requestFormReset` do React DOM.

Para mais informações, veja a documentação do `react-dom` para [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) e `<button>`.

### React DOM: Novo Hook: `useFormStatus` {/*new-hook-useformstatus*/}

Em design systems, é comum escrever componentes de design que precisam acessar informações sobre o `<form>` em que estão, sem precisar passar props até o componente. Isso pode ser feito via Context, mas, para facilitar o caso comum, adicionamos um novo Hook, o `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` lê o status do `<form>` pai como se o formulário fosse um provider de Context.

Para mais informações, veja a documentação do `react-dom` para [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Novo Hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Outro padrão de UI comum ao fazer uma mutação de dados é mostrar o estado final de forma otimista enquanto a requisição assíncrona está em andamento. No React 19, estamos adicionando um novo Hook chamado `useOptimistic` para facilitar isso:

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

O Hook `useOptimistic` vai renderizar imediatamente o `optimisticName` enquanto a requisição `updateName` está em andamento. Quando a atualização termina ou dá erro, o React volta automaticamente para o valor de `currentName`.

Para mais informações, veja a documentação de [`useOptimistic`](/reference/react/useOptimistic).

### Nova API: `use` {/*new-feature-use*/}

No React 19, estamos introduzindo uma nova API para ler recursos durante a renderização: `use`.

Por exemplo, você pode ler uma promise com `use`, e o React vai suspender até que a promise seja resolvida:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` vai suspender até que a promise seja resolvida.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Quando `use` suspender em Comments,
  // este limite de Suspense será exibido.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` não suporta promises criadas durante a renderização. {/*use-does-not-support-promises-created-in-render*/}

Se você tentar passar para `use` uma promise criada durante a renderização, o React vai emitir um aviso:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir, você precisa passar uma promise de uma biblioteca ou framework com suporte a Suspense que faça cache de promises. No futuro, planejamos lançar recursos que facilitem o cache de promises durante a renderização.

</Note>

Você também pode ler o contexto com `use`, o que permite ler o Context condicionalmente, por exemplo depois de retornos antecipados:

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

A API `use` só pode ser chamada durante a renderização, de forma parecida com os Hooks. Diferente dos Hooks, `use` pode ser chamada condicionalmente. No futuro, planejamos suportar mais formas de consumir recursos durante a renderização com `use`.

Para mais informações, veja a documentação de [`use`](/reference/react/use).

## Novas APIs estáticas do React DOM {/*new-react-dom-static-apis*/}

Adicionamos duas novas APIs ao `react-dom/static` para geração de sites estáticos:
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

Essas novas APIs melhoram o `renderToString` ao esperar que os dados sejam carregados para gerar o HTML estático. Elas foram projetadas para funcionar com ambientes de streaming, como Node.js Streams e Web Streams. Por exemplo, em um ambiente de Web Streams, você pode pré-renderizar uma árvore React para HTML estático com `prerender`:

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

As APIs de pré-renderização esperam que todos os dados sejam carregados antes de retornar o stream de HTML estático. Os streams podem ser convertidos em strings ou enviados como uma resposta em streaming. Elas não suportam streaming do conteúdo à medida que ele carrega, algo que é suportado pelas [APIs de renderização no servidor do React DOM](/reference/react-dom/server) já existentes.

Para mais informações, veja [APIs estáticas do React DOM](/reference/react-dom/static).

## React Server Components {/*react-server-components*/}

### Server Components {/*server-components*/}

Server Components são uma nova opção que permite renderizar componentes antecipadamente, antes do bundling, em um ambiente separado da sua aplicação cliente ou do seu servidor de SSR. Esse ambiente separado é o "servidor" em React Server Components. Server Components podem ser executados uma vez, em tempo de build, no seu servidor de CI, ou a cada requisição, usando um servidor web.

O React 19 inclui todos os recursos de React Server Components que vieram do canal Canary. Isso significa que bibliotecas que trazem Server Components agora podem ter o React 19 como peer dependency, com uma [condição de export](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) `react-server`, para uso em frameworks que suportam a [Arquitetura Full-stack do React](/learn/creating-a-react-app#which-features-make-up-the-react-teams-full-stack-architecture-vision).


<Note>

#### Como dar suporte a Server Components? {/*how-do-i-build-support-for-server-components*/}

Embora os React Server Components no React 19 sejam estáveis e não vão quebrar entre versões minor, as APIs subjacentes usadas para implementar um bundler ou framework de React Server Components não seguem o semver e podem quebrar entre versões minor do React 19.x.

Para dar suporte a React Server Components como bundler ou framework, recomendamos fixar uma versão específica do React ou usar a versão Canary. Vamos continuar trabalhando com bundlers e frameworks para estabilizar no futuro as APIs usadas para implementar React Server Components.

</Note>


Para mais informações, veja a documentação de [React Server Components](/reference/rsc/server-components).

### Server Actions {/*server-actions*/}

Server Actions permitem que Client Components chamem funções assíncronas executadas no servidor.

Quando uma Server Action é definida com a diretiva `"use server"`, o seu framework cria automaticamente uma referência para a função de servidor e passa essa referência para o Client Component. Quando essa função é chamada no cliente, o React envia uma requisição ao servidor para executar a função e retorna o resultado.

<Note>

#### Não existe diretiva para Server Components. {/*there-is-no-directive-for-server-components*/}

Um equívoco comum é achar que Server Components são marcados com `"use server"`, mas não existe diretiva para Server Components. A diretiva `"use server"` é usada para Server Actions.

Para mais informações, veja a documentação de [Diretivas](/reference/rsc/directives).

</Note>

Server Actions podem ser criadas em Server Components e passadas como props para Client Components, ou podem ser importadas e usadas em Client Components.

Para mais informações, veja a documentação de [React Server Actions](/reference/rsc/server-actions).

## Melhorias no React 19 {/*improvements-in-react-19*/}

### `ref` como prop {/*ref-as-a-prop*/}

A partir do React 19, você pode acessar `ref` como uma prop em componentes de função:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Novos componentes de função não vão mais precisar de `forwardRef`, e vamos publicar um codemod para atualizar automaticamente os seus componentes para usar a nova prop `ref`. Em versões futuras, vamos descontinuar e remover o `forwardRef`.

<Note>

`ref`s passadas para classes não são passadas como props, porque referenciam a instância do componente.

</Note>

### Diffs para erros de hidratação {/*diffs-for-hydration-errors*/}

Também melhoramos o relato de erros de hidratação no `react-dom`. Por exemplo, em vez de registrar vários erros em DEV sem nenhuma informação sobre a divergência:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

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

Agora registramos uma única mensagem com um diff da divergência:


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

### `<Context>` como provider {/*context-as-a-provider*/}

No React 19, você pode renderizar `<Context>` como provider em vez de `<Context.Provider>`:


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

Novos providers de Context podem usar `<Context>`, e vamos publicar um codemod para converter os providers existentes. Em versões futuras, vamos descontinuar o `<Context.Provider>`.

### Funções de limpeza para refs {/*cleanup-functions-for-refs*/}

Agora suportamos retornar uma função de limpeza a partir de callbacks de `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref criada

    // NOVO: retorne uma função de limpeza para redefinir
    // a ref quando o elemento for removido do DOM.
    return () => {
      // limpeza da ref
    };
  }}
/>
```

Quando o componente desmonta, o React chama a função de limpeza retornada pelo callback de `ref`. Isso funciona para refs de DOM, refs para componentes de classe e `useImperativeHandle`.

<Note>

Antes, o React chamava as funções de `ref` com `null` ao desmontar o componente. Se a sua `ref` retornar uma função de limpeza, o React agora vai pular essa etapa.

Em versões futuras, vamos descontinuar a chamada de refs com `null` ao desmontar componentes.

</Note>

Com a introdução das funções de limpeza de refs, retornar qualquer outra coisa de um callback de `ref` agora vai ser rejeitado pelo TypeScript. A correção normalmente é parar de usar retornos implícitos, por exemplo:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornava a instância do `HTMLDivElement`, e o TypeScript não saberia se aquilo _deveria_ ser uma função de limpeza ou se você não queria retornar uma função de limpeza.

Você pode aplicar um codemod a esse padrão com [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### Valor inicial do `useDeferredValue` {/*use-deferred-value-initial-value*/}

Adicionamos uma opção `initialValue` ao `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // Na renderização inicial, o valor é ''.
  // Depois, uma nova renderização é agendada com o deferredValue.
  const value = useDeferredValue(deferredValue, '');

  return (
    <Results query={value} />
  );
}
````

Quando <CodeStep step={2}>initialValue</CodeStep> é fornecido, `useDeferredValue` o retorna como `value` na renderização inicial do componente e agenda uma nova renderização em segundo plano com o <CodeStep step={1}>deferredValue</CodeStep> retornado.

Para mais informações, veja [`useDeferredValue`](/reference/react/useDeferredValue).

### Suporte a metadados do documento {/*support-for-metadata-tags*/}

No HTML, tags de metadados do documento como `<title>`, `<link>` e `<meta>` são reservadas para a seção `<head>` do documento. No React, o componente que decide quais metadados são apropriados para o app pode estar muito longe do lugar onde você renderiza o `<head>`, ou o React pode nem renderizar o `<head>`. Antes, esses elementos precisavam ser inseridos manualmente em um Effect, ou por bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet), e exigiam um cuidado especial ao renderizar uma aplicação React no servidor.

No React 19, estamos adicionando suporte nativo para renderizar tags de metadados do documento em componentes:

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

Quando o React renderiza este componente, ele vê as tags `<title>`, `<link>` e `<meta>` e as move automaticamente para a seção `<head>` do documento. Com o suporte nativo a essas tags de metadados, conseguimos garantir que elas funcionem com apps apenas no cliente, SSR com streaming e Server Components.

<Note>

#### Você ainda pode querer uma biblioteca de metadados {/*you-may-still-want-a-metadata-library*/}

Para casos de uso simples, renderizar os metadados do documento como tags pode ser suficiente, mas bibliotecas podem oferecer recursos mais poderosos, como sobrescrever metadados genéricos com metadados específicos com base na rota atual. Esses recursos facilitam que frameworks e bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet) deem suporte a tags de metadados, em vez de substituí-las.

</Note>

Para mais informações, veja a documentação de [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) e [`<meta>`](/reference/react-dom/components/meta).

### Suporte a folhas de estilo {/*support-for-stylesheets*/}

Folhas de estilo, tanto as vinculadas externamente (`<link rel="stylesheet" href="...">`) quanto as inline (`<style>...</style>`), exigem um posicionamento cuidadoso no DOM por causa das regras de precedência de estilo. Criar um recurso de folhas de estilo que permita composição dentro de componentes é difícil, então os usuários muitas vezes acabam carregando todos os estilos longe dos componentes que dependem deles, ou usam uma biblioteca de estilos que encapsula essa complexidade.

No React 19, estamos lidando com essa complexidade e oferecendo uma integração ainda mais profunda com a Renderização Concorrente no cliente e a Renderização em Streaming no servidor, com suporte embutido a folhas de estilo. Se você informar ao React a `precedence` da sua folha de estilo, ele vai gerenciar a ordem de inserção da folha de estilo no DOM e garantir que a folha de estilo (se externa) seja carregada antes de revelar o conteúdo que depende dessas regras de estilo.

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

Durante a renderização do lado do servidor, o React inclui a folha de estilo no `<head>`, o que garante que o navegador não vai pintar a tela até que ela tenha carregado. Se a folha de estilo for descoberta tarde, depois que já começamos o streaming, o React garante que a folha de estilo seja inserida no `<head>` no cliente antes de revelar o conteúdo de um limite de Suspense que depende dela.

Durante a renderização do lado do cliente, o React espera as folhas de estilo recém-renderizadas carregarem antes de confirmar (commit) a renderização. Se você renderizar este componente em vários lugares da sua aplicação, o React vai incluir a folha de estilo apenas uma vez no documento:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // não vai gerar um link de folha de estilo duplicado no DOM
  </>
}
```

Para quem está acostumado a carregar folhas de estilo manualmente, esta é uma oportunidade de colocar essas folhas de estilo junto dos componentes que dependem delas, o que facilita raciocinar localmente sobre o código e garantir que você carregue apenas as folhas de estilo de que realmente depende.

Bibliotecas de estilo e integrações de estilo com bundlers também podem adotar esse novo recurso, então, mesmo que você não renderize diretamente as suas próprias folhas de estilo, ainda pode se beneficiar quando as suas ferramentas forem atualizadas para usá-lo.

Para mais detalhes, leia a documentação de [`<link>`](/reference/react-dom/components/link) e [`<style>`](/reference/react-dom/components/style).

### Suporte a scripts assíncronos {/*support-for-async-scripts*/}

No HTML, scripts normais (`<script src="...">`) e scripts adiados (`<script defer="" src="...">`) são carregados na ordem do documento, o que torna difícil renderizar esses tipos de script no fundo da árvore de componentes. Já os scripts assíncronos (`<script async="" src="...">`) são carregados em ordem arbitrária.

No React 19, incluímos um suporte melhor a scripts assíncronos, permitindo que você os renderize em qualquer lugar da árvore de componentes, dentro dos componentes que de fato dependem do script, sem precisar gerenciar a realocação e a deduplicação das instâncias de script.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // não vai gerar um script duplicado no DOM
    </body>
  </html>
}
```

Em todos os ambientes de renderização, scripts assíncronos são deduplicados, de modo que o React carrega e executa o script apenas uma vez, mesmo que ele seja renderizado por vários componentes diferentes.

Na renderização do lado do servidor, scripts assíncronos são incluídos no `<head>` e priorizados depois de recursos mais críticos que bloqueiam a pintura, como folhas de estilo, fontes e pré-carregamento de imagens.

Para mais detalhes, leia a documentação de [`<script>`](/reference/react-dom/components/script).

### Suporte ao pré-carregamento de recursos {/*support-for-preloading-resources*/}

Durante o carregamento inicial do documento e nas atualizações do lado do cliente, informar ao navegador o quanto antes sobre os recursos que ele provavelmente vai precisar carregar pode ter um efeito enorme no desempenho da página.

O React 19 inclui várias APIs novas para carregar e pré-carregar recursos do navegador, para facilitar ao máximo a criação de ótimas experiências que não sejam prejudicadas por um carregamento de recursos ineficiente.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // carrega e executa este script antecipadamente
  preload('https://.../path/to/font.woff', { as: 'font' }) // pré-carrega esta fonte
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // pré-carrega esta folha de estilo
  prefetchDNS('https://...') // quando talvez você nem faça nenhuma requisição a este host
  preconnect('https://...') // quando você vai fazer uma requisição, mas não sabe exatamente qual
}
```
```html
<!-- o código acima resultaria no seguinte DOM/HTML -->
<html>
  <head>
    <!-- links/scripts são priorizados pela utilidade para o carregamento antecipado, não pela ordem das chamadas -->
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

Essas APIs podem ser usadas para otimizar o carregamento inicial das páginas, tirando a descoberta de recursos adicionais, como fontes, do carregamento das folhas de estilo. Elas também podem tornar as atualizações no cliente mais rápidas, fazendo o prefetch de uma lista de recursos usados por uma navegação prevista e então pré-carregando esses recursos antecipadamente ao clicar ou até ao passar o mouse.

Para mais detalhes, veja [APIs de pré-carregamento de recursos](/reference/react-dom#resource-preloading-apis).

### Compatibilidade com scripts e extensões de terceiros {/*compatibility-with-third-party-scripts-and-extensions*/}

Melhoramos a hidratação para levar em conta scripts de terceiros e extensões do navegador.

Durante a hidratação, se um elemento renderizado no cliente não corresponder ao elemento encontrado no HTML vindo do servidor, o React força uma nova renderização no cliente para corrigir o conteúdo. Antes, se um elemento fosse inserido por scripts de terceiros ou extensões do navegador, isso disparava um erro de divergência e a renderização no cliente.

No React 19, tags inesperadas no `<head>` e no `<body>` são ignoradas, evitando os erros de divergência. Se o React precisar renderizar novamente o documento inteiro por causa de uma divergência de hidratação não relacionada, ele vai manter as folhas de estilo inseridas por scripts de terceiros e extensões do navegador.

### Relato de erros melhorado {/*error-handling*/}

Melhoramos o tratamento de erros no React 19 para remover duplicações e oferecer opções para tratar erros capturados e não capturados. Por exemplo, quando há um erro na renderização capturado por um Error Boundary, antes o React lançava o erro duas vezes (uma para o erro original e outra depois de falhar ao tentar se recuperar automaticamente) e então chamava `console.error` com informações sobre onde o erro ocorreu.

Isso resultava em três erros para cada erro capturado:

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

No React 19, registramos um único erro com todas as informações incluídas:

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

Além disso, adicionamos duas novas opções de raiz para complementar o `onRecoverableError`:

- `onCaughtError`: chamada quando o React captura um erro em um Error Boundary.
- `onUncaughtError`: chamada quando um erro é lançado e não é capturado por um Error Boundary.
- `onRecoverableError`: chamada quando um erro é lançado e recuperado automaticamente.

Para mais informações e exemplos, veja a documentação de [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Suporte a Custom Elements {/*support-for-custom-elements*/}

O React 19 adiciona suporte completo a custom elements e passa em todos os testes do [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Em versões anteriores, usar Custom Elements no React era difícil, porque o React tratava props não reconhecidas como atributos, e não como propriedades. No React 19, adicionamos suporte a propriedades que funciona no cliente e durante o SSR, com a seguinte estratégia:

- **Renderização do lado do servidor**: props passadas para um custom element são renderizadas como atributos se o tipo delas for um valor primitivo, como `string` ou `number`, ou se o valor for `true`. Props com tipos não primitivos, como `object`, `symbol` e `function`, ou com o valor `false`, são omitidas.
- **Renderização do lado do cliente**: props que correspondem a uma propriedade da instância do Custom Element são atribuídas como propriedades; caso contrário, são atribuídas como atributos.

Agradecemos a [Joey Arhar](https://github.com/josepharhar) por conduzir o design e a implementação do suporte a Custom Elements no React.


#### Como atualizar {/*how-to-upgrade*/}
Veja o [Guia de Atualização para o React 19](/blog/2024/04/25/react-19-upgrade-guide) para instruções passo a passo e uma lista completa das mudanças incompatíveis e das mudanças relevantes.

_Nota: esta publicação foi publicada originalmente em 25/04/2024 e foi atualizada em 05/12/2024 com o lançamento estável._
