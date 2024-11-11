---
title: useTransition
---

<Intro>

`useTransition` é um Hook do React que permite você atualizar o state (estado) sem bloquear a UI.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## Referência {/*reference*/}

### `useTransition()` {/*usetransition*/}

Chame `useTransition` no nível superior do seu componente para marcar algumas atualizações de estado como Transições.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[Abaixo, você encontrará mais exemplos.](#usage)

#### Parâmetros {/*parameters*/}

`useTransition` não recebe parâmetros.

#### Retornos {/*returns*/}

`useTransition` retorna um array com exatamente dois itens:

1. O atributo `isPending` que informa se há uma Transição pendente
2. A função [`startTransition`](#starttransition) que permite marcar uma atualização de estado como uma Transição.

---

### `startTransition()` {/*starttransition*/}

A função `startTransition` retornado pelo hook `useTransition` permite marcar uma atualização de estado como uma Transição.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### Parâmetros {/*starttransition-parameters*/}

* `scope`: Uma função que atualiza o state chamando uma ou mais [funções `set`](/reference/react/useState#setstate)  O React executa imediatamente essa função `scope` sem parâmetros e marca todas as atualizações de state agendadas de forma síncrona durante a chamada da função `scope` como transições.  Essas transições nâo são [obrigatórias](#marking-a-state-update-as-a-non-blocking-transition) e [indicadores de carregamento indesejados.](#preventing-unwanted-loading-indicators)

#### Retorno {/*starttransition-returns*/}

`startTransition` não possui valor de retorno.

#### Caveats {/*starttransition-caveats*/}

* `useTransition`  é um Hook, portanto, deve ser chamado dentro de componentes ou Hooks personalizados. Se você precisar iniciar uma transição em outro lugar (por exemplo, a partir de uma biblioteca de dados), chame a função independente [`startTransition`](/reference/react/startTransition) em vez disso.

* Você só pode envolver uma atualização em uma transição se tiver acesso à função `set` daquele state. Se você deseja iniciar uma transição em resposta a alguma propriedade ou valor de um Hook personalizado, tente utilizar [`useDeferredValue`](/reference/react/useDeferredValue)  em vez disso.

* A função que você passa para  `startTransition` deve ser síncrona. O React executa imediatamente essa função, marcando todas as atualizações de state que acontecem enquanto ela é executada como transições. Se você tentar executar mais atualizações de state  posteriormente (por exemplo, em um timeout), elas não serão marcadas como transições.

<<<<<<< HEAD
* Uma atualização de state marcada como uma transição pode ser interrompida por outras atualizações de state. Por exemplo, se você atualizar um componente de gráfico dentro de uma transição, mas depois começar a digitar em uma entrada enquanto o gráfico estiver no meio de uma nova renderização, o React reiniciará o trabalho de renderização no componente de gráfico após lidar com a atualização da entrada.
=======
* The `startTransition` function has a stable identity, so you will often see it omitted from Effect dependencies, but including it will not cause the Effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input update.
>>>>>>> b214f78433756914ec32526dda48e76176dbf4fc

* As atualizações de transição não podem ser usadas para controlar entradas de texto.

* Se houver várias transições em andamento, o React atualmente as agrupa em lotes. Essa é uma limitação que provavelmente será removida em uma versão futura.

---

## Uso {/*usage*/}

### Marcando uma atualização de state como uma transição não bloqueante {/*marking-a-state-update-as-a-non-blocking-transition*/}

Chame `useTransition` o nível superior do seu componente para marcar as atualizações de state como *Transições* sem bloqueio.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` retorna um array com exatamente dois itens:

1. O sinalizador <CodeStep step={1}>`isPending`</CodeStep> que indica se existe uma transição pendente.
2.  O sinalizador <CodeStep step={2}>`startTransition` function</CodeStep> que permite que você marque uma atualização de state como uma transição.

Pode então marcar uma atualização de state como uma transição desta forma:

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

As transições permitem manter as atualizações da interface do usuário com capacidade de resposta, mesmo em dispositivos lentos.

Com uma transição, sua interface do usuário permanece reactiva no meio de uma nova renderização. Por exemplo, se o usuário clicar em uma guia, mas depois mudar de ideia e clicar em outra guia, eles podem fazer isso sem esperar que a primeira renderização termine.

<Recipes titleText="A diferença entre o uso de useTransition e atualizações regulares de state" titleId="examples">

#### Atualizando a guia atual em uma transição {/*updating-the-current-tab-in-a-transition*/}

Neste exemplo, a guia "Posts" é **artificialmente retardada** para que leve pelo menos um segundo para ser renderizada.

Clique em "Posts" e depois clique imediatamente em "Contato". Observe que isso interrompe a renderização lenta de "Posts". A guia "Contato" é exibida imediatamente. Como essa atualização de state é marcada como uma transição, uma lenta re-renderização não congela a interface do usuário.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem-vindos ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderizando 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada durante 1 ms por item para simular um código extremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Atualizando a guia atual sem uma transição {/*updating-the-current-tab-without-a-transition*/}

Neste exemplo, a guia "Posts" também é **artificialmente desacelerada** sopara que leve pelo menos um segundo para renderizar.Ao contrário do exemplo anterior, esta atualização de state **não é uma transição..**

Clique em "Posts" e, em seguida, clique imediatamente em "Contact". Observe Repare que a aplicação congela enquanto renderiza o separador mais lento, e a interface do usuário deixa de responder. Esta atualização de state não é uma transição, portanto, uma renderização lenta congela a interface do usuário.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem vindo ao meu Perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
// Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderização 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não fazer nada por 1 ms por item para simular um código extremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Atualizando o componente principal durante uma transição {/*updating-the-parent-component-in-a-transition*/}
Você também pode atualizar o state de um componente pai a partir da chamada `useTransition`. Por exemplo, este componente `TabButton`  envolve sua lógica de  `onClick` em uma transição:

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

Como o componente pai atualiza seu state dentro do manipulador de eventos `onClick`, essa atualização de state é marcada como uma transição. É por isso que, como no exemplo anterior, você pode clicar em "Posts" e imediatamente clicar em "Contact". A atualização da guia selecionada é marcada como uma transição, então ela não bloqueia as interações do usuário.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem vindo ao meu Perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar uma vez. A desaceleração real está dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderização 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não fazer nada por 1 ms por item para simular um código extremamente lento  
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Apresentação de um state pendente durante a transição {/*displaying-a-pending-visual-state-during-the-transition*/}

Você pode usar o valor booleano `isPending` retornado por `useTransition` para indicar ao usuário que uma transição está em andamento. Por exemplo, o botão da guia pode ter um state visual especial de "pendente".

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

Observe como clicar em "Publicações" agora parece mais reativo, porque o botão da guia em si é atualizado imediatamente:

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (lento)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Registrar apenas uma vez. A desaceleração real ocorre dentro de SlowPost.
  console.log('[ARTIFICIALLY SLOW] Renderizando 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Não faz nada durante 1 ms por item para emular código extremamente lento
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### Prevenindo indicadores de carregamento indesejados {/*preventing-unwanted-loading-indicators*/}

Neste exemplo, o componente PostsTab busca dados usando uma fonte de dados habilitada para [Suspense.](/reference/react/Suspense) Quando você clica na guia "Posts", o componente PostsTab suspende, fazendo com que o fallback de carregamento mais próximo apareça:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Carregando...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';


// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que esteja integrado com Suspense, como Relay ou Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// Este é um contorno para um bug para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
      Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```js data.js hidden
// Observação: a forma como você realiza a busca de dados depende do 
// framework que você utiliza em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
// Adicione um atraso fake para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

Ocultar todo o container de guias para mostrar um indicador de carregamento resulta em uma experiência de usuário desagradável. Se você adicionar `useTransition` ao `TabButton`, pode, em vez disso, indicar o state pendente no próprio botão da guia.

Observe que clicar em "Posts" já não substitui mais o contêiner da guia inteira por um indicador de carregamento:

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Carregando...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        Sobre
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contato
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Bem-vindo ao meu perfil!</p>
  );
}
```

```js src/PostsTab.js hidden
import { fetchData } from './data.js';

// Observação: este componente é escrito usando uma API experimental 
// que ainda não está disponível em versões estáveis do React.
 // Para um exemplo realista que você pode seguir hoje, tente um framework 
 // que esteja integrado com Suspense, como Relay ou Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

// Isso é uma solução temporária para um bug para fazer o demo funcionar. 
// TODO: substituir por pela implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
      Pode me encontrar online aqui:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```js data.js hidden
// Nota: a maneira como você  faz a busca de dados depende
// framework que você utiliza em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Não implementado');
  }
}

async function getPosts() {
// Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Read more about using Transitions with Suspense.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

As transições só "esperam" o tempo  tempo necessário para evitar ocultação *já revelada* com conteúdo (como o contêiner da guia). Se a guia Posts  tivesse um limite [tivesse um limite `<Suspense>`,](/reference/react/Suspense#revealing-nested-content-as-it-loads) a transição não "esperaria" por ele.

</Note>

---

### Construir um router com suspense ativado {/*building-a-suspense-enabled-router*/}

Se estiver a construir uma estrutura React ou um router, recomendamos marcar as navegações de página como transições.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

This is recommended for two reasons:

- [Transições que podem ser interrompidas ,](#marking-a-state-update-as-a-non-blocking-transition) permite ao usuário clicar em outro lugar sem precisar esperar que a nova renderização esteja concluída.
- [Transições que evitam indicadores de carregamento indesejados,](#preventing-unwanted-loading-indicators)  o que permite ao usuário evitar saltos bruscos na navegação.

Aqui está um pequeno exemplo simplificado de um router que utiliza transições para as navegações.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Carregando...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Navegador de música
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Abrir a página do artista dos Beatles
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js hidden
import { fetchData } from './data.js';

// Nota: este componente foi escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.

// Para um exemplo realista que você pode seguir hoje, tente um framework
// que esteja integrado com Suspense, como Relay ou Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// Esta é uma solução temporária para um bug para fazer a demonstração funcionar.
// TODO: substituir por uma implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Biography.js hidden
import { fetchData } from './data.js';

// Nota: este componente está escrito usando uma API experimental
// que ainda não está disponível em versões estáveis do React.
// Para um exemplo realista que você pode seguir hoje, tente um framework
// que está integrado com o Suspense, como Relay ou Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// Este é um contorno para um bug para fazer a demonstração funcionar.
// TODO: substituir pela implementação real quando o bug for corrigido.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
```

```js src/Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Nota: a forma como você faria a busca de dados depende de
// do framework que você usa  em conjunto com o Suspense.
// Normalmente, a lógica de cache estaria dentro de um framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
// Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles foram uma banda de rock inglesa,
    formada em Liverpool em 1960, que era composta por
    John Lennon, Paul McCartney, George Harrison
    e Ringo Starr.`;
}

