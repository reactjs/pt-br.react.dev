---
id: concurrent-mode-patterns
title: Padrões de UI Concorrente (Experimental)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

>Cuidado:
>
>Esta página descreve os recursos **experimentais que ainda [não estão disponíveis](/docs/concurrent-mode-adoption.html) em uma versão estável**. Não confie nas versões experimentais do React em aplicativos de produção. Esses recursos podem mudar significativamente e sem aviso antes de se tornarem parte do React.
>
>Esta documentação é destinada a adotante precoces e pessoas curiosas. Se você é novo no Rect, não se preocupe com esses recursos -- não precisa aprendê-los agora.

Normalmente, quando atualizamos o estado, esperamos ver alterações na tela imediatamente. Isso faz sentido, porque queremos manter nossa aplicação responsiva à entrada do usuário. No entanto, há casos em que podemos preferir **adiar que uma atualização apareça na tela**.

Por exemplo, se mudarmos de uma página para outra e nenhum código ou dados para a próxima tela tiver sido carregado, pode ser frustrante ver imediatamente uma página em branco com um indicador de carregamento. Podemos preferir ficar mais tempo na tela anterior. Implementar esse padrão tem sido historicamente difícil no React. O Modo Concorrente oferece um novo conjunto de ferramentas para fazer isso.

