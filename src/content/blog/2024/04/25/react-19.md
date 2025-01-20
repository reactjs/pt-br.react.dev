---
title: "React 19 Beta"
author: The React Team
date: 2024/04/25
description: React 19 Beta agora está disponível no npm! Neste post, faremos uma visão geral das novas funcionalidades no React 19 e como você pode adotá-las.
---

25 de abril de 2024 por [The React Team](/community/team)

---

<Note>

Esta versão beta é para bibliotecas se prepararem para o React 19. Desenvolvedores de aplicativos devem atualizar para 18.3.0 e aguardar o React 19 estável enquanto trabalhamos com bibliotecas e fazemos mudanças com base no feedback.

</Note>

<Intro>

React 19 Beta agora está disponível no npm!

</Intro>

No nosso [Guia de Atualização do React 19 Beta](/blog/2024/04/25/react-19-upgrade-guide), compartilhamos instruções passo a passo para atualizar seu aplicativo para o React 19 Beta. Neste post, faremos uma visão geral das novas funcionalidades no React 19 e como você pode adotá-las.

- [O que há de novo no React 19](#whats-new-in-react-19)
- [Melhorias no React 19](#improvements-in-react-19)
- [Como atualizar](#how-to-upgrade)

Para uma lista de mudanças significativas, veja o [Guia de Atualização](/blog/2024/04/25/react-19-upgrade-guide).

---

## O que há de novo no React 19 {/*whats-new-in-react-19*/}

### Ações {/*actions*/}

Um caso de uso comum em aplicativos React é executar uma mutação de dados e, em seguida, atualizar o estado em resposta. Por exemplo, quando um usuário envia um formulário para alterar seu nome, você fará uma solicitação de API e, em seguida, lidará com a resposta. No passado, você precisaria lidar manualmente com estados pendentes, erros, atualizações otimistas e solicitações sequenciais.

Por exemplo, você poderia lidar com o estado pendente e o erro em `useState`:

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
        Atualizar
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

No React 19, estamos adicionando suporte ao uso de funções assíncronas em transições para lidar automaticamente com estados pendentes, erros, formulários e atualizações otimistas.

Por exemplo, você pode usar `useTransition` para lidar com o estado pendente para você:

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
        Atualizar
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

A transição assíncrona definirá imediatamente o estado `isPending` como verdadeiro, fará a(s) solicitação(ões) assíncrona(s) e mudará `isPending` para falso após qualquer transição. Isso permite que você mantenha a UI atual responsiva e interativa enquanto os dados estão mudando.

<Note>

#### Por convenção, funções que usam transições assíncronas são chamadas de "Ações". {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

Ações gerenciam automaticamente o envio de dados para você:

- **Estado pendente**: Ações fornecem um estado pendente que começa no início de uma solicitação e reinicia automaticamente quando a atualização final do estado é comprometida.
- **Atualizações otimistas**: Ações suportam o novo hook [`useOptimistic`](#new-hook-optimistic-updates) para que você possa mostrar aos usuários um feedback instantâneo enquanto as solicitações estão sendo enviadas.
- **Tratamento de erros**: Ações fornecem tratamento de erros para que você possa exibir Limites de Erro quando uma solicitação falha e reverter automaticamente atualizações otimistas para seus valores originais.
- **Formulários**: Elementos `<form>` agora suportam a passagem de funções para as props `action` e `formAction`. Passar funções para as props `action` usa Ações por padrão e reinicia o formulário automaticamente após a submissão.

</Note>

Construindo em cima das Ações, o React 19 introduz [`useOptimistic`](#new-hook-optimistic-updates) para gerenciar atualizações otimistas, e um novo hook [`React.useActionState`](#new-hook-useactionstate) para lidar com casos comuns para Ações. No `react-dom`, estamos adicionando [`<form>` Ações](#form-actions) para gerenciar formulários automaticamente e [`useFormStatus`](#new-hook-useformstatus) para suportar os casos comuns de Ações em formulários.

No React 19, o exemplo acima pode ser simplificado para:

```js
// Usando <form> Ações e useActionState
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
      <button type="submit" disabled={isPending}>Atualizar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

Na próxima seção, vamos detalhar cada uma das novas funcionalidades das Ações no React 19.

### Novo hook: `useActionState` {/*new-hook-useactionstate*/}

Para facilitar os casos comuns para Ações, adicionamos um novo hook chamado `useActionState`:

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // Você pode retornar qualquer resultado da ação.
      // Aqui, retornamos apenas o erro.
      return error;
    }

    // lidar com sucesso
    return null;
  },
  null,
);
```

`useActionState` aceita uma função (a "Ação") e retorna uma Ação encapsulada a ser chamada. Isso funciona porque as Ações se compõem. Quando a Ação encapsulada é chamada, `useActionState` retornará o último resultado da Ação como `data` e o estado pendente da Ação como `pending`. 

<Note>

`React.useActionState` foi anteriormente chamado de `ReactDOM.useFormState` nas versões Canary, mas o renomeamos e depreciamos `useFormState`.

Veja [#28491](https://github.com/facebook/react/pull/28491) para mais informações.

</Note>

Para mais informações, veja a documentação para [`useActionState`](/reference/react/useActionState).

### React DOM: `<form>` Ações {/*form-actions*/}

As Ações também estão integradas com as novas funcionalidades de `<form>` do React 19 para `react-dom`. Adicionamos suporte para passar funções como as props `action` e `formAction` de `<form>`, `<input>` e `<button>` para enviar automaticamente formulários com Ações:

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

Quando uma Ação de `<form>` tem sucesso, o React automaticamente reinicia o formulário para componentes não controlados. Se você precisar reiniciar o `<form>` manualmente, pode chamar a nova API React DOM `requestFormReset`.

Para mais informações, veja a documentação do `react-dom` para [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) e `<button>`.

### React DOM: Novo hook: `useFormStatus` {/*new-hook-useformstatus*/}

Em sistemas de design, é comum escrever componentes de design que precisam de acesso a informações sobre o `<form>` em que estão, sem passar props adiante para o componente. Isso pode ser feito via Contexto, mas para facilitar o caso comum, adicionamos um novo hook `useFormStatus`:

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` lê o status do `<form>` pai como se o formulário fosse um provedor de Contexto.

Para mais informações, veja a documentação do `react-dom` para [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### Novo hook: `useOptimistic` {/*new-hook-optimistic-updates*/}

Outro padrão de UI comum ao realizar uma mutação de dados é mostrar o estado final de maneira otimista enquanto a solicitação assíncrona está em andamento. No React 19, estamos adicionando um novo hook chamado `useOptimistic` para facilitar isso:

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
      <p>Seu nome é: {optimisticName}</p>
      <p>
        <label>Alterar Nome:</label>
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

O hook `useOptimistic` renderizará imediatamente o `optimisticName` enquanto a solicitação `updateName` estiver em andamento. Quando a atualização termina ou falha, o React mudará automaticamente de volta para o valor `currentName`.

Para mais informações, veja a documentação para [`useOptimistic`](/reference/react/useOptimistic).

### Nova API: `use` {/*new-feature-use*/}

No React 19, estamos introduzindo uma nova API para ler recursos durante a renderização: `use`.

Por exemplo, você pode ler uma promessa com `use`, e o React fará Suspense até que a promessa se resolva:

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` suspenderá até que a promessa se resolva.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Quando `use` suspender em Comentários,
  // este limite de Suspense será mostrado.
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` não suporta promessas criadas na renderização. {/*use-does-not-support-promises-created-in-render*/}

Se você tentar passar uma promessa criada na renderização para `use`, o React avisará:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Um componente foi suspenso por uma promessa não cacheada. Criar promessas dentro de um Componente Cliente ou hook ainda não é suportado, exceto via uma biblioteca ou framework compatível com Suspense.

</ConsoleLogLine>

</ConsoleBlockMulti>

Para corrigir, você precisa passar uma promessa de uma biblioteca ou framework alimentado por suspense que suporte cache para promessas. No futuro, planejamos lançar funcionalidades para facilitar o cache de promessas na renderização.

</Note>

Você também pode ler o contexto com `use`, permitindo que você leia o Contexto condicionalmente, como após retornos antecipados:

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

A API `use` só pode ser chamada na renderização, semelhante aos hooks. Ao contrário dos hooks, `use` pode ser chamado condicionalmente. No futuro, planejamos suportar mais maneiras de consumir recursos durante a renderização com `use`.

Para mais informações, veja a documentação para [`use`](/reference/react/use).


## Componentes do Servidor React {/*react-server-components*/}

### Componentes do Servidor {/*server-components*/}

Os Componentes do Servidor são uma nova opção que permite renderizar componentes antecipadamente, antes de realizar o bundling, em um ambiente separado do seu aplicativo cliente ou servidor SSR. Este ambiente separado é o "servidor" nos Componentes do Servidor React. Os Componentes do Servidor podem ser executados uma vez no tempo de construção no seu servidor CI, ou podem ser executados para cada solicitação usando um servidor web.

O React 19 inclui todos os recursos dos Componentes do Servidor React incluídos no canal Canary. Isso significa que bibliotecas que são enviadas com Componentes do Servidor agora podem direcionar o React 19 como uma dependência peer com uma condição de exportação `react-server` [condicional](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) para uso em frameworks que suportam a [Arquitetura React Full-stack](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision). 

<Note>

#### Como posso construir suporte para Componentes do Servidor? {/*how-do-i-build-support-for-server-components*/}

Embora os Componentes do Servidor no React 19 sejam estáveis e não quebrarão entre versões principais, as APIs subjacentes usadas para implementar um bundler ou framework de Componentes do Servidor React não seguem semver e podem quebrar entre versões menores no React 19.x. 

Para suportar os Componentes do Servidor React como um bundler ou framework, recomendamos que você fixo a uma versão específica do React ou use a versão Canary. Continuaremos trabalhando com bundlers e frameworks para estabilizar as APIs utilizadas para implementar os Componentes do Servidor React no futuro.

</Note>

Para mais, veja a documentação para [Componentes do Servidor React](/reference/rsc/server-components).

### Ações do Servidor {/*server-actions*/}

As Ações do Servidor permitem que Componentes Cliente chamem funções assíncronas executadas no servidor.

Quando uma Ação do Servidor é definida com a diretiva `"use server"`, seu framework criará automaticamente uma referência à função do servidor e passará essa referência para o Componente Cliente. Quando essa função for chamada no cliente, o React enviará uma solicitação ao servidor para executar a função e retornará o resultado.

<Note>

#### Não há diretiva para Componentes do Servidor. {/*there-is-no-directive-for-server-components*/}

Uma compreensão comum é que os Componentes do Servidor são denotados por `"use server"`, mas não há diretiva para os Componentes do Servidor. A diretiva `"use server"` é usada para Ações do Servidor.

Para mais informações, veja a documentação para [Diretivas](/reference/rsc/directives).

</Note>

As Ações do Servidor podem ser criadas em Componentes do Servidor e passadas como props para Componentes Cliente, ou podem ser importadas e usadas em Componentes Cliente.

Para mais, veja a documentação para [Ações do Servidor React](/reference/rsc/server-actions).

## Melhorias no React 19 {/*improvements-in-react-19*/}

### `ref` como uma prop {/*ref-as-a-prop*/}

Começando no React 19, você agora pode acessar `ref` como uma prop para componentes de função:

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

Novos componentes de função não precisarão mais de `forwardRef`, e publicaremos um codemod para atualizar automaticamente seus componentes para usar a nova prop `ref`. Nas versões futuras, iremos depreciar e remover `forwardRef`.

<Note>

`refs` passados para classes não são passados como props, pois fazem referência à instância do componente.

</Note>

### Diferenças para erros de hidratação {/*diffs-for-hydration-errors*/}

Também melhoramos a reportagem de erros para erros de hidratação em `react-dom`. Por exemplo, em vez de registrar múltiplos erros em DEV sem nenhuma informação sobre a discrepância:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Aviso: O conteúdo de texto não correspondia. Servidor: "Servidor" Cliente: "Cliente"
{'  '}em span
{'  '}em App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Aviso: Ocorreu um erro durante a hidratação. O HTML do servidor foi substituído pelo conteúdo do cliente em \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Aviso: O conteúdo de texto não correspondia. Servidor: "Servidor" Cliente: "Cliente"
{'  '}em span
{'  '}em App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Aviso: Ocorreu um erro durante a hidratação. O HTML do servidor foi substituído pelo conteúdo do cliente em \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Erro não capturado: O conteúdo de texto não corresponde ao HTML renderizado no servidor.
{'  '}em checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

Agora registramos uma única mensagem com uma diferença da discrepância:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Erro não capturado: A hidratação falhou porque o HTML renderizado pelo servidor não correspondesse ao cliente. Como resultado, esta árvore será regenerada no cliente. Isso pode acontecer se um Componente Cliente SSR-ed usou:{'\n'}
\- Um branch servidor/clente `if (typeof window !== 'undefined')`.
\- Entrada variável como `Date.now()` ou `Math.random()` que muda a cada chamada.
\- Formatação de data na localidade de um usuário que não corresponde ao servidor.
\- Dados externos que mudam sem enviar um instantâneo junto com o HTML.
\- Aninhamento inválido de tags HTML.{'\n'}
Isso também pode acontecer se o cliente tiver uma extensão do navegador instalada que baguncem o HTML antes do React carregar.{'\n'}
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

Novos provedores de Contexto podem usar `<Context>` e publicaremos um codemod para converter provedores existentes. Nas versões futuras, iremos depreciar `<Context.Provider>`.

### Funções de limpeza para refs {/*cleanup-functions-for-refs*/}

Agora suportamos retornar uma função de limpeza dos callbacks de `ref`:

```js {7-9}
<input
  ref={(ref) => {
    // ref criada

    // NOVO: retornar uma função de limpeza para redefinir
    // a ref quando o elemento for removido do DOM.
    return () => {
      // limpeza da ref
    };
  }}
/>
```

Quando o componente é desmontado, o React chamará a função de limpeza retornada do callback de `ref`. Isso funciona para refs de DOM, refs para componentes de classe e `useImperativeHandle`. 

<Note>

Anteriormente, o React chamaria funções de `ref` com `null` ao desmontar o componente. Se sua `ref` retornar uma função de limpeza, o React agora ignorará essa etapa.

Nas versões futuras, iremos depreciar a chamada de refs com `null` ao desmontar componentes.

</Note>

Devido à introdução de funções de limpeza de refs, retornar qualquer outra coisa de um callback de `ref` será agora rejeitado pelo TypeScript. A correção geralmente é parar de usar retornos implícitos, por exemplo:

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

O código original retornou a instância do `HTMLDivElement` e o TypeScript não saberia se isso era _suposto_ ser uma função de limpeza ou se você não queria retornar uma função de limpeza.

Você pode codemodificar esse padrão com [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return).

### `useDeferredValue` valor inicial {/*use-deferred-value-initial-value*/}

Adicionamos uma opção `initialValue` a `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // Na renderização inicial, o valor é ''.
  // Em seguida, uma nova renderização é agendada com o deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

Quando <CodeStep step={2}>initialValue</CodeStep> é fornecido, `useDeferredValue` o retornará como `value` para a renderização inicial do componente, e agenda uma re-renderização em segundo plano com o <CodeStep step={1}>deferredValue</CodeStep> retornado.

Para mais, veja [`useDeferredValue`](/reference/react/useDeferredValue).

### Suporte para Metadados de Documento {/*support-for-metadata-tags*/}

Em HTML, as tags de metadados de documento, como `<title>`, `<link>` e `<meta>`, são reservadas para colocação na seção `<head>` do documento. No React, o componente que decide quais metadados são apropriados para o aplicativo pode estar muito longe do local onde você renderiza o `<head>` ou o React não renderiza o `<head>` de maneira alguma. No passado, esses elementos precisariam ser inseridos manualmente em um efeito ou por bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet), e exigiam um manuseio cuidadoso ao renderizar um aplicativo React no servidor. 

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
        Eee é igual a em-see-quadrado...
      </p>
    </article>
  );
}
```

Quando o React renderiza este componente, verá as tags `<title>`, `<link>` e `<meta>`, e automaticamente as elevará para a seção `<head>` do documento. Ao suportar essas tags de metadados nativamente, conseguimos garantir que funcionem com aplicativos apenas de cliente, SSR com streaming e Componentes do Servidor.

<Note>

#### Você ainda pode querer uma biblioteca de Metadados {/*you-may-still-want-a-metadata-library*/}

Para casos de uso simples, renderizar Metadados de Documento como tags pode ser adequado, mas bibliotecas podem oferecer recursos mais poderosos, como substituir metadados genéricos por metadados específicos com base na rota atual. Esses recursos facilitam o suporte a tags de metadados para frameworks e bibliotecas como [`react-helmet`](https://github.com/nfl/react-helmet), em vez de substituí-las.

</Note>

Para mais informações, veja a documentação para [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link) e [`<meta>`](/reference/react-dom/components/meta).

### Suporte para folhas de estilo {/*support-for-stylesheets*/}

Folhas de estilo, tanto vinculadas externamente (`<link rel="stylesheet" href="...">`) quanto inline (`<style>...</style>`), exigem posicionamento cuidadoso no DOM devido às regras de precedência de estilo. Construir uma capacidade de folha de estilo que permita a composibilidade dentro de componentes é difícil, então os usuários geralmente acabam carregando todas as suas estilos longe dos componentes que podem depender deles ou usam uma biblioteca de estilo que encapsula essa complexidade.

No React 19, estamos abordando essa complexidade e oferecendo uma integração ainda mais profunda na Renderização Concorrente no Cliente e na Renderização por Streaming no Servidor com suporte incorporado para folhas de estilo. Se você informar ao React a `precedência` da sua folha de estilo, ele gerenciará a ordem de inserção da folha de estilo no DOM e garantirá que a folha de estilo (se externa) seja carregada antes de revelar o conteúdo que depende dessas regras de estilo.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="carregando...">
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

Durante a Renderização do Lado do Servidor, o React incluirá a folha de estilo no `<head>`, o que garante que o navegador não pintará até que tenha carregado. Se a folha de estilo for descoberta tarde, após já termos começado a fazer streaming, o React garantirá que a folha de estilo seja inserida no `<head>` no cliente antes de revelar o conteúdo de um limite de Suspense que depende daquela folha de estilo.

Durante a Renderização do Lado do Cliente, o React aguardará que as novas folhas de estilo renderizadas carreguem antes de comprometer a renderização. Se você renderizar este componente de múltiplos locais dentro da sua aplicação, o React incluirá a folha de estilo apenas uma vez no documento:

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // não levará a uma duplicata da folha de estilo no DOM
  </>
}
```

Para usuários acostumados a carregar folhas de estilo manualmente, esta é uma oportunidade de localizar essas folhas de estilo ao lado dos componentes dos quais dependem, permitindo um melhor raciocínio local e uma maneira mais fácil de garantir que você carregue apenas as folhas de estilo das quais realmente depende.

Bibliotecas de estilo e integrações de estilo com bundlers também podem adotar essa nova capacidade, para que mesmo que você não renderize suas próprias folhas de estilo diretamente, ainda possa se beneficiar à medida que suas ferramentas forem atualizadas para usar essa funcionalidade.

Para mais detalhes, consulte a documentação para [`<link>`](/reference/react-dom/components/link) e [`<style>`](/reference/react-dom/components/style).

### Suporte para scripts assíncronos {/*support-for-async-scripts*/}

Em HTML, scripts normais (`<script src="...">`) e scripts diferidos (`<script defer="" src="...">`) carregam na ordem do documento, o que torna desafiador renderizar esses tipos de scripts dentro de sua árvore de componentes. No entanto, scripts assíncronos (`<script async="" src="...">`) podem ser carregados em ordem arbitrária.

No React 19, incluímos um suporte melhor para scripts assíncronos, permitindo que você os renderize em qualquer lugar de sua árvore de componentes, dentro dos componentes que realmente dependem do script, sem precisar gerenciar o realocamento e deduplicação de instâncias de script.

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

Em todos os ambientes de renderização, os scripts assíncronos serão deduplicados, de modo que o React carregue e execute o script apenas uma vez, mesmo que seja renderizado por múltiplos componentes diferentes.

Na Renderização do Lado do Servidor, scripts assíncronos serão incluídos no `<head>` e priorizados após recursos mais críticos que bloqueiam a pintura, como folhas de estilo, fontes e pré-carregamentos de imagens.

Para mais detalhes, consulte a documentação para [`<script>`](/reference/react-dom/components/script).

### Suporte para pré-carregamento de recursos {/*support-for-preloading-resources*/}

Durante o carregamento inicial do documento e em atualizações do lado do cliente, informar ao navegador sobre os recursos que provavelmente precisará carregar o mais cedo possível pode ter um efeito dramático no desempenho da página.

O React 19 inclui várias novas APIs para carregar e pré-carregar recursos do navegador para facilitar a construção de experiências excelentes que não sejam bloqueadas por um carregamento de recursos ineficiente.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // carrega e executa este script ansiosamente
  preload('https://.../path/to/font.woff', { as: 'font' }) // pré-carrega essa fonte
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // pré-carrega essa folha de estilo
  prefetchDNS('https://...') // quando você pode não realmente requerer nada desse host
  preconnect('https://...') // quando você requisitará algo mas não tem certeza do que
}
```
```html
<!-- o acima resultaria no seguinte DOM/HTML -->
<html>
  <head>
    <!-- links/scripts são priorizados pela sua utilidade para o carregamento inicial, e não pela ordem de chamada -->
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

Essas APIs podem ser usadas para otimizar os carregamentos iniciais da página, movendo a descoberta de recursos adicionais, como fontes, para fora do carregamento da folha de estilo. Elas também podem tornar atualizações do cliente mais rápidas pré-carregando uma lista de recursos usados em uma navegação antecipada e, em seguida, pré-carregando esses recursos ansiosamente ao clicar ou até mesmo ao passar o mouse.

Para mais detalhes, veja [APIs de Pré-Carregamento de Recursos](/reference/react-dom#resource-preloading-apis).

### Compatibilidade com scripts e extensões de terceiros {/*compatibility-with-third-party-scripts-and-extensions*/}

Melhoramos a hidratação para levar em conta scripts de terceiros e extensões do navegador.

Ao hidratar, se um elemento que renderiza no cliente não corresponder ao elemento encontrado no HTML do servidor, o React forçará uma nova renderização do cliente para corrigir o conteúdo. Anteriormente, se um elemento fosse inserido por scripts de terceiros ou extensões do navegador, isso acionaria um erro de discrepância e uma renderização no cliente.

No React 19, tags inesperadas no `<head>` e `<body>` serão ignoradas, evitando erros de discrepância. Se o React precisar re-renderizar todo o documento devido a uma discrepância de hidratação não relacionada, ele deixará no lugar folhas de estilos inseridas por scripts de terceiros e extensões do navegador.

### Melhorias na reportagem de erros {/*error-handling*/}

Melhoramos o manuseio de erros no React 19 para remover duplicações e fornecer opções para lidar com erros capturados e não capturados. Por exemplo, quando há um erro na renderização que é capturado por um Limite de Erro, anteriormente o React lançava o erro duas vezes (uma vez para o erro original, depois novamente após falhar em se recuperar automaticamente) e em seguida chamava `console.error` com informações sobre onde o erro ocorreu. 

Isso resultava em três erros para cada erro capturado:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Erro não capturado: hit
{'  '}em Throws
{'  '}em renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Erro não capturado: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicado</span>
{'  '}em Throws
{'  '}em renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

O erro acima ocorreu no componente Throws:
{'  '}em Throws
{'  '}em ErrorBoundary
{'  '}em App{'\n'}
O React tentará recriar esta árvore de componentes do zero usando o limite de erro que você forneceu, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

No React 19, registramos um único erro com todas as informações do erro incluídas:

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
O React tentará recriar esta árvore de componentes do zero usando o limite de erro que você forneceu, ErrorBoundary.
{'  '}em ErrorBoundary
{'  '}em App

</ConsoleLogLine>

</ConsoleBlockMulti>

Além disso, adicionamos duas novas opções de raiz para complementar `onRecoverableError`:

- `onCaughtError`: chamado quando o React captura um erro em um Limite de Erro.
- `onUncaughtError`: chamado quando um erro é lançado e não capturado por um Limite de Erro.
- `onRecoverableError`: chamado quando um erro é lançado e recuperado automaticamente.

Para mais informações e exemplos, veja a documentação para [`createRoot`](/reference/react-dom/client/createRoot) e [`hydrateRoot`](/reference/react-dom/client/hydrateRoot).

### Suporte para Elementos Customizados {/*support-for-custom-elements*/}

O React 19 adiciona suporte completo para elementos customizados e passa em todos os testes em [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

Em versões anteriores, usar Elementos Customizados no React tem sido difícil porque o React tratava props não reconhecidas como atributos em vez de propriedades. No React 19, adicionamos suporte a propriedades que funcionam no cliente e durante SSR com a seguinte estratégia:

- **Renderização do Lado do Servidor**: props passadas para um elemento customizado serão renderizadas como atributos se seu tipo for um valor primitivo, como `string`, `number` ou o valor for `true`. Props com tipos não primitivos, como `object`, `symbol`, `function` ou valor `false` serão omitidas.
- **Renderização do Lado do Cliente**: props que correspondem a uma propriedade na instância do Elemento Customizado serão atribuídas como propriedades, caso contrário, serão atribuídas como atributos.

Agradecimentos a [Joey Arhar](https://github.com/josepharhar) por liderar o projeto e a implementação do suporte a Elementos Customizados no React.


#### Como atualizar {/*how-to-upgrade*/}
Veja o [Guia de Atualização do React 19](/blog/2024/04/25/react-19-upgrade-guide) para instruções passo a passo e uma lista completa de mudanças significativas e notáveis.