async function getAlbums() {
  // Adicione um atraso falso para tornar a espera perceptível.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) Espera-se que os roteadores envolvam automaticamente as atualizações de navegação em transições por padrão.

</Note>

---

### Exibindo um erro para usuários com um limite de erro {/*displaying-an-error-to-users-with-error-boundary*/}

<Canary>

Atualmente, o limite de erro para useTransition está disponível apenas nos canais canário e experimental do React. Saiba mais sobre [canais de lançamento do React aqui](/community/versioning-policy#all-release-channels).

</Canary>

Se uma função passada para `startTransition` gerar um erro, você poderá exibir um erro ao seu usuário com um [limite de erro](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Para usar um limite de erro, envolva o componente onde você está chamando `useTransition` em um limite de erro. Depois que a função for passada para erros `startTransition`, o substituto para o limite do erro será exibido.

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // Para fins de demonstração, para mostrar o limite de erro
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## Solução de problemas {/*troubleshooting*/}

### A atualização de uma entrada numa transição não funciona {/*updating-an-input-in-a-transition-doesnt-work*/}

Não é possível utilizar uma transição para uma variável de state que controla uma entrada:

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌  Não é possível utilizar transições ao uma entrada de state controlada.
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

Isso ocorre porque as transições não são bloqueantes, mas a atualização de uma entrada em resposta ao evento de alteração deve ocorrer de forma síncrona. Se você deseja executar uma transição em resposta à digitação, você tem duas opções:

1. Você pode declarar duas variáveis de state separadas: uma para o state da entrada (que sempre é atualizado de forma síncrona) e outra que você atualizará em uma transição. Isso permite que você controle a entrada usando o state síncrono e passe a variável de state de transição (que ficará "atrasada" em relação à entrada) para o restante da sua lógica de renderização.
2. Em alternativa, pode ter uma variável de state e adicionar [`useDeferredValue`](/reference/react/useDeferredValue) que ficará "atrasado" em relação ao valor real. Isso irá desencadear re-renderizações não bloqueantes para "alcançar" automaticamente o novo valor.
---

### O React não está tratando minha atualização de state como uma transição {/*react-doesnt-treat-my-state-update-as-a-transition*/}

Quando você envolve uma atualização de state em uma transição, certifique-se de que ela ocorra *durante* a chamada de `startTransition`:

```js
startTransition(() => {
// ✅ Configurando o state *durante* a chamada de startTransition
  setPage('/about');
});
```

A função que você passa para `startTransition` deve ser síncrona.

Você não pode marcar uma atualização como uma transição dessa forma:

```js
startTransition(() => {
// ❌ Configurando o state *após* a chamada de startTransition
setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

Em vez disso, você pode fazer o seguinte:

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Configurando st *durante* a chamada de startTransition.
    setPage('/about');
  });
}, 1000);
```

Da mesma forma, não é possível marcar uma atualização como uma transição dessa maneira:


```js
startTransition(async () => {
  await someAsyncFunction();
// ❌ Configurando um state *depois* da chamada de startTransition
  setPage('/about');
});
```

No entanto, isso funciona em vez disso:

```js
await someAsyncFunction();
startTransition(() => {
// ✅ Configurando state *durante* a chamada de startTransition
  setPage('/about');
});
```

---

### Desejo acessar chamar  `useTransition` de fora de um componente. {/*i-want-to-call-usetransition-from-outside-a-component*/}

Você não pode chamar `useTransition` fora de um componente porque ele é um Hook.  Neste caso, utilize o método independente [`startTransition`](/reference/react/startTransition) Ele funciona da mesma forma, mas não fornece o indicador `isPending`.

---

### A função que passo para `startTransition` é executada imediatamente.{/*the-function-i-pass-to-starttransition-executes-immediately*/}

Se você executar este código, ele imprimirá 1, 2, 3:

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**Espera-se que imprima 1, 2, 3.** A função passada para `startTransition` não sofre atrasos. Ao contrário do `setTimeout`, que não é executada posteriormente. O React executa sua função imediatamente, mas qualquer atualização de state agendada enquanto ele *está em execução* são marcadas como transições. Você pode imaginar que funciona assim:

```js
// Uma versão simplificada de como o React funciona

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... Agendar uma atualização do state de transição...
  } else {
    // ... Agendar uma atualização urgente do state...
  }
}
```