- [Transições](#transitions)
  - [Encapsulando setState em uma Transição](#wrapping-setstate-in-a-transition)
  - [Adicionando um Indicador de Pendente](#adding-a-pending-indicator)
  - [Revisando as Mudanças](#reviewing-the-changes)
  - [Onde a Atualização Acontece?](#where-does-the-update-happen)
  - [Transições Estão em Toda Parte](#transitions-are-everywhere)
  - [Inserindo Transições no Sistema de Design](#baking-transitions-into-the-design-system)
- [Os Três Passos](#the-three-steps)
  - [Padrão: Recuado → Esqueleto → Completo](#default-receded-skeleton-complete)
  - [Preferido: Pendente → Esqueleto → Completo](#preferred-pending-skeleton-complete)
  - [Encapsule Recursos Lentos em `<Suspense>`](#wrap-lazy-features-in-suspense)
  - ["Trem" Revela Suspense](#suspense-reveal-train)
  - [Atrasando um Indicador Pendente](#delaying-a-pending-indicator)
  - [Recapitulação](#recap)
- [Outros Padrões](#other-patterns)
  - [Dividindo Estado de Alta e Baixa Prioridade](#splitting-high-and-low-priority-state)
  - [Adiando um Valor](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [Próximos Passos](#next-steps)

## Transições {#transitions}

Vamos revisitar [esta demo](https://codesandbox.io/s/infallible-feather-xjtbu) da página anterior sobre [Suspense para Busca de Dados](/docs/concurrent-mode-suspense.html).

Quando clicamos no botão "Next" para mudar o perfil ativo, os dados da página existente desaparecem imediatamente e vemos o indicador de carregamento de toda a página novamente. Podemos chamar isso de estado de carregamento "indesejável". **Seria bom se pudéssemos "ignorá-lo" e aguardar o carregamento de algum conteúdo antes de fazer a transição para a nova tela.**

O React oferece um novo Hook interno `useTransition()` para ajudar com isso.

Podemos usá-lo em três passos.

Primeiro, vamos garantir que estamos realmente usando o Modo Concorrente. Falaremos sobre [adotar o Modo Concorrente](/docs/concurrent-mode-adoption.html) mais tarde, mas por enquanto é o bastante saber que precisamos usar `ReactDOM.createRoot()` em vez de `ReactDOM.render()` para que este recurso funcione:

```js
const rootElement = document.getElementById("root");
// Ativar Modo Concorrente
ReactDOM.createRoot(rootElement).render(<App />);
```

Em seguida, adicionaremos a importação do Hook `useTransition` do React:

```js
import React, { useState, useTransition, Suspense } from "react";
```

Finalmente, vamos usá-lo dentro do componente `App`:

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**Por si só, esse código ainda não faz nada.** Precisamos usar os valores de retorno deste Hook para configurar nossa transição de estado. Existem dois valores retornados por `useTransition`:

* `startTransition` é uma função. Vamos usá-la para informar ao React *qual* atualização de estado queremos adiar.
* `isPending` é um booleano. É o React nos dizendo se essa transição está em andamento no momento.

Vamos usá-los logo abaixo.

Note que passamos um objeto de configuração para `useTransition`. Sua propriedade `timeoutMs` especifica **por quanto tempo estamos dispostos a esperar a conclusão da transição**. Ao passar `{timeoutMs: 3000}`, dizemos "Se o próximo perfil levar mais de 3 segundos para carregar, mostre o spinner grande -- mas antes desse tempo limite, não há problema em continuar exibindo a tela anterior".

### Encapsulando setState em uma Transição {#wrapping-setstate-in-a-transition}

Nosso manipulador de cliques no botão "Next" define o estado que alterna o perfil atual no estado:

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

Vamos encapsular essa atualização de estado em `startTransition`. É assim que dizemos ao React **que não nos importamos em o React atrasar essa atualização de estado** se ela levar a um estado de carregamento indesejável:

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/musing-driscoll-6nkie)**

Pressione "Next" algumas vezes. Observe que já parece bem diferente. **Em vez de ver imediatamente uma tela vazia ao clicar, agora continuamos vendo a página anterior por um tempo.** Quando os dados são carregados, o React nos transfere para a nova tela.

Se fizermos as respostas da API demorarem 5 segundos, [podemos confirmar](https://codesandbox.io/s/relaxed-greider-suewh) que agora o React "desiste" e faz a transição para a próxima tela depois de 3 segundos. Isso ocorre porque passamos `{timeoutMs: 3000}` para `useTransition()`. Por exemplo, se passarmos `{timeoutMs: 60000}` em vez disso, irá esperar um minuto.

### Adicionando um Indicador de Pendente {#adding-a-pending-indicator}

Ainda tem algo que parece quebrado em relação ao [nosso último exemplo](https://codesandbox.io/s/musing-driscoll-6nkie). Claro, é bom não ver um estado de carregamento "ruim". **Mas não ter nenhuma indicação de progresso é ainda pior!** Quando clicamos em "Next", nada acontece e parece que o aplicativo está quebrado.

Nossa chamada do `useTransition()` retorna dois valores: `startTransition` e` isPending`.

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

Já usamos `startTransition` para encapsular a atualização de estado. Agora vamos usar também o `isPending`. O React fornece esse booleano para que possamos saber se **estamos atualmente aguardando a conclusão da transição**. Vamos usá-lo para indicar que algo está acontecendo:

```js{4,14}
return (
  <>
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        });
      }}
    >
      Next
    </button>
    {isPending ? " Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Agora, parece ter ficado muito melhor! Quando clicamos em "Next", ele fica desativado porque não faz sentido clicar várias vezes nele. E o novo "Loading..." informa ao usuário que o aplicativo não congelou.

### Revisando as Mudanças {#reviewing-the-changes}

Vamos dar uma olhada em todas as alterações que fizemos desde o [exemplo original](https://codesandbox.io/s/infallible-feather-xjtbu):

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/jovial-lalande-26yep)**

Precisamos apenas de sete linhas de código para adicionar essa transição:

* Importamos o Hook `useTransition` e usamos no componente que atualiza o estado.
* Passamos o `{timeoutMs: 3000}` para permanecer na tela anterior por no máximo 3 segundos.
* Encapsulamos nossa atualização de estado no `startTransition` para dizer ao React que não há problema em adiá-lo.
* Estamos usando o `isPending` para comunicar o progresso da transição de estado ao usuário e desativar o botão.

Como resultado, clicar em "Next" não realiza uma transição imediata de estado para um estado de carregamento "indesejável", mas ao invés disso permanece na tela anterior e comunica o progresso lá.

### Onde a Atualização Acontece? {#where-does-the-update-happen}

Isso não foi muito difícil de implementar. No entanto, se você começar a pensar em como isso poderia funcionar, pode se tornar um pouco perturbador. Se definirmos o estado, como é que não vemos o resultado imediatamente? *Onde* é a próxima renderização de `<ProfilePage>`?

Claramente, ambas as "versões" do `<PerfilPage>` existem ao mesmo tempo. Sabemos que o antigo existe porque o vemos na tela e até exibimos um indicador de progresso. E sabemos que a nova versão também existe *em algum lugar*, porque é a que estamos aguardando!

**Mas como duas versões do mesmo componente podem existir ao mesmo tempo?**

Com isso chegamos na raiz do que é o Modo Concorrente. Nós [dissemos anteriormente](/docs/concurrent-mode-intro.html#intentional-loading-sequences) que é um pouco como o React trabalhando na atualização de estado em um "ramo". Outra maneira que podemos conceituar é que o encapsulamento de uma atualização de estado em `startTransition` começa a renderizá-lo *"em um universo diferente"*, como nos filmes de ficção científica. Nós não "vemos" esse universo diretamente -- mas podemos obter um sinal dele que nos diz que algo está acontecendo (`isPending`). Quando a atualização está pronta, nossos "universos" se fundem novamente e vemos o resultado na tela!

Brinque um pouco mais com a [demo](https://codesandbox.io/s/jovial-lalande-26yep) e tente imaginar isso acontecendo.

Obviamente, duas versões da renderização em árvore *ao mesmo tempo* são uma ilusão, assim como a ideia de que todos os programas executam no computador ao mesmo tempo é uma ilusão. Um sistema operacional alterna entre diferentes aplicativos muito rapidamente. Da mesma forma, o React pode alternar entre a versão da árvore que você vê na tela e a versão que está "preparando" para mostrar a seguir.

Uma API como `useTransition` permite que você se concentre na experiência do usuário desejada, e não pense na mecânica de como ela é implementada. Ainda assim, pode ser uma metáfora útil imaginar que as atualizações encapsuladas em `startTransition` ocorram "em uma ramificação" ou "em um universo diferente".

### Transições Estão em Toda Parte {#transitions-are-everywhere}

Como aprendemos com [Suspense Passo a Passo](/docs/concurrent-mode-suspense.html), qualquer componente pode "suspender" a qualquer momento se alguns dados necessários ainda não estiverem prontos. Podemos colocar estrategicamente os limites do `<Suspense>` em diferentes partes da árvore para lidar com isso, mas nem sempre será o suficiente.

Vamos voltar à nossa [primeira demo do Suspense](https://codesandbox.io/s/frosty-hermann-bztrp), onde havia apenas um perfil. Atualmente, ele busca os dados apenas uma vez. Vamos adicionar um botão "Refresh" para verificar se há atualizações do servidor.

Nossa primeira tentativa pode ser assim:

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/boring-shadow-100tf)**

Neste exemplo, começamos a busca de dados no carregamento *e* toda vez que você pressionar "Refresh". Colocamos o resultado da chamada de `fetchUserAndPosts()` no estado para que os componentes abaixo possam começar a ler os novos dados da solicitação que acabamos de iniciar.

Podemos ver [neste exemplo](https://codesandbox.io/s/boring-shadow-100tf) que pressionar "Refresh" funciona. Os componentes `<ProfileDetails>` e `<ProfileTimeline>` recebem uma nova prop `resource` que representa os dados atualizados, eles "suspendem" porque ainda não temos uma resposta e vemos os fallbacks. Quando a resposta é carregada, podemos ver as postagens atualizadas (nossa API falsa as adiciona a cada 3 segundos).

No entanto, a experiência parece ruim. Estávamos navegando em uma página, mas ela foi substituída por um estado de carregamento quando estávamos interagindo com ela. É desorientador. **Assim como antes, para evitar mostrar um estado de carregamento indesejável, podemos encapsular a atualização do estado em uma transição:**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
    // Aguarde 10 segundos antes do fallback
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/sleepy-field-mohzb)**

Isso parece muito melhor! Clicar em "Refresh" não nos afasta mais da página em que estamos navegando. Vemos que algo está carregando "inline" e, quando os dados estão prontos, são exibidos.

### Inserindo Transições no Sistema de Design {#baking-transitions-into-the-design-system}

We can now see that the need for `useTransition` is *very* common. Pretty much any button click or interaction that can lead to a component suspending needs to be wrapped in `useTransition` to avoid accidentally hiding something the user is interacting with.

This can lead to a lot of repetitive code across components. This is why **we generally recommend to bake `useTransition` into the *design system* components of your app**. For example, we can extract the transition logic into our own `<Button>` component:

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

Note that the button doesn't care *what* state we're updating. It's wrapping *any* state updates that happen during its `onClick` handler into a transition. Now that our `<Button>` takes care of setting up the transition, the `<ProfilePage>` component doesn't need to set up its own:

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Refresh
      </Button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/modest-ritchie-iufrh)**

When a button gets clicked, it starts a transition and calls `props.onClick()` inside of it -- which triggers `handleRefreshClick` in the `<ProfilePage>` component. We start fetching the fresh data, but it doesn't trigger a fallback because we're inside a transition, and the 10 second timeout specified in the `useTransition` call hasn't passed yet. While a transition is pending, the button displays an inline loading indicator.

We can see now how Concurrent Mode helps us achieve a good user experience without sacrificing isolation and modularity of components. React coordinates the transition.

## Os Três Passos {#the-three-steps}

By now we have discussed all of the different visual states that an update may go through. In this section, we will give them names and talk about the progression between them.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

At the very end, we have the **Complete** state. That's where we want to eventually get to. It represents the moment when the next screen is fully rendered and isn't loading more data.

But before our screen can be Complete, we might need to load some data or code. When we're on the next screen, but some parts of it are still loading, we call that a **Skeleton** state.

Finally, there are two primary ways that lead us to the Skeleton state. We will illustrate the difference between them with a concrete example.

### Padrão: Recuado → Esqueleto → Completo {#default-receded-skeleton-complete}

Open [this example](https://codesandbox.io/s/prod-grass-g1lh5) and click "Open Profile". You will see several visual states one by one:

* **Receded**: For a second, you will see the `<h1>Loading the app...</h1>` fallback.
* **Skeleton:** You will see the `<ProfilePage>` component with `<h2>Loading posts...</h2>` inside.
* **Complete:** You will see the `<ProfilePage>` component with no fallbacks inside. Everything was fetched.

How do we separate the Receded and the Skeleton states? The difference between them is that the **Receded** state feels like "taking a step back" to the user, while the **Skeleton** state feels like "taking a step forward" in our progress to show more content.

In this example, we started our journey on the `<HomePage>`:

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

After the click, React started rendering the next screen:

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

Both `<ProfileDetails>` and `<ProfileTimeline>` need data to render, so they suspend:

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

When a component suspends, React needs to show the closest fallback. But the closest fallback to `<ProfileDetails>` is at the top level:

```js{2,3,7}
<Suspense fallback={
  // We see this fallback now because of <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

This is why when we click the button, it feels like we've "taken a step back". The `<Suspense>` boundary which was previously showing useful content (`<HomePage />`) had to "recede" to showing the fallback (`<h1>Loading the app...</h1>`). We call that a **Receded** state.

As we load more data, React will retry rendering, and `<ProfileDetails>` can render successfully. Finally, we're in the **Skeleton** state. We see the new page with missing parts:

```js{6,7,9}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // We see this fallback now because of <ProfileTimeline>
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Eventually, they load too, and we get to the **Complete** state.

This scenario (Receded → Skeleton → Complete) is the default one. However, the Receded state is not very pleasant because it "hides" existing information. This is why React lets us opt into a different sequence (**Pending** → Skeleton → Complete) with `useTransition`.

### Preferido: Pendente → Esqueleto → Completo {#preferred-pending-skeleton-complete}

When we `useTransition`, React will let us "stay" on the previous screen -- and show a progress indicator there. We call that a **Pending** state. It feels much better than the Receded state because none of our existing content disappears, and the page stays interactive.

You can compare these two examples to feel the difference:

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/prod-grass-g1lh5)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/focused-snow-xbkvl)**

The only difference between these two examples is that the first uses regular `<button>`s, but the second one uses our custom `<Button>` component with `useTransition`.

### Encapsule Recursos Lentos em `<Suspense>` {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/nameless-butterfly-fkw5q). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

We will now add a brand new feature to the profile page -- a list of fun facts about a person:

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/focused-mountain-uhkzg)**

If you press "Open Profile" now, you can tell something is wrong. It takes whole seven seconds to make the transition now! This is because our trivia API is too slow. Let's say we can't make the API faster. How can we improve the user experience with this constraint?

If we don't want to stay in the Pending state for too long, our first instinct might be to set `timeoutMs` in `useTransition` to something smaller, like `3000`. You can try this [here](https://codesandbox.io/s/practical-kowalevski-kpjg4). This lets us escape the prolonged Pending state, but we still don't have anything useful to show!

There is a simpler way to solve this. **Instead of making the transition shorter, we can "disconnect" the slow component from the transition** by wrapping it into `<Suspense>`:

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/condescending-shape-s6694)**

This reveals an important insight. React always prefers to go to the Skeleton state as soon as possible. Even if we use transitions with long timeouts everywhere, React will not stay in the Pending state for longer than necessary to avoid the Receded state.

**If some feature isn't a vital part of the next screen, wrap it in `<Suspense>` and let it load lazily.** This ensures we can show the rest of the content as soon as possible. Conversely, if a screen is *not worth showing* without some component, such as `<ProfileDetails>` in our example, do *not* wrap it in `<Suspense>`. Then the transitions will "wait" for it to be ready.

### "Trem" Revela Suspense {#suspense-reveal-train}

When we're already on the next screen, sometimes the data needed to "unlock" different `<Suspense>` boundaries arrives in quick succession. For example, two different responses might arrive after 1000ms and 1050ms, respectively. If you've already waited for a second, waiting another 50ms is not going to be perceptible. This is why React reveals `<Suspense>` boundaries on a schedule, like a "train" that arrives periodically. This trades a small delay for reducing the layout thrashing and the number of visual changes presented to the user.

You can see a demo of this [here](https://codesandbox.io/s/admiring-mendeleev-y54mk). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together.

### Atrasando um Indicador Pendente {#delaying-a-pending-indicator}

Our `Button` component will immediately show the Pending state indicator on click:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/floral-thunder-iy826)**

This signals to the user that some work is happening. However, if the transition is relatively short (less than 500ms), it might be too distracting and make the transition itself feel *slower*.

One possible solution to this is to *delay the spinner itself* from displaying:

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/gallant-spence-l6wbk)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 500ms has passed. This may not seem like much of an improvement when the API responses are slow. But compare how it feels [before](https://codesandbox.io/s/thirsty-liskov-1ygph) and [after](https://codesandbox.io/s/hardcore-http-s18xr) when the API call is fast. Even though the rest of the code hasn't changed, suppressing a "too fast" loading state improves the perceived performance by not calling attention to the delay.

### Recapitulação {#recap}

The most important things we learned so far are:

* By default, our loading sequence is Receded → Skeleton → Complete.
* The Receded state doesn't feel very nice because it hides existing content.
* With `useTransition`, we can opt into showing a Pending state first instead. This will keep us on the previous screen while the next screen is being prepared.
* If we don't want some component to delay the transition, we can wrap it in its own `<Suspense>` boundary.
* Instead of doing `useTransition` in every other component, we can build it into our design system.

## Outros Padrões {#other-patterns}

Transitions are probably the most common Concurrent Mode pattern you'll encounter, but there are a few more patterns you might find useful.

### Dividindo Estado de Alta e Baixa Prioridade {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

However, in Concurrent Mode there are cases where you might *want* to "duplicate" some data in different state variables. Consider this tiny translation app:

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/brave-villani-ypxvf)**

Notice how when you type into the input, the `<Translation>` component suspends, and we see the `<p>Loading...</p>` fallback until we get fresh results. This is not ideal. It would be better if we could see the *previous* translation for a bit while we're fetching the next one.

In fact, if we open the console, we'll see a warning:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

As we mentioned earlier, if some state update causes a component to suspend, that state update should be wrapped in a transition. Let's add `useTransition` to our component:

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/zen-keldysh-rifos)**

Try typing into the input now. Something's wrong! The input is updating very slowly.

We've fixed the first problem (suspending outside of a transition). But now because of the transition, our state doesn't update immediately, and it can't "drive" a controlled input!

The answer to this problem **is to split the state in two parts:** a "high priority" part that updates immediately, and a "low priority" part that may wait for a transition.

In our example, we already have two state variables. The input text is in `query`, and we read the translation from `resource`. We want changes to the `query` state to happen immediately, but changes to the `resource` (i.e. fetching a new translation) should trigger a transition.

So the correct fix is to put `setQuery` (which doesn't suspend) *outside* the transition, but `setResource` (which will suspend) *inside* of it.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;

  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/lively-smoke-fdf93)**

With this change, it works as expected. We can type into the input immediately, and the translation later "catches up" to what we have typed.

### Adiando um Valor {#deferring-a-value}

By default, React always renders a consistent UI. Consider code like this:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

This makes sense in the vast majority of situations. Inconsistent UI is confusing and can mislead users. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

However, sometimes it might be helpful to intentionally introduce an inconsistency. We could do it manually by "splitting" the state like above, but React also offers a built-in Hook for this:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/musing-ramanujan-bgw2o). Click the "Next" button and notice how it takes 1 second to do a transition.

Let's say that fetching the user details is very fast and only takes 300 milliseconds. Currently, we're waiting a whole second because we need both user details and posts to display a consistent profile page. But what if we want to show the details faster?

If we're willing to sacrifice consistency, we could **pass potentially stale data to the components that delay our transition**. That's what `useDeferredValue()` lets us do:

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/vigorous-keller-3ed2b)**

The tradeoff we're making here is that `<ProfileTimeline>` will be inconsistent with other components and potentially show an older item. Click "Next" a few times, and you'll notice it. But thanks to that, we were able to cut down the transition time from 1000ms to 300ms.

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change very visible between items, and the user might not even realize they were looking at a stale version for a second.

It's worth noting that `useDeferredValue` is not *only* useful for data fetching. It also helps when an expensive component tree causes an interaction (e.g. typing in an input) to be sluggish. Just like we can "defer" a value that takes too long to fetch (and show its old value despite others components updating), we can do this with trees that take too long to render.

For example, consider a filterable list like this:

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/pensive-shirley-wkp46)**

In this example, **every item in `<MySlowList>` has an artificial slowdown -- each of them blocks the thread for a few milliseconds**. We'd never do this in a real app, but this helps us simulate what can happen in a deep component tree with no single obvious place to optimize.

We can see how typing in the input causes stutter. Now let's add `useDeferredValue`:

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

Now typing has a lot less stutter -- although we pay for this by showing the results with a lag.

How is this different from debouncing? Our example has a fixed artificial delay (3ms for every one of 80 items), so there is always a delay, no matter how fast our computer is. However, the `useDeferredValue` value only "lags behind" if the rendering takes a while. There is no minimal lag imposed by React. With a more realistic workload, you can expect the lag to adjust to the user’s device. On fast machines, the lag would be smaller or non-existent, and on slow machines, it would be more noticeable. In both cases, the app would remain responsive. That’s the advantage of this mechanism over debouncing or throttling, which always impose a minimal delay and can't avoid blocking the thread while rendering.

Even though there is an improvement in responsiveness, this example isn't as compelling yet because Concurrent Mode is missing some crucial optimizations for this use case. Still, it is interesting to see that features like `useDeferredValue` (or `useTransition`) are useful regardless of whether we're waiting for network or for computational work to finish.

### SuspenseList {#suspenselist}

`<SuspenseList>` is the last pattern that's related to orchestrating loading states.

Consider this example:

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/proud-tree-exg5t)**

The API call duration in this example is randomized. If you keep refreshing it, you will notice that sometimes the posts arrive first, and sometimes the "fun facts" arrive first.

This presents a problem. If the response for fun facts arrives first, we'll see the fun facts below the `<h2>Loading posts...</h2>` fallback for posts. We might start reading them, but then the *posts* response will come back, and shift all the facts down. This is jarring.

One way we could fix it is by putting them both in a single boundary:

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/currying-violet-5jsiy)**

The problem with this is that now we *always* wait for both of them to be fetched. However, if it's the *posts* that came back first, there's no reason to delay showing them. When fun facts load later, they won't shift the layout because they're already below the posts.

Other approaches to this, such as composing Promises in a special way, are increasingly difficult to pull off when the loading states are located in different components down the tree.

To solve this, we will import `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordinates the "reveal order" of the closest `<Suspense>` nodes below it:

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[Experimente no CodeSandbox](https://codesandbox.io/s/black-wind-byilt)**

The `revealOrder="forwards"` option means that the closest `<Suspense>` nodes inside this list **will only "reveal" their content in the order they appear in the tree -- even if the data for them arrives in a different order**. `<SuspenseList>` has other interesting modes: try changing `"forwards"` to `"backwards"` or `"together"` and see what happens.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at the time. You can play with it [here](https://codesandbox.io/s/adoring-almeida-1zzjh).

Keep in mind that `<SuspenseList>` is composable, like anything in React. For example, you can create a grid by putting several `<SuspenseList>` rows inside a `<SuspenseList>` table.

## Próximos Passos {#next-steps}

Concurrent Mode offers a powerful UI programming model and a set of new composable primitives to help you orchestrate delightful user experiences.

It's a result of several years of research and development, but it's not finished. In the section on [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html), we'll describe how you can try it and what you can expect.